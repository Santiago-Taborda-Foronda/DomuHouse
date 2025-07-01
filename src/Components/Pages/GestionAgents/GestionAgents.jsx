"use client"

import { useState, useEffect } from "react"
import { Eye, Edit, Trash2, Search, Filter, Users, Star, Phone, Mail, Shield } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"
import { useNavigate } from "react-router-dom"
import { AgentDetailsModal } from "../AgentDetailsModal/AgentDetailsModal.JSX"
import { AgentEditModal } from "../AgentEditModal/AgentEditModal"

// Datos de agentes simulados iniciales
const agentesIniciales = [
  {
    id: 1,
    name: "Karina Tabares",
    email: "karina25@gmail.com",
    phone: "3214567890",
    propertyCount: 8,
    rating: 5,
    status: "Activo",
    specialties: ["Ventas", "Alquileres"],
    avatar: null,
    createdAt: "2024-01-15T10:00:00Z",
    totalSales: 15,
    description: "Especialista en propiedades residenciales con más de 5 años de experiencia",
  },
  {
    id: 2,
    name: "Mariano Quiroga",
    email: "mariano23@gmail.com",
    phone: "3214567891",
    propertyCount: 7,
    rating: 4,
    status: "Activo",
    specialties: ["Comercial", "Terrenos"],
    avatar: null,
    createdAt: "2024-01-10T14:30:00Z",
    totalSales: 12,
    description: "Experto en propiedades comerciales y desarrollo de terrenos",
  },
  {
    id: 3,
    name: "Nathaly Rodriguez",
    email: "nathaly2@gmail.com",
    phone: "3214567892",
    propertyCount: 10,
    rating: 5,
    status: "Activo",
    specialties: ["Lujo", "Inversión"],
    avatar: null,
    createdAt: "2024-01-08T09:15:00Z",
    totalSales: 20,
    description: "Especialista en propiedades de lujo y asesoramiento en inversiones",
  },
  {
    id: 4,
    name: "Manuel Vargas",
    email: "manuel26@gmail.com",
    phone: "3214567893",
    propertyCount: 12,
    rating: 4,
    status: "Activo",
    specialties: ["Residencial", "Primera Vivienda"],
    avatar: null,
    createdAt: "2024-01-05T16:45:00Z",
    totalSales: 18,
    description: "Experto en ayudar a familias a encontrar su primera vivienda",
  },
  {
    id: 5,
    name: "Santiago Taborda",
    email: "santiago30@gmail.com",
    phone: "3214567894",
    propertyCount: 9,
    rating: 4,
    status: "Inactivo",
    specialties: ["Alquileres", "Administración"],
    avatar: null,
    createdAt: "2024-01-03T11:20:00Z",
    totalSales: 8,
    description: "Especialista en gestión de alquileres y administración de propiedades",
  },
]

