import React, { useState, useEffect } from 'react'
import { Plus, Eye, Edit, Trash2, Search, Filter, Users, Star, Phone, Mail, Shield } from 'lucide-react'
import { Header } from '../../Layouts/Header/Header'
import { SidebarInmobiliaria } from '../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria'
import { useNavigate } from 'react-router-dom'

// Datos de agentes simulados iniciales
const agentesIniciales = [
  {
    id: 1,
    name: 'Karina Tabares',
    email: 'karina25@gmail.com',
    phone: '3214567890',
    propertyCount: 8,
    rating: 5,
    status: 'Activo',
    specialties: ['Ventas', 'Alquileres'],
    avatar: null,
    createdAt: '2024-01-15T10:00:00Z',
    totalSales: 15,
    description: 'Especialista en propiedades residenciales con más de 5 años de experiencia'
  },
  {
    id: 2,
    name: 'Mariano Quiroga',
    email: 'mariano23@gmail.com',
    phone: '3214567891',
    propertyCount: 7,
    rating: 4,
    status: 'Activo',
    specialties: ['Comercial', 'Terrenos'],
    avatar: null,
    createdAt: '2024-01-10T14:30:00Z',
    totalSales: 12,
    description: 'Experto en propiedades comerciales y desarrollo de terrenos'
  },
  {
    id: 3,
    name: 'Nathaly Rodriguez',
    email: 'nathaly2@gmail.com',
    phone: '3214567892',
    propertyCount: 10,
    rating: 5,
    status: 'Activo',
    specialties: ['Lujo', 'Inversión'],
    avatar: null,
    createdAt: '2024-01-08T09:15:00Z',
    totalSales: 20,
    description: 'Especialista en propiedades de lujo y asesoramiento en inversiones'
  },
  {
    id: 4,
    name: 'Manuel Vargas',
    email: 'manuel26@gmail.com',
    phone: '3214567893',
    propertyCount: 12,
    rating: 4,
    status: 'Activo',
    specialties: ['Residencial', 'Primera Vivienda'],
    avatar: null,
    createdAt: '2024-01-05T16:45:00Z',
    totalSales: 18,
    description: 'Experto en ayudar a familias a encontrar su primera vivienda'
  },
  {
    id: 5,
    name: 'Santiago Taborda',
    email: 'santiago30@gmail.com',
    phone: '3214567894',
    propertyCount: 9,
    rating: 4,
    status: 'Inactivo',
    specialties: ['Alquileres', 'Administración'],
    avatar: null,
    createdAt: '2024-01-03T11:20:00Z',
    totalSales: 8,
    description: 'Especialista en gestión de alquileres y administración de propiedades'
  }
];

export const GestionAgents = () => {
  const navigate = useNavigate();
  const [agentes, setAgentes] = useState(agentesIniciales);
  const [filtros, setFiltros] = useState({
    estado: '',
    especialidad: '',
    busqueda: ''
  });

  // Estado de autenticación simulado
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Función para cargar agentes (preparada para backend)
  const cargarAgentes = async () => {
    try {
      // AQUÍ SE CONECTARÁ CON EL BACKEND
      /*
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgentes(data);
      */
      
      // Por ahora mantenemos los agentes iniciales
    } catch (error) {
      console.error('Error al cargar agentes:', error);
    }
  };

  // Cargar agentes al montar el componente
  useEffect(() => {
    cargarAgentes();
  }, []);

  // Función para eliminar agente
  const eliminarAgente = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este agente?')) {
      return;
    }

    try {
      // AQUÍ SE CONECTARÁ CON EL BACKEND
      /*
      await fetch(`/api/agents/${id}`, {
        method: 'DELETE'
      });
      */
      
      // Por ahora eliminamos localmente
      setAgentes(prev => prev.filter(agente => agente.id !== id));
      
      console.log(`Agente ${id} eliminado exitosamente`);
    } catch (error) {
      console.error('Error al eliminar agente:', error);
      alert('Error al eliminar el agente');
    }
  };

  // Función para editar agente
  const editarAgente = (id) => {
    navigate(`/editar-agente/${id}`);
  };

  // Función para ver detalles de agente
  const verAgente = (id) => {
    navigate(`/agente/${id}`);
  };

  // Función para manejar logout
  const handleLogout = () => {
    console.log('Cerrando sesión...');
    setIsAuthenticated(false);
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Función para filtrar agentes
  const agentesFiltrados = agentes.filter(agente => {
    const cumpleBusqueda = !filtros.busqueda || 
      agente.name.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      agente.email.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const cumpleEstado = !filtros.estado || 
      agente.status.toLowerCase() === filtros.estado.toLowerCase();
    
    const cumpleEspecialidad = !filtros.especialidad || 
      agente.specialties.some(spec => spec.toLowerCase().includes(filtros.especialidad.toLowerCase()));

    return cumpleBusqueda && cumpleEstado && cumpleEspecialidad;
  });

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'inactivo':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'suspendido':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  // Obtener especialidades únicas para el filtro
  const especialidadesUnicas = [...new Set(agentes.flatMap(a => a.specialties))];

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Agentes</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Administra y gestiona todos tus agentes inmobiliarios ({agentesFiltrados.length} agentes)
                </p>
              </div>
              <button 
                onClick={() => navigate('/invitar-agente')}
                className="flex items-center gap-2 bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium shadow-sm"
                >
                <Shield className="w-4 h-4" />
                    Nuevo Agente
              </button>
            </div>

            {/* Panel de filtros */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">Filtros de búsqueda</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={filtros.estado}
                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={filtros.especialidad}
                    onChange={(e) => handleFiltroChange('especialidad', e.target.value)}
                  >
                    <option value="">Todas las especialidades</option>
                    {especialidadesUnicas.map(especialidad => (
                      <option key={especialidad} value={especialidad}>{especialidad}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Buscar agentes..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      value={filtros.busqueda}
                      onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de agentes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Lista de Agentes</h3>
                <p className="text-sm text-gray-500">Gestiona y edita la información de tus agentes</p>
              </div>
              
              {agentesFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay agentes</h3>
                  <p className="text-gray-500 mb-4">
                    {agentes.length === 0 
                      ? 'Aún no has agregado ningún agente.' 
                      : 'No se encontraron agentes con los filtros seleccionados.'
                    }
                  </p>
                  {agentes.length === 0 && (
                    <button 
                      onClick={() => navigate('/agregar-agente')}
                      className="bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium"
                    >
                      Agregar Primer Agente
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2 px-2">
                  <div className="min-w-full inline-block align-middle">
                    <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Nombre del Agente
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Correo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Teléfono
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Propiedades Asignadas
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Puntuación
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {agentesFiltrados.map((agente) => (
                        <tr key={agente.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#2F8EAC] rounded-full flex items-center justify-center text-white font-semibold">
                                {agente.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{agente.name}</div>
                                <div className="text-xs text-gray-500">
                                  {agente.specialties.join(', ')}
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getEstadoColor(agente.status)}`}>
                                  {agente.status}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {agente.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              {agente.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">{agente.propertyCount}</div>
                              <div className="text-xs text-gray-500">propiedades</div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {renderStars(agente.rating)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => verAgente(agente.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => editarAgente(agente.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Editar agente"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => eliminarAgente(agente.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar agente"
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
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};