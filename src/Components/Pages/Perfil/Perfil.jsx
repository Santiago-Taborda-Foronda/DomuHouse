import React, { useState } from 'react'
import { User, Edit2, Save, X, Building2, Eye, Edit, Trash2 } from 'lucide-react'

export const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('publicadas') // Nueva estado para pestañas
  const [userData, setUserData] = useState({
    nombre: "Karina Tabares",
    telefono: "+57 3224456666",
    correo: "karina172@gmail.com",
    contraseña: "••••••••••••••••"
  })

  const [tempUserData, setTempUserData] = useState({ ...userData })

  const handleEdit = () => {
    setIsEditing(true)
    setTempUserData({ ...userData })
  }

  const handleSave = () => {
    setUserData({ ...tempUserData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempUserData({ ...userData })
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setTempUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Datos de ejemplo para las propiedades publicadas
  const propiedadesPublicadas = [
    {
      id: 1,
      address: "Ur La Portada Americana 23 #56",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 120,
      price: "7250000",
      type: "casa",
      propertyType: "venta",
      status: "Disponible"
    },
    {
      id: 2,
      address: "Ur La Portada Americana 25 #58",
      title: "Casa Lomas Del Norte",
      rooms: 4,
      bathrooms: 2,
      area: 150,
      price: "8500000",
      type: "casa",
      propertyType: "alquiler",
      status: "Alquilada"
    },
    {
      id: 3,
      address: "Ur La Portada Americana 27 #60",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 110,
      price: "6900000",
      type: "casa",
      propertyType: "venta",
      status: "Disponible"
    },
    {
      id: 4,
      address: "Ur La Portada Americana 29 #62",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 110,
      price: "6900000",
      type: "casa",
      propertyType: "venta",
      status: "Vendida"
    },
    {
      id: 5,
      address: "Ur La Portada Americana 31 #64",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 110,
      price: "6900000",
      type: "casa",
      propertyType: "venta",
      status: "Disponible"
    }
  ]

  // Datos de ejemplo para las propiedades adquiridas
  const propiedadesAdquiridas = [
    {
      id: 101,
      address: "Calle 15 #45-67, Zona Rosa",
      title: "Apartamento Moderno Centro",
      rooms: 2,
      bathrooms: 2,
      area: 85,
      price: "4500000",
      type: "apartamento",
      propertyType: "compra",
      status: "Comprada",
      fechaAdquisicion: "2024-03-15",
      vendedor: "Juan Pérez"
    },
    {
      id: 102,
      address: "Av. Principal #123, El Poblado",
      title: "Local Comercial Esquina",
      rooms: 0,
      bathrooms: 1,
      area: 120,
      price: "12000000",
      type: "local",
      propertyType: "compra",
      status: "Comprada",
      fechaAdquisicion: "2023-11-20",
      vendedor: "María González"
    },
    {
      id: 103,
      address: "Carrera 70 #34-89, Laureles",
      title: "Casa Familiar Tradicional",
      rooms: 4,
      bathrooms: 3,
      area: 180,
      price: "9800000",
      type: "casa",
      propertyType: "alquiler",
      status: "Arrendada",
      fechaAdquisicion: "2024-01-10",
      vendedor: "Carlos Ramírez"
    }
  ]

  // Datos para propiedades favoritas (placeholder por ahora)
  const propiedadesFavoritas = []

  // Función para eliminar propiedad
  const eliminarPropiedad = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta propiedad?')) {
      console.log(`Eliminar propiedad ${id}`)
    }
  }

  // Función para editar propiedad
  const editarPropiedad = (id) => {
    console.log(`Editar propiedad ${id}`)
  }

  // Función para ver propiedad
  const verPropiedad = (id) => {
    console.log(`Ver propiedad ${id}`)
  }

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    const numero = typeof precio === 'string' ? 
      parseInt(precio.replace(/[^\d]/g, '')) : precio;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numero);
  }

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
      case 'alquilada':
      case 'arrendada':
        return 'bg-blue-100 text-blue-700 border border-blue-200'
      case 'vendida':
      case 'comprada':
        return 'bg-purple-100 text-purple-700 border border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
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
  }

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Función para obtener los datos según la pestaña activa
  const obtenerDatos = () => {
    switch (activeTab) {
      case 'publicadas':
        return propiedadesPublicadas;
      case 'adquiridas':
        return propiedadesAdquiridas;
      case 'favoritas':
        return propiedadesFavoritas;
      default:
        return [];
    }
  }

  // Función para obtener el título según la pestaña activa
  const obtenerTitulo = () => {
    switch (activeTab) {
      case 'publicadas':
        return 'Mis Propiedades Publicadas';
      case 'adquiridas':
        return 'Propiedades Adquiridas';
      case 'favoritas':
        return 'Propiedades Favoritas';
      default:
        return '';
    }
  }

  const datosActuales = obtenerDatos();

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-10">
      {/* Información Personal */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-10 max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Información Personal
          </h2>
          
          {/* Botones de edición */}
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 text-[#2F8EAC] hover:text-[#287b93] transition-colors hover:bg-[#e6f3f6] rounded-md"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm font-medium">Editar</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-2 bg-[#2F8EAC] text-white rounded-md hover:bg-[#287b93] transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm">Guardar</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Cancelar</span>
              </button>
            </div>
          )}
        </div>
          
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-[#2F8EAC] rounded-full flex items-center justify-center shadow-md">
            <User className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Formulario de información */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Nombre
            </label>
            <input
              type="text"
              value={isEditing ? tempUserData.nombre : userData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md bg-transparent focus:border-[#2F8EAC] focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] transition-colors ${
                isEditing ? 'text-gray-900 bg-white' : 'text-gray-600 bg-gray-50'
              }`}
              readOnly={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Teléfono
            </label>
            <input
              type="text"
              value={isEditing ? tempUserData.telefono : userData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md bg-transparent focus:border-[#2F8EAC] focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] transition-colors ${
                isEditing ? 'text-gray-900 bg-white' : 'text-gray-600 bg-gray-50'
              }`}
              readOnly={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Correo
            </label>
            <input
              type="email"
              value={isEditing ? tempUserData.correo : userData.correo}
              onChange={(e) => handleInputChange('correo', e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md bg-transparent focus:border-[#2F8EAC] focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] transition-colors ${
                isEditing ? 'text-gray-900 bg-white' : 'text-gray-600 bg-gray-50'
              }`}
              readOnly={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Contraseña
            </label>
            <input
              type={isEditing ? "text" : "password"}
              value={isEditing ? tempUserData.contraseña : userData.contraseña}
              onChange={(e) => handleInputChange('contraseña', e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md bg-transparent focus:border-[#2F8EAC] focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] transition-colors ${
                isEditing ? 'text-gray-900 bg-white' : 'text-gray-600 bg-gray-50'
              }`}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Sección de Propiedades */}
      <div>
        {/* Pestañas */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-8">
          <div className="flex rounded-t-2xl overflow-hidden">
            <button 
              onClick={() => setActiveTab('publicadas')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'publicadas' 
                  ? 'text-white bg-[#2F8EAC] hover:bg-[#287b93]' 
                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              Mis Propiedades Publicadas
            </button>
            <button 
              onClick={() => setActiveTab('adquiridas')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'adquiridas' 
                  ? 'text-white bg-[#2F8EAC] hover:bg-[#287b93]' 
                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              Propiedades Adquiridas
            </button>
            <button 
              onClick={() => setActiveTab('favoritas')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'favoritas' 
                  ? 'text-white bg-[#2F8EAC] hover:bg-[#287b93]' 
                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              Propiedades Favoritas
            </button>
          </div>
        </div>

        {/* Tabla de propiedades */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">{obtenerTitulo()}</h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'favoritas' 
                ? `Tus propiedades favoritas (${datosActuales.length} propiedades)` 
                : `Administra tus propiedades (${datosActuales.length} propiedades)`
              }
            </p>
          </div>
          
          {datosActuales.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'favoritas' ? 'No tienes propiedades favoritas' : 'No hay propiedades'}
              </h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'favoritas' 
                  ? 'Aún no has marcado ninguna propiedad como favorita.' 
                  : `Aún no has ${activeTab === 'adquiridas' ? 'adquirido' : 'agregado'} ninguna propiedad.`
                }
              </p>
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
                    {activeTab === 'adquiridas' && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Adquisición
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {datosActuales.map((propiedad) => (
                    <tr key={propiedad.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <Building2 className="w-6 h-6 text-gray-400" />
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
                      {activeTab === 'adquiridas' && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <div className="text-xs text-gray-500">{formatearFecha(propiedad.fechaAdquisicion)}</div>
                            <div className="text-xs text-gray-400">Vendedor: {propiedad.vendedor}</div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => verPropiedad(propiedad.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {activeTab !== 'adquiridas' && (
                            <button 
                              onClick={() => editarPropiedad(propiedad.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Editar propiedad"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => eliminarPropiedad(propiedad.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={activeTab === 'favoritas' ? 'Quitar de favoritas' : 'Eliminar propiedad'}
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
    </div>   
  )
}