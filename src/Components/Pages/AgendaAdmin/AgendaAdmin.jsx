import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, MapPin, Phone, Filter, Search, Eye, Edit3, CheckCircle, XCircle } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'

// Datos simulados de agentes y sus visitas
const agentesData = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    email: "carlos@inmobiliaria.com",
    telefono: "+57 300 123 4567",
    foto: "/api/placeholder/40/40",
    visitasHoy: 3,
    visitasSemana: 8
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@inmobiliaria.com",
    telefono: "+57 301 987 6543",
    foto: "/api/placeholder/40/40",
    visitasHoy: 2,
    visitasSemana: 12
  },
  {
    id: 3,
    nombre: "Juan Rodríguez",
    email: "juan@inmobiliaria.com",
    telefono: "+57 302 456 7890",
    foto: "/api/placeholder/40/40",
    visitasHoy: 4,
    visitasSemana: 6
  }
]

// Función para obtener fechas dinámicas
const obtenerFechaHoy = () => new Date().toISOString().split('T')[0]
const obtenerFechaManana = () => {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 1)
  return fecha.toISOString().split('T')[0]
}

const visitasData = [
  {
    id: 1,
    agenteId: 1,
    fecha: "2024-08-17",
    hora: "09:00",
    cliente: "Ana Martínez",
    telefono: "+57 310 111 2222",
    propiedad: "Apartamento Zona Rosa",
    direccion: "Cra 15 #85-32, Bogotá",
    tipo: "Apartamento",
    estado: "confirmada",
    precio: 850000000,
    duracion: 60
  },
  {
    id: 2,
    agenteId: 1,
    fecha: "2024-08-17",
    hora: "14:30",
    cliente: "Roberto Silva",
    telefono: "+57 311 333 4444",
    propiedad: "Casa Campestre",
    direccion: "Km 5 Vía La Calera",
    tipo: "Casa",
    estado: "pendiente",
    precio: 1200000000,
    duracion: 90
  },
  {
    id: 3,
    agenteId: 1,
    fecha: "2024-08-17",
    hora: "16:00",
    cliente: "Laura Gómez",
    telefono: "+57 312 555 6666",
    propiedad: "Oficina Centro",
    direccion: "Cra 7 #32-15, Centro",
    tipo: "Oficina",
    estado: "confirmada",
    precio: 450000000,
    duracion: 45
  },
  {
    id: 4,
    agenteId: 2,
    fecha: "2024-08-17",
    hora: "10:00",
    cliente: "Pedro Ramírez",
    telefono: "+57 313 777 8888",
    propiedad: "Apartamento Chapinero",
    direccion: "Calle 63 #11-20, Chapinero",
    tipo: "Apartamento",
    estado: "confirmada",
    precio: 750000000,
    duracion: 60
  },
  {
    id: 5,
    agenteId: 2,
    fecha: "2024-08-17",
    hora: "15:30",
    cliente: "Sandra López",
    telefono: "+57 314 999 0000",
    propiedad: "Local Comercial",
    direccion: "Av. El Dorado #50-30",
    tipo: "Local",
    estado: "cancelada",
    precio: 300000000,
    duracion: 30
  },
  {
    id: 6,
    agenteId: 3,
    fecha: "2024-08-17",
    hora: "08:30",
    cliente: "Miguel Torres",
    telefono: "+57 315 123 4567",
    propiedad: "Casa Familiar Norte",
    direccion: "Cra 30 #127-45, Usaquén",
    tipo: "Casa",
    estado: "confirmada",
    precio: 950000000,
    duracion: 75
  },
  {
    id: 7,
    agenteId: 3,
    fecha: "2024-08-17",
    hora: "11:00",
    cliente: "Carmen Díaz",
    telefono: "+57 316 234 5678",
    propiedad: "Apartamento Zona Norte",
    direccion: "Cra 19 #104-28, Zona Norte",
    tipo: "Apartamento",
    estado: "confirmada",
    precio: 680000000,
    duracion: 50
  },
  {
    id: 8,
    agenteId: 3,
    fecha: "2024-08-17",
    hora: "13:00",
    cliente: "Andrés Morales",
    telefono: "+57 317 345 6789",
    propiedad: "Bodega Industrial",
    direccion: "Zona Franca, Bogotá",
    tipo: "Bodega",
    estado: "pendiente",
    precio: 1500000000,
    duracion: 120
  },
  {
    id: 9,
    agenteId: 3,
    fecha: "2024-08-17",
    hora: "17:00",
    cliente: "Beatriz Herrera",
    telefono: "+57 318 456 7890",
    propiedad: "Apartamento Ejecutivo",
    direccion: "Cra 11 #93-15, Rosales",
    tipo: "Apartamento",
    estado: "confirmada",
    precio: 1100000000,
    duracion: 60
  },
  // Visitas para hoy (fecha actual)
  {
    id: 10,
    agenteId: 1,
    fecha: obtenerFechaHoy(),
    hora: "10:00",
    cliente: "Carlos Ruiz",
    telefono: "+57 319 111 2222",
    propiedad: "Apartamento Moderno",
    direccion: "Cra 50 #25-10, Medellín",
    tipo: "Apartamento",
    estado: "confirmada",
    precio: 900000000,
    duracion: 60
  },
  {
    id: 11,
    agenteId: 2,
    fecha: obtenerFechaHoy(),
    hora: "14:00",
    cliente: "Diana Vargas",
    telefono: "+57 320 333 4444",
    propiedad: "Casa Familiar",
    direccion: "Calle 80 #15-25, Barranquilla",
    tipo: "Casa",
    estado: "pendiente",
    precio: 1800000000,
    duracion: 90
  },
  {
    id: 12,
    agenteId: 3,
    fecha: obtenerFechaHoy(),
    hora: "16:30",
    cliente: "Fernando López",
    telefono: "+57 321 555 6666",
    propiedad: "Oficina Ejecutiva",
    direccion: "Av. Las Vegas #30-40, Medellín",
    tipo: "Oficina",
    estado: "confirmada",
    precio: 600000000,
    duracion: 45
  }
]

