import React, { useState } from 'react'
import { SidebarInmobiliaria } from '../../../Components/Layouts/SidebarInmobiliaria/SidebarInmobiliaria.jsx'
import { Header } from '../../../Components/Layouts/Header/Header.jsx'
import {TrendingUp, Users, DollarSign, Calendar, Award, BarChart3, PieChart, Target,ArrowUpRight,ArrowDownRight,Filter,Download,Building2,UserCheck,Phone,Mail} from 'lucide-react'

// Datos simulados para los reportes
const reportesData = {
  resumenGeneral: {
    ventasTotales: 2450000000,
    ventasMesAnterior: 2100000000,
    clientesNuevos: 187,
    clientesMesAnterior: 165,
    propiedadesVendidas: 34,
    propiedadesMesAnterior: 29,
    comisionesTotales: 245000000,
    comisionesMesAnterior: 210000000
  },
  
  topAgentes: [
    { nombre: 'María González', ventas: 8, comisiones: 45000000, crecimiento: 15.2 },
    { nombre: 'Carlos Rodríguez', ventas: 7, comisiones: 38500000, crecimiento: 8.7 },
    { nombre: 'Ana Martínez', ventas: 6, comisiones: 32000000, crecimiento: 12.3 },
    { nombre: 'Luis Herrera', ventas: 5, comisiones: 28000000, crecimiento: -2.1 },
    { nombre: 'Patricia Silva', ventas: 4, comisiones: 22000000, crecimiento: 18.9 }
  ],

  ventasPorMes: [
    { mes: 'Ene', ventas: 1800000000, propiedades: 25 },
    { mes: 'Feb', ventas: 2100000000, propiedades: 28 },
    { mes: 'Mar', ventas: 2300000000, propiedades: 31 },
    { mes: 'Abr', ventas: 2050000000, propiedades: 27 },
    { mes: 'May', ventas: 2400000000, propiedades: 33 },
    { mes: 'Jun', ventas: 2200000000, propiedades: 29 },
    { mes: 'Jul', ventas: 2600000000, propiedades: 35 },
    { mes: 'Ago', ventas: 2450000000, propiedades: 34 }
  ],

  tiposPropiedades: [
    { tipo: 'Casas', porcentaje: 45, ventas: 1102500000 },
    { tipo: 'Apartamentos', porcentaje: 35, ventas: 857500000 },
    { tipo: 'Oficinas', porcentaje: 12, ventas: 294000000 },
    { tipo: 'Locales', porcentaje: 8, ventas: 196000000 }
  ],

  crecimientoClientela: [
    { mes: 'Ene', nuevos: 145, contactos: 320, conversiones: 45.3 },
    { mes: 'Feb', nuevos: 132, contactos: 298, conversiones: 44.3 },
    { mes: 'Mar', nuevos: 178, contactos: 367, conversiones: 48.5 },
    { mes: 'Abr', nuevos: 156, contactos: 334, conversiones: 46.7 },
    { mes: 'May', nuevos: 189, contactos: 401, conversiones: 47.1 },
    { mes: 'Jun', nuevos: 167, contactos: 356, conversiones: 46.9 },
    { mes: 'Jul', nuevos: 195, contactos: 423, conversiones: 46.1 },
    { mes: 'Ago', nuevos: 187, contactos: 398, conversiones: 47.0 }
  ]
}

