import React, { useState } from 'react'
import { FileText, Calendar, Eye, Edit, Trash2, Plus, Filter } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'

// Datos simulados de contratos
const contratosData = [
  {
    id: 1,
    contrato: 'Luis Torres',
    estado: 'Activo',
    fechaVencimiento: '25 abril 2025',
    tipo: 'Arrendamiento'
  },
  {
    id: 2,
    contrato: 'Juan Ruiz',
    estado: 'Finalizado',
    fechaVencimiento: '25 abril 2025',
    tipo: 'Venta'
  },
  {
    id: 3,
    contrato: 'Andres Rios',
    estado: 'Activo',
    fechaVencimiento: '25 abril 2025',
    tipo: 'Arrendamiento'
  }
]

export const Contract = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [filtroActivo, setFiltroActivo] = useState('Activos')
  const [contratos, setContratos] = useState(contratosData)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para manejar logout
  const handleLogout = () => {
    console.log('Cerrando sesión...');
    setIsAuthenticated(false);
  };

  // Filtrar contratos según el tab activo
  const contratosFiltrados = contratos.filter(contrato => {
    if (filtroActivo === 'Activos') {
      return contrato.estado === 'Activo'
    } else if (filtroActivo === 'Finalizados') {
      return contrato.estado === 'Finalizado'
    }
    return true
  })

  // Función para obtener el badge del estado
  const getBadgeEstado = (estado) => {
    if (estado === 'Activo') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Activo
        </span>
      )
    } else if (estado === 'Finalizado') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Finalizado
        </span>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header hasSidebar={true} toggleSidebar={toggleSidebar} />
      
      {/* Layout principal con sidebar responsive */}
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
        <div className={`lg:hidden fixed inset-0 z-50 ${isSidebarOpen ? 'block' : 'hidden'}`}>
          {/* Overlay oscuro */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>
          
          {/* Sidebar móvil */}
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <SidebarInmobiliaria 
              isOpen={isSidebarOpen}
              toggleMenu={toggleSidebar}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              isFixedLayout={false}
            />
          </div>
        </div>

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contratos y Reservas</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestiona todos tus contratos y reservas
                </p>
              </div>
              
              {/* Botón Subir Archivos */}
              <button className="flex items-center justify-center gap-2 bg-[#2F8EAC] text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-[#267a96] transition-colors font-medium w-full sm:w-auto">
                <Plus className="w-5 h-5" />
                <span className="sm:inline">Subir Archivos</span>
              </button>
            </div>

            {/* Contenedor principal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tabs de filtrado */}
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex space-x-6 sm:space-x-8 px-4 sm:px-6 min-w-max sm:min-w-0">
                  {['Activos', 'Finalizados'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFiltroActivo(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        filtroActivo === tab
                          ? 'border-[#2F8EAC] text-[#2F8EAC]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tabla de contratos - Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contrato
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Vencimiento
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Funciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contratosFiltrados.map((contrato) => (
                      <tr key={contrato.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {contrato.contrato}
                              </div>
                              <div className="text-sm text-gray-500">
                                {contrato.tipo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getBadgeEstado(contrato.estado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            {contrato.fechaVencimiento}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button
                              className="text-[#2F8EAC] hover:text-[#267a96] transition-colors"
                              title="Ver"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              className="text-[#2F8EAC] hover:text-[#267a96] transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de tarjetas para móviles */}
              <div className="sm:hidden">
                {contratosFiltrados.map((contrato) => (
                  <div key={contrato.id} className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center flex-1">
                        <FileText className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {contrato.contrato}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contrato.tipo}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        {getBadgeEstado(contrato.estado)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs sm:text-sm">{contrato.fechaVencimiento}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-[#2F8EAC] hover:text-[#267a96] transition-colors p-1"
                          title="Ver"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="text-[#2F8EAC] hover:text-[#267a96] transition-colors p-1"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensaje cuando no hay contratos */}
              {contratosFiltrados.length === 0 && (
                <div className="text-center py-12 px-4">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay contratos {filtroActivo.toLowerCase()}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {filtroActivo === 'Activos' 
                      ? 'No tienes contratos activos en este momento.'
                      : 'No hay contratos finalizados para mostrar.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}