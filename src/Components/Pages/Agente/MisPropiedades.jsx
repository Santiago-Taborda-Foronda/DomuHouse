import { useState, useEffect, useCallback } from "react"
import { Eye, Edit, Trash2, Search, Plus, X, Check, AlertTriangle, Building2 } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"
import { Header } from "../../Layouts/Header/Header"
import { useNavigate } from "react-router-dom"

/* ------------------- helpers ------------------- */
const getStatusColor = (status) => {
  switch (status) {
    case "Disponible":
      return "bg-blue-100 text-blue-800"
    case "Vendida":
      return "bg-indigo-100 text-indigo-800"
    case "Alquilada":
      return "bg-sky-200 text-sky-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MisPropiedades() {
  /* ---------------- hooks & state ---------------- */
  const navigate = useNavigate()

  /* user / agentId desde localStorage */
  const [userData, setUserData] = useState(null)
  const [agentId, setAgentId] = useState(null)
  const [activeSection, setActiveSection] = useState("Mis Propiedades")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* filtros */
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")

  /* data */
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  /* modales */
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  /* edición */
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    status: "",
    type: "",
    area: "",
    rooms: "",
    bathrooms: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Inicializar userData y agentId una sola vez
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userData") || "{}")
      const id = storedUser.person_id ?? storedUser.id

      if (!id) {
        setError("No se encontró el ID del agente. Por favor, inicia sesión nuevamente.")
        setLoading(false)
        return
      }

      setUserData(storedUser)
      setAgentId(id)
    } catch (err) {
      setError("Error al cargar los datos del usuario.")
      setLoading(false)
    }
  }, [])

  /* -------------- fetch propiedades -------------- */
  const fetchProperties = useCallback(async (currentAgentId, currentUserData) => {
    if (!currentAgentId) {
      setError("No se encontró el ID del agente.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")
      const endpoint = `http://localhost:10101/api/agents/${currentAgentId}/properties`
      const token = localStorage.getItem("token") || ""

      const res = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.error || payload.message || `Error ${res.status}: ${res.statusText}`)
      }

      const json = await res.json()
      const rows = json.properties || []

      // Mapeo corregido según los campos del backend
      const mapped = rows.map((p) => ({
        id: p.property_id || p.propertyId, // Usar property_id del backend
        name: p.propertyTitle || "Sin título", // Usar property_title
        status: p.status || "Disponible",
        date: p.publish_date ? p.publish_date.split("T")[0] : new Date().toISOString().split("T")[0],
        type: p.property_type_id || p.propertyType || "N/A", // Mapear property_type_id
        image: p.image?.[0] || "/placeholder.svg?height=80&width=120",
        price: `$${Number(p.price || 0).toLocaleString("es-CO")}`,
        location: p.address || "Sin dirección",
        description: p.description || "Sin descripción",
        area: p.built_area || p.total_area || "N/A", // Usar built_area o total_area
        rooms: p.bedrooms || 0, // Usar bedrooms del backend
        bathrooms: p.bathrooms || 0, // Usar bathrooms del backend
        agent: currentUserData?.name_person || "Agente",
        phone: currentUserData?.phone || "",
        // Campos adicionales para el modal de detalles
        neighborhood: p.neighborhood || "",
        city: p.city || "",
        parking_spaces: p.parking_spaces || 0,
        operation_type: p.operation_type || "",
        socioeconomic_stratum: p.socioeconomic_stratum || "",
        latitude: p.latitude || "",
        longitude: p.longitude || "",
        approved: p.approved || false,
      }))

      setProperties(mapped)
    } catch (err) {
      console.error("Error fetching properties:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch properties cuando agentId y userData estén disponibles
  useEffect(() => {
    if (agentId && userData) {
      fetchProperties(agentId, userData)
    }
  }, [agentId, userData, fetchProperties])

  /* ------------------- CRUD ------------------- */
  /* VER */
  const handleViewProperty = async (prop) => {
    if (!agentId) {
      alert("Error: ID del agente no disponible")
      return
    }

    try {
      const token = localStorage.getItem("token") || ""
      const res = await fetch(`http://localhost:10101/api/agents/${agentId}/properties/${prop.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("No se pudo cargar la propiedad")

      const { property } = await res.json()

      // Mapeo corregido para el modal de detalles
      setSelectedProperty({
        ...prop,
        // Sobrescribir con datos actualizados del backend
        name: property.propertyTitle || property.address || prop.name,
        location: property.address || prop.location,
        description: property.description || prop.description,
        area: property.built_area || property.total_area || "N/A",
        rooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        price: `$${Number(property.price || 0).toLocaleString("es-CO")}`,
        status: property.status || prop.status,
        neighborhood: property.neighborhood || "",
        city: property.city || "",
        parking_spaces: property.parking_spaces || 0,
        operation_type: property.operation_type || "",
        socioeconomic_stratum: property.socioeconomic_stratum || "",
      })
      setShowViewModal(true)
    } catch (err) {
      console.error("Error viewing property:", err)
      alert(err.message)
    }
  }

  /* EDITAR (abrir modal) */
  const handleEditProperty = (p) => {
    setSelectedProperty(p)
    setEditForm({
      name: p.name || "",
      price: p.price.replace(/[^\d]/g, "") || "",
      location: p.location || "",
      description: p.description || "",
      status: p.status || "Disponible",
      type: p.type || "Casa",
      area: p.area || "",
      rooms: p.rooms?.toString() || "0",
      bathrooms: p.bathrooms?.toString() || "0",
    })
    setShowEditModal(true)
    setSubmitSuccess(false)
  }

  /* SAVE */
  const handleSaveEdit = async () => {
    if (!agentId || !selectedProperty) {
      alert("Error: Datos no disponibles")
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token") || ""
      const res = await fetch(`http://localhost:10101/api/agents/${agentId}/properties/${selectedProperty.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          property_title: editForm.name, // Usar property_title
          address: editForm.location,
          price: Number(editForm.price) || 0,
          description: editForm.description,
          status: editForm.status,
          bedrooms: Number(editForm.rooms) || 0, // Usar bedrooms
          bathrooms: Number(editForm.bathrooms) || 0, // Usar bathrooms
          built_area: editForm.area, // Usar built_area
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "Error actualizando la propiedad")
      }

      /* actualiza UI local */
      setProperties((prev) =>
        prev.map((p) =>
          p.id === selectedProperty.id
            ? {
                ...p,
                name: editForm.name,
                location: editForm.location,
                description: editForm.description,
                status: editForm.status,
                type: editForm.type,
                area: editForm.area,
                price: `$${Number(editForm.price).toLocaleString("es-CO")}`,
                rooms: Number(editForm.rooms),
                bathrooms: Number(editForm.bathrooms),
              }
            : p,
        ),
      )

      setSubmitSuccess(true)
      setTimeout(() => {
        setShowEditModal(false)
        setSubmitSuccess(false)
      }, 1500)
    } catch (err) {
      console.error("Error saving edit:", err)
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ELIMINAR */
  const handleDeleteProperty = (p) => {
    setSelectedProperty(p)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!agentId || !selectedProperty) {
      alert("Error: Datos no disponibles")
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token") || ""
      const res = await fetch(`http://localhost:10101/api/agents/${agentId}/properties/${selectedProperty.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "No se pudo eliminar la propiedad")
      }

      setProperties((prev) => prev.filter((p) => p.id !== selectedProperty.id))
      setShowDeleteModal(false)
    } catch (err) {
      console.error("Error deleting property:", err)
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* helpers */
  const handleEditFormChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const closeModals = () => {
    setShowViewModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedProperty(null)
    setSubmitSuccess(false)
  }

  const toggleAgentSidebar = () => setSidebarOpen((s) => !s)
  const handleNewProperty = () => navigate("/CrearPropiedad")

  /* filtro local */
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "Todos" || p.status === filterStatus
    return matchesSearch && matchesFilter
  })

  /* ------------------- render ------------------- */
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F8EAC] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando propiedades…</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#2F8EAC] text-white px-4 py-2 rounded-lg hover:bg-[#267a95] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </>
    )
  }

  /* ----- UI completa ----- */
  return (
    <>
      <Header toggleAgentSidebar={toggleAgentSidebar} />
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar fijo en desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <AgentSideBar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sidebarOpen={true}
            setSidebarOpen={() => {}}
            toggleSidebar={() => {}}
          />
        </div>

        {/* Sidebar móvil */}
        <AgentSideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toggleSidebar={toggleAgentSidebar}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Contenido principal */}
        <main className="lg:ml-72 pt-16">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Propiedades</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Administra y gestiona todas tus propiedades ({filteredProperties.length} propiedades)
                </p>
              </div>
              <button
                onClick={handleNewProperty}
                className="flex items-center gap-2 bg-[#2F8EAC] text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nueva Propiedad
              </button>
            </div>

            {/* Panel de filtros */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">Filtros de búsqueda</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar propiedades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  >
                    <option value="Todos">Todos los estados</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Vendida">Vendida</option>
                    <option value="Alquilada">Alquilada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{properties.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Propiedades</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-[#2F8EAC]">
                  {properties.filter((p) => p.status === "Disponible").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-sky-600">
                  {properties.filter((p) => p.status === "Vendida").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Vendidas</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-cyan-300">
                  {properties.filter((p) => p.status === "Alquilada").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Alquiladas</p>
              </div>
            </div>

            {/* Tabla / Tarjetas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Lista de Propiedades</h3>
                <p className="text-sm text-gray-500">Gestiona y edita tus propiedades</p>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades</h3>
                  <p className="text-gray-500 mb-4">
                    {properties.length === 0
                      ? "Aún no has agregado ninguna propiedad."
                      : "No se encontraron propiedades con los filtros seleccionados."}
                  </p>
                  {properties.length === 0 && (
                    <button
                      onClick={handleNewProperty}
                      className="bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium"
                    >
                      Agregar Primera Propiedad
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Tarjetas móvil */}
                  <div className="block lg:hidden">
                    {filteredProperties.map((property) => (
                      <div key={property.id} className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-12 h-10 sm:w-16 sm:h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={property.image || "/placeholder.svg?height=80&width=120"}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">{property.name}</p>
                                <p className="text-xs text-gray-500">
                                  {property.type} • {property.location}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">{property.date}</p>
                                <p className="text-sm font-semibold text-[#2F8EAC] mt-1">{property.price}</p>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                    property.status,
                                  )}`}
                                >
                                  {property.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 mt-3">
                              <button
                                onClick={() => handleViewProperty(property)}
                                className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProperty(property)}
                                className="p-1.5 sm:p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property)}
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tabla desktop */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Propiedad
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Precio
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredProperties.map((property) => (
                          <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  <img
                                    src={property.image || "/placeholder.svg?height=80&width=120"}
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{property.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {property.type} • {property.location}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                  property.status,
                                )}`}
                              >
                                {property.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">{property.date}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-[#2F8EAC]">{property.price}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewProperty(property)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditProperty(property)}
                                  className="p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(property)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        {/* -------- Modales (Ver / Editar / Eliminar) -------- */}
        {showViewModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModals()
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Detalles de la Propiedad</h2>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-full sm:w-32 h-24 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={selectedProperty.image || "/placeholder.svg?height=80&width=120"}
                        alt={selectedProperty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedProperty.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {selectedProperty.type} • {selectedProperty.location}
                      </p>
                      <p className="text-xl font-bold text-[#2F8EAC] mt-2">{selectedProperty.price}</p>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(
                          selectedProperty.status,
                        )}`}
                      >
                        {selectedProperty.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área:</label>
                      <p className="text-gray-900 font-semibold">{selectedProperty.area} m²</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones:</label>
                      <p className="text-gray-900 font-semibold">{selectedProperty.rooms}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Baños:</label>
                      <p className="text-gray-900 font-semibold">{selectedProperty.bathrooms}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de publicación:</label>
                      <p className="text-gray-900 font-semibold">{selectedProperty.date}</p>
                    </div>
                  </div>

                  {/* Información adicional */}
                  {selectedProperty.neighborhood && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Barrio:</label>
                        <p className="text-gray-900 font-semibold">{selectedProperty.neighborhood}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad:</label>
                        <p className="text-gray-900 font-semibold">{selectedProperty.city}</p>
                      </div>
                    </div>
                  )}

                  {selectedProperty.parking_spaces > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Espacios de parqueadero:</label>
                      <p className="text-gray-900 font-semibold">{selectedProperty.parking_spaces}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción:</label>
                    <p className="text-gray-900">{selectedProperty.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Agente:</label>
                      <p className="text-gray-900 font-semibold">{selectedProperty.agent}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                      <p className="text-gray-900 font-semibold">{selectedProperty.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------- Modal Editar -------- */}
        {showEditModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModals()
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Editar Propiedad</h2>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitSuccess && (
                  <div className="mb-4 bg-sky-50 border border-green-200 text-blue-700 px-4 py-3 rounded-xl">
                    ¡Propiedad actualizada exitosamente!
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre:</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Precio:</label>
                      <input
                        type="text"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación:</label>
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo:</label>
                      <select
                        name="type"
                        value={editForm.type}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      >
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Local">Local</option>
                        <option value="Oficina">Oficina</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Área:</label>
                      <input
                        type="text"
                        name="area"
                        value={editForm.area}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones:</label>
                      <input
                        type="number"
                        name="rooms"
                        value={editForm.rooms}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Baños:</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={editForm.bathrooms}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado:</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Vendida">Vendida</option>
                      <option value="Alquilada">Alquilada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción:</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditFormChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={closeModals}
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSubmitting}
                      className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                        isSubmitting
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------- Modal Eliminar -------- */}
        {showDeleteModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModals()
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Confirmar Eliminación
                  </h2>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-600 mb-4">
                    ¿Estás seguro de que deseas eliminar la propiedad <strong>{selectedProperty.name}</strong>?
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-600">Esta acción no se puede deshacer.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModals}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isSubmitting}
                    className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {isSubmitting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
