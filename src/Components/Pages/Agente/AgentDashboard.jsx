import React, { useState } from 'react';
import { Home, Star, Eye, Edit, Menu } from 'lucide-react';
import AgentSideBar from './Components/AgentSideBar';
import { Outlet } from "react-router-dom";

export default function AgentDashboard() {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: 'Propiedades', value: '7', subtitle: 'Activas' },
    { label: 'Visitas', value: '4', subtitle: 'Programadas' },
    { label: 'Contactados', value: '12', subtitle: 'Este mes' }
  ];

  const recentProperties = [
    { id: 1, name: 'Casa 01', status: 'Publicado', date: '2024-03-20', type: 'Casa' },
    { id: 2, name: 'Casa 02', status: 'Pendiente', date: '2024-03-20', type: 'Casa' },
    { id: 3, name: 'Casa 03', status: 'Publicado', date: '2024-03-03', type: 'Casa' },
    { id: 4, name: 'Casa 04', status: 'Pendiente', date: '2024-03-21', type: 'Casa' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <AgentSideBar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 overflow-auto">
        {/* Header para móvil */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <div className="w-10" /> {/* Espaciador para centrar */}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F8EAC]" />
                      <span className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{stat.subtitle}</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Propiedades Recientes */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Propiedades Recientes</h2>
            </div>

            {/* Vista de tarjetas para móvil */}
            <div className="block sm:hidden">
              {recentProperties.map((property) => (
                <div key={property.id} className="p-4 border-b last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-9 bg-gradient-to-br from-[#2F8EAC] to-blue-950 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">{property.name}</p>
                          <p className="text-xs text-gray-500">{property.type}</p>
                          <p className="text-xs text-gray-600 mt-1">{property.date}</p>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                            property.status === "Publicado" ? "bg-blue-100 text-blue-800" : "bg-blue-50 text-blue-950"
                          }`}
                        >
                          {property.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 mt-3">
                        <button className="text-[#2F8EAC] hover:text-[#256b82]">
                          <Star className="w-4 h-4" />
                        </button>
                        <button className="text-teal-400 hover:text-teal-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista de tabla para desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Propiedad
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Funciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-9 bg-gradient-to-br from-[#2F8EAC] to-blue-950 rounded"></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{property.name}</div>
                            <div className="text-sm text-gray-500">{property.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.status === "Publicado" ? "bg-blue-100 text-blue-800" : "bg-blue-50 text-blue-950"
                          }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.date}</td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="text-[#2F8EAC] hover:text-[#256b82]">
                            <Star className="w-4 h-4" />
                          </button>
                          <button className="text-teal-400 hover:text-teal-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <Outlet />
                        </div> 
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}