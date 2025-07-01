import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2, Home, MapPin, Calendar, DollarSign, Users, Building2, TrendingUp, ChevronDown } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'

// Datos simulados de propiedades
const propiedadesData = [
  {
    id: 1,
    titulo: "Apartamento Moderno en Zona Norte",
    tipo: "Apartamento",
    operacion: "Venta",
    precio: 350000000,
    ubicacion: "Zona Norte, Bogotá",
    habitaciones: 3,
    banos: 2,
    area: 95,
    estado: "Disponible",
    fechaPublicacion: "2024-08-15",
    visitas: 24,
    imagen: "/api/placeholder/300/200"
  },
  {
    id: 2,
    titulo: "Casa Familiar con Jardín",
    tipo: "Casa",
    operacion: "Alquiler",
    precio: 2500000,
    ubicacion: "Chapinero, Bogotá",
    habitaciones: 4,
    banos: 3,
    area: 180,
    estado: "Ocupado",
    fechaPublicacion: "2024-08-10",
    visitas: 18,
    imagen: "/api/placeholder/300/200"
  },
  {
    id: 3,
    titulo: "Estudio Minimalista Centro",
    tipo: "Estudio",
    operacion: "Alquiler",
    precio: 1800000,
    ubicacion: "Centro, Bogotá",
    habitaciones: 1,
    banos: 1,
    area: 45,
    estado: "Disponible",
    fechaPublicacion: "2024-08-12",
    visitas: 31,
    imagen: "/api/placeholder/300/200"
  },
  {
    id: 4,
    titulo: "Penthouse con Terraza",
    tipo: "Penthouse",
    operacion: "Venta",
    precio: 850000000,
    ubicacion: "Zona Rosa, Bogotá",
    habitaciones: 4,
    banos: 4,
    area: 220,
    estado: "Disponible",
    fechaPublicacion: "2024-08-08",
    visitas: 45,
    imagen: "/api/placeholder/300/200"
  },
  {
    id: 5,
    titulo: "Apartamento Ejecutivo",
    tipo: "Apartamento",
    operacion: "Alquiler",
    precio: 3200000,
    ubicacion: "Usaquén, Bogotá",
    habitaciones: 2,
    banos: 2,
    area: 80,
    estado: "Disponible",
    fechaPublicacion: "2024-08-14",
    visitas: 12,
    imagen: "/api/placeholder/300/200"
  },
  {
    id: 6,
    titulo: "Casa Campestre",
    tipo: "Casa",
    operacion: "Venta",
    precio: 480000000,
    ubicacion: "La Calera, Cundinamarca",
    habitaciones: 5,
    banos: 4,
    area: 300,
    estado: "Negociación",
    fechaPublicacion: "2024-08-05",
    visitas: 8,
    imagen: "/api/placeholder/300/200"
  }
]

// Datos de estadísticas
const estadisticas = {
  totalVentas: 12,
  totalAlquileres: 35,
  ingresosMesVentas: 1200000000,
  ingresosMesAlquileres: 45000000,
  propiedadesDisponibles: 47,
  propiedadesOcupadas: 28
}

