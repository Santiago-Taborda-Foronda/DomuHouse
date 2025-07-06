"use client"
import { X, Mail, Phone, Star, Calendar } from "lucide-react"

export const AgentDetailsModal = ({ agent, isOpen, onClose }) => {
  if (!isOpen || !agent) return null

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case "activo":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200"
      case "inactivo":
        return "bg-gray-100 text-gray-700 border border-gray-200"
      case "suspendido":
        return "bg-red-100 text-red-700 border border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Agente</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Agent Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-[#2F8EAC] rounded-full flex items-center justify-center text-white font-bold text-xl">
              {agent.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{agent.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(agent.rating)}
                <span className="text-sm text-gray-600">({agent.rating}/5)</span>
              </div>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(agent.status)}`}
              >
                {agent.status}
              </span>
            </div>
          </div>

          {/* Description */}
          {agent.description && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{agent.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Información de Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{agent.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{agent.phone}</span>
                </div>
                
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Estadísticas</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Propiedades activas</span>
                  <span className="text-sm font-semibold text-gray-900">{agent.propertyCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ventas totales</span>
                  <span className="text-sm font-semibold text-gray-900">{agent.totalSales}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Calificación</span>
                  <div className="flex items-center gap-1">{renderStars(agent.rating)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Especialidades</h4>
            <div className="flex flex-wrap gap-2">
              {agent.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  {specialty}
                </span>
              ))}
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
