import React, { useState, useEffect } from 'react'
import { Plus, Eye, Edit, Trash2, Search, Filter, Building2 } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'
import { useNavigate, useLocation } from 'react-router-dom'

// Datos de propiedades simulados iniciales (se mantendrán para demostración)
const propiedadesIniciales = [
  {
    id: 1,
    title: 'Casa Lomas Del Norte',
    price: '7250000',
    status: 'Disponible',
    address: 'Ur. La Portada Americana',
    type: 'casa',
    rooms: 5,
    bathrooms: 3,
    area: 150,
    propertyType: 'venta',
    description: 'Hermosa casa en zona residencial exclusiva',
    agent: {
      name: 'Jane Doe',
      phone: '+57 300 123 4567',
      email: 'jane@inmobiliaria.com'
    },
    images: [],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Apartamento Centro',
    price: '3500000',
    status: 'Alquilada',
    address: 'Centro Histórico',
    type: 'apartamento',
    rooms: 3,
    bathrooms: 2,
    area: 85,
    propertyType: 'alquiler',
    description: 'Moderno apartamento en el corazón de la ciudad',
    agent: {
      name: 'Angelica Smith',
      phone: '+57 301 987 6543',
      email: 'angelica@inmobiliaria.com'
    },
    images: [],
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: 3,
    title: 'Local Comercial Norte',
    price: '2800000',
    status: 'Arrendada',
    address: 'Zona Norte',
    type: 'local',
    rooms: 0,
    bathrooms: 1,
    area: 120,
    propertyType: 'alquiler',
    description: 'Excelente local comercial en zona de alto tráfico',
    agent: {
      name: 'Carlos Rodriguez',
      phone: '+57 302 456 7890',
      email: 'carlos@inmobiliaria.com'
    },
    images: [],
    createdAt: '2024-01-08T09:15:00Z'
  }
];


export default function MiInmobiliaria() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Estados existentes
  const [propiedades, setPropiedades] = useState(propiedadesIniciales)
  const [filtros, setFiltros] = useState({
    estado: '',
    agente: '',
    tipo: '',
    busqueda: ''
  })

  // Estado de autenticación simulado (ajustar según tu sistema de auth)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  // Función para cargar propiedades (preparada para backend)
