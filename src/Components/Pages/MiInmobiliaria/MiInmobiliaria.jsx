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
  // Removemos el estado sidebarOpen ya que siempre estará visible
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
    try {
      // AQUÍ SE CONECTARÁ CON EL BACKEND
      /*
      const response = await fetch('/api/properties');
      const data = await response.json();
      setPropiedades(data);
      */
      
      // Por ahora mantenemos las propiedades iniciales
      // En el futuro, aquí se cargarán desde el backend
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
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
      {/* Header sin el botón de hamburguesa */}
      <Header hasSidebar={true} />
      
      {/* Layout principal con sidebar fijo */}
      <div className="flex pt-16">
        {/* Sidebar fijo siempre visible */}
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <SidebarInmobiliaria 
            isOpen={true} // Siempre abierto
            toggleMenu={() => {}} // Función vacía ya que no se necesita toggle
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true} // Nueva prop para indicar que es layout fijo
          />
        </div>

        {/* Contenido principal con margen izquierdo para el sidebar */}
        <main className="flex-1 ml-72">
          <div className="p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Propiedades</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Administra y gestiona todas tus propiedades ({propiedadesFiltradas.length} propiedades)
                </p>
              </div>
              <button 
                onClick={() => navigate('/agregar-propiedad')}
                className="flex items-center gap-2 bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium shadow-sm"
              >
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
                    <option value="vendida">Vendida</option>
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
                    <option value="oficina">Oficina</option>
                    <option value="terreno">Terreno</option>
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
                    {agentesUnicos.map(agente => (
                      <option key={agente} value={agente}>{agente}</option>
                    ))}
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
              
              {propiedadesFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades</h3>
                  <p className="text-gray-500 mb-4">
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}