export const GestionAgents = () => {
  const navigate = useNavigate()
  const [agentes, setAgentes] = useState(agentesIniciales)
  const [filtros, setFiltros] = useState({
    estado: "",
    especialidad: "",
    busqueda: "",
  })

  // Estado del sidebar para móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // Estado de autenticación simulado
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  // Estados para los modales
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Función para toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para cargar agentes (preparada para backend)
  const cargarAgentes = async () => {
    try {
      // AQUÍ SE CONECTARÁ CON EL BACKEND
      // Por ahora mantenemos los agentes iniciales
    } catch (error) {
      console.error("Error al cargar agentes:", error)
    }
  }

  // Cargar agentes al montar el componente
  useEffect(() => {
    cargarAgentes()
  }, [])

  // Función para eliminar agente
  const eliminarAgente = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este agente?")) {
      return
    }

    try {
      // AQUÍ SE CONECTARÁ CON EL BACKEND
      // Por ahora eliminamos localmente
      setAgentes((prev) => prev.filter((agente) => agente.id !== id))

      console.log(`Agente ${id} eliminado exitosamente`)
    } catch (error) {
      console.error("Error al eliminar agente:", error)
      alert("Error al eliminar el agente")
    }
  }

  // Función para ver detalles de agente
  const verAgente = (id) => {
    const agent = agentes.find((a) => a.id === id)
    if (agent) {
      setSelectedAgent(agent)
      setIsDetailsModalOpen(true)
    }
  }

  // Función para editar agente
  const editarAgente = (id) => {
    const agent = agentes.find((a) => a.id === id)
    if (agent) {
      setSelectedAgent(agent)
      setIsEditModalOpen(true)
    }
  }

  // Función para guardar cambios del agente
  const handleSaveAgent = (updatedAgent) => {
    setAgentes((prev) => prev.map((agent) => (agent.id === updatedAgent.id ? updatedAgent : agent)))
    console.log("Agente actualizado:", updatedAgent)
  }

  // Función para manejar logout
  const handleLogout = () => {
    console.log("Cerrando sesión...")
    setIsAuthenticated(false)
  }

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  // Función para filtrar agentes
  const agentesFiltrados = agentes.filter((agente) => {
    const cumpleBusqueda =
      !filtros.busqueda ||
      agente.name.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      agente.email.toLowerCase().includes(filtros.busqueda.toLowerCase())

    const cumpleEstado = !filtros.estado || agente.status.toLowerCase() === filtros.estado.toLowerCase()

    const cumpleEspecialidad =
      !filtros.especialidad ||
      agente.specialties.some((spec) => spec.toLowerCase().includes(filtros.especialidad.toLowerCase()))

    return cumpleBusqueda && cumpleEstado && cumpleEspecialidad
  })

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case "activo":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200"
      case "inactivo":
        return "bg-gray-100 text-gray-700 border border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  // Obtener especialidades únicas para el filtro
  const especialidadesUnicas = [...new Set(agentes.flatMap((a) => a.specialties))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header hasSidebar={true} toggleSidebar={toggleSidebar} />

      {/* Layout principal con sidebar */}
      <div className="flex pt-16">
        {/* Sidebar fijo para desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <SidebarInmobiliaria
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Sidebar overlay para móviles */}
        <SidebarInmobiliaria
          isOpen={isSidebarOpen}
          toggleMenu={toggleSidebar}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          isFixedLayout={false}
        />

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Agentes</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Administra y gestiona todos tus agentes inmobiliarios ({agentesFiltrados.length} agentes)
                </p>
              </div>
              <button
                onClick={() => navigate("/invitar-agente")}
                className="flex items-center justify-center gap-2 bg-[#2F8EAC] text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium shadow-sm text-sm sm:text-base"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Agente</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            </div>

            {/* Panel de filtros */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">Filtros de búsqueda</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                    value={filtros.estado}
                    onChange={(e) => handleFiltroChange("estado", e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                    value={filtros.especialidad}
                    onChange={(e) => handleFiltroChange("especialidad", e.target.value)}
                  >
                    <option value="">Todas las especialidades</option>
                    {especialidadesUnicas.map((especialidad) => (
                      <option key={especialidad} value={especialidad}>
                        {especialidad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar agentes..."
                      className="w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                      value={filtros.busqueda}
                      onChange={(e) => handleFiltroChange("busqueda", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de agentes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Lista de Agentes</h3>
                <p className="text-xs sm:text-sm text-gray-500">Gestiona y edita la información de tus agentes</p>
              </div>

              {agentesFiltrados.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-4">
                  <Users className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No hay agentes</h3>
                  <p className="text-gray-500 mb-4 text-sm sm:text-base">
                    {agentes.length === 0
                      ? "Aún no has agregado ningún agente."
                      : "No se encontraron agentes con los filtros seleccionados."}
                  </p>
                  {agentes.length === 0 && (
                    <button
                      onClick={() => navigate("/agregar-agente")}
                      className="bg-[#2F8EAC] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium text-sm sm:text-base"
                    >
                      Agregar Primer Agente
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Vista de tabla para desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Nombre del Agente
                          </th>
                          <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Correo
                          </th>
                          <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Teléfono
                          </th>
                          <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Propiedades
                          </th>
                          <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Puntuación
                          </th>
                          <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {agentesFiltrados.map((agente) => (
                          <tr key={agente.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 lg:px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 lg:w-10 h-8 lg:h-10 bg-[#2F8EAC] rounded-full flex items-center justify-center text-white font-semibold text-xs lg:text-sm">
                                  {agente.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{agente.name}</div>
                                  <div className="text-xs text-gray-500">{agente.specialties.join(", ")}</div>
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getEstadoColor(agente.status)}`}
                                  >
                                    {agente.status}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-[120px] lg:max-w-none">{agente.email}</span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Phone className="w-3 h-3" />
                                {agente.phone}
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">{agente.propertyCount}</div>
                                <div className="text-xs text-gray-500">propiedades</div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4">
                              <div className="flex items-center gap-1">{renderStars(agente.rating)}</div>
                            </td>
                            <td className="px-4 lg:px-6 py-4">
                              <div className="flex items-center gap-1 lg:gap-2">
                                <button
                                  onClick={() => verAgente(agente.id)}
                                  className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => editarAgente(agente.id)}
                                  className="p-1.5 lg:p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Editar agente"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => eliminarAgente(agente.id)}
                                  className="p-1.5 lg:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar agente"
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

                  {/* Vista de cards para móviles */}
                  <div className="md:hidden">
                    <div className="divide-y divide-gray-100">
                      {agentesFiltrados.map((agente) => (
                        <div key={agente.id} className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-[#2F8EAC] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {agente.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900 truncate">{agente.name}</h3>
                                  <p className="text-xs text-gray-500 mt-1">{agente.specialties.join(", ")}</p>
                                </div>
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(agente.status)}`}
                                >
                                  {agente.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{agente.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{agente.phone}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">{agente.propertyCount}</div>
                                <div className="text-xs text-gray-500">propiedades</div>
                              </div>
                              <div className="flex items-center gap-1">{renderStars(agente.rating)}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => verAgente(agente.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => editarAgente(agente.id)}
                              className="p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Editar agente"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => eliminarAgente(agente.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar agente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modales */}
      <AgentDetailsModal
        agent={selectedAgent}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedAgent(null)
        }}
      />

      <AgentEditModal
        agent={selectedAgent}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedAgent(null)
        }}
        onSave={handleSaveAgent}
      />
    </div>
  )
}
