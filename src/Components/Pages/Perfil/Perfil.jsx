import React, { useState } from 'react'
import { User, Edit2, Save, X } from 'lucide-react'
import { PropertyCard } from '../../Layouts/PropertyCard/PropertyCard'

export const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false)
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

  // Datos de ejemplo para las propiedades
  const propiedades = [
    {
      address: "Ur La Portada Americana 23 #56",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 120,
      price: "7250.00",
      agentName: "Jane Doe",
      type: "venta"
    },
    {
      address: "Ur La Portada Americana 25 #58",
      title: "Casa Lomas Del Norte",
      rooms: 4,
      bathrooms: 2,
      area: 150,
      price: "8500.00",
      agentName: "Jane Doe",
      type: "alquiler"
    },
    {
      address: "Ur La Portada Americana 27 #60",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 110,
      price: "6900.00",
      agentName: "Jane Doe",
      type: "venta"
    },
    {
      address: "Ur La Portada Americana 27 #60",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 110,
      price: "6900.00",
      agentName: "Jane Doe",
      type: "venta"
    },
    {
      address: "Ur La Portada Americana 27 #60",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 110,
      price: "6900.00",
      agentName: "Jane Doe",
      type: "venta"
    }
  ]

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
        <div >
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-8">
        <div className="flex rounded-t-2xl overflow-hidden">
          <button className="flex-1 px-6 py-4 text-sm font-medium text-white bg-[#2F8EAC] hover:bg-[#287b93] transition-colors">
            Mis Propiedades Publicadas
          </button>
          <button className="flex-1 px-6 py-4 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
            Propiedades Adquiridas
          </button>
          <button className="flex-1 px-6 py-4 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
            Propiedades Favoritas
          </button>
        </div>
      </div>

      {/* Lista de Propiedades */}
      <div className="px-0 py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((propiedad, index) => (
            <div key={index} className="transform hover:scale-[1.02] transition-transform duration-200">
              <PropertyCard
                address={propiedad.address}
                title={propiedad.title}
                rooms={propiedad.rooms}
                bathrooms={propiedad.bathrooms}
                area={propiedad.area}
                price={propiedad.price}
                agentName={propiedad.agentName}
                type={propiedad.type}
                onClick={() => console.log(`Clicked on property ${index + 1}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>   
  )
}