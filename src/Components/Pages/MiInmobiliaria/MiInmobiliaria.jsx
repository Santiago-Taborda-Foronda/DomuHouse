import React, { useState } from 'react'
import { Plus, Eye, Edit, Trash2, Search, Filter, Menu, X, LayoutDashboard, Building2, HandCoins, Users, FileText, Calendar, BarChart3, User, UserCheck, LogOut } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'

// Datos de propiedades simulados
const propiedadesData = [
  {
    id: 1,
    imagen: '/api/placeholder/80/60',
    nombre: 'Casa Lomas Del Norte',
    precio: '$7,250.00',
    estado: 'Disponible',
    ubicacion: 'Ur. La Portada Americana',
    tipo: 'Casa',
    habitaciones: 5,
    banos: 3,
    area: 150
  },
  {
    id: 2,
    imagen: '/api/placeholder/80/60',
    nombre: 'Apartamento Centro',
    precio: '$3,500.00',
    estado: 'Alquilada',
    ubicacion: 'Centro Histórico',
    tipo: 'Apartamento',
    habitaciones: 3,
    banos: 2,
    area: 85
  },
  {
    id: 3,
    imagen: '/api/placeholder/80/60',
    nombre: 'Local Comercial Norte',
    precio: '$2,800.00',
    estado: 'Arrendada',
    ubicacion: 'Zona Norte',
    tipo: 'Local',
    habitaciones: 0,
    banos: 1,
    area: 120
  },
  {
    id: 4,
    imagen: '/api/placeholder/80/60',
    nombre: 'Casa Familiar Sur',
    precio: '$4,750.00',
    estado: 'Disponible',
    ubicacion: 'Zona Residencial Sur',
    tipo: 'Casa',
    habitaciones: 4,
    banos: 3,
    area: 180
  }
]

// Header Component



// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar, isAuthenticated, handleLogout }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: '/mi-inmobiliaria/dashboard', active: false },
    { icon: Building2, label: 'Propiedades', route: '/mi-inmobiliaria/propiedades', active: true },
    { icon: HandCoins, label: 'Ventas y Alquileres', route: '/mi-inmobiliaria/ventas-alquileres', active: false },
    { icon: Users, label: 'Clientes', route: '/mi-inmobiliaria/clientes', active: false },
    { icon: FileText, label: 'Contratos', route: '/mi-inmobiliaria/contratos', active: false },
    { icon: Calendar, label: 'Agenda / Visitas', route: '/mi-inmobiliaria/agenda', active: false },
    { icon: BarChart3, label: 'Reportes', route: '/mi-inmobiliaria/reportes', active: false },
    { icon: User, label: 'Usuarios', route: '/mi-inmobiliaria/usuarios', active: false },
  ]

  return (
    <>
        <Header />
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 w-72 h-full bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 overflow-y-auto`}>
        
        <button 
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2F8EAC] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">DOMUHOUSE</h2>
              <p className="text-sm text-gray-500">Panel de gestión</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <li key={index}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors duration-200 ${
                      item.active 
                        ? 'bg-blue-50 text-[#2F8EAC] border-r-2 border-[#2F8EAC]' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#2F8EAC]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-3 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-[#2F8EAC] rounded-lg transition-colors duration-200">
              <UserCheck className="w-5 h-5" />
              <div>
                <span className="text-sm font-medium block">Agentes</span>
                <span className="text-xs text-gray-500">Administradores</span>
              </div>
            </button>
          </div>
        </nav>

        {isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default function MiInmobiliaria() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filtros, setFiltros] = useState({
    estado: '',
    agente: '',
    tipo: '',
    busqueda: ''
  })

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
      case 'alquilada':
        return 'bg-blue-100 text-blue-700 border border-blue-200'
      case 'arrendada':
        return 'bg-amber-100 text-amber-700 border border-amber-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        isAuthenticated={true}
        handleLogout={() => console.log('Logout')}
      />

      {/* Contenido principal */}
      <main className="lg:ml-72 pt-16 transition-all duration-300">
        <div className="p-6">
          {/* Header de la página */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Propiedades</h1>
              <p className="text-gray-600 text-sm mt-1">Administra y gestiona todas tus propiedades</p>
            </div>
            <button className="flex items-center gap-2 bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium shadow-sm">
              <Plus className="w-4 h-4" />
              Nueva Propiedad
            </button>
          </div>

          {/* Panel de filtros */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-800">Filtros de búsqueda</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="disponible">Disponible</option>
                  <option value="alquilada">Alquilada</option>
                  <option value="arrendada">Arrendada</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  value={filtros.tipo}
                  onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="local">Local Comercial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agente</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  value={filtros.agente}
                  onChange={(e) => handleFiltroChange('agente', e.target.value)}
                >
                  <option value="">Todos los agentes</option>
                  <option value="agente1">Jane Doe</option>
                  <option value="agente2">Angelica Smith</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Buscar propiedades..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={filtros.busqueda}
                    onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de propiedades */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Lista de Propiedades</h3>
              <p className="text-sm text-gray-500">Gestiona y edita tus propiedades</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Detalles
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {propiedadesData.map((propiedad) => (
                    <tr key={propiedad.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <Building2 className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{propiedad.nombre}</div>
                            <div className="text-xs text-gray-500">{propiedad.tipo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <div>{propiedad.habitaciones} hab • {propiedad.banos} baños</div>
                          <div className="text-xs text-gray-500">{propiedad.area} m²</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{propiedad.precio}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(propiedad.estado)}`}>
                          {propiedad.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{propiedad.ubicacion}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
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
  )
}