"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"

const UpdateProperty = () => {
  const { id } = useParams()
  const navigate = useNavigate()

const [formData, setFormData] = useState({
  title: "",
  address: "",
  type: "",
  description: "",
  rooms: "",
  bathrooms: "",
  area: "",         // Área total
  builtArea: "",    // Área construida
  stratum: "",      // Estrato
  city: "",
  neighborhood: "",
  parkingSpaces: "", // Parqueaderos
  latitude: "",
  longitude: "",
  price: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
  agentWhatsapp: "",
  propertyType: "venta",
  additionalRoomInfo: "",
  status: "activo",
})



  const [selectedImages, setSelectedImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [imagesToDelete, setImagesToDelete] = useState([])
  const [precioEstimado, setPrecioEstimado] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [propertyNotFound, setPropertyNotFound] = useState(false)

  // Cargar datos de la propiedad
  useEffect(() => {
    const loadPropertyData = async () => {
      if (!id) {
        setPropertyNotFound(true)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setSubmitError("")

        // Primero obtener los datos de la propiedad
        const detailsResponse = await fetch(`http://localhost:10101/api/properties/details/${id}`)
        if (!detailsResponse.ok) {
          throw new Error("No se pudo cargar la propiedad")
        }
        const responseJson = await detailsResponse.json()
        const propertyData = responseJson.property // ✅ Este es el objeto con los datos


          console.log("🔍 propertyData:", propertyData)

        setFormData({
          title: propertyData.title || "",
          address: propertyData.address || "",
          type: propertyData.type || "", // tipo de propiedad
          description: propertyData.description || "",
          rooms: propertyData.bedrooms?.toString() || "",
          bathrooms: propertyData.bathrooms?.toString() || "",
          area: propertyData.area?.toString() || "",          // ✅ área total
          builtArea: propertyData.builtArea?.toString() || "",// ✅ área construida
          stratum: propertyData.stratum?.toString() || "",    // ✅ estrato
          city: propertyData.city || "",
          neighborhood: propertyData.neighborhood || "",
          parkingSpaces: propertyData.parkingSpaces?.toString() || "", // ✅ parqueaderos
          latitude: propertyData.latitude?.toString() || "",
          longitude: propertyData.longitude?.toString() || "",
          price: propertyData.price?.toString() || "",
          agentName: propertyData.agent_name || "",
          agentPhone: propertyData.agent_phone || "",
          agentEmail: propertyData.agent_email || "",
          agentWhatsapp: propertyData.agent_phone || "",
          propertyType: propertyData.operation_type || "venta",
          additionalRoomInfo: "",
          status: propertyData.status || "activo",
        })

        // Cargar imágenes existentes
       if (propertyData.images && propertyData.images.length > 0) {
          setExistingImages(
            propertyData.images.map((url, index) => ({
              id: index, // puedes usar index si no tienes ID real
              url,
            }))
          )
        }

      } catch (error) {
        console.error("Error al cargar propiedad:", error)
        setSubmitError(`Error al cargar la propiedad: ${error.message}`)
        if (error.message.includes("404")) {
          setPropertyNotFound(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadPropertyData()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map((file) => URL.createObjectURL(file))
    setSelectedImages((prev) => [...prev, ...imageUrls])
    setImageFiles((prev) => [...prev, ...files])
  }

  const removeNewImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
    setImagesToDelete((prev) => [...prev, imageId])
  }

  const validateForm = () => {
    const requiredFields = [
      { field: "title", name: "Título" },
      { field: "address", name: "Dirección" },
      { field: "type", name: "Tipo de propiedad" },
      { field: "description", name: "Descripción" },
      { field: "rooms", name: "Habitaciones" },
      { field: "bathrooms", name: "Baños" },
      { field: "area", name: "Área" },
      { field: "price", name: "Precio" },
      { field: "agentName", name: "Nombre del agente" },
      { field: "agentPhone", name: "Teléfono del agente" },
      { field: "agentEmail", name: "Email del agente" },
    ]

    for (const { field, name } of requiredFields) {
      if (!formData[field]?.toString().trim()) {
        setSubmitError(`El campo "${name}" es requerido`)
        return false
      }
    }

    return true
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
     const cleanData = {
        property_title: formData.title.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        operation_type: formData.propertyType,
        bedrooms: Number(formData.rooms),
        bathrooms: Number(formData.bathrooms),
        total_area: Number(formData.area),
        built_area: Number(formData.builtArea || 0),
        parkingSpaces: Number(formData.parkingSpaces || 0),
        latitude: Number(formData.latitude || 0),
        longitude: Number(formData.longitude || 0),
        socioeconomic_stratum: Number(formData.stratum || 0),
        city: formData.city,
        neighborhood: formData.neighborhood,
        price: formData.price.replace(/[^\d]/g, ""),
        status: formData.status,
        agent_name: formData.agentName.trim(),
        agent_phone: formData.agentPhone.trim(),
        agent_email: formData.agentEmail.trim().toLowerCase(),
        agent_whatsapp: formData.agentWhatsapp.trim() || formData.agentPhone.trim(),
        additional_info: formData.additionalRoomInfo.trim(),
        imagesToDelete: imagesToDelete,
      }


      const formDataToSend = new FormData()
      formDataToSend.append("data", JSON.stringify(cleanData))

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file)
      })

      const response = await fetch(`http://localhost:10101/api/properties/editar/${id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        navigate("/mi-inmobiliaria/propiedades")
      }, 2000)
    } catch (error) {
      console.error("Error al actualizar:", error)
      setSubmitError(`Error al actualizar la propiedad: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSolicitarValoracion = async () => {
    if (!formData.area || !formData.type || !formData.address) {
      alert("Por favor completa el área, tipo de propiedad y dirección para solicitar valoración")
      return
    }

    try {
      const basePrice = Math.random() * 500000 + 200000
      const formattedPrice = new Intl.NumberFormat("es-CO").format(basePrice)
      setPrecioEstimado(formattedPrice)

      setFormData((prev) => ({
        ...prev,
        price: formattedPrice,
      }))
    } catch (error) {
      console.error("Error en valoración:", error)
      alert("Error al solicitar valoración. Intenta de nuevo.")
    }
  }

  const handleGoBack = () => {
    navigate("/MiInmobiliaria")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos de la propiedad...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (propertyNotFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h1>
            <p className="text-gray-600 mb-6">La propiedad que buscas no existe o ha sido eliminada.</p>
            <button
              onClick={handleGoBack}
              className="bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors"
            >
              Volver a Propiedades
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Propiedades
          </button>
        </div>

        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <strong>Error:</strong> {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            ¡Propiedad actualizada exitosamente! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulario principal */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Editar Propiedad</h1>

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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Dirección Completa *"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              name="city"
                              placeholder="Ciudad *"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                            />
                            <input
                              type="text"
                              name="neighborhood"
                              placeholder="Barrio *"
                              value={formData.neighborhood}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                            />
                          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="venta">En Venta</option>
                      <option value="alquiler">En Alquiler</option>
                    </select>

                    
                  </div>
                 <select
                  name="stratum"
                  value={formData.stratum}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                >
                  <option value="">Estrato Socioeconómico (Opcional)</option>
                  <option value="1">Estrato 1</option>
                  <option value="2">Estrato 2</option>
                  <option value="3">Estrato 3</option>
                  <option value="4">Estrato 4</option>
                  <option value="5">Estrato 5</option>
                  <option value="6">Estrato 6</option>
                </select>

                </div>

                {/* Características */}
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="bathrooms"
                      placeholder="Baños *"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  <input
                    type="number"
                    name="parkingSpaces"
                    placeholder="Parqueaderos"
                    value={formData.parkingSpaces}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />


                    
                  </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="builtArea"
                    placeholder="Área Construida (m²) *"
                    value={formData.builtArea}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />
                  <input
                    type="number"
                    name="area"
                    placeholder="Área Total (m²)"
                    value={formData.area}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />
                </div>


                                <input
                    type="text"
                    name="price"
                    placeholder="Precio (sin símbolo $) *"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      name="agentPhone"
                      placeholder="Teléfono *"
                      value={formData.agentPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      name="agentWhatsapp"
                      placeholder="WhatsApp (opcional)"
                      value={formData.agentWhatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <input
                    type="email"
                    name="agentEmail"
                    placeholder="Email del Agente *"
                    value={formData.agentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
                  }`}
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar Propiedad"}
                </button>
              </div>
            </div>

            {/* Panel derecho - Imágenes */}
            <div className="space-y-6">
              {/* Imágenes existentes */}
              {existingImages.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Imágenes Actuales</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Imagen ${image.id}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nuevas imágenes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {existingImages.length > 0 ? "Agregar Nuevas Imágenes" : "Imágenes de la Propiedad"}
                </h2>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  {selectedImages.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Nueva imagen ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {selectedImages.length} nueva(s) imagen(es) seleccionada(s)
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="w-16 h-12 bg-gray-300 rounded flex items-center justify-center">📷</div>
                      </div>
                      <p className="text-gray-500 mb-4">No hay nuevas imágenes seleccionadas</p>
                    </div>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    Seleccionar Nuevas Imágenes
                  </label>
                </div>
              </div>

              {/* Valoración */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                  Solicitar Nueva Valoración
                </button>

                {precioEstimado && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    * El precio se ha actualizado automáticamente en el formulario
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProperty