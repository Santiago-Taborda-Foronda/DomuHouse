"use client"

import { useState, useEffect } from "react"
import { X, Save, User } from "lucide-react"

export const AgentEditModal = ({ agent, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    status: "Activo",
    specialties: [],
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const availableSpecialties = [
    "Ventas",
    "Alquileres",
    "Comercial",
    "Terrenos",
    "Lujo",
    "Inversión",
    "Residencial",
    "Primera Vivienda",
    "Administración",
  ]

  useEffect(() => {
    if (agent && isOpen) {
      const nameParts = agent.name.split(" ")
      setFormData({
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        email: agent.email,
        phone: agent.phone,
        status: agent.status,
        specialties: agent.specialties,
        description: agent.description || "",
      })
      setError("")
    }
  }, [agent, isOpen])

  if (!isOpen || !agent) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const handleSpecialtyToggle = (specialty) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      setError("El nombre es requerido")
      return false
    }
    if (!formData.last_name.trim()) {
      setError("Los apellidos son requeridos")
      return false
    }
    if (!formData.email.trim()) {
      setError("El email es requerido")
      return false
    }
    if (!formData.phone.trim()) {
      setError("El teléfono es requerido")
      return false
    }
    if (formData.specialties.length === 0) {
      setError("Debe seleccionar al menos una especialidad")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Aquí iría la llamada al backend para actualizar el agente
      // Por ahora simulamos la actualización
      const updatedAgent = {
        ...agent,
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        specialties: formData.specialties,
        description: formData.description,
      }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave(updatedAgent)
      onClose()
    } catch (error) {
      setError("Error al actualizar el agente. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#2F8EAC]" />
            <h2 className="text-2xl font-bold text-gray-900">Editar Agente</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={isLoading}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <div className="space-y-6">
            {/* Nombres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                disabled={isLoading}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            {/* Especialidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Especialidades *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSpecialties.map((specialty) => (
                  <label
                    key={specialty}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => handleSpecialtyToggle(specialty)}
                      className="w-4 h-4 text-[#2F8EAC] border-gray-300 rounded focus:ring-[#2F8EAC]"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors resize-none"
                placeholder="Descripción del agente y su experiencia..."
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-3 bg-[#2F8EAC] text-white rounded-xl hover:bg-[#267a95] transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
