"use client"

import { useState } from "react"
import { Eye, Edit, Trash2, Search, Plus, X, Check, AlertTriangle, Building2 } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"
import { Header } from "../../Layouts/Header/Header"
import { useNavigate } from "react-router-dom"

export default function MisPropiedades() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("Mis Propiedades")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const toggleAgentSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Casa 01",
      status: "Publicado",
      date: "2024-03-20",
      type: "Casa",
      image: "/placeholder.svg?height=80&width=120",
      price: "$250,000,000",
      location: "Zona Norte",
      description: "Hermosa casa de 3 habitaciones con jardín amplio y garaje para 2 vehículos.",
      area: "150 m²",
      rooms: 3,
      bathrooms: 2,
      agent: "Juan Pérez",
      phone: "+57 300 123 4567",
    },
    {
      id: 2,
      name: "Casa 02",
      status: "Pendiente",
      date: "2024-03-20",
      type: "Casa",
      image: "/placeholder.svg?height=80&width=120",
      price: "$23,000,000",
      location: "Centro",
      description: "Casa moderna en el centro de la ciudad, cerca de centros comerciales.",
      area: "120 m²",
      rooms: 2,
      bathrooms: 1,
      agent: "María González",
      phone: "+57 301 234 5678",
    },
    {
      id: 3,
      name: "Casa 03",
      status: "Publicado",
      date: "2024-03-03",
      type: "Casa",
      image: "/placeholder.svg?height=80&width=120",
      price: "$18,000,000",
      location: "Zona Sur",
      description: "Casa familiar con patio trasero y excelente ubicación.",
      area: "180 m²",
      rooms: 4,
      bathrooms: 3,
      agent: "Carlos Mendoza",
      phone: "+57 302 345 6789",
    },
    {
      id: 4,
      name: "Casa 04",
      status: "Pendiente",
      date: "2024-03-21",
      type: "Casa",
      image: "/placeholder.svg?height=80&width=120",
      price: "$19,000,000",
      location: "Zona Este",
      description: "Casa de dos pisos con terraza y vista panorámica.",
      area: "200 m²",
      rooms: 3,
      bathrooms: 2,
      agent: "Ana Rodríguez",
      phone: "+57 303 456 7890",
    },
  ])

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

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "Todos" || property.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    return status === "Publicado" ? "bg-blue-100 text-blue-800" : "bg-blue-50 text-blue-950"
  }

  // Función para ver detalles de la propiedad
  const handleViewProperty = (property) => {
    setSelectedProperty(property)
    setShowViewModal(true)
  }

  // Función para editar propiedad
  const handleEditProperty = (property) => {
    setSelectedProperty(property)
    setEditForm({
      name: property.name,
      price: property.price,
      location: property.location,
      description: property.description,
      status: property.status,
      type: property.type,
      area: property.area,
      rooms: property.rooms.toString(),
      bathrooms: property.bathrooms.toString(),
    })
    setShowEditModal(true)
    setSubmitSuccess(false)
  }

  // Función para eliminar propiedad
  const handleDeleteProperty = (property) => {
    setSelectedProperty(property)
    setShowDeleteModal(true)
  }

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    setIsSubmitting(true)
    try {
      // Simulación de eliminación
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProperties(properties.filter((p) => p.id !== selectedProperty.id))
      setShowDeleteModal(false)
      setSelectedProperty(null)
    } catch (error) {
      console.error("Error al eliminar propiedad:", error)
      alert("Error al eliminar la propiedad")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para guardar cambios de edición
  const handleSaveEdit = async () => {
    setIsSubmitting(true)
    try {
      // Simulación de actualización
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const updatedProperties = properties.map((p) => {
        if (p.id === selectedProperty.id) {
          return {
            ...p,
            name: editForm.name,
            price: editForm.price,
            location: editForm.location,
            description: editForm.description,
            status: editForm.status,
            type: editForm.type,
            area: editForm.area,
            rooms: Number.parseInt(editForm.rooms),
            bathrooms: Number.parseInt(editForm.bathrooms),
          }
        }
        return p
      })
      setProperties(updatedProperties)
      setSubmitSuccess(true)
      setTimeout(() => {
        setShowEditModal(false)
        setSelectedProperty(null)
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error al actualizar propiedad:", error)
      alert("Error al actualizar la propiedad")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para manejar cambios en el formulario de edición
  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Función para cerrar modales
  const closeModals = () => {
    setShowViewModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedProperty(null)
    setSubmitSuccess(false)
  }

  // Función para crear nueva propiedad
  const handleNewProperty = () => {
    navigate("/CrearPropiedad")
  }

  return (
    <>
      <Header toggleAgentSidebar={toggleAgentSidebar} />
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar fijo siempre visible en desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <AgentSideBar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sidebarOpen={true} // Siempre abierto en desktop
            setSidebarOpen={() => {}} // Función vacía
            toggleSidebar={() => {}} // Función vacía
          />
        </div>

        {/* Sidebar móvil con overlay */}
        <AgentSideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toggleSidebar={toggleAgentSidebar}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* OVERLAY DUPLICADO ELIMINADO - El AgentSideBar ya maneja su propio overlay */}

        {/* Contenido principal con margen izquierdo para el sidebar */}
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

            {/* Panel de filtros y búsqueda */}
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
                    <option value="Publicado">Publicado</option>
                    <option value="Pendiente">Pendiente</option>
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
                  {properties.filter((p) => p.status === "Publicado").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Publicadas</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-blue-800">
                  {properties.filter((p) => p.status === "Pendiente").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Pendientes</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-sky-600">
                  {properties.length > 0
                    ? Math.round((properties.filter((p) => p.status === "Publicado").length / properties.length) * 100)
                    : 0}
                  %
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Tasa Publicación</p>
              </div>
            </div>

            {/* Tabla de propiedades */}
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
                  {/* Vista de tarjetas para móvil y tablet */}
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
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}
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

                  {/* Vista de tabla para desktop */}
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
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}
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

        {/* Modal de Ver Propiedad */}
        {showViewModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModals()
              }
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
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(selectedProperty.status)}`}
                      >
                        {selectedProperty.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área:</label>
                      <p className="text-gray-900 font-semibold">{selectedProperty.area}</p>
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

        {/* Modal de Editar Propiedad */}
        {showEditModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModals()
              }
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
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
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
                      <option value="Publicado">Publicado</option>
                      <option value="Pendiente">Pendiente</option>
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

        {/* Modal de Confirmación de Eliminación */}
        {showDeleteModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModals()
              }
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
