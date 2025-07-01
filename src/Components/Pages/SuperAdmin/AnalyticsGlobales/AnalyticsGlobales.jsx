"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, TrendingDown, Users, Building2, DollarSign, Eye, Filter } from "lucide-react"
import { Header } from "../../../Layouts/Header/Header"
import { SidebarSuperAdmin } from "../../../Layouts/SidebarSuperAdmin/SidebarSuperAdmin"

// Datos simulados de analytics
const analyticsData = {
  metricsGenerales: {
    totalUsuarios: 15847,
    crecimientoUsuarios: 12.5,
    totalPropiedades: 3421,
    crecimientoPropiedades: 8.3,
    totalTransacciones: 892,
    crecimientoTransacciones: 15.7,
    ingresosTotales: 245000000,
    crecimientoIngresos: 22.1,
  },
  actividadMensual: [
    { mes: "Oct", usuarios: 1200, propiedades: 280, transacciones: 65, ingresos: 18500000 },
    { mes: "Nov", usuarios: 1350, propiedades: 310, transacciones: 72, ingresos: 20200000 },
    { mes: "Dic", usuarios: 1480, propiedades: 340, transacciones: 85, ingresos: 23100000 },
    { mes: "Ene", usuarios: 1620, propiedades: 375, transacciones: 92, ingresos: 25800000 },
    { mes: "Feb", usuarios: 1750, propiedades: 410, transacciones: 98, ingresos: 27500000 },
    { mes: "Mar", usuarios: 1890, propiedades: 445, transacciones: 105, ingresos: 29200000 },
  ],
  topInmobiliarias: [
    { nombre: "Propiedades Elite", propiedades: 67, transacciones: 18, ingresos: 4200000, crecimiento: 15.2 },
    { nombre: "Inmobiliaria Premium", propiedades: 45, transacciones: 12, ingresos: 2500000, crecimiento: 8.7 },
    { nombre: "Casas del Norte", propiedades: 32, transacciones: 8, ingresos: 1200000, crecimiento: -2.1 },
    { nombre: "Bienes Raíces Sur", propiedades: 28, transacciones: 3, ingresos: 800000, crecimiento: -5.3 },
  ],
  distribucionPorCiudad: [
    { ciudad: "Bogotá", inmobiliarias: 18, propiedades: 1245, porcentaje: 36.4 },
    { ciudad: "Medellín", inmobiliarias: 12, propiedades: 892, porcentaje: 26.1 },
    { ciudad: "Cali", inmobiliarias: 8, propiedades: 634, porcentaje: 18.5 },
    { ciudad: "Barranquilla", inmobiliarias: 5, propiedades: 425, porcentaje: 12.4 },
    { ciudad: "Otras", inmobiliarias: 2, propiedades: 225, porcentaje: 6.6 },
  ],
}

