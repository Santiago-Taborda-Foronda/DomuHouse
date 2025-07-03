"use client"

import { useState, useEffect } from "react"
import { Eye, Edit, Trash2, Search, Filter, Users, Star, Phone, Mail, Shield, Loader2 } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"
import { useNavigate } from "react-router-dom"
import { AgentDetailsModal } from "../AgentDetailsModal/AgentDetailsModal"
import { AgentEditModal } from "../AgentEditModal/AgentEditModal"

export const GestionAgents = () => {
  const navigate = useNavigate()
  const [agentes, setAgentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  // Función para obtener el token de autenticación
  const getAuthToken = () => {
    // Opción 1: Desde localStorage
    const token = localStorage.getItem("authToken") || localStorage.getItem("token")

    // Opción 2: Desde sessionStorage
    // const token = sessionStorage.getItem('authToken')

    // Opción 3: Desde cookies (si usas js-cookie)
    // import Cookies from 'js-cookie'
    // const token = Cookies.get('authToken')

    return token
  }

  // Función para crear headers con autenticación
  const getAuthHeaders = () => {
    const token = getAuthToken()

    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      // Opción 1: Bearer token (más común)
      headers.Authorization = `Bearer ${token}`

      // Opción 2: Si tu API usa otro formato
      // headers.Authorization = `Token ${token}`
      // headers['X-Auth-Token'] = token
    }

    return headers
  }

  // Función para toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para cargar agentes desde la API
  const cargarAgentes = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = getAuthToken()

      // Verificar si hay token antes de hacer la petición
      if (!token) {
        throw new Error("No se encontró token de autenticación. Por favor, inicia sesión nuevamente.")
      }

      const response = await fetch("http://localhost:10101/api/agentes", {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem("authToken")
        localStorage.removeItem("token")
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Mapear los datos de la API al formato esperado por el componente
      const agentesFormateados = data.map((agente) => ({
        id: agente.id,
        name: agente.nombre || agente.name,
        email: agente.email || agente.correo,
        phone: agente.telefono || agente.phone,
        propertyCount: agente.propiedades_count || agente.propertyCount || 0,
        rating: agente.puntuacion || agente.rating || 0,
        status: agente.estado || agente.status || "Activo",
        specialties: agente.especialidades || agente.specialties || [],
        avatar: agente.avatar || null,
        createdAt: agente.fecha_creacion || agente.createdAt,
        totalSales: agente.ventas_totales || agente.totalSales || 0,
        description: agente.descripcion || agente.description || "",
      }))

      setAgentes(agentesFormateados)
    } catch (error) {
      console.error("Error al cargar agentes:", error)
      setError(error.message)

      // Si es error de autenticación, redirigir al login
      if (error.message.includes("sesión") || error.message.includes("autenticación")) {
        setIsAuthenticated(false)
        // Opcional: redirigir al login
        // navigate('/login')
      }

      setAgentes([])
    } finally {
      setLoading(false)
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
      const token = getAuthToken()

      if (!token) {
        throw new Error("No se encontró token de autenticación.")
      }

      const response = await fetch(`http://localhost:10101/api/agentes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.status === 401) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("token")
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Actualizar el estado local removiendo el agente eliminado
      setAgentes((prev) => prev.filter((agente) => agente.id !== id))
      console.log(`Agente ${id} eliminado exitosamente`)
    } catch (error) {
      console.error("Error al eliminar agente:", error)
      alert(`Error al eliminar el agente: ${error.message}`)

      if (error.message.includes("sesión") || error.message.includes("autenticación")) {
        setIsAuthenticated(false)
      }
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
  const handleSaveAgent = async (updatedAgent) => {
    try {
      const token = getAuthToken()

      if (!token) {
        throw new Error("No se encontró token de autenticación.")
      }

      const response = await fetch(`http://localhost:10101/api/agentes/${updatedAgent.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nombre: updatedAgent.name,
          email: updatedAgent.email,
          telefono: updatedAgent.phone,
          especialidades: updatedAgent.specialties,
          descripcion: updatedAgent.description,
          estado: updatedAgent.status,
        }),
      })

      if (response.status === 401) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("token")
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Actualizar el estado local
      setAgentes((prev) => prev.map((agent) => (agent.id === updatedAgent.id ? updatedAgent : agent)))
      console.log("Agente actualizado:", updatedAgent)
    } catch (error) {
      console.error("Error al actualizar agente:", error)
      alert(`Error al actualizar el agente: ${error.message}`)

      if (error.message.includes("sesión") || error.message.includes("autenticación")) {
        setIsAuthenticated(false)
      }
    }
  }

  // Función para manejar logout
  const handleLogout = () => {
    console.log("Cerrando sesión...")
    localStorage.removeItem("authToken")
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    navigate("/login")
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

  // Componente de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header hasSidebar={true} toggleSidebar={toggleSidebar} />
        <div className="flex pt-16">
          <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
            <SidebarInmobiliaria
              isOpen={true}
              toggleMenu={() => {}}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              isFixedLayout={true}
            />
          </div>
          <main className="flex-1 lg:ml-72 transition-all duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2F8EAC] mx-auto mb-4" />
                  <p className="text-gray-600">Cargando agentes...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Componente de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header hasSidebar={true} toggleSidebar={toggleSidebar} />
        <div className="flex pt-16">
          <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
            <SidebarInmobiliaria
              isOpen={true}
              toggleMenu={() => {}}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              isFixedLayout={true}
            />
          </div>
          <main className="flex-1 lg:ml-72 transition-all duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar agentes</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <div className="space-y-2">
                    <button
                      onClick={cargarAgentes}
                      className="bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium mr-2"
                    >
                      Reintentar
                    </button>
                    {error.includes("sesión") || error.includes("autenticación") ? (
                      <button
                        onClick={() => navigate("/login")}
                        className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                      >
                        Ir al Login
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sesión expirada</h3>
          <p className="text-gray-600 mb-4">Por favor, inicia sesión para continuar</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium"
          >
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

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