export const ReportesInmobiliaria = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [filtroTiempo, setFiltroTiempo] = useState('mensual')
  const [tipoReporte, setTipoReporte] = useState('ventas')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Función para manejar el toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  // Función para calcular porcentaje de crecimiento
  const calcularCrecimiento = (actual, anterior) => {
    return ((actual - anterior) / anterior * 100).toFixed(1);
  };

  const { resumenGeneral } = reportesData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header hasSidebar={true} toggleSidebar={toggleSidebar} />
      
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
        <div className="lg:hidden">
          <SidebarInmobiliaria 
            isOpen={isSidebarOpen}
            toggleMenu={toggleSidebar}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={false}
          />
        </div>

        {/* Contenido principal con margen adaptativo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          {/* Header de la página */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Análisis completo del rendimiento de tu inmobiliaria
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select 
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] text-sm"
                    value={filtroTiempo}
                    onChange={(e) => setFiltroTiempo(e.target.value)}
                  >
                    <option value="semanal">Últimos 7 días</option>
                    <option value="mensual">Último mes</option>
                    <option value="trimestral">Último trimestre</option>
                    <option value="anual">Último año</option>
                  </select>
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2F8EAC] text-white rounded-xl hover:bg-[#247a94] transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Tabs de navegación */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-fit">
                {[
                  { id: 'ventas', label: 'Ventas' },
                  { id: 'agentes', label: 'Agentes' },
                  { id: 'clientes', label: 'Clientes' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setTipoReporte(tab.id)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tipoReporte === tab.id
                        ? 'bg-white text-[#2F8EAC] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tarjetas de métricas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Ventas Totales */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#4ECDC4]/20 rounded-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ECDC4]" />
                  </div>
                  <div className="flex items-center gap-1 text-[#4ECDC4]">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      +{calcularCrecimiento(resumenGeneral.ventasTotales, resumenGeneral.ventasMesAnterior)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                    {formatearPrecio(resumenGeneral.ventasTotales)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Ventas Totales</p>
                </div>
              </div>

              {/* Propiedades Vendidas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#2F8EAC]/20 rounded-lg">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F8EAC]" />
                  </div>
                  <div className="flex items-center gap-1 text-[#4ECDC4]">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      +{calcularCrecimiento(resumenGeneral.propiedadesVendidas, resumenGeneral.propiedadesMesAnterior)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                    {resumenGeneral.propiedadesVendidas}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Propiedades Vendidas</p>
                </div>
              </div>

              {/* Clientes Nuevos */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#FF8A80]/20 rounded-lg">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF8A80]" />
                  </div>
                  <div className="flex items-center gap-1 text-[#4ECDC4]">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      +{calcularCrecimiento(resumenGeneral.clientesNuevos, resumenGeneral.clientesMesAnterior)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                    {resumenGeneral.clientesNuevos}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Clientes Nuevos</p>
                </div>
              </div>

              {/* Comisiones */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#FFD54F]/20 rounded-lg">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD54F]" />
                  </div>
                  <div className="flex items-center gap-1 text-[#4ECDC4]">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      +{calcularCrecimiento(resumenGeneral.comisionesTotales, resumenGeneral.comisionesMesAnterior)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                    {formatearPrecio(resumenGeneral.comisionesTotales)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Comisiones Generadas</p>
                </div>
              </div>
            </div>

            {/* Contenido principal según el tab seleccionado */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Gráfico principal */}
              <div className="xl:col-span-2">
                {tipoReporte === 'ventas' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Evolución de Ventas</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Ventas mensuales y propiedades vendidas</p>
                      </div>
                      <BarChart3 className="w-5 h-5 text-[#2F8EAC]" />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {reportesData.ventasPorMes.slice(-6).map((item, index) => {
                        const maxVentas = Math.max(...reportesData.ventasPorMes.map(v => v.ventas));
                        return (
                          <div key={index} className="flex items-center gap-2 sm:gap-4">
                            <div className="w-6 sm:w-8 text-xs sm:text-sm font-medium text-gray-600">{item.mes}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 sm:h-8 relative">
                              <div 
                                className="bg-gradient-to-r from-[#2F8EAC] to-[#4ECDC4] h-6 sm:h-8 rounded-full flex items-center justify-between px-2 sm:px-3"
                                style={{ width: `${(item.ventas / maxVentas) * 100}%` }}
                              >
                                <span className="text-xs font-medium text-white truncate">
                                  {formatearPrecio(item.ventas)}
                                </span>
                                <span className="text-xs font-medium text-white">
                                  {item.propiedades}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : tipoReporte === 'clientes' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Crecimiento de Clientela</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Nuevos clientes y tasa de conversión</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-[#2F8EAC]" />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {reportesData.crecimientoClientela.slice(-6).map((item, index) => {
                        const maxClientes = Math.max(...reportesData.crecimientoClientela.map(c => c.nuevos));
                        return (
                          <div key={index} className="flex items-center gap-2 sm:gap-4">
                            <div className="w-6 sm:w-8 text-xs sm:text-sm font-medium text-gray-600">{item.mes}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 sm:h-8 relative">
                              <div 
                                className="bg-gradient-to-r from-[#2F8EAC] to-[#4ECDC4] h-6 sm:h-8 rounded-full flex items-center justify-between px-2 sm:px-3"
                                style={{ width: `${(item.nuevos / maxClientes) * 100}%` }}
                              >
                                <span className="text-xs font-medium text-white">
                                  {item.nuevos}
                                </span>
                                <span className="text-xs font-medium text-white">
                                  {item.conversiones}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Rendimiento de Agentes</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Top 5 agentes por ventas y comisiones</p>
                      </div>
                      <Award className="w-5 h-5 text-[#2F8EAC]" />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {reportesData.topAgentes.map((agente, index) => (
                        <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#2F8EAC] to-[#4ECDC4] text-white rounded-full text-xs sm:text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                              <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{agente.nombre}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm text-gray-600">{agente.ventas} ventas</span>
                                <div className={`flex items-center gap-1 ${agente.crecimiento >= 0 ? 'text-[#4ECDC4]' : 'text-[#FF8A80]'}`}>
                                  {agente.crecimiento >= 0 ? 
                                    <ArrowUpRight className="w-3 h-3" /> : 
                                    <ArrowDownRight className="w-3 h-3" />
                                  }
                                  <span className="text-xs font-medium">
                                    {Math.abs(agente.crecimiento)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {formatearPrecio(agente.comisiones)} en comisiones
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel lateral */}
              <div className="space-y-4 sm:space-y-6">
                {/* Distribución por tipo de propiedad */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Tipos de Propiedades</h3>
                    <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F8EAC]" />
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {reportesData.tiposPropiedades.map((tipo, index) => {
                      const colores = ['bg-[#2F8EAC]', 'bg-[#4ECDC4]', 'bg-[#FF8A80]', 'bg-[#FFD54F]'];
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">{tipo.tipo}</span>
                            <span className="text-xs sm:text-sm text-gray-600">{tipo.porcentaje}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${colores[index]} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${tipo.porcentaje}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatearPrecio(tipo.ventas)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Métricas rápidas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">Métricas del Periodo</h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-[#2F8EAC]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#2F8EAC]" />
                        <span className="text-xs sm:text-sm text-gray-700">Llamadas realizadas</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">1,245</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-[#4ECDC4]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#4ECDC4]" />
                        <span className="text-xs sm:text-sm text-gray-700">Emails enviados</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">3,567</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-[#FF8A80]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF8A80]" />
                        <span className="text-xs sm:text-sm text-gray-700">Citas programadas</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">89</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-[#FFD54F]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFD54F]" />
                        <span className="text-xs sm:text-sm text-gray-700">Tasa de cierre</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">23.4%</span>
                    </div>
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