const cargarPropiedades = async () => {
  const adminId = localStorage.getItem('adminId');

  if (!adminId) {
    console.error("adminId no encontrado en localStorage");
    return;
  }
  
  try {
    const response = await fetch(`https://domuhouse.onrender.com/api/properties/admin/${adminId}`);

    if (!response.ok) {
      throw new Error('Error al obtener propiedades');
    }

    const data = await response.json();

    const propiedadesAdaptadas = data.map(prop => ({
      id: prop.property_id,
      title: prop.property_title,
      price: prop.price,
      status: prop.status,
      address: `${prop.neighborhood}, ${prop.city}`,
      type: prop.property_type.toLowerCase(),
      rooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area: parseFloat(prop.built_area),
      propertyType: prop.operation_type.toLowerCase(),
      description: '',
      images: [],
      agent: {
        name: `${prop.agent_name} ${prop.agent_lastname}`,
        phone: prop.agent_phone,
        email: prop.agent_email,
      },
      createdAt: '',
    }));

    setPropiedades(propiedadesAdaptadas);
  } catch (error) {
    console.error('Error al cargar propiedades:', error);
    alert('Error al obtener propiedades');
  }
};



  // Cargar propiedades al montar el componente
  useEffect(() => {
    cargarPropiedades();
  }, []);

  // Función para eliminar propiedad (preparada para backend)
  const eliminarPropiedad = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) {
      return;
    }

    try {
      // AQUÍ SE CONECTARÁ CON EL BACKEND
      /*
      await fetch(`/api/properties/${id}`, {
        method: 'DELETE'
      });
      */
      
      // Por ahora eliminamos localmente
      setPropiedades(prev => prev.filter(prop => prop.id !== id));
      
      console.log(`Propiedad ${id} eliminada exitosamente`);
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      alert('Error al eliminar la propiedad');
    }
  };

  // Función para editar propiedad
  const editarPropiedad = (id) => {
    // AQUÍ SE NAVEGARÁ A LA PÁGINA DE EDICIÓN
    navigate(`/editar-propiedad/${id}`);
  };

  // Función para ver detalles de propiedad
  const verPropiedad = (id) => {
    // AQUÍ SE NAVEGARÁ A LA VISTA DETALLADA
    navigate(`/propiedad/${id}`);
  };

  // Función para manejar logout
  const handleLogout = () => {
    // Aquí iría la lógica de logout real
    console.log('Cerrando sesión...');
    setIsAuthenticated(false);
    // navigate('/login'); // Descomentar cuando tengas la ruta de login
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  // Función para filtrar propiedades
  const propiedadesFiltradas = propiedades.filter(propiedad => {
    const cumpleBusqueda = !filtros.busqueda || 
      propiedad.title.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      propiedad.address.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const cumpleEstado = !filtros.estado || 
      propiedad.status.toLowerCase() === filtros.estado.toLowerCase();
    
    const cumpleTipo = !filtros.tipo || 
      propiedad.type.toLowerCase() === filtros.tipo.toLowerCase();
    
    const cumpleAgente = !filtros.agente || 
      propiedad.agent.name.toLowerCase().includes(filtros.agente.toLowerCase());

    return cumpleBusqueda && cumpleEstado && cumpleTipo && cumpleAgente;
  });

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    const numero = typeof precio === 'string' ? 
      parseInt(precio.replace(/[^\d]/g, '')) : precio;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numero);
  };

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'bg-blue-100 text-[#2F8EAC]'
      case 'alquilada':
        return 'bg-blue-100 text-blue-700'
      case 'arrendada':
        return 'bg-blue-100 text-blue-500'
      case 'vendida':
        return 'bg-sky-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Función para formatear el tipo de propiedad
  const formatearTipo = (tipo) => {
    const tipos = {
      'casa': 'Casa',
      'apartamento': 'Apartamento',
      'local': 'Local Comercial',
      'oficina': 'Oficina',
      'terreno': 'Terreno'
    };
    return tipos[tipo] || tipo;
  };

  // Obtener lista única de agentes para el filtro
  const agentesUnicos = [...new Set(propiedades.map(p => p.agent.name))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón hamburguesa */}
      <Header toggleSidebar={toggleSidebar} />
      
      {/* Layout principal con sidebar responsivo */}
      <div className="flex pt-16">
        {/* Sidebar fijo para desktop (lg y superiores) */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <SidebarInmobiliaria 
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Sidebar overlay para móviles y tablets */}
        <SidebarInmobiliaria 
          isOpen={isSidebarOpen}   
          toggleMenu={toggleSidebar}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          isFixedLayout={false}
        />

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-3 sm:p-4 lg:p-6">
            {/* Header de la página - Responsivo */}
            <div className="flex flex-col gap-4 mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    Gestión de Propiedades
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Administra y gestiona todas tus propiedades ({propiedadesFiltradas.length} propiedades)
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/agregar-propiedad')}
                  className="flex items-center justify-center gap-2 bg-[#2F8EAC] text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium shadow-sm w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span className="whitespace-nowrap">Nueva Propiedad</span>
                </button>
              </div>
            </div>

            {/* Panel de filtros - Completamente responsivo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">Filtros de búsqueda</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm"
                    value={filtros.estado}
                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="disponible">Disponible</option>
                    <option value="alquilada">Alquilada</option>
                    <option value="arrendada">Arrendada</option>
                    <option value="vendida">Vendida</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm"
                    value={filtros.tipo}
                    onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                  >
                    <option value="">Todos los tipos</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="local">Local Comercial</option>
                    <option value="oficina">Oficina</option>
                    <option value="terreno">Terreno</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agente</label>
                  <select 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm"
                    value={filtros.agente}
                    onChange={(e) => handleFiltroChange('agente', e.target.value)}
                  >
                    <option value="">Todos los agentes</option>
                    {agentesUnicos.map(agente => (
                      <option key={agente} value={agente}>{agente}</option>
                    ))}
                  </select>
                </div>
                
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Buscar propiedades..."
                      className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm"
                      value={filtros.busqueda}
                      onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contenedor de propiedades - Vista adaptativa */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Lista de Propiedades</h3>
                <p className="text-sm text-gray-500">Gestiona y edita tus propiedades</p>
              </div>
              
              {propiedadesFiltradas.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-4">
                  <Building2 className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades</h3>
                  <p className="text-gray-500 mb-4 text-sm sm:text-base">
                    {propiedades.length === 0 
                      ? 'Aún no has agregado ninguna propiedad.' 
                      : 'No se encontraron propiedades con los filtros seleccionados.'
                    }
                  </p>
                  {propiedades.length === 0 && (
                    <button 
                      onClick={() => navigate('/agregar-propiedad')}
                      className="bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium"
                    >
                      Agregar Primera Propiedad
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Vista de tabla para desktop */}
                  <div className="hidden lg:block overflow-x-auto">
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
                            Agente
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {propiedadesFiltradas.map((propiedad) => (
                          <tr key={propiedad.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  {propiedad.images && propiedad.images.length > 0 ? (
                                    <img 
                                      src={propiedad.images[0]} 
                                      alt={propiedad.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Building2 className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{propiedad.title}</div>
                                  <div className="text-xs text-gray-500">{formatearTipo(propiedad.type)}</div>
                                  <div className="text-xs text-gray-400">{propiedad.address}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                <div>{propiedad.rooms} hab • {propiedad.bathrooms} baños</div>
                                <div className="text-xs text-gray-500">{propiedad.area} m²</div>
                                <div className="text-xs text-blue-600 capitalize">{propiedad.propertyType}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {formatearPrecio(propiedad.price)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(propiedad.status)}`}>
                                {propiedad.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{propiedad.agent.name}</div>
                              <div className="text-xs text-gray-500">{propiedad.agent.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => verPropiedad(propiedad.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => editarPropiedad(propiedad.id)}
                                  className="p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Editar propiedad"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => eliminarPropiedad(propiedad.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar propiedad"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vista de tarjetas para móvil y tablet */}
                  <div className="lg:hidden">
                    <div className="divide-y divide-gray-100">
                      {propiedadesFiltradas.map((propiedad) => (
                        <div key={propiedad.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col space-y-3">
                            {/* Header de la tarjeta */}
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-12 sm:w-20 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {propiedad.images && propiedad.images.length > 0 ? (
                                  <img 
                                    src={propiedad.images[0]} 
                                    alt={propiedad.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Building2 className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                  {propiedad.title}
                                </h3>
                                <p className="text-sm text-gray-500">{formatearTipo(propiedad.type)}</p>
                                <p className="text-xs text-gray-400 truncate">{propiedad.address}</p>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <div className="text-base sm:text-lg font-bold text-gray-900">
                                  {formatearPrecio(propiedad.price)}
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(propiedad.status)}`}>
                                  {propiedad.status}
                                </span>
                              </div>
                            </div>

                            {/* Detalles de la propiedad */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                              <div className="text-gray-600">
                                <span className="font-medium">{propiedad.rooms}</span> habitaciones
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">{propiedad.bathrooms}</span> baños
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">{propiedad.area}</span> m²
                              </div>
                            </div>

                            {/* Información del agente */}
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{propiedad.agent.name}</div>
                                <div className="text-gray-600">{propiedad.agent.phone}</div>
                                <div className="text-xs text-blue-600 capitalize mt-1">{propiedad.propertyType}</div>
                              </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex items-center justify-center gap-2 pt-2">
                              <button 
                                onClick={() => verPropiedad(propiedad.id)}
                                className="flex-1 flex items-center justify-center gap-2 p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">Ver</span>
                              </button>
                              <button 
                                onClick={() => editarPropiedad(propiedad.id)}
                                className="flex-1 flex items-center justify-center gap-2 p-3 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                <span className="text-sm font-medium">Editar</span>
                              </button>
                              <button 
                                onClick={() => eliminarPropiedad(propiedad.id)}
                                className="flex-1 flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Eliminar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}