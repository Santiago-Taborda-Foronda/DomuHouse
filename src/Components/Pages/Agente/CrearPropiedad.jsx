import { useState } from "react"
import { Upload, X, Menu } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"
import { Header } from "../../Layouts/Header/Header"

export default function CrearPropiedad() {
  const [activeSection, setActiveSection] = useState("Crear Propiedad")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [formData, setFormData] = useState({
    // Campos básicos
    title: "",
    address: "",
    type: "",
    description: "",

    // Campos numéricos específicos
    rooms: "",
    bathrooms: "",
    area: "",
    price: "",

    // Información del agente
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    agentWhatsapp: "",

    // Información adicional
    propertyType: "venta",
    additionalRoomInfo: "",
  })

  const [selectedImages, setSelectedImages] = useState([])
  const [imageFiles, setImageFiles] = useState([]) // Para enviar archivos reales al backend
  const [precioEstimado, setPrecioEstimado] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [fullAddress, setFullAddress] = useState("Bogotá, Colombia") // Default location

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Update map address when address field changes
    if (name === "address") {
      setFullAddress(value || "Bogotá, Colombia")
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map((file) => URL.createObjectURL(file))

    // Para mostrar preview
    setSelectedImages((prev) => [...prev, ...imageUrls])
    // Para enviar al backend
    setImageFiles((prev) => [...prev, ...files])
  }

  const removeImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  // Función para validar el formulario
  const validateForm = () => {
    const requiredFields = [
      "title",
      "address",
      "type",
      "description",
      "rooms",
      "bathrooms",
      "area",
      "price",
      "agentName",
      "agentPhone",
      "agentEmail",
    ]

    for (const field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`El campo ${field} es requerido`)
        return false
      }
    }

    // Validar que rooms, bathrooms y area sean números válidos
    if (isNaN(formData.rooms) || formData.rooms < 0) {
      setSubmitError("El número de habitaciones debe ser válido")
      return false
    }

    if (isNaN(formData.bathrooms) || formData.bathrooms < 0) {
      setSubmitError("El número de baños debe ser válido")
      return false
    }

    if (isNaN(formData.area) || formData.area <= 0) {
      setSubmitError("El área debe ser un número válido mayor a 0")
      return false
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.agentEmail)) {
      setSubmitError("El email del agente no es válido")
      return false
    }

    return true
  }

  // Función optimizada para envío al backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Resetear estados
    setSubmitError("")
    setSubmitSuccess(false)

    // Validar formulario
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Crear FormData para enviar archivos e información
      const formDataToSend = new FormData()

      // Preparar datos de la propiedad para el backend
      const propertyData = {
        // Información básica
        title: formData.title.trim(),
        address: formData.address.trim(),
        type: formData.type,
        description: formData.description.trim(),
        propertyType: formData.propertyType, // 'venta' o 'alquiler'

        // Características numéricas (convertir a números)
        rooms: Number.parseInt(formData.rooms),
        bathrooms: Number.parseInt(formData.bathrooms),
        area: Number.parseInt(formData.area),
        price: formData.price.replace(/[^\d]/g, ""), // Limpiar precio de caracteres no numéricos

        // Información del agente
        agent: {
          name: formData.agentName.trim(),
          phone: formData.agentPhone.trim(),
          email: formData.agentEmail.trim().toLowerCase(),
          whatsapp: formData.agentWhatsapp.trim() || formData.agentPhone.trim(),
        },

        // Información adicional
        additionalRoomInfo: formData.additionalRoomInfo.trim(),

        // Metadatos
        createdAt: new Date().toISOString(),
        status: "active", // o el estado que manejen en el backend
      }

      // Agregar datos JSON al FormData
      formDataToSend.append("propertyData", JSON.stringify(propertyData))

      // Agregar imágenes al FormData
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`images`, file)
      })

      // SIMULACIÓN TEMPORAL (remover cuando se conecte al backend real)
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simular delay de red

      console.log("Datos preparados para backend:", {
        propertyData,
        imageCount: imageFiles.length,
        formDataKeys: Array.from(formDataToSend.keys()),
      })

      // Éxito
      setSubmitSuccess(true)

      // Opcional: limpiar formulario después del éxito
      setTimeout(() => {
        resetForm()
      }, 2000)
    } catch (error) {
      console.error("Error al enviar propiedad:", error)
      setSubmitError(error.message || "Error al registrar la propiedad. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      title: "",
      address: "",
      type: "",
      description: "",
      rooms: "",
      bathrooms: "",
      area: "",
      price: "",
      agentName: "",
      agentPhone: "",
      agentEmail: "",
      agentWhatsapp: "",
      propertyType: "venta",
      additionalRoomInfo: "",
    })
    setSelectedImages([])
    setImageFiles([])
    setPrecioEstimado("")
    setSubmitError("")
    setSubmitSuccess(false)
    setFullAddress("Bogotá, Colombia")
  }

  const handleSolicitarValoracion = async () => {
    // Validar que tengamos datos mínimos para la valoración
    if (!formData.area || !formData.type || !formData.address) {
      setSubmitError("Por favor completa el área, tipo de propiedad y dirección para solicitar valoración")
      return
    }

    try {
      // Simulación temporal
      const basePrice = Math.random() * 500000 + 200000
      const formattedPrice = new Intl.NumberFormat("es-CO").format(basePrice)
      setPrecioEstimado(formattedPrice)

      // Actualizar el precio en el formulario
      setFormData((prev) => ({
        ...prev,
        price: formattedPrice,
      }))
    } catch (error) {
      console.error("Error en valoración:", error)
      setSubmitError("Error al solicitar valoración. Intenta de nuevo.")
    }
  }

  const handleCancel = () => {
    resetForm()
  }

  return (
    <>
    <Header hasSidebar={true} />
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
          <h1 className="text-lg font-semibold text-gray-800">Crear Propiedades</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Crear Propiedades</h1>
          </div>

          {/* Mensajes de estado */}
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{submitError}</div>
          )}

          {submitSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              ¡Propiedad registrada exitosamente!
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Property Details */}
              <div className="space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información Básica</h3>

                  <input
                    type="text"
                    name="title"
                    placeholder="Título de la Propiedad *"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Dirección Completa *"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    >
                      <option value="">Tipo de Propiedad *</option>
                      <option value="casa">Casa</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="local">Local Comercial</option>
                      <option value="oficina">Oficina</option>
                      <option value="terreno">Terreno</option>
                    </select>

                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    >
                      <option value="venta">En Venta</option>
                      <option value="alquiler">En Alquiler</option>
                    </select>
                  </div>
                </div>

                {/* Características de la propiedad */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Características</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      name="rooms"
                      placeholder="Habitaciones *"
                      value={formData.rooms}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />

                    <input
                      type="number"
                      name="bathrooms"
                      placeholder="Baños *"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />

                    <input
                      type="number"
                      name="area"
                      placeholder="Área (m²) *"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>

                  <input
                    type="text"
                    name="additionalRoomInfo"
                    placeholder="Información Adicional de Habitaciones"
                    value={formData.additionalRoomInfo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />

                  <input
                    type="text"
                    name="price"
                    placeholder="Precio (sin símbolo $) *"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />
                </div>

                {/* Información del agente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información del Agente</h3>

                  <input
                    type="text"
                    name="agentName"
                    placeholder="Nombre del Agente *"
                    value={formData.agentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      name="agentPhone"
                      placeholder="Teléfono *"
                      value={formData.agentPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />

                    <input
                      type="tel"
                      name="agentWhatsapp"
                      placeholder="WhatsApp (opcional)"
                      value={formData.agentWhatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>

                  <input
                    type="email"
                    name="agentEmail"
                    placeholder="Email del Agente *"
                    value={formData.agentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <textarea
                    name="description"
                    placeholder="Descripción de la Propiedad *"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Right Column - Multimedia and Map */}
              <div className="space-y-8">
                {/* Multimedia Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Multimedia</h2>

                  {/* Image Upload Area */}
                  <div className="mb-4">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-[#2F8EAC] mb-2" />
                        <p className="text-sm text-gray-600">Subir imágenes</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  {/* Uploaded Images Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`Propiedad ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Valoración automática */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-center mb-4">
                    <p className="text-lg font-semibold text-gray-800 mb-2">Valoración Automática</p>
                    {precioEstimado && <p className="text-2xl font-bold text-green-600">${precioEstimado}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={handleSolicitarValoracion}
                    className="w-full bg-[#2F8EAC] text-white py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <span>📊</span>
                    Solicitar Valoración Automática
                  </button>

                  {precioEstimado && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      * El precio se ha actualizado automáticamente en el formulario
                    </p>
                  )}
                </div>

                {/* Map Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Ubicación en el Mapa</h2>
                  <div className="w-16 h-0.5 bg-gray-200 mb-4"></div>
                  <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      className="w-full h-full"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      loading="lazy"
                      title="Ubicación de la propiedad"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#2F8EAC] text-white hover:bg-[#256b82]"
                }`}
              >
                {isSubmitting ? "Registrando..." : "Guardar Propiedad"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
    
  )
}
