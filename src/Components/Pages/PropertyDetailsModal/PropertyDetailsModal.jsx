"use client"
import { X, MapPin, Home, Calendar, Eye, DollarSign, Bed, Bath, Square } from "lucide-react"

export const PropertyDetailsModal = ({ property, isOpen, onClose }) => {
  if (!isOpen || !property) return null

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-100 text-green-800 border border-green-200"
      case "Ocupado":
        return "bg-red-100 text-red-800 border border-red-200"
      case "Negociación":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Detalles de la Propiedad</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.titulo}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{property.ubicacion}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(property.estado)}`}>
                  {property.estado}
                </span>
                <span className="px-3 py-1 bg-[#2F8EAC] text-white rounded-full text-sm font-medium">
                  {property.operacion}
                </span>
              </div>
            </div>

            {/* Imagen */}
            <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center mb-6">
              <Home className="w-16 h-16 text-gray-400" />
            </div>

            {/* Precio */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#2F8EAC]">{formatearPrecio(property.precio)}</span>
              {property.operacion === "Alquiler" && <span className="text-lg text-gray-600">/mes</span>}
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Características</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{property.habitaciones} Habitaciones</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{property.banos} Baños</span>
                </div>
                <div className="flex items-center gap-3">
                  <Square className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{property.area} m²</span>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{property.tipo}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Publicado: {formatearFecha(property.fechaPublicacion)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{property.visitas} visitas</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Operación: {property.operacion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