export const AnalyticsGlobales = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("6meses")
  const [metricaSeleccionada, setMetricaSeleccionada] = useState("usuarios")

  // Función para manejar toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para manejar logout
  const handleLogout = () => {
    console.log("Cerrando sesión...")
    setIsAuthenticated(false)
  }

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  // Función para formatear números
  const formatearNumero = (numero) => {
    return new Intl.NumberFormat("es-CO").format(numero)
  }

  // Función para obtener datos del gráfico según la métrica seleccionada
  const getDatosGrafico = () => {
    switch (metricaSeleccionada) {
      case "usuarios":
        return analyticsData.actividadMensual.map((item) => ({ ...item, valor: item.usuarios }))
      case "propiedades":
        return analyticsData.actividadMensual.map((item) => ({ ...item, valor: item.propiedades }))
      case "transacciones":
        return analyticsData.actividadMensual.map((item) => ({ ...item, valor: item.transacciones }))
      case "ingresos":
        return analyticsData.actividadMensual.map((item) => ({ ...item, valor: item.ingresos }))
      default:
        return analyticsData.actividadMensual.map((item) => ({ ...item, valor: item.usuarios }))
    }
  }

  // Función para obtener el máximo valor para normalizar el gráfico
  const getMaxValor = () => {
    const datos = getDatosGrafico()
    return Math.max(...datos.map((item) => item.valor))
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex pt-16">
        {/* Sidebar fijo para desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <SidebarSuperAdmin
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Sidebar overlay para móviles */}
        <SidebarSuperAdmin
          isOpen={isSidebarOpen}
          toggleMenu={toggleSidebar}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          isFixedLayout={false}
        />

        {/* Overlay para cerrar sidebar en móviles */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-70 z-40 lg:hidden" onClick={toggleSidebar}></div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Globales</h1>
                <p className="text-gray-600 text-sm mt-1">Métricas y estadísticas avanzadas de toda la plataforma</p>
              </div>

              {/* Filtros de período */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={periodoSeleccionado}
                  onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                >
                  <option value="1mes">Último mes</option>
                  <option value="3meses">Últimos 3 meses</option>
                  <option value="6meses">Últimos 6 meses</option>
                  <option value="1año">Último año</option>
                </select>
              </div>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Total Usuarios */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {formatearNumero(analyticsData.metricsGenerales.totalUsuarios)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Usuarios</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        +{analyticsData.metricsGenerales.crecimientoUsuarios}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Propiedades */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {formatearNumero(analyticsData.metricsGenerales.totalPropiedades)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Propiedades</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        +{analyticsData.metricsGenerales.crecimientoPropiedades}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Transacciones */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {formatearNumero(analyticsData.metricsGenerales.totalTransacciones)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Transacciones</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        +{analyticsData.metricsGenerales.crecimientoTransacciones}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingresos Totales */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-base sm:text-lg font-bold text-gray-900 break-words">
                        {formatearPrecio(analyticsData.metricsGenerales.ingresosTotales)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Ingresos Totales</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        +{analyticsData.metricsGenerales.crecimientoIngresos}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de tendencias y distribución */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              {/* Gráfico de Tendencias */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Tendencias de Crecimiento</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Evolución mensual de métricas clave</p>
                  </div>

                  {/* Selector de métrica */}
                  <select
                    value={metricaSeleccionada}
                    onChange={(e) => setMetricaSeleccionada(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm"
                  >
                    <option value="usuarios">Usuarios</option>
                    <option value="propiedades">Propiedades</option>
                    <option value="transacciones">Transacciones</option>
                    <option value="ingresos">Ingresos</option>
                  </select>
                </div>

                {/* Gráfico de barras */}
                <div className="space-y-4">
                  {getDatosGrafico().map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">{item.mes}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {metricaSeleccionada === "ingresos"
                              ? formatearPrecio(item.valor)
                              : formatearNumero(item.valor)}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#2F8EAC] to-[#1E5F73] h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.valor / getMaxValor()) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribución por Ciudad */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Distribución por Ciudad</h3>
                    <p className="text-xs text-gray-500">Propiedades por ubicación</p>
                  </div>
                  <Eye className="w-5 h-5 text-[#2F8EAC]" />
                </div>

                <div className="space-y-4">
                  {analyticsData.distribucionPorCiudad.map((ciudad, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{ciudad.ciudad}</span>
                          <p className="text-xs text-gray-500">{ciudad.inmobiliarias} inmobiliarias</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">{ciudad.propiedades}</span>
                          <p className="text-xs text-gray-500">{ciudad.porcentaje}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#2F8EAC] h-2 rounded-full" style={{ width: `${ciudad.porcentaje}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Inmobiliarias */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Top Inmobiliarias</h2>
                <p className="text-sm text-gray-500">Ranking por rendimiento y crecimiento</p>
              </div>

              {/* Vista móvil - Cards */}
              <div className="block lg:hidden">
                {analyticsData.topInmobiliarias.map((inmobiliaria, index) => (
                  <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#2F8EAC]">#{index + 1}</span>
                          <h3 className="font-semibold text-gray-900">{inmobiliaria.nombre}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{inmobiliaria.propiedades} propiedades</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {inmobiliaria.crecimiento >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${inmobiliaria.crecimiento >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {inmobiliaria.crecimiento >= 0 ? "+" : ""}
                          {inmobiliaria.crecimiento}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Transacciones:</span>
                        <span className="ml-1 font-medium">{inmobiliaria.transacciones}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ingresos:</span>
                        <span className="ml-1 font-medium">{formatearPrecio(inmobiliaria.ingresos)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vista desktop - Tabla */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ranking
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Inmobiliaria
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Propiedades
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Transacciones
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ingresos
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Crecimiento
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {analyticsData.topInmobiliarias.map((inmobiliaria, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-[#2F8EAC]">#{index + 1}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{inmobiliaria.nombre}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inmobiliaria.propiedades}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inmobiliaria.transacciones}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatearPrecio(inmobiliaria.ingresos)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {inmobiliaria.crecimiento >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span
                              className={`text-sm font-medium ${inmobiliaria.crecimiento >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {inmobiliaria.crecimiento >= 0 ? "+" : ""}
                              {inmobiliaria.crecimiento}%
                            </span>
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
      </div>
    </div>
  )
}
