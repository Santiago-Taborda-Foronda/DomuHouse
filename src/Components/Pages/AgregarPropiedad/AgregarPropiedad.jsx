"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ChevronDown, Upload, X } from "lucide-react"

const AgregarPropiedad = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    type: "",
    description: "",
    rooms: "",
    bathrooms: "",
    area: "",
    price: "",
    selectedAgentId: "",
    propertyType: "Venta",
    additionalRoomInfo: "",
    socioeconomic_stratum: "",
    city: "",
    neighborhood: "",
    parking_spaces: "",
    total_area: "",
    latitude: "",
    longitude: "",
  })

  // Estados para agentes
  const [agents, setAgents] = useState([])
  const [loadingAgents, setLoadingAgents] = useState(true)
  const [agentsError, setAgentsError] = useState("")

  // Estados para imágenes
  const [selectedImages, setSelectedImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])

  // Estados para envío
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Estado para valoración
  const [precioEstimado, setPrecioEstimado] = useState("")
  const [debugInfo, setDebugInfo] = useState(null)

  // Función para obtener datos de usuario
  const getUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const token = userData.token || localStorage.getItem("token") || ""

      console.log("🔍 Datos de usuario obtenidos:", {
        userData,
        token: token ? `${token.substring(0, 20)}...` : "No token",
        tokenLength: token.length,
      })

      return {
        userData,
        userId: userData.id || userData.person_id || userData.user_id,
        token,
        isValid: !!(userData.id && token),
      }
    } catch (error) {
      console.error("❌ Error al obtener datos de usuario:", error)
      return { userData: {}, userId: null, token: "", isValid: false }
    }
  }

  // Función mejorada para obtener agentes
  const fetchAgents = async () => {
    try {
      setLoadingAgents(true)
      setAgentsError("")
      setDebugInfo(null)

      const { isValid, userData, userId, token } = getUserData()

      // Guardar información de depuración
      const debugData = {
        userData,
        userId,
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
      }
      console.log("📊 Información de usuario para la solicitud:", debugData)
      setDebugInfo(debugData)

      if (!isValid) {
        throw new Error("No se encontraron credenciales válidas. Por favor, inicia sesión nuevamente.")
      }

      if (!token) {
        throw new Error("Token de autorización no encontrado")
      }

      // Construir headers exactamente como en Postman
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      console.log("🔑 Headers que se van a enviar:", {
        Authorization: `Bearer ${token.substring(0, 20)}...`,
        "Content-Type": "application/json",
      })

      console.log("🚀 Intentando fetch a /api/agentes")

      const response = await fetch("https://domuhouse.onrender.com/api/agentes", {
        method: "GET",
        headers: headers,
        // NO usar credentials: "include" para evitar problemas de CORS
      })

      console.log("📡 Respuesta recibida:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error en respuesta:", errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}. ${errorText}`)
      }

      const responseData = await response.json()
      console.log("✅ Respuesta exitosa de /api/agentes:", responseData)

      // Procesar respuesta y extraer agentes
      let agentsData = []

      // Intentar diferentes estructuras de respuesta
      if (Array.isArray(responseData)) {
        agentsData = responseData
      } else if (responseData.data && Array.isArray(responseData.data)) {
        agentsData = responseData.data
      } else if (responseData.agentes && Array.isArray(responseData.agentes)) {
        agentsData = responseData.agentes
      } else if (responseData.agents && Array.isArray(responseData.agents)) {
        agentsData = responseData.agents
      } else {
        // Buscar cualquier array en la respuesta
        const possibleArrays = Object.values(responseData).filter((val) => Array.isArray(val))
        if (possibleArrays.length > 0) {
          agentsData = possibleArrays[0]
        } else {
          console.log("📋 Estructura de respuesta completa:", responseData)
          throw new Error("No se encontraron agentes en la respuesta del servidor")
        }
      }

      // Normalizar estructura de agentes
      if (agentsData.length > 0) {
        agentsData = agentsData.map((agent) => ({
          person_id: agent.person_id || agent.id || agent.agentId || agent.agent_id,
          name_person: agent.name_person || agent.firstName || agent.nombre || agent.name?.split(" ")[0] || "Sin nombre",
          last_name:
            agent.last_name || agent.lastName || agent.apellido || agent.name?.split(" ").slice(1).join(" ") || "",
          email: agent.email || agent.correo || "sin-email@ejemplo.com",
          phone: agent.phone || agent.telefono || agent.phoneNumber || "Sin teléfono",
        }))

        // Filtrar agentes que tengan al menos person_id válido
        agentsData = agentsData.filter((agent) => agent.person_id && agent.person_id !== null)
      }

      console.log("👥 Agentes procesados:", agentsData)

      if (agentsData.length === 0) {
        throw new Error("No se encontraron agentes disponibles")
      }

      setAgents(agentsData)
    } catch (error) {
      console.error("❌ Error fetching agents:", error)
      setAgentsError(`Error al cargar la lista de agentes: ${error.message}`)

      // IMPORTANTE: Solo en desarrollo, usa agentes de ejemplo
      console.log("🔧 Usando agentes de ejemplo para desarrollo...")
      setAgents([
        {
          person_id: 1,
          name_person: "Juan",
          last_name: "Pérez",
          email: "juan.perez@inmobiliaria.com",
          phone: "+57 300 123 4567",
        },
        {
          person_id: 2,
          name_person: "María",
          last_name: "González",
          email: "maria.gonzalez@inmobiliaria.com",
          phone: "+57 301 234 5678",
        },
        {
          person_id: 3,
          name_person: "Carlos",
          last_name: "Rodríguez",
          email: "carlos.rodriguez@inmobiliaria.com",
          phone: "+57 302 345 6789",
        },
      ])
    } finally {
      setLoadingAgents(false)
    }
  }

  // Cargar agentes al montar el componente
  useEffect(() => {
    fetchAgents()
  }, [])

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar carga de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length + imageFiles.length > 10) {
      setSubmitError("Máximo 10 imágenes permitidas")
      return
    }

    const imageUrls = files.map((file) => URL.createObjectURL(file))
    setSelectedImages((prev) => [...prev, ...imageUrls])
    setImageFiles((prev) => [...prev, ...files])
  }

  // Remover imagen
  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(selectedImages[indexToRemove])
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  // Validar formulario
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
      "selectedAgentId",
      "city",
      "neighborhood",
    ]

    for (const field of requiredFields) {
      if (!formData[field]) {
        if (field === "selectedAgentId") {
          setSubmitError("Debe seleccionar un agente responsable")
        } else {
          setSubmitError(`El campo ${field} es requerido`)
        }
        return false
      }
    }

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

    if (imageFiles.length === 0) {
      setSubmitError("Debe seleccionar al menos una imagen")
      return false
    }

    if (imageFiles.length > 10) {
      setSubmitError("Máximo 10 imágenes permitidas")
      return false
    }

    return true
  }

  // Mapeo de tipos de propiedad
  const getPropertyTypeId = (type) => {
    const typeMap = {
      casa: 1,
      apartamento: 2,
      local: 3,
      oficina: 4,
      terreno: 5,
    }
    return typeMap[type] || 1
  }

  // Función para mapear el tipo de operación del frontend al backend
  const mapOperationType = (frontendType) => {
    const operationMap = {
      Venta: "Venta",
      Arriendo: "Arriendo",
      "Arriendo con opción de compra": "Arriendo con opción de compra",
    }
    return operationMap[frontendType] || "Venta"
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")
    setSubmitSuccess(false)

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Crear FormData para enviar archivos e información
      const formDataToSend = new FormData()

      // Mapear campos del frontend a los que espera el backend
      formDataToSend.append("address", formData.address.trim())
      formDataToSend.append("property_title", formData.title.trim())
      formDataToSend.append("description", formData.description.trim())
      formDataToSend.append("price", formData.price.replace(/[^\d]/g, ""))
      formDataToSend.append("status", "Disponible")

      // Usar el ID del agente seleccionado
      formDataToSend.append("person_id", formData.selectedAgentId)

      formDataToSend.append("property_type_id", getPropertyTypeId(formData.type))
      formDataToSend.append("socioeconomic_stratum", formData.socioeconomic_stratum || "3")
      formDataToSend.append("city", formData.city.trim())
      formDataToSend.append("neighborhood", formData.neighborhood.trim())
      formDataToSend.append("operation_type", mapOperationType(formData.propertyType))
      formDataToSend.append("bedrooms", Number.parseInt(formData.rooms))
      formDataToSend.append("bathrooms", Number.parseInt(formData.bathrooms))
      formDataToSend.append("parking_spaces", Number.parseInt(formData.parking_spaces) || 0)
      formDataToSend.append("built_area", Number.parseInt(formData.area))
      formDataToSend.append("total_area", Number.parseInt(formData.total_area) || Number.parseInt(formData.area))
      formDataToSend.append("latitude", formData.latitude || "0")
      formDataToSend.append("longitude", formData.longitude || "0")

      // Agregar imágenes
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file)
      })

      const { token } = getUserData()
      const headers = {}

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Llamada al API del backend
      const response = await fetch("https://domuhouse-express.onrender.com/api/properties/create", {
        method: "POST",
        headers,
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear la propiedad")
      }

      const result = await response.json()
      console.log("Propiedad creada exitosamente:", result)

      setSubmitSuccess(true)
      // Limpiar formulario después del éxito
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

  // Resetear formulario
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
      selectedAgentId: "",
      propertyType: "Venta",
      additionalRoomInfo: "",
      socioeconomic_stratum: "",
      city: "",
      neighborhood: "",
      parking_spaces: "",
      total_area: "",
      latitude: "",
      longitude: "",
    })

    selectedImages.forEach((url) => URL.revokeObjectURL(url))
    setSelectedImages([])
    setImageFiles([])
    setPrecioEstimado("")
    setSubmitError("")
    setSubmitSuccess(false)
  }

  // Solicitar valoración
  const handleSolicitarValoracion = async () => {
    if (!formData.area || !formData.type || !formData.address) {
      setSubmitError("Completa el área, tipo de propiedad y dirección para solicitar valoración")
      return
    }

    try {
      const basePrice = Math.random() * 500000 + 200000
      const formattedPrice = new Intl.NumberFormat("es-CO").format(basePrice)
      setPrecioEstimado(formattedPrice)
      setFormData((prev) => ({ ...prev, price: formattedPrice }))
    } catch (error) {
      console.error("Error en valoración:", error)
      setSubmitError("Error al solicitar valoración")
    }
  }

  // Función para recargar manualmente los agentes
  const handleReloadAgents = () => {
    fetchAgents()
  }

  // Función para probar la conexión manualmente
  const testConnection = async () => {
    console.log("🧪 Probando conexión manual...")
    const { token } = getUserData()

    try {
      const response = await fetch("http://localhost:10101/api/agentes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("🧪 Resultado de prueba:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      })

      if (response.ok) {
        const data = await response.json()
        console.log("🧪 Datos recibidos:", data)
      } else {
        const errorText = await response.text()
        console.log("🧪 Error recibido:", errorText)
      }
    } catch (error) {
      console.log("🧪 Error de conexión:", error)
    }
  }

  const selectedAgent = agents.find((agent) => agent.person_id?.toString() === formData.selectedAgentId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>

        {/* Alertas */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{submitError}</div>
        )}

        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            ¡Propiedad registrada exitosamente!
          </div>
        )}

        {agentsError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl flex flex-col">
            <div className="flex justify-between items-center">
              <span>{agentsError}</span>
              <div className="flex gap-2">
                <button
                  onClick={testConnection}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-sm"
                >
                  Probar Conexión
                </button>
                <button
                  onClick={handleReloadAgents}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg text-sm"
                >
                  Reintentar
                </button>
              </div>
            </div>
            {debugInfo && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer">Mostrar información de depuración</summary>
                <pre className="mt-2 p-2 bg-yellow-100 rounded overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
              </details>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel izquierdo - Formulario */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Agregar Propiedad</h1>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="Ciudad *"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="neighborhood"
                      placeholder="Barrio *"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <option value="Venta">En Venta</option>
                      <option value="Arriendo">En Arriendo</option>
                      <option value="Arriendo con opción de compra">Arriendo con opción de compra</option>
                    </select>
                  </div>

                  <select
                    name="socioeconomic_stratum"
                    value={formData.socioeconomic_stratum}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Estrato Socioeconómico</option>
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
                      name="parking_spaces"
                      placeholder="Parqueaderos"
                      value={formData.parking_spaces}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="area"
                      placeholder="Área Construida (m²) *"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="total_area"
                      placeholder="Área Total (m²)"
                      value={formData.total_area}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <input
                    type="text"
                    name="additionalRoomInfo"
                    placeholder="Información Adicional de Habitaciones"
                    value={formData.additionalRoomInfo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

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

                {/* Ubicación GPS */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Ubicación GPS (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="latitude"
                      placeholder="Latitud"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="longitude"
                      placeholder="Longitud"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Selección del agente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Agente Responsable</h3>

                  {loadingAgents ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">Cargando agentes...</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <select
                          name="selectedAgentId"
                          value={formData.selectedAgentId}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Seleccionar Agente *</option>
                          {agents.map((agent) => (
                            <option key={agent.person_id} value={agent.person_id}>
                              {agent.name_person} {agent.last_name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>

                      {selectedAgent && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">Información del Agente:</h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <p>
                              <strong>Nombre:</strong> {selectedAgent.name_person} {selectedAgent.last_name}
                            </p>
                            <p>
                              <strong>Email:</strong> {selectedAgent.email}
                            </p>
                            <p>
                              <strong>Teléfono:</strong> {selectedAgent.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {agents.length === 0 && !loadingAgents && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <p className="text-yellow-700">
                            No se encontraron agentes disponibles. Contacte al administrador.
                          </p>
                        </div>
                      )}
                    </>
                  )}
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
                  disabled={isSubmitting || loadingAgents}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    isSubmitting || loadingAgents
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Registrando..." : "Registrar Propiedad"}
                </button>
              </div>
            </div>

            {/* Panel derecho */}
            <div className="space-y-6">
              {/* Sección de imágenes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Imágenes de la Propiedad *
                </h2>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  {selectedImages.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Propiedad ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {selectedImages.length} imagen(es) seleccionada(s) (máximo 10)
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <Upload className="w-16 h-16 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4">No hay imágenes seleccionadas</p>
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
                    {selectedImages.length > 0 ? "Agregar más imágenes" : "Seleccionar Imágenes *"}
                  </label>
                </div>
              </div>

              {/* Valoración automática */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold text-gray-800 mb-2">Valoración Automática</p>
                  {precioEstimado && <p className="text-2xl font-bold text-green-600">${precioEstimado}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSolicitarValoracion}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgregarPropiedad