"use client"

import { useState } from "react"
import { Home, Star, Eye, Edit, Check, Heart, X } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"
import { Outlet } from "react-router-dom"
import { Header } from "../../Layouts/Header/Header"

export default function AgentDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showFavoriteModal, setShowFavoriteModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const toggleAgentSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const stats = [
    { label: "Propiedades", value: "7", subtitle: "Activas" },
    { label: "Visitas", value: "4", subtitle: "Programadas" },
    { label: "Contactados", value: "12", subtitle: "Este mes" },
  ]

  const [recentProperties, setRecentProperties] = useState([
    {
      id: 1,
      name: "Casa 01",
      status: "Publicado",
      date: "2024-03-20",
      type: "Casa",
      price: "$250,000,000",
      location: "Zona Norte",
      description: "Hermosa casa de 3 habitaciones con jardín amplio y garaje para 2 vehículos.",
      area: "150 m²",
      rooms: 3,
      bathrooms: 2,
      isFavorite: false,
    },
    {
      id: 2,
      name: "Casa 02",
      status: "Pendiente",
      date: "2024-03-20",
      type: "Casa",
      price: "$23,000,000",
      location: "Centro",
      description: "Casa moderna en el centro de la ciudad, cerca de centros comerciales.",
      area: "120 m²",
      rooms: 2,
      bathrooms: 1,
      isFavorite: true,
    },
    {
      id: 3,
      name: "Casa 03",
      status: "Publicado",
      date: "2024-03-03",
      type: "Casa",
      price: "$18,000,000",
      location: "Zona Sur",
      description: "Casa familiar con patio trasero y excelente ubicación.",
      area: "180 m²",
      rooms: 4,
      bathrooms: 3,
      isFavorite: false,
    },
    {
      id: 4,
      name: "Casa 04",
      status: "Pendiente",
      date: "2024-03-21",
      type: "Casa",
      price: "$19,000,000",
      location: "Zona Este",
      description: "Casa de dos pisos con terraza y vista panorámica.",
      area: "200 m²",
      rooms: 3,
      bathrooms: 2,
      isFavorite: false,
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

  // Función para manejar favoritos
  const handleToggleFavorite = (property) => {
    setSelectedProperty(property)
    setShowFavoriteModal(true)
  }

  // Función para confirmar favorito
  const confirmToggleFavorite = async () => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const updatedProperties = recentProperties.map((p) => {
        if (p.id === selectedProperty.id) {
          return { ...p, isFavorite: !p.isFavorite }
        }
        return p
      })
      setRecentProperties(updatedProperties)
      setShowFavoriteModal(false)
      setSelectedProperty(null)
    } catch (error) {
      console.error("Error al actualizar favorito:", error)
      alert("Error al actualizar favorito")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para guardar cambios de edición
  const handleSaveEdit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const updatedProperties = recentProperties.map((p) => {
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
      setRecentProperties(updatedProperties)
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
    setShowFavoriteModal(false)
    setSelectedProperty(null)
    setSubmitSuccess(false)
  }

  const getStatusColor = (status) => {
    return status === "Publicado" ? "bg-blue-100 text-blue-800" : "bg-blue-50 text-blue-950"
  }

  return (
    <>
      <Header toggleAgentSidebar={toggleAgentSidebar} />
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar fijo siempre visible en desktop (igual que en mis-propiedades) */}
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

        {/* Contenido principal con margen izquierdo para el sidebar (igual que en mis-propiedades) */}
        <main className="lg:ml-72 pt-16">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 text-sm mt-1">Panel de control y estadísticas generales</p>
              </div>
            </div>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F8EAC]" />
                        <span className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{stat.subtitle}</p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-800">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Propiedades Recientes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Propiedades Recientes</h2>
                <p className="text-xs sm:text-sm text-gray-500">Gestiona tus propiedades más recientes</p>
              </div>

              {/* Vista de tarjetas para móvil y tablet */}
              <div className="block lg:hidden">
                {recentProperties.map((property) => (
                  <div key={property.id} className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-12 h-10 sm:w-16 sm:h-12 bg-gradient-to-br from-[#2F8EAC] to-blue-950 rounded-xl flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">{property.name}</p>
                            <p className="text-xs text-gray-500">{property.type}</p>
                            <p className="text-xs text-gray-600 mt-1">{property.date}</p>
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
                            onClick={() => handleToggleFavorite(property)}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                              property.isFavorite ? "text-red-600 hover:bg-red-50" : "text-[#2F8EAC] hover:bg-blue-50"
                            }`}
                            title={property.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                          >
                            {property.isFavorite ? (
                              <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                            ) : (
                              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleViewProperty(property)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProperty(property)}
                            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
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
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {recentProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 bg-gradient-to-br from-[#2F8EAC] to-blue-950 rounded-lg overflow-hidden">
                              {/* Aquí podrías agregar una imagen si está disponible */}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{property.name}</div>
                              <div className="text-xs text-gray-500">{property.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}
                          >
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleFavorite(property)}
                              className={`p-2 rounded-lg transition-colors ${
                                property.isFavorite ? "text-red-600 hover:bg-red-50" : "text-[#2F8EAC] hover:bg-blue-50"
                              }`}
                              title={property.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                            >
                              {property.isFavorite ? (
                                <Heart className="w-4 h-4 fill-current" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </button>
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* View Property Modal - Responsive */}
        {showViewModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
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
                  <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-full sm:w-32 h-24 bg-gradient-to-br from-[#2F8EAC] to-blue-950 rounded-xl flex-shrink-0"></div>
                    <div className="flex-1 w-full">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedProperty.name}</h3>
                      <p className="text-gray-600">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Property Modal - Responsive */}
        {showEditModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
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
                  <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitSuccess && (
                  <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                    ¡Propiedad actualizada exitosamente!
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
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
                      className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
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

        {/* Favorite Confirmation Modal - Responsive */}
        {showFavoriteModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
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
                    {selectedProperty.isFavorite ? (
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    ) : (
                      <Star className="w-5 h-5 text-[#2F8EAC]" />
                    )}
                    {selectedProperty.isFavorite ? "Quitar de Favoritos" : "Agregar a Favoritos"}
                  </h2>
                  <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-600 mb-4">
                    ¿Estás seguro de que deseas {selectedProperty.isFavorite ? "quitar" : "agregar"} la propiedad{" "}
                    <strong>{selectedProperty.name}</strong> {selectedProperty.isFavorite ? "de" : "a"} tus favoritos?
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModals}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmToggleFavorite}
                    disabled={isSubmitting}
                    className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : selectedProperty.isFavorite
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
                    }`}
                  >
                    {selectedProperty.isFavorite ? <Heart className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                    {isSubmitting ? "Procesando..." : selectedProperty.isFavorite ? "Quitar" : "Agregar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Outlet />
      </div>
    </>
  )
}
