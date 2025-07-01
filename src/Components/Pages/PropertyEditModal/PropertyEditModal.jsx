"use client"

import { useState, useEffect } from "react"
import { X, Save, Home } from "lucide-react"

export const PropertyEditModal = ({ property, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "Apartamento",
    operacion: "Venta",
    precio: "",
    ubicacion: "",
    habitaciones: "",
    banos: "",
    area: "",
    estado: "Disponible",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const tiposPropiedad = ["Casa", "Apartamento", "Estudio", "Penthouse"]
  const tiposOperacion = ["Venta", "Alquiler"]
  const estadosPropiedad = ["Disponible", "Ocupado", "Negociación"]

  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        titulo: property.titulo,
        tipo: property.tipo,
        operacion: property.operacion,
        precio: property.precio.toString(),
        ubicacion: property.ubicacion,
        habitaciones: property.habitaciones.toString(),
        banos: property.banos.toString(),
        area: property.area.toString(),
        estado: property.estado,
      })
      setError("")
    }
  }, [property, isOpen])

  if (!isOpen || !property) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.titulo.trim()) {
      setError("El título es requerido")
      return false
    }
    if (!formData.precio || isNaN(Number(formData.precio))) {
      setError("El precio debe ser un número válido")
      return false
    }
    if (!formData.ubicacion.trim()) {
      setError("La ubicación es requerida")
      return false
    }
    if (!formData.habitaciones || isNaN(Number(formData.habitaciones))) {
      setError("El número de habitaciones debe ser válido")
      return false
    }
    if (!formData.banos || isNaN(Number(formData.banos))) {
      setError("El número de baños debe ser válido")
      return false
    }
    if (!formData.area || isNaN(Number(formData.area))) {
      setError("El área debe ser un número válido")
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
      const updatedProperty = {
        ...property,
        titulo: formData.titulo,
        tipo: formData.tipo,
        operacion: formData.operacion,
        precio: Number(formData.precio),
        ubicacion: formData.ubicacion,
        habitaciones: Number(formData.habitaciones),
        banos: Number(formData.banos),
        area: Number(formData.area),
        estado: formData.estado,
      }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave(updatedProperty)
      onClose()
    } catch (error) {
      setError("Error al actualizar la propiedad. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6 text-[#2F8EAC]" />
            <h2 className="text-2xl font-bold text-gray-900">Editar Propiedad</h2>
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
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                Título de la propiedad *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                disabled={isLoading}
                required
              />
            </div>

            {/* Tipo y Operación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de propiedad *
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                >
                  {tiposPropiedad.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="operacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Operación *
                </label>
                <select
                  id="operacion"
                  name="operacion"
                  value={formData.operacion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                >
                  {tiposOperacion.map((operacion) => (
                    <option key={operacion} value={operacion}>
                      {operacion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Precio y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación *
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Habitaciones, Baños y Área */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="habitaciones" className="block text-sm font-medium text-gray-700 mb-2">
                  Habitaciones *
                </label>
                <input
                  type="number"
                  id="habitaciones"
                  name="habitaciones"
                  value={formData.habitaciones}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="banos" className="block text-sm font-medium text-gray-700 mb-2">
                  Baños *
                </label>
                <input
                  type="number"
                  id="banos"
                  name="banos"
                  value={formData.banos}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Área (m²) *
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                disabled={isLoading}
                required
              >
                {estadosPropiedad.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
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
