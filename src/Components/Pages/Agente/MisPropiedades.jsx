import { useState } from "react"
import { Eye, Edit, Trash2, Menu, Search, Plus, X, Check, AlertTriangle } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"
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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <AgentSideBar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Mis Propiedades</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Mis Propiedades</h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar propiedades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Publicado">Publicado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>

                <button
                  onClick={handleNewProperty}
                  className="px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#256b82] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nueva Propiedad</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                <p className="text-sm text-gray-600">Total Propiedades</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-sky-600">
                  {properties.filter((p) => p.status === "Publicado").length}
                </p>
                <p className="text-sm text-gray-600">Publicadas</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-blue-600">
                  {properties.filter((p) => p.status === "Pendiente").length}
                </p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-[#2F8EAC]">
                  {properties.length > 0
                    ? Math.round((properties.filter((p) => p.status === "Publicado").length / properties.length) * 100)
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-600">Tasa Publicación</p>
              </div>
            </div>
          </div>

          {/* Properties Table/Cards */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {filteredProperties.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No se encontraron propiedades</div>
              ) : (
                filteredProperties.map((property) => (
                  <div key={property.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.name}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 truncate">{property.name}</h3>
                            <p className="text-xs text-gray-500">
                              {property.type} • {property.location}
                            </p>
                            <p className="text-sm font-semibold text-[#2F8EAC] mt-1">{property.price}</p>
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}
                          >
                            {property.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600">{property.date}</p>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewProperty(property)}
                              className="text-[#2F8EAC] hover:text-[#256b82] p-1"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditProperty(property)}
                              className="text-gray-600 hover:text-gray-800 p-1"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron propiedades
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <img
                              src={property.image || "/placeholder.svg"}
                              alt={property.name}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{property.name}</p>
                              <p className="text-xs text-gray-500">
                                {property.type} • {property.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}
                          >
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2F8EAC]">
                          {property.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewProperty(property)}
                              className="text-[#2F8EAC] hover:text-[#256b82] p-1"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditProperty(property)}
                              className="text-gray-600 hover:text-gray-800 p-1"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View Property Modal */}
      {showViewModal && selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModals()
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Detalles de la Propiedad</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedProperty.image || "/placeholder.svg"}
                    alt={selectedProperty.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{selectedProperty.name}</h3>
                    <p className="text-gray-600">
                      {selectedProperty.type} • {selectedProperty.location}
                    </p>
                    <p className="text-xl font-bold text-[#2F8EAC] mt-2">{selectedProperty.price}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(selectedProperty.status)}`}
                    >
                      {selectedProperty.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Área:</label>
                    <p className="text-gray-900">{selectedProperty.area}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones:</label>
                    <p className="text-gray-900">{selectedProperty.rooms}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baños:</label>
                    <p className="text-gray-900">{selectedProperty.bathrooms}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de publicación:</label>
                    <p className="text-gray-900">{selectedProperty.date}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                  <p className="text-gray-900">{selectedProperty.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agente:</label>
                    <p className="text-gray-900">{selectedProperty.agent}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                    <p className="text-gray-900">{selectedProperty.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {showEditModal && selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModals()
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Editar Propiedad</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                  ¡Propiedad actualizada exitosamente!
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio:</label>
                    <input
                      type="text"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación:</label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    >
                      <option value="Casa">Casa</option>
                      <option value="Apartamento">Apartamento</option>
                      <option value="Local">Local</option>
                      <option value="Oficina">Oficina</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Área:</label>
                    <input
                      type="text"
                      name="area"
                      value={editForm.area}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones:</label>
                    <input
                      type="number"
                      name="rooms"
                      value={editForm.rooms}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baños:</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={editForm.bathrooms}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  >
                    <option value="Publicado">Publicado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeModals}
                    disabled={isSubmitting}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#2F8EAC] text-white hover:bg-[#256b82]"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModals()
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Confirmar Eliminación
                </h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  ¿Estás seguro de que deseas eliminar la propiedad <strong>{selectedProperty.name}</strong>?
                </p>
                <p className="text-sm text-red-600">Esta acción no se puede deshacer.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModals}
                  disabled={isSubmitting}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
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
  )
}
