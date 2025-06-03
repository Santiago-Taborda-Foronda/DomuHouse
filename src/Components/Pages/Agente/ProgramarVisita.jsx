import { useState } from "react"
import { Menu, Calendar, User, Home, Phone, MapPin } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"

export default function ProgramarVisita() {
  const [activeSection, setActiveSection] = useState("Programar Visitas")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [formData, setFormData] = useState({
    clienteName: "",
    clientePhone: "",
    clienteEmail: "",
    propiedad: "",
    fecha: "",
    hora: "",
    tipoVisita: "presencial",
    notas: "",
    direccion: "",
    agenteName: "",
    agentePhone: "",
  })

  // Datos de ejemplo para propiedades disponibles
  const propiedadesDisponibles = [
    { id: 1, nombre: "Casa 01", direccion: "Calle 123 #45-67, Bogotá", tipo: "Casa" },
    { id: 2, nombre: "Casa 02", direccion: "Carrera 45 #12-34, Bogotá", tipo: "Casa" },
    { id: 3, nombre: "Casa 03", direccion: "Avenida 68 #23-45, Bogotá", tipo: "Casa" },
    { id: 4, nombre: "Apartamento 01", direccion: "Calle 85 #15-30, Bogotá", tipo: "Apartamento" },
    { id: 5, nombre: "Local Comercial 01", direccion: "Carrera 7 #32-16, Bogotá", tipo: "Local" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-completar dirección cuando se selecciona una propiedad
    if (name === "propiedad") {
      const selectedProperty = propiedadesDisponibles.find((prop) => prop.nombre === value)
      if (selectedProperty) {
        setFormData((prev) => ({
          ...prev,
          direccion: selectedProperty.direccion,
        }))
      }
    }
  }

  const validateForm = () => {
    const requiredFields = ["clienteName", "clientePhone", "propiedad", "fecha", "hora", "agenteName", "agentePhone"]

    for (const field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`El campo ${getFieldLabel(field)} es requerido`)
        return false
      }
    }

    // Validar email si se proporciona
    if (formData.clienteEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clienteEmail)) {
      setSubmitError("El email del cliente no es válido")
      return false
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(formData.fecha)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      setSubmitError("La fecha de la visita no puede ser en el pasado")
      return false
    }

    return true
  }

  const getFieldLabel = (field) => {
    const labels = {
      clienteName: "Nombre del Cliente",
      clientePhone: "Teléfono del Cliente",
      propiedad: "Propiedad",
      fecha: "Fecha",
      hora: "Hora",
      agenteName: "Nombre del Agente",
      agentePhone: "Teléfono del Agente",
    }
    return labels[field] || field
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmitError("")
    setSubmitSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Preparar datos para el backend
      const visitData = {
        cliente: {
          nombre: formData.clienteName.trim(),
          telefono: formData.clientePhone.trim(),
          email: formData.clienteEmail.trim(),
        },
        propiedad: {
          nombre: formData.propiedad,
          direccion: formData.direccion,
        },
        fechaHora: `${formData.fecha}T${formData.hora}`,
        tipoVisita: formData.tipoVisita,
        notas: formData.notas.trim(),
        agente: {
          nombre: formData.agenteName.trim(),
          telefono: formData.agentePhone.trim(),
        },
        estado: "programada",
        creadoEn: new Date().toISOString(),
      }

      // Simulación de envío al backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Visita programada:", visitData)

      setSubmitSuccess(true)

      // Limpiar formulario después del éxito
      setTimeout(() => {
        resetForm()
      }, 2000)
    } catch (error) {
      console.error("Error al programar visita:", error)
      setSubmitError("Error al programar la visita. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      clienteName: "",
      clientePhone: "",
      clienteEmail: "",
      propiedad: "",
      fecha: "",
      hora: "",
      tipoVisita: "presencial",
      notas: "",
      direccion: "",
      agenteName: "",
      agentePhone: "",
    })
    setSubmitError("")
    setSubmitSuccess(false)
  }

  // Generar opciones de hora
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        times.push(timeString)
      }
    }
    return times
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <AgentSideBar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Programar Visita</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Programar Visita</h1>
          </div>

          {/* Mensajes de estado */}
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{submitError}</div>
          )}

          {submitSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              ¡Visita programada exitosamente!
            </div>
          )}

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
              <div className="space-y-8">
                {/* Información del Cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#2F8EAC]" />
                    Información del Cliente
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        name="clienteName"
                        value={formData.clienteName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                        placeholder="Nombre del cliente"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                      <input
                        type="tel"
                        name="clientePhone"
                        value={formData.clientePhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opcional)</label>
                    <input
                      type="email"
                      name="clienteEmail"
                      value={formData.clienteEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>

                {/* Información de la Propiedad */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#2F8EAC]" />
                    Información de la Propiedad
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Propiedad *</label>
                    <select
                      name="propiedad"
                      value={formData.propiedad}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    >
                      <option value="">Selecciona una propiedad</option>
                      {propiedadesDisponibles.map((propiedad) => (
                        <option key={propiedad.id} value={propiedad.nombre}>
                          {propiedad.nombre} - {propiedad.tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.direccion && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{formData.direccion}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Información de la Visita */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                    Detalles de la Visita
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                      <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
                      <select
                        name="hora"
                        value={formData.hora}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                      >
                        <option value="">Selecciona una hora</option>
                        {generateTimeOptions().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Visita</label>
                      <select
                        name="tipoVisita"
                        value={formData.tipoVisita}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                      >
                        <option value="presencial">Presencial</option>
                        <option value="virtual">Virtual</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                    <textarea
                      name="notas"
                      value={formData.notas}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                      placeholder="Información adicional sobre la visita..."
                    />
                  </div>
                </div>

                {/* Información del Agente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#2F8EAC]" />
                    Información del Agente
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Agente *</label>
                      <input
                        type="text"
                        name="agenteName"
                        value={formData.agenteName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                        placeholder="Nombre del agente responsable"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono del Agente *</label>
                      <input
                        type="tel"
                        name="agentePhone"
                        value={formData.agentePhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-xl font-medium transition-colors ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#2F8EAC] text-white hover:bg-[#256b82]"
                    }`}
                  >
                    {isSubmitting ? "Programando..." : "Programar Visita"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
