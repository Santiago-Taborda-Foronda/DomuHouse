"use client"
import { useState, useEffect } from "react"
import { TrendingUp, Users, Building2, Bell, Eye } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"

export const DashboardAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    propiedadesActivas: 0,
    usuariosRegistrados: 0,
    visitasAgendadas: 0,
    actividadReciente: [],
    tareasPendientes: [],
  })

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    console.log("Cerrando sesión...")
    setIsAuthenticated(false)
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const adminId = localStorage.getItem("adminId")
      if (!adminId) throw new Error("No se encontró el ID del administrador")

      // Obtener propiedades del admin
      const resProps = await fetch(`http://localhost:10101/api/properties/admin/${adminId}`)
      const propiedadesAdmin = await resProps.json()
      const propiedadesActivas = propiedadesAdmin?.length || 0

      // Obtener usuarios registrados
      const resUsers = await fetch("http://localhost:10101/api/clients/count")
      const userData = await resUsers.json()
      const usuariosRegistrados = userData?.totalClients || 0

      // Obtener visitas agendadas
      const resVisitas = await fetch("http://localhost:10101/api/visitas")
      const visitasData = await resVisitas.json()
      const visitasAgendadas = visitasData?.length || 0

      // Crear actividad reciente con información detallada de visitas
      const actividad = []
      if (visitasData && visitasData.length > 0) {
        visitasData.slice(0, 6).forEach((visita) => {
          actividad.push({
            tipo: "Visita agendada",
            nombre: visita.nombre || "Cliente",
            propiedad: visita.nombre_propiedad || visita.direccion || "Propiedad no especificada",
            fecha: visita.visit_date
              ? new Date(visita.visit_date).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Fecha no disponible",
            telefono: visita.telefono || "",
            status: visita.status || "Pendiente",
          })
        })
      }

      const actividadReciente = actividad

      // Crear tareas pendientes solo con visitas
      const tareas = []
      if (visitasAgendadas > 0)
        tareas.push(
          `${visitasAgendadas} visita${visitasAgendadas > 1 ? "s" : ""} agendada${visitasAgendadas > 1 ? "s" : ""}`,
        )
      if (tareas.length === 0) tareas.push("No hay actividad reciente")

      setDashboardData({
        propiedadesActivas,
        usuariosRegistrados,
        visitasAgendadas,
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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false)
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

              {/* Visitas Agendadas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {dashboardData.visitasAgendadas}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Visitas Agendadas</p>
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
            </div>

            {/* Fila con actividad reciente y panel lateral */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Actividad Reciente */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Actividad Reciente</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Últimas visitas agendadas</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#2F8EAC]" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {dashboardData.actividadReciente.length > 0 ? (
                    dashboardData.actividadReciente.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-800">{item.tipo}</p>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  item.status === "Confirmada"
                                    ? "bg-sky-100 text-blue-700"
                                    : item.status === "Pendiente"
                                      ? "bg-indigo-100 text-sky-700 font-bold"
                                      : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium truncate">{item.nombre}</p>
                            <p className="text-xs text-gray-600 truncate">{item.propiedad}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.fecha}</p>
                          </div>
                        </div>
                      
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No hay visitas agendadas</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel derecho */}
              <div className="space-y-6">
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