export const AgendaAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0])
  const [agenteSeleccionado, setAgenteSeleccionado] = useState('todos')
  const [estadoFiltro, setEstadoFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  // Función para alternar sidebar móvil
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

  // Filtrar visitas según criterios
  const visitasFiltradas = visitasData.filter(visita => {
    const cumpleFecha = visita.fecha === fechaSeleccionada
    const cumpleAgente = agenteSeleccionado === 'todos' || visita.agenteId === parseInt(agenteSeleccionado)
    const cumpleEstado = estadoFiltro === 'todos' || visita.estado === estadoFiltro
    const cumpleBusqueda = busqueda === '' || 
      visita.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      visita.propiedad.toLowerCase().includes(busqueda.toLowerCase())
    
    return cumpleFecha && cumpleAgente && cumpleEstado && cumpleBusqueda
  })

  // Obtener agente por ID
  const obtenerAgente = (agenteId) => {
    return agentesData.find(agente => agente.id === agenteId)
  }

  // Obtener color según estado
  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'confirmada': return 'text-green-600 bg-green-50'
      case 'pendiente': return 'text-yellow-600 bg-yellow-50'
      case 'cancelada': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // Obtener ícono según estado
  const obtenerIconoEstado = (estado) => {
    switch(estado) {
      case 'confirmada': return <CheckCircle className="w-4 h-4" />
      case 'pendiente': return <Clock className="w-4 h-4" />
      case 'cancelada': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  // Estadísticas del día
  const estadisticasDia = {
    totalVisitas: visitasFiltradas.length,
    confirmadas: visitasFiltradas.filter(v => v.estado === 'confirmada').length,
    pendientes: visitasFiltradas.filter(v => v.estado === 'pendiente').length,
    canceladas: visitasFiltradas.filter(v => v.estado === 'cancelada').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header hasSidebar={true} toggleSidebar={toggleSidebar} />
      
      {/* Layout principal con sidebar */}
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

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-3 sm:p-6">
            {/* Header de la página */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agenda de Visitas</h1>
              <p className="text-gray-600 text-sm mt-1">
                Gestiona y supervisa todas las visitas programadas de tus agentes
              </p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Selector de fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <input 
                    type="date" 
                    className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                  />
                </div>

                {/* Selector de agente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agente</label>
                  <select 
                    className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                    value={agenteSeleccionado}
                    onChange={(e) => setAgenteSeleccionado(e.target.value)}
                  >
                    <option value="todos">Todos los agentes</option>
                    {agentesData.map(agente => (
                      <option key={agente.id} value={agente.id}>{agente.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select 
                    className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {/* Búsqueda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text"
                      placeholder="Cliente o propiedad..."
                      className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas del día */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{estadisticasDia.totalVisitas}</div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Visitas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{estadisticasDia.confirmadas}</div>
                    <p className="text-xs sm:text-sm text-gray-600">Confirmadas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">{estadisticasDia.pendientes}</div>
                    <p className="text-xs sm:text-sm text-gray-600">Pendientes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{estadisticasDia.canceladas}</div>
                    <p className="text-xs sm:text-sm text-gray-600">Canceladas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de visitas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Visitas para {new Date(fechaSeleccionada).toLocaleDateString('es-ES', { 
                    weekday: window.innerWidth < 640 ? 'short' : 'long', 
                    year: 'numeric', 
                    month: window.innerWidth < 640 ? 'short' : 'long', 
                    day: 'numeric' 
                  })}
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {visitasFiltradas.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center">
                    <Calendar className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">No hay visitas programadas para los filtros seleccionados</p>
                  </div>
                ) : (
                  visitasFiltradas
                    .sort((a, b) => a.hora.localeCompare(b.hora))
                    .map((visita) => {
                      const agente = obtenerAgente(visita.agenteId)
                      return (
                        <div key={visita.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
                              {/* Hora */}
                              <div className="text-center sm:text-left flex-shrink-0">
                                <div className="text-base sm:text-lg font-bold text-[#2F8EAC]">{visita.hora}</div>
                                <div className="text-xs text-gray-500">{visita.duracion}min</div>
                              </div>

                              {/* Información principal */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{visita.cliente}</h3>
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(visita.estado)} self-start sm:self-auto`}>
                                    {obtenerIconoEstado(visita.estado)}
                                    {visita.estado.charAt(0).toUpperCase() + visita.estado.slice(1)}
                                  </span>
                                </div>
                                
                                <div className="text-xs sm:text-sm text-gray-600 mb-2 space-y-1 sm:space-y-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                                      <span className="truncate">{visita.propiedad} - {visita.direccion}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                                      <span>{visita.telefono}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">Agente: <span className="font-medium">{agente?.nombre}</span></span>
                                  </div>
                                  <div className="text-[#2F8EAC] font-semibold">
                                    {formatearPrecio(visita.precio)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button className="p-2 text-gray-400 hover:text-[#2F8EAC] hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-[#2F8EAC] hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}