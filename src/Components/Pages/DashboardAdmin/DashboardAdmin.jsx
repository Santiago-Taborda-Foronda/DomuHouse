"use client"

import { useState, useEffect } from "react"
import { Calendar, TrendingUp, Users, Building2, DollarSign, Bell } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"

export const DashboardAdmin = () => {
  // Estados de UI
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Estados de datos del dashboard
  const [dashboardData, setDashboardData] = useState({
    propiedadesActivas: 0,
    usuariosRegistrados: 0,
    ventasMes: 0,
    ingresosMensuales: 0,
    actividadReciente: [],
    tareasPendientes: [],
  })

  // Funciones auxiliares
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    console.log("Cerrando sesión...")
    setIsAuthenticated(false)
  }

  // Función principal para obtener datos del dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const adminId = localStorage.getItem("adminId")

      if (!adminId) {
        throw new Error("No se encontró el ID del administrador")
      }

      // Obtener propiedades activas del admin
      const resProps = await fetch(`http://localhost:10101/api/properties/admin/${adminId}`)
      const propiedadesAdmin = await resProps.json()
      const propiedadesActivas = propiedadesAdmin?.length || 0

      // Obtener usuarios registrados
      const resUsers = await fetch("http://localhost:10101/api/clients/count")
      const userData = await resUsers.json()
      const usuariosRegistrados = userData?.totalClients || 0

      // Obtener datos completos de propiedades para análisis
      const resOperaciones = await fetch(
        `https://imagen-domuhouse-express.onrender.com/api/properties/admin/${adminId}`,
      )
      const propiedadesFull = await resOperaciones.json()

      // Calcular datos del mes actual
      const ahora = new Date()
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

      // Filtrar ventas del mes
      const ventas = propiedadesFull.filter((p) => {
        const fecha = new Date(p.sale_date)
        return p.operation_type === "Venta" && fecha >= inicioMes && fecha <= ahora && p.status === "Ocupado"
      })

      // Filtrar alquileres del mes
      const alquileres = propiedadesFull.filter((p) => {
        const fecha = new Date(p.rent_date)
        return p.operation_type === "Arriendo" && fecha >= inicioMes && fecha <= ahora && p.status === "Ocupado"
      })

      // Calcular ingresos
      const ingresosVentas = ventas.reduce((sum, p) => sum + Number(p.price || 0), 0)
      const ingresosAlquileres = alquileres.reduce((sum, p) => sum + Number(p.price || 0), 0)
      const ingresosMensuales = ingresosVentas + ingresosAlquileres
      const ventasMes = ventas.length + alquileres.length

      // Generar actividad reciente
      const actividad = []

      ventas.forEach((v) => {
        actividad.push({
          tipo: "Venta realizada",
          cantidad: 1,
          fecha: new Date(v.sale_date).toLocaleDateString(),
        })
      })

      alquileres.forEach((a) => {
        actividad.push({
          tipo: "Alquiler realizado",
          cantidad: 1,
          fecha: new Date(a.rent_date).toLocaleDateString(),
        })
      })

      const actividadReciente = actividad.slice(0, 6)

      // Generar tareas pendientes
      const tareas = []
      if (ventas.length > 0) {
        tareas.push(`${ventas.length} venta${ventas.length > 1 ? "s" : ""} realizada${ventas.length > 1 ? "s" : ""}`)
      }
      if (alquileres.length > 0) {
        tareas.push(
          `${alquileres.length} alquiler${alquileres.length > 1 ? "es" : ""} realizado${alquileres.length > 1 ? "s" : ""}`,
        )
      }
      if (tareas.length === 0) {
        tareas.push("No hay actividad reciente")
      }

      // Actualizar estado con todos los datos
      setDashboardData({
        propiedadesActivas,
        usuariosRegistrados,
        ventasMes,
        ingresosMensuales,
        actividadReciente,
        tareasPendientes: tareas,
      })
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error)
      setDashboardData((prev) => ({
        ...prev,
        actividadReciente: [],
        tareasPendientes: ["Error al cargar datos"],
      }))
    } finally {
      setLoading(false)
    }
  }

  // Effects
  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F8EAC] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Layout principal */}
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

        {/* Overlay para cerrar sidebar en móviles */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-70 z-40 lg:hidden" onClick={toggleSidebar} />
        )}

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {/* Header del Dashboard */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Resumen general de tu negocio inmobiliario</p>
            </div>

            {/* Tarjetas de estadísticas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Propiedades Activas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {dashboardData.propiedadesActivas}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Propiedades Activas</p>
                  </div>
                </div>
              </div>

              {/* Operaciones del mes */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.ventasMes}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Operaciones del Mes</p>
                  </div>
                </div>
              </div>

              {/* Usuarios Registrados */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {dashboardData.usuariosRegistrados.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Usuarios Registrados</p>
                  </div>
                </div>
              </div>

              {/* Ingresos Mensuales */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-base sm:text-lg font-bold text-gray-900 break-words">
                        {formatearPrecio(dashboardData.ingresosMensuales)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Ingresos Mensuales</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fila con actividad reciente y panel lateral */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Actividad Reciente */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Actividad Reciente</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Últimas operaciones realizadas</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#2F8EAC]" />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {dashboardData.actividadReciente.length > 0 ? (
                    dashboardData.actividadReciente.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{item.tipo}</p>
                            <p className="text-xs text-gray-500">{item.fecha}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#2F8EAC]">+{item.cantidad}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No hay actividad reciente</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel derecho */}
              <div className="space-y-6">
                {/* Selector de fecha */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">Seleccionar fecha</h3>
                    <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm text-gray-600 mb-2">
                      {fechaSeleccionada.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {fechaSeleccionada.toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    <input
                      type="date"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm"
                      value={fechaSeleccionada.toISOString().split("T")[0]}
                      onChange={(e) => setFechaSeleccionada(new Date(e.target.value))}
                    />
                  </div>
                </div>

                {/* Resumen de Actividad */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">Resumen del Mes</h3>
                    <Bell className="w-5 h-5 text-[#2F8EAC]" />
                  </div>
                  <div className="space-y-3">
                    {dashboardData.tareasPendientes.length > 0 ? (
                      dashboardData.tareasPendientes.map((tarea, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-[#2F8EAC] rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-xs sm:text-sm text-gray-700">{tarea}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-xs sm:text-sm text-gray-500">No hay actividad este mes</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
