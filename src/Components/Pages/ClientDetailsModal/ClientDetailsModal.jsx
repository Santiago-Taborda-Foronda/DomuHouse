"use client"
import { X, Mail, Phone, Calendar, Home, CreditCard, User } from "lucide-react"

export const ClientDetailsModal = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Activo":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200"
      case "Inactivo":
        return "bg-red-100 text-red-700 border border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "Comprador":
        return "bg-green-100 text-green-700 border border-green-200"
      case "Arrendatario":
        return "bg-blue-100 text-blue-700 border border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
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
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Cliente</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Client Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-[#2F8EAC] rounded-full flex items-center justify-center text-white font-bold text-xl">
              {client.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{client.nombre}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(client.tipoCliente)}`}>
                  {client.tipoCliente}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(client.estado)}`}>
                  {client.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Información de Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{client.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{client.telefono}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Registrado: {formatearFecha(client.fechaRegistro)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Última actividad: {formatearFecha(client.ultimaActividad)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Información de Transacción</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{client.propiedadAsociada}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">
                    {formatearPrecio(client.valorTransaccion)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Tipo: {client.tipoCliente}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Resumen</h4>
            <p className="text-sm text-gray-600">
              Cliente {client.tipoCliente.toLowerCase()} registrado el {formatearFecha(client.fechaRegistro)} con una
              transacción de {formatearPrecio(client.valorTransaccion)} para la propiedad "{client.propiedadAsociada}".
              Estado actual: {client.estado}.
            </p>
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
