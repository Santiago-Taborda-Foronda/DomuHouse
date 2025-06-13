import React, { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Users, Building2, DollarSign, Eye, Bell, Search, Filter, Phone, Mail, MapPin, User, Home, CreditCard } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'

// Datos simulados de clientes
const clientesData = {
  totalClientes: 156,
  clientesActivos: 134,
  clientesNuevos: 12,
  ingresosTotales: 890500000,
  clientes: [
    {
      id: 1,
      nombre: 'María García López',
      email: 'maria.garcia@email.com',
      telefono: '+57 300 123 4567',
      tipoCliente: 'Comprador',
      fechaRegistro: '2024-01-15',
      ultimaActividad: '2024-06-08',
      propiedadAsociada: 'Apartamento 3 hab - Zona Rosa',
      valorTransaccion: 450000000,
      estado: 'Activo',
      avatar: 'MG'
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez Pérez',
      email: 'carlos.rodriguez@email.com',
      telefono: '+57 301 987 6543',
      tipoCliente: 'Arrendatario',
      fechaRegistro: '2024-02-20',
      ultimaActividad: '2024-06-09',
      propiedadAsociada: 'Casa 4 hab - La Calera',
      valorTransaccion: 2500000,
      estado: 'Activo',
      avatar: 'CR'
    },
    {
      id: 3,
      nombre: 'Ana Sofía Martínez',
      email: 'ana.martinez@email.com',
      telefono: '+57 302 456 7890',
      tipoCliente: 'Comprador',
      fechaRegistro: '2024-03-10',
      ultimaActividad: '2024-06-05',
      propiedadAsociada: 'Oficina 120m² - Chapinero',
      valorTransaccion: 320000000,
      estado: 'Activo',
      avatar: 'AM'
    },
    {
      id: 4,
      nombre: 'Luis Fernando Torres',
      email: 'luis.torres@email.com',
      telefono: '+57 304 321 0987',
      tipoCliente: 'Arrendatario',
      fechaRegistro: '2024-04-05',
      ultimaActividad: '2024-06-01',
      propiedadAsociada: 'Apartamento 2 hab - Usaquén',
      valorTransaccion: 1800000,
      estado: 'Inactivo',
      avatar: 'LT'
    },
    {
      id: 5,
      nombre: 'Patricia Jiménez Ruiz',
      email: 'patricia.jimenez@email.com',
      telefono: '+57 305 654 3210',
      tipoCliente: 'Comprador',
      fechaRegistro: '2024-05-12',
      ultimaActividad: '2024-06-10',
      propiedadAsociada: 'Casa 5 hab - Chía',
      valorTransaccion: 580000000,
      estado: 'Activo',
      avatar: 'PJ'
    },
    {
      id: 6,
      nombre: 'Diego Alejandro Silva',
      email: 'diego.silva@email.com',
      telefono: '+57 306 789 0123',
      tipoCliente: 'Arrendatario',
      fechaRegistro: '2024-01-28',
      ultimaActividad: '2024-06-07',
      propiedadAsociada: 'Local Comercial - Zona T',
      valorTransaccion: 4200000,
      estado: 'Activo',
      avatar: 'DS'
    }
  ]
}

export const ClientesAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [clientesFiltrados, setClientesFiltrados] = useState(clientesData.clientes)

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
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Efecto para filtrar clientes
  useEffect(() => {
    let clientesFiltrados = clientesData.clientes;

    // Filtrar por tipo
    if (filtroTipo !== 'Todos') {
      clientesFiltrados = clientesFiltrados.filter(cliente => cliente.tipoCliente === filtroTipo);
    }

    // Filtrar por estado
    if (filtroEstado !== 'Todos') {
      clientesFiltrados = clientesFiltrados.filter(cliente => cliente.estado === filtroEstado);
    }

    // Filtrar por búsqueda
    if (busqueda) {
      clientesFiltrados = clientesFiltrados.filter(cliente => 
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.propiedadAsociada.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setClientesFiltrados(clientesFiltrados);
  }, [filtroTipo, filtroEstado, busqueda]);

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

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-3 sm:p-4 md:p-6">
            {/* Header de la página */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600 text-sm mt-1">
                Gestiona y visualiza información de tus clientes
              </p>
            </div>

            {/* Tarjetas de estadísticas principales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Total Clientes */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-[#2F8EAC]" />
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{clientesData.totalClientes}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Total Clientes</p>
                  </div>
                </div>
              </div>

              {/* Clientes Activos */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-[#2F8EAC]" />
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{clientesData.clientesActivos}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Clientes Activos</p>
                  </div>
                </div>
              </div>

              {/* Clientes Nuevos */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#2F8EAC]" />
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{clientesData.clientesNuevos}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Nuevos este mes</p>
                  </div>
                </div>
              </div>

              {/* Ingresos Totales */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-[#2F8EAC]" />
                      <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{formatearPrecio(clientesData.ingresosTotales)}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Ingresos Totales</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex flex-col gap-4">
                {/* Barra de búsqueda */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email o propiedad..."
                    className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm md:text-base"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm md:text-base"
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                  >
                    <option value="Todos">Todos los tipos</option>
                    <option value="Comprador">Compradores</option>
                    <option value="Arrendatario">Arrendatarios</option>
                  </select>

                  <select
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm md:text-base"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="Todos">Todos los estados</option>
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de clientes */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                  Lista de Clientes ({clientesFiltrados.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {clientesFiltrados.map((cliente) => (
                  <div key={cliente.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Información principal del cliente */}
                      <div className="flex items-start sm:items-center gap-3 md:gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#2F8EAC] rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base flex-shrink-0">
                          {cliente.avatar}
                        </div>

                        {/* Datos del cliente */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                            <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{cliente.nombre}</h4>
                            <div className="flex gap-2 flex-wrap">
                              <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                                cliente.tipoCliente === 'Comprador' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {cliente.tipoCliente}
                              </span>
                              <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                                cliente.estado === 'Activo' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {cliente.estado}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span className="truncate">{cliente.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span>{cliente.telefono}</span>
                            </div>

                            <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
                              <Home className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span className="truncate">{cliente.propiedadAsociada}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span className="truncate">Registro: {formatearFecha(cliente.fechaRegistro)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información financiera y acciones */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-end gap-3 lg:gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#2F8EAC]" />
                          <span className="font-bold text-gray-900 text-sm md:text-base">
                            {formatearPrecio(cliente.valorTransaccion)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Última actividad: {formatearFecha(cliente.ultimaActividad)}
                        </p>
                        <button className="px-3 md:px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a94] transition-colors text-xs md:text-sm font-medium">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensaje cuando no hay resultados */}
              {clientesFiltrados.length === 0 && (
                <div className="p-8 md:p-12 text-center">
                  <Users className="w-8 h-8 md:w-12 md:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm md:text-base">No se encontraron clientes que coincidan con los filtros aplicados.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}