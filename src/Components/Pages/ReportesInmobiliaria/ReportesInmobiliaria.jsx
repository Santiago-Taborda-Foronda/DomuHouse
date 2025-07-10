"use client"

import { useState, useEffect, useCallback } from "react"
import {
  TrendingUp,
  DollarSign,
  Award,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Building2,
  UserCheck,
  Eye,
  X,
  Star,
} from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"

// Modal para ver detalles del agente
const AgentDetailsModal = ({ agente, isOpen, onClose }) => {
  if (!isOpen || !agente) return null

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? "text-amber-400 fill-current" : "text-slate-300"}`}
      />
    ))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Detalles del Agente</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Información personal */}
          <div className="bg-gradient-to-r from-[#2F8EAC]/10 to-[#4ECDC4]/10 rounded-xl p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2F8EAC] to-[#4ECDC4] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {agente.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{agente.nombre}</h3>
                <p className="text-[#2F8EAC] font-medium">Agente Inmobiliario</p>
                <div className="flex items-center gap-1 mt-1">{renderStars(4.5)}</div>
              </div>
            </div>
          </div>

          {/* Métricas de rendimiento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#2F8EAC]">{agente.ventas}</div>
              <p className="text-sm text-slate-600">Ventas Totales</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#4ECDC4]">{agente.porcentaje}%</div>
              <p className="text-sm text-slate-600">Participación</p>
            </div>
          </div>

          {/* Información de rendimiento */}
          <div className="bg-emerald-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Comisiones
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Comisiones:</span>
                <span className="font-bold text-emerald-600">{formatearPrecio(agente.comisiones)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReportesInmobiliaria() {
  const [filtroTiempo, setFiltroTiempo] = useState("mensual")
  const [tipoReporte, setTipoReporte] = useState("ventas")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  // Estados para los modales
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Estados para datos del backend
  const [resumenGlobal, setResumenGlobal] = useState({
    totalSales: 0,
    soldProperties: 0,
  })
  const [totalClients, setTotalClients] = useState(0)
  const [topAgents, setTopAgents] = useState([])
  const [propertyTypeSales, setPropertyTypeSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Funciones fetch para obtener datos del backend
  const fetchResumenGlobal = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:10101/api/admin/global-sales")
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()

      const summary = data.summary || {}
      setResumenGlobal({
        totalSales: Number(summary.totalSales || 0),
        soldProperties: summary.soldProperties || 0,
      })
    } catch (error) {
      console.error("Error al obtener resumen global:", error)
      setError(error.message)
    }
  }, [])

  const fetchClientes = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:10101/api/clients/count")
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      setTotalClients(data.totalClients || 0)
    } catch (error) {
      console.error("Error al obtener total de clientes:", error)
      setError(error.message)
    }
  }, [])

  const fetchTopAgentes = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:10101/api/admin/top-agents")
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      const rows = data.topAgentes || []
      setTopAgents(
        rows.map((agente, index) => ({
          id: index + 1,
          nombre: agente.nombre,
          ventas: agente.ventas,
          porcentaje: agente.porcentaje,
          comisiones: Number(agente.comisiones),
        })),
      )
    } catch (error) {
      console.error("Error al obtener top agentes:", error)
      setError(error.message)
    }
  }, [])

  const fetchTiposPropiedades = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:10101/api/admin/property-type-sales")
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      const rows = data.tiposPropiedades || []

      const parsed = rows.map((tipo) => ({
        tipo: tipo.tipo,
        ventas: Number(tipo.ventas),
      }))

      const total = parsed.reduce((acc, item) => acc + item.ventas, 0)

      setPropertyTypeSales(
        parsed.map((item) => ({
          ...item,
          porcentaje: total ? Math.round((item.ventas / total) * 100) : 0,
        })),
      )
    } catch (error) {
      console.error("Error al obtener tipos de propiedad:", error)
      setError(error.message)
    }
  }, [])

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      await Promise.all([fetchResumenGlobal(), fetchClientes(), fetchTopAgentes(), fetchTiposPropiedades()])
      setLoading(false)
    })()
  }, [fetchResumenGlobal, fetchClientes, fetchTopAgentes, fetchTiposPropiedades])

  // Función para ver detalles del agente
  const verAgente = (id) => {
    const agent = topAgents.find((a) => a.id === id)
    if (agent) {
      setSelectedAgent(agent)
      setIsDetailsModalOpen(true)
    }
  }

  // Función para guardar cambios del agente

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    console.log("Usuario desconectado")
  }

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio)
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F8EAC] mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar los datos: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a95] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header hasSidebar={true} toggleSidebar={toggleSidebar} />

      {/* Layout principal con sidebar */}
      <div className="flex pt-16">
        {/* Sidebar fijo para desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-slate-200 overflow-y-auto z-30">
          <SidebarInmobiliaria
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Sidebar overlay para móviles */}
        <div className="lg:hidden">
          <SidebarInmobiliaria
            isOpen={isSidebarOpen}
            toggleMenu={toggleSidebar}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={false}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 lg:ml-72">
          {/* Header de la página */}
          <div className="bg-white shadow-sm border-b border-slate-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Reportes y Estadísticas</h1>
                  <p className="text-sm text-slate-600 mt-1">Análisis completo del rendimiento de tu inmobiliaria</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Tabs de navegación */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-fit">
                {[
                  { id: "ventas", label: "Ventas" },
                  { id: "agentes", label: "Agentes" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTipoReporte(tab.id)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tipoReporte === tab.id
                        ? "bg-white text-[#2F8EAC] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tarjetas de métricas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Ventas Totales */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#2F8EAC]/20 rounded-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F8EAC]" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">+12.5%</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
                    {formatearPrecio(resumenGlobal.totalSales)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Ventas Totales</p>
                </div>
              </div>

              {/* Propiedades Vendidas */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#4ECDC4]/20 rounded-lg">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ECDC4]" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">+8.3%</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
                    {resumenGlobal.soldProperties}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Propiedades Vendidas</p>
                </div>
              </div>

              {/* Clientes Totales */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#7DD3C0]/20 rounded-lg">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#7DD3C0]" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">+15.2%</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">{totalClients}</div>
                  <p className="text-xs sm:text-sm text-slate-600">Total Clientes</p>
                </div>
              </div>
            </div>

            {/* Contenido principal según el tab seleccionado */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Gráfico principal */}
              <div className="xl:col-span-2">
                {tipoReporte === "ventas" ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Resumen de Ventas</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Información general del negocio</p>
                      </div>
                      <BarChart3 className="w-5 h-5 text-[#2F8EAC]" />
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-[#2F8EAC]/10 to-[#4ECDC4]/10 rounded-xl p-4">
                          <h4 className="font-semibold text-slate-800 mb-2">Ventas Totales</h4>
                          <p className="text-2xl font-bold text-[#2F8EAC]">
                            {formatearPrecio(resumenGlobal.totalSales)}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#7DD3C0]/10 rounded-xl p-4">
                          <h4 className="font-semibold text-slate-800 mb-2">Propiedades Vendidas</h4>
                          <p className="text-2xl font-bold text-[#4ECDC4]">{resumenGlobal.soldProperties}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Top Agentes</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Mejores agentes por ventas</p>
                      </div>
                      <Award className="w-5 h-5 text-[#2F8EAC]" />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {topAgents.map((agente, index) => (
                        <div
                          key={agente.id}
                          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl"
                        >
                          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#2F8EAC] to-[#4ECDC4] text-white rounded-full text-xs sm:text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                              <span className="font-medium text-slate-900 text-sm sm:text-base truncate">
                                {agente.nombre}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm text-slate-600">{agente.ventas} ventas</span>
                                <span className="text-xs sm:text-sm text-[#2F8EAC] font-medium">
                                  {agente.porcentaje}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs sm:text-sm text-slate-600">
                                Comisiones: {formatearPrecio(agente.comisiones)}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => verAgente(agente.id)}
                                  className="p-1.5 text-[#2F8EAC] hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel lateral - Distribución por tipo de propiedad */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Tipos de Propiedades</h3>
                    <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F8EAC]" />
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {propertyTypeSales.map((tipo, index) => {
                      const colores = ["bg-[#2F8EAC]", "bg-[#4ECDC4]", "bg-[#7DD3C0]", "bg-[#1e5f73]"]
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-slate-700">{tipo.tipo}</span>
                            <span className="text-xs sm:text-sm text-slate-600">{tipo.porcentaje}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`${colores[index % colores.length]} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${tipo.porcentaje}%` }}
                            />
                          </div>
                          <div className="text-xs text-slate-500">{formatearPrecio(tipo.ventas)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <AgentDetailsModal
        agente={selectedAgent}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedAgent(null)
        }}
      />
    </div>
  )
}
