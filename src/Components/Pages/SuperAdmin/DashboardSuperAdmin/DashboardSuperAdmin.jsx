"use client"

import { useState, useEffect } from "react"
import { Building2, DollarSign, TrendingUp, Crown, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { Header } from "../../../Layouts/Header/Header"
import { SidebarSuperAdmin } from "../../../Layouts/SidebarSuperAdmin/SidebarSuperAdmin"

// Datos simulados del dashboard del Super Admin
const superAdminData = {
  totalInmobiliarias: 45,
  totalAgentes: 234,
  ingresosTotales: 125000000,
  inmobiliariasActivas: 42,
  inmobiliariasSuspendidas: 3,
  actividadMensual: [
    { mes: "Ene", ingresos: 8500000, inmobiliarias: 38 },
    { mes: "Feb", ingresos: 9200000, inmobiliarias: 40 },
    { mes: "Mar", ingresos: 10100000, inmobiliarias: 42 },
    { mes: "Abr", ingresos: 11800000, inmobiliarias: 43 },
    { mes: "May", ingresos: 12500000, inmobiliarias: 45 },
  ],
  alertasRecientes: [
    { tipo: "warning", mensaje: 'Inmobiliaria "Casas del Norte" con pago pendiente', tiempo: "2 horas" },
    { tipo: "success", mensaje: 'Nueva inmobiliaria registrada: "Propiedades Premium"', tiempo: "5 horas" },
    { tipo: "error", mensaje: "Reporte de problema técnico en módulo de pagos", tiempo: "1 día" },
    { tipo: "info", mensaje: "Actualización del sistema programada para mañana", tiempo: "2 días" },
  ],
}

export const DashboardSuperAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  // Función para obtener icono de alerta
  const getAlertIcon = (tipo) => {
    switch (tipo) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Shield className="w-4 h-4 text-blue-500" />
    }
  }

  // Cerrar sidebar al hacer clic fuera en móviles
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
      {/* Header con función toggleSidebar */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Layout principal con sidebar responsivo */}
      <div className="flex pt-16">
        {/* Sidebar fijo para desktop (lg y superior) */}
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

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {/* Header del Dashboard */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-8 h-8 text-[#2F8EAC]" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              </div>
              <p className="text-gray-600 text-sm">Panel de control maestro de la plataforma DomuHouse</p>
            </div>

            {/* Tarjetas de estadísticas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Total Inmobiliarias */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {superAdminData.totalInmobiliarias}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Inmobiliarias</p>
                    <p className="text-xs text-green-600">{superAdminData.inmobiliariasActivas} activas</p>
                  </div>
                </div>
              </div>

              {/* Total Agentes */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {superAdminData.totalAgentes}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Agentes</p>
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
                        {formatearPrecio(superAdminData.ingresosTotales)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Ingresos Totales</p>
                  </div>
                </div>
              </div>

              {/* Total Propiedades */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">1,247</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Propiedades</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fila con gráfico y alertas */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Gráfico de Crecimiento */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Crecimiento de la Plataforma</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Inmobiliarias e ingresos por mes</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#2F8EAC]" />
                </div>

                {/* Gráfico simple de barras */}
                <div className="space-y-4">
                  {superAdminData.actividadMensual.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">{item.mes}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">{formatearPrecio(item.ingresos)}</div>
                          <div className="text-xs text-gray-500">{item.inmobiliarias} inmobiliarias</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#2F8EAC] to-[#1E5F73] h-3 rounded-full"
                          style={{
                            width: `${(item.ingresos / Math.max(...superAdminData.actividadMensual.map((i) => i.ingresos))) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel de Alertas y Notificaciones */}
              <div className="space-y-6">
                {/* Estado del Sistema */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">Estado del Sistema</h3>
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Inmobiliarias Activas</span>
                      <span className="text-sm font-semibold text-green-600">
                        {superAdminData.inmobiliariasActivas}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Suspendidas</span>
                      <span className="text-sm font-semibold text-red-600">
                        {superAdminData.inmobiliariasSuspendidas}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(superAdminData.inmobiliariasActivas / superAdminData.totalInmobiliarias) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Alertas Recientes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">Alertas Recientes</h3>
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </div>

                  <div className="space-y-3">
                    {superAdminData.alertasRecientes.map((alerta, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        {getAlertIcon(alerta.tipo)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-700">{alerta.mensaje}</p>
                          <p className="text-xs text-gray-500 mt-1">{alerta.tiempo}</p>
                        </div>
                      </div>
                    ))}
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