export const VentasAlquileresAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [propiedades, setPropiedades] = useState(propiedadesData)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Estado para el sidebar móvil
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipo: 'Todos',
    operacion: 'Todos',
    estado: 'Todos',
    precioMin: '',
    precioMax: ''
  })
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [vista, setVista] = useState('lista') // 'lista' o 'tarjetas'

  // Función para toggle del sidebar móvil
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
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Función para aplicar filtros
  const propiedadesFiltradas = propiedades.filter(propiedad => {
    const cumpleBusqueda = propiedad.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                          propiedad.ubicacion.toLowerCase().includes(filtros.busqueda.toLowerCase())
    const cumpleTipo = filtros.tipo === 'Todos' || propiedad.tipo === filtros.tipo
    const cumpleOperacion = filtros.operacion === 'Todos' || propiedad.operacion === filtros.operacion
    const cumpleEstado = filtros.estado === 'Todos' || propiedad.estado === filtros.estado
    
    return cumpleBusqueda && cumpleTipo && cumpleOperacion && cumpleEstado
  })

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Disponible': return 'bg-green-100 text-green-800'
      case 'Ocupado': return 'bg-red-100 text-red-800'
      case 'Negociación': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con toggle del sidebar */}
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
        <SidebarInmobiliaria 
          isOpen={isSidebarOpen}
          toggleMenu={toggleSidebar}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          isFixedLayout={false}
        />

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ventas y Alquileres</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Gestiona todas las propiedades de tu inmobiliaria
                  </p>
                </div>
                <button className="bg-[#2F8EAC] text-white px-4 sm:px-6 py-3 rounded-xl font-medium hover:bg-[#256b82] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Nueva Propiedad</span>
                  <span className="sm:hidden">Nueva</span>
                </button>
              </div>
            </div>

            {/* Estadísticas rápidas - Grid responsivo */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-[#2F8EAC]" />
                  <span className="text-lg font-bold text-gray-900">{estadisticas.totalVentas}</span>
                </div>
                <p className="text-xs text-gray-600">Ventas este mes</p>
              </div>
              
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="w-4 h-4 text-[#2F8EAC]" />
                  <span className="text-lg font-bold text-gray-900">{estadisticas.totalAlquileres}</span>
                </div>
                <p className="text-xs text-gray-600">Alquileres activos</p>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-[#2F8EAC]" />
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{formatearPrecio(estadisticas.ingresosMesVentas)}</span>
                </div>
                <p className="text-xs text-gray-600">Ingresos ventas</p>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-[#2F8EAC]" />
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{formatearPrecio(estadisticas.ingresosMesAlquileres)}</span>
                </div>
                <p className="text-xs text-gray-600">Ingresos alquileres</p>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-gray-900">{estadisticas.propiedadesDisponibles}</span>
                </div>
                <p className="text-xs text-gray-600">Disponibles</p>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-red-600" />
                  <span className="text-lg font-bold text-gray-900">{estadisticas.propiedadesOcupadas}</span>
                </div>
                <p className="text-xs text-gray-600">Ocupadas</p>
              </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex flex-col gap-4">
                {/* Barra de búsqueda */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por título o ubicación..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                  />
                </div>

                {/* Botón de filtros */}
                <button
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start"
                >
                  <Filter className="w-5 h-5" />
                  Filtros
                  <ChevronDown className={`w-4 h-4 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Panel de filtros expandible */}
              {mostrarFiltros && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                        value={filtros.tipo}
                        onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Estudio">Estudio</option>
                        <option value="Penthouse">Penthouse</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Operación</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                        value={filtros.operacion}
                        onChange={(e) => setFiltros({...filtros, operacion: e.target.value})}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Venta">Venta</option>
                        <option value="Alquiler">Alquiler</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                        value={filtros.estado}
                        onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupado">Ocupado</option>
                        <option value="Negociación">Negociación</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Precio Mín.</label>
                      <input
                        type="number"
                        placeholder="Precio mínimo"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                        value={filtros.precioMin}
                        onChange={(e) => setFiltros({...filtros, precioMin: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máx.</label>
                      <input
                        type="number"
                        placeholder="Precio máximo"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                        value={filtros.precioMax}
                        onChange={(e) => setFiltros({...filtros, precioMax: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resultados y lista de propiedades */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
              {/* Header de resultados */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Propiedades</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {propiedadesFiltradas.length} propiedades encontradas
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de propiedades */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {propiedadesFiltradas.map((propiedad) => (
                    <div key={propiedad.id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Imagen y información principal en móvil */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          {/* Imagen */}
                          <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Home className="w-8 h-8 text-gray-400" />
                          </div>

                          {/* Información principal */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 leading-tight">{propiedad.titulo}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-sm text-gray-600">{propiedad.ubicacion}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(propiedad.estado)}`}>
                                  {propiedad.estado}
                                </span>
                                <span className="px-3 py-1 bg-[#2F8EAC] text-white rounded-full text-xs font-medium">
                                  {propiedad.operacion}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600">
                              <span>{propiedad.habitaciones} hab.</span>
                              <span>{propiedad.banos} baños</span>
                              <span>{propiedad.area} m²</span>
                              <span>{propiedad.tipo}</span>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{propiedad.visitas} visitas</span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div>
                                <span className="text-xl sm:text-2xl font-bold text-[#2F8EAC]">
                                  {formatearPrecio(propiedad.precio)}
                                </span>
                                {propiedad.operacion === 'Alquiler' && (
                                  <span className="text-sm text-gray-600">/mes</span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-600 hover:text-[#2F8EAC] hover:bg-gray-100 rounded-lg transition-colors">
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-[#2F8EAC] hover:bg-gray-100 rounded-lg transition-colors">
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {propiedadesFiltradas.length === 0 && (
                  <div className="text-center py-12">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron propiedades</h3>
                    <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}