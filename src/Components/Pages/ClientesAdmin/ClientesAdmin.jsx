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
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [clientesFiltrados, setClientesFiltrados] = useState(clientesData.clientes)

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
            {/* Header de la página */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600 text-sm mt-1">
                Gestiona y visualiza información de tus clientes
              </p>
            </div>

            {/* Tarjetas de estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Clientes */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-3xl font-bold text-gray-900">{clientesData.totalClientes}</span>
                    </div>
                    <p className="text-sm text-gray-600">Total Clientes</p>
                  </div>
                </div>
              </div>

              {/* Clientes Activos */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-3xl font-bold text-gray-900">{clientesData.clientesActivos}</span>
                    </div>
                    <p className="text-sm text-gray-600">Clientes Activos</p>
                  </div>
                </div>
              </div>

              {/* Clientes Nuevos */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-3xl font-bold text-gray-900">{clientesData.clientesNuevos}</span>
                    </div>
                    <p className="text-sm text-gray-600">Nuevos este mes</p>
                  </div>
                </div>
              </div>

              {/* Ingresos Totales */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-[#2F8EAC]" />
                      <span className="text-lg font-bold text-gray-900">{formatearPrecio(clientesData.ingresosTotales)}</span>
                    </div>
                    <p className="text-sm text-gray-600">Ingresos Totales</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Barra de búsqueda */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email o propiedad..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                {/* Filtros */}
                <div className="flex gap-3">
                  <select
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                  >
                    <option value="Todos">Todos los tipos</option>
                    <option value="Comprador">Compradores</option>
                    <option value="Arrendatario">Arrendatarios</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Lista de Clientes ({clientesFiltrados.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {clientesFiltrados.map((cliente) => (
                  <div key={cliente.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      {/* Información principal del cliente */}
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-[#2F8EAC] rounded-full flex items-center justify-center text-white font-semibold">
                          {cliente.avatar}
                        </div>

                        {/* Datos del cliente */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{cliente.nombre}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              cliente.tipoCliente === 'Comprador' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {cliente.tipoCliente}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              cliente.estado === 'Activo' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {cliente.estado}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{cliente.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{cliente.telefono}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Home className="w-4 h-4" />
                              <span>{cliente.propiedadAsociada}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Registro: {formatearFecha(cliente.fechaRegistro)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información financiera y acciones */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4 text-[#2F8EAC]" />
                          <span className="font-bold text-gray-900">
                            {formatearPrecio(cliente.valorTransaccion)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Última actividad: {formatearFecha(cliente.ultimaActividad)}
                        </p>
                        <button className="px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a94] transition-colors text-sm">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensaje cuando no hay resultados */}
              {clientesFiltrados.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron clientes que coincidan con los filtros aplicados.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}