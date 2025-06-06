import React, { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Users, Building2, DollarSign, Eye, Bell } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'

// Datos simulados del dashboard
const dashboardData = {
  propiedadesActivas: 200,
  visitasProgramadas: 43,
  usuariosRegistrados: 1222,
  ingresosMensuales: 5630000,
  actividadReciente: [
    { dia: 'Lun', visitas: 85 },
    { dia: 'Mar', visitas: 120 },
    { dia: 'Mié', visitas: 140 },
    { dia: 'Jue', visitas: 180 },
    { dia: 'Vie', visitas: 220 },
    { dia: 'Sáb', visitas: 150 },
    { dia: 'Dom', visitas: 320 }
  ],
  tareasPendientes: [
    'Visita confirmada para el día de hoy',
    'Nueva propiedad agregada',
    'Pago de alquiler recibido',
    'Se actualizó la propiedad "C3"'
  ]
}

export const DashboardAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())

  // Función para manejar logout
  const handleLogout = () => {
    console.log('Cerrando sesión...');
    setIsAuthenticated(false);
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Obtener el máximo valor para normalizar el gráfico
  const maxVisitas = Math.max(...dashboardData.actividadReciente.map(item => item.visitas));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header hasSidebar={true} />
      
      {/* Layout principal con sidebar fijo */}
      <div className="flex pt-16">
        {/* Sidebar fijo siempre visible */}
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <SidebarInmobiliaria 
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Contenido principal con margen izquierdo para el sidebar */}
        <main className="flex-1 ml-72">
          <div className="p-6">
            {/* Header del Dashboard */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                Resumen general de tu negocio inmobiliario
              </p>
            </div>

            {/* Tarjetas de estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Propiedades Activas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-3xl font-bold text-gray-900">{dashboardData.propiedadesActivas}</span>
                    </div>
                    <p className="text-sm text-gray-600">Propiedades Activas</p>
                  </div>
                </div>
              </div>

              {/* Visitas Programadas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-3xl font-bold text-gray-900">{dashboardData.visitasProgramadas}</span>
                    </div>
                    <p className="text-sm text-gray-600">Visitas Programadas</p>
                  </div>
                </div>
              </div>

              {/* Usuarios Registrados */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-3xl font-bold text-gray-900">{dashboardData.usuariosRegistrados.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">Usuarios Registrados</p>
                  </div>
                </div>
              </div>

              {/* Ingresos Mensuales */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-lg font-bold text-gray-900">{formatearPrecio(dashboardData.ingresosMensuales)}</span>
                    </div>
                    <p className="text-sm text-gray-600">Ingresos Mensuales</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fila con gráfico y calendario/tareas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gráfico de Actividad Reciente */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Actividad Reciente</h3>
                    <p className="text-sm text-gray-500">Visitas por día de la semana</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#2F8EAC]" />
                </div>

                {/* Gráfico de barras simple */}
                <div className="space-y-4">
                  {dashboardData.actividadReciente.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 text-sm font-medium text-gray-600">{item.dia}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                        <div 
                          className="bg-[#2F8EAC] h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(item.visitas / maxVisitas) * 100}%` }}
                        >
                          <span className="text-xs font-medium text-white">{item.visitas}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel derecho con calendario y tareas */}
              <div className="space-y-6">
                {/* Selector de fecha */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Seleccionar fecha</h3>
                    <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Agosto 2024</div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      Lun, Ago 17
                    </div>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      value={fechaSeleccionada.toISOString().split('T')[0]}
                      onChange={(e) => setFechaSeleccionada(new Date(e.target.value))}
                    />
                  </div>
                </div>

                {/* Tareas Pendientes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Tareas Pendientes</h3>
                    <Bell className="w-5 h-5 text-[#2F8EAC]" />
                  </div>
                  
                  <div className="space-y-3">
                    {dashboardData.tareasPendientes.map((tarea, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-[#2F8EAC] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{tarea}</p>
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