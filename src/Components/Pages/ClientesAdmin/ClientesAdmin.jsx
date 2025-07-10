"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar, TrendingUp, Users, DollarSign, Search, Phone, Mail, User, Home, CreditCard } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"
import { ClientDetailsModal } from "../ClientDetailsModal/ClientDetailsModal"

// Configuración de la API
const API_BASE_URL = 'http://localhost:10101/api'

// Servicios para llamadas a la API
const clientAPI = {
  getAllClients: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`)
      if (!response.ok) throw new Error('Error al obtener clientes')
      return await response.json()
    } catch (error) {
      console.error('Error en getAllClients:', error)
      throw error
    }
  },
  
  getTotalClients: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/count`)
      if (!response.ok) throw new Error('Error al obtener total de clientes')
      return await response.json()
    } catch (error) {
      console.error('Error en getTotalClients:', error)
      throw error
    }
  }
}

export const ClientesAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  
  // Estados para datos de la API
  const [clientes, setClientes] = useState([])
  const [clientesFiltrados, setClientesFiltrados] = useState([])
  const [totalClientes, setTotalClientes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)


  // Función para manejar el toggle del sidebar
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

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para generar iniciales del nombre
  const generarIniciales = (nombre, apellido) => {
    const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : ''
    const inicialApellido = apellido ? apellido.charAt(0).toUpperCase() : ''
    return inicialNombre + inicialApellido
  }

  // Función para transformar datos de la API al formato del frontend
  const transformarDatosCliente = (clienteAPI) => {
    return {
      id: clienteAPI.clientId,
      nombre: `${clienteAPI.name} ${clienteAPI.lastName || ''}`.trim(),
      email: clienteAPI.email || 'Sin email',
      telefono: clienteAPI.phone || 'Sin teléfono',
      valorTransaccion: 0, // Default
      avatar: generarIniciales(clienteAPI.name, clienteAPI.lastName)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Llamadas paralelas para obtener datos
        const [clientesData, totalData] = await Promise.all([
          clientAPI.getAllClients(),
          clientAPI.getTotalClients()
        ])
        
        // Transformar datos de clientes
        const clientesTransformados = clientesData.map(transformarDatosCliente)
        
        setClientes(clientesTransformados)
        setTotalClientes(totalData.totalClients || 0)
        
      } catch (err) {
        setError('Error al cargar los datos: ' + err.message)
        console.error('Error al cargar datos:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  // Efecto para filtrar clientes
  useEffect(() => {
    let clientesFiltrados = clientes;

    // Filtrar por búsqueda
    if (busqueda) {
      clientesFiltrados = clientesFiltrados.filter(cliente => 
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.email.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setClientesFiltrados(clientesFiltrados);
  }, [busqueda, clientes]);

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header hasSidebar={true} toggleSidebar={toggleSidebar} />
        <div className="flex pt-16">
          <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
            <SidebarInmobiliaria 
              isOpen={true}
              toggleMenu={() => {}}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              isFixedLayout={true}
            />
          </div>
          <main className="flex-1 lg:ml-72 transition-all duration-300">
            <div className="p-4 flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F8EAC] mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando clientes...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header hasSidebar={true} toggleSidebar={toggleSidebar} />
        <div className="flex pt-16">
          <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
            <SidebarInmobiliaria 
              isOpen={true}
              toggleMenu={() => {}}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              isFixedLayout={true}
            />
          </div>
          <main className="flex-1 lg:ml-72 transition-all duration-300">
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 mb-2">Error al cargar los datos</p>
                <p className="text-gray-600 text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a94] transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Calcular estadísticas
  const clientesActivos = clientes.length
  const clientesNuevos = 0 // Removido ya que no tenemos fecha de registro
  const ingresosTotales = clientesFiltrados.reduce((total, cliente) => total + cliente.valorTransaccion, 0)

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
          <div className="p-3 sm:p-3 md:p-4">
            {/* Header de la página */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600 text-sm mt-1">Gestiona y visualiza información de tus clientes</p>
            </div>
            
            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4">
              <div className="flex flex-col gap-4">
                {/* Barra de búsqueda */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm md:text-base"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Filtros removidos por simplicidad */}
                </div>
              </div>
            </div>

            {/* Lista de clientes */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                  Lista de Clientes ({clientes.length})
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
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{cliente.nombre}</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span className="truncate">{cliente.email}</span>
                            </div>

                            <div className="flex items-center gap-8">
                              <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span>{cliente.telefono}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información financiera y acciones */}
                  
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensaje cuando no hay resultados */}
              {clientesFiltrados.length === 0 && (
                <div className="p-8 md:p-12 text-center">
                  <Users className="w-8 h-8 md:w-12 md:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm md:text-base">No se encontraron clientes que coincidan con la búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de detalles */}
      <ClientDetailsModal
        client={selectedClient}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedClient(null)
        }}
      />
    </div>
  )
}
