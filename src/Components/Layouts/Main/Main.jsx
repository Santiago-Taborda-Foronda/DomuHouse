"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Casa from "../../../assets/images/casLujo2.jpg"
import Casa2 from "../../../assets/images/Casa2.jpg"
import { LuSettings2 } from "react-icons/lu"
import { ChatDomu } from "../../UI/ChatDomu/ChatDomu"
import { Button } from "../../UI/Button/Button"
import "../../../App"

const PropertyCard = ({ address, title, rooms, bathrooms, area, price, type, agentName, imageUrl, onClick }) => {
  // Función para obtener el color y texto de la etiqueta según el tipo
  const getOperationStyle = (operationType) => {
    switch (operationType?.toLowerCase()) {
      case "venta":
        return { bg: "bg-green-500", text: "En Venta" }
      case "arriendo":
      case "alquiler":
        return { bg: "bg-blue-500", text: "En Alquiler" }
      default:
        return { bg: "bg-green-500", text: "En Venta" }
    }
  }

  const operationStyle = getOperationStyle(type)

  // ✅ FUNCIÓN MEJORADA PARA LAS INICIALES
  const getAgentInitials = (name) => {
    if (!name || name.trim() === "" || name === "Agente") return "AG"

    return name
      .trim()
      .split(" ")
      .filter((n) => n.length > 0) // Filtrar espacios vacíos
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  // ✅ FUNCIÓN MEJORADA PARA FORMATEAR EL NOMBRE
  const formatAgentName = (name) => {
    if (!name || name.trim() === "") return "Agente"
    return name.trim()
  }

  // ✅ FUNCIÓN PARA MANEJAR ERRORES DE IMAGEN
  const handleImageError = (e) => {
    console.log("Error cargando imagen:", imageUrl)
    e.target.src = Casa // Fallback a imagen por defecto
  }

  // ✅ FUNCIÓN MEJORADA PARA MANEJAR URLs DE CLOUDINARY
  const getImageUrl = () => {
    if (!imageUrl) return Casa

    // Si ya es una URL completa de Cloudinary o cualquier servicio, usarla directamente
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl
    }

    // Si es una ruta relativa, construir la URL completa
    if (imageUrl.startsWith("/")) {
      return `https://domuhouse-express.onrender.com${imageUrl}`
    }

    // Si no tiene protocolo ni slash inicial, asumir que es una ruta relativa
    return `https://domuhouse-express.onrender.com/${imageUrl}`
  }

  console.log("PropertyCard recibió:", { agentName, title, imageUrl })

  return (
    <div
      className="bg-white flex flex-col rounded-2xl w-full max-w-xs sm:max-w-sm shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
    >
      {/* Imagen de la propiedad con etiqueta de tipo */}
      <div className="relative w-full h-40 sm:h-44 md:h-48 lg:h-52">
        <img
          src={getImageUrl() || "/placeholder.svg"}
          alt={title || "Propiedad"}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        {/* Etiqueta de tipo de operación */}
        <div
          className={`absolute top-3 right-3 ${operationStyle.bg} text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}
        >
          {operationStyle.text}
        </div>
        {/* Overlay con dirección */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
          <span className="drop-shadow-lg">{address}</span>
        </div>
      </div>

      {/* Información de la propiedad */}
      <div className="p-3 sm:p-4">
        {/* Título de la propiedad */}
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 line-clamp-2">
          {title}
        </h2>

        {/* Características principales */}
        <div className="flex flex-wrap items-center text-gray-600 text-xs sm:text-sm gap-3 sm:gap-6 mb-3 sm:mb-4">
          <span className="flex items-center gap-1">
            Cuartos: <strong className="text-gray-800">{rooms}</strong>
          </span>
          <span className="flex items-center gap-1">
            Baños: <strong className="text-gray-800">{bathrooms}</strong>
          </span>
          <span className="flex items-center gap-1">
            m²: <strong className="text-gray-800">{area}</strong>
          </span>
        </div>

        <hr className="my-2" />

        {/* Información del agente y precio */}
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#2F8EAC] to-[#1e6b7a] flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
              {getAgentInitials(agentName)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-700 font-medium">{formatAgentName(agentName)}</span>
            </div>
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900">${price}</span>
        </div>
      </div>
    </div>
  )
}

export const Main = () => {
  const navigate = useNavigate()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [priceRange, setPriceRange] = useState(250000000)
  const [properties, setProperties] = useState([])
  const [filters, setFilters] = useState({
    operation_type: "",
    property_type: "",
    city: "",
    neighborhood: "",
    keyword: "",
    bedrooms_min: "",
    bathrooms_min: "",
    parking_spaces: "",
    socioeconomic_stratum: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleAdvanced = () => setShowAdvanced(!showAdvanced)

  // ✅ DEBUG: Para verificar propiedades cargadas
  useEffect(() => {
    if (properties.length > 0) {
      console.log(
        "🔍 Propiedades cargadas:",
        properties.slice(0, 2).map((p) => ({
          id: p.property_id,
          title: p.property_title,
          agent_name: p.agent_name,
          name_person: p.name_person,
          last_name: p.last_name,
          // ✅ Agregar debug de imágenes
          main_image_url: p.main_image_url,
          image_url: p.image_url,
          has_images: p.has_images,
          image_count: p.image_count,
        })),
      )
    }
  }, [properties])

  // ✅ Cargar propiedades con imágenes principales
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        // ✅ Usar la nueva ruta que incluye las imágenes principales
        const res = await fetch("https://domuhouse-express.onrender.com/api/properties/with-images")
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        console.log("Datos recibidos con imágenes:", data)

        if (data.success && Array.isArray(data.properties)) {
          setProperties(data.properties)
        } else if (Array.isArray(data)) {
          setProperties(data)
        } else {
          console.warn("Formato de datos inesperado:", data)
          setProperties([])
        }
        setError(null)
      } catch (error) {
        console.error("Error al cargar propiedades:", error)
        // ✅ Fallback a la ruta original si la nueva no existe
        try {
          console.log("🔄 Intentando con ruta original...")
          const fallbackRes = await fetch("https://domuhouse-express.onrender.com/api/properties/approved")
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json()
            if (fallbackData.success && Array.isArray(fallbackData.properties)) {
              setProperties(fallbackData.properties)
            } else if (Array.isArray(fallbackData)) {
              setProperties(fallbackData)
            }
            setError(null)
          } else {
            throw new Error("Ambas rutas fallaron")
          }
        } catch (fallbackError) {
          setError("Error al cargar propiedades: " + error.message)
          setProperties([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const handleOperationTypeClick = async (operationType) => {
    console.log(`🏠 Filtro seleccionado: ${operationType}`)
    if (isLoading) {
      console.log("⏳ Ya hay una búsqueda en progreso...")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const newFilters = { ...filters, operation_type: operationType }
      setFilters(newFilters)

      const queryParams = new URLSearchParams()
      queryParams.append("operation_type", operationType)

      const url = `https://domuhouse-express.onrender.com/api/search/search?${queryParams.toString()}`
      console.log(`🔗 Fetching: ${url}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Error response: ${errorText}`)
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. Details: ${errorText}`)
      }

      const data = await response.json()
      console.log(`📊 Datos recibidos para ${operationType}:`, data)

      let propertiesToSet = []
      if (Array.isArray(data)) {
        propertiesToSet = data
      } else if (data && data.success && Array.isArray(data.properties)) {
        propertiesToSet = data.properties
      } else if (data && data.properties && Array.isArray(data.properties)) {
        propertiesToSet = data.properties
      } else if (data && data.data && Array.isArray(data.data)) {
        propertiesToSet = data.data
      } else if (data && data.results && Array.isArray(data.results)) {
        propertiesToSet = data.results
      } else {
        console.warn("❌ Formato de datos inesperado:", data)
        propertiesToSet = []
      }

      setProperties(propertiesToSet)

      if (propertiesToSet.length === 0) {
        console.warn(`⚠️ No se encontraron propiedades para ${operationType}`)
        setError(`No se encontraron propiedades en ${operationType.toLowerCase()}`)
      } else {
        console.log(`✅ ${propertiesToSet.length} propiedades encontradas para ${operationType}`)
        setError(null)
      }
    } catch (error) {
      console.error(`❌ Error al filtrar por ${operationType}:`, error)
      if (error.name === "AbortError") {
        setError("La búsqueda tardó demasiado tiempo. Intenta nuevamente.")
      } else if (error.message.includes("Failed to fetch")) {
        setError("Error de conexión. Verifica que el servidor esté funcionando en el puerto 10101.")
      } else if (error.message.includes("NetworkError")) {
        setError("Error de red. Verifica tu conexión a internet.")
      } else {
        setError(`Error al filtrar propiedades: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.target)
      const searchParams = {
        ...filters,
        price_max: priceRange,
      }

      if (formData.get("property_type")) searchParams.property_type = formData.get("property_type")
      if (formData.get("city")) searchParams.city = formData.get("city")
      if (formData.get("neighborhood")) searchParams.neighborhood = formData.get("neighborhood")

      if (showAdvanced) {
        if (formData.get("bedrooms_min")) searchParams.bedrooms_min = formData.get("bedrooms_min")
        if (formData.get("socioeconomic_stratum"))
          searchParams.socioeconomic_stratum = formData.get("socioeconomic_stratum")
        if (formData.get("bathrooms_min")) searchParams.bathrooms_min = formData.get("bathrooms_min")
        if (formData.get("parking_spaces")) searchParams.parking_spaces = formData.get("parking_spaces")
      }

      console.log("🔍 Parámetros de búsqueda:", searchParams)

      const queryParams = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value !== "") {
          queryParams.append(key, value.toString())
        }
      })

      const response = await fetch(`https://domuhouse-express.onrender.com/api/search/search?${queryParams}`)

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("Resultado de búsqueda:", data)

      if (Array.isArray(data)) {
        setProperties(data)
      } else if (data.success && Array.isArray(data.properties)) {
        setProperties(data.properties)
      } else {
        setProperties([])
        console.warn("Resultado de búsqueda vacío o formato inesperado:", data)
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error)
      setError("Error al realizar la búsqueda: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePropertyClick = (property) => {
    console.log("Propiedad seleccionada:", property)
    if (!property) {
      console.error("No se recibió ninguna propiedad")
      return
    }

    const propId = property.property_id || property.id

    if (!propId) {
      console.error("La propiedad no tiene un ID válido:", property)
      return
    }

    try {
      navigate(`/propiedad/${propId}`, {
        state: {
          property: property,
        },
      })
      console.log(`Navegando a /propiedad/${propId}`)
    } catch (error) {
      console.error("Error al navegar:", error)
      setError(`Error al abrir la propiedad: ${error.message}`)
    }
  }

  const handleFilterClick = (filterType, value) => {
    console.log(`🔧 Aplicando filtro: ${filterType} = ${value}`)
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
  }

  const resetFilters = async () => {
    console.log("🔄 Reseteando filtros...")
    setFilters({
      operation_type: "",
      property_type: "",
      city: "",
      neighborhood: "",
      keyword: "",
      bedrooms_min: "",
      bathrooms_min: "",
      parking_spaces: "",
      socioeconomic_stratum: "",
    })
    setPriceRange(500000000)
    setShowAdvanced(false)

    setIsLoading(true)
    try {
      // ✅ Usar la nueva ruta con imágenes
      const res = await fetch(`https://domuhouse-express.onrender.com/api/properties/with-images`)
      if (!res.ok) {
        // Fallback a la ruta original
        const fallbackRes = await fetch(`https://domuhouse-express.onrender.com/api/properties/approved`)
        if (!fallbackRes.ok) {
          throw new Error(`HTTP error! status: ${fallbackRes.status}`)
        }
        const fallbackData = await fallbackRes.json()
        if (fallbackData.success && Array.isArray(fallbackData.properties)) {
          setProperties(fallbackData.properties)
        } else if (Array.isArray(fallbackData)) {
          setProperties(fallbackData)
        } else {
          setProperties([])
        }
      } else {
        const data = await res.json()
        if (data.success && Array.isArray(data.properties)) {
          setProperties(data.properties)
        } else if (Array.isArray(data)) {
          setProperties(data)
        } else {
          setProperties([])
        }
      }
      setError(null)
    } catch (error) {
      console.error("Error al cargar propiedades:", error)
      setError("Error al cargar propiedades: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ FUNCIÓN PARA OBTENER LA IMAGEN PRINCIPAL DE LA PROPIEDAD
  const getPropertyImage = (property) => {
    // ✅ Priorizar los nuevos campos procesados por la API
    if (property.main_image_url) {
      return property.main_image_url
    }

    if (property.image_url) {
      return property.image_url
    }

    // ✅ Fallback: intentar extraer de los campos originales
    const possibleImageFields = [
      "image",
      "images",
      "main_image",
      "primary_image",
      "featured_image",
      "property_images",
      "photo_url",
      "picture_url",
    ]

    for (const field of possibleImageFields) {
      const imageValue = property[field]

      if (imageValue) {
        // Si es un string JSON, intentar parsearlo
        if (typeof imageValue === "string" && imageValue.trim() !== "") {
          try {
            const parsedImages = JSON.parse(imageValue)

            // Si es un array, tomar la primera imagen
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              return parsedImages[0]
            }

            // Si es un objeto con estructura normales/esféricas
            if (typeof parsedImages === "object") {
              if (parsedImages.normales && Array.isArray(parsedImages.normales) && parsedImages.normales.length > 0) {
                return parsedImages.normales[0]
              }
              if (
                parsedImages.esfericas &&
                Array.isArray(parsedImages.esfericas) &&
                parsedImages.esfericas.length > 0
              ) {
                return parsedImages.esfericas[0]
              }
            }
          } catch (parseError) {
            // Si no se puede parsear, asumir que es una URL directa
            if (imageValue.startsWith("http") || imageValue.startsWith("/")) {
              return imageValue
            }
          }
        }

        // Si es un array directamente
        if (Array.isArray(imageValue) && imageValue.length > 0) {
          return imageValue[0].url || imageValue[0].image_url || imageValue[0]
        }

        // Si es un objeto con url
        if (typeof imageValue === "object" && imageValue.url) {
          return imageValue.url
        }
      }
    }

    // Si no se encuentra ninguna imagen, devolver null para usar el fallback
    return null
  }

  return (
    <>
      <div
        className="relative h-[400px] xs:h-[450px] sm:h-[550px] md:h-[650px] lg:h-[750px] bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-4 sm:px-6 md:px-8 lg:px-12"
        style={{ backgroundImage: `url(${Casa2})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="relative z-10 w-full flex flex-col justify-center items-center">
          {/* Título principal */}
          <h1 className="font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 xs:mb-6 sm:mb-8 lg:mb-10 leading-tight">
            Encuentra Tu Lugar Ideal
          </h1>

          {/* Botones de tipo de operación */}
          <div className="flex flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!isLoading) {
                  console.log("🔥 Botón Venta clickado")
                  handleOperationTypeClick("Venta")
                }
              }}
              disabled={isLoading}
              className={`rounded-2xl px-4 xs:px-6 sm:px-8 lg:px-10 py-1.5 xs:py-2 text-xs xs:text-sm sm:text-base transition-all duration-300 ${
                filters.operation_type === "Venta"
                  ? "bg-[#2F8EAC] text-white border-2 border-[#2F8EAC] shadow-lg transform scale-105"
                  : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#2F8EAC] hover:scale-105"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}`}
            >
              {isLoading && filters.operation_type === "Venta" ? "Buscando..." : "Venta"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!isLoading) {
                  console.log("🔥 Botón Arriendo clickado")
                  handleOperationTypeClick("Arriendo")
                }
              }}
              disabled={isLoading}
              className={`rounded-2xl px-4 xs:px-6 sm:px-8 lg:px-10 py-1.5 xs:py-2 text-xs xs:text-sm sm:text-base transition-all duration-300 ${
                filters.operation_type === "Arriendo"
                  ? "bg-[#2F8EAC] text-white border-2 border-[#2F8EAC] shadow-lg transform scale-105"
                  : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#2F8EAC] hover:scale-105"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}`}
            >
              {isLoading && filters.operation_type === "Arriendo" ? "Buscando..." : "Arriendo"}
            </button>
          </div>

          {/* Formulario de búsqueda */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row bg-white rounded-xl xs:rounded-2xl lg:rounded-full shadow-xl 
                      px-2 xs:px-3 sm:px-5 md:px-6 lg:px-8 
                      py-2 xs:py-3 sm:py-4 md:py-5 
                      gap-2 xs:gap-3 sm:gap-4 lg:gap-6 
                      items-stretch lg:items-center 
                      w-[95%] xs:w-[90%] max-w-[1100px] mx-auto"
          >
            {/* Tipo de propiedad */}
            <div className="flex flex-col w-full lg:w-auto lg:min-w-[180px] lg:flex-1">
              <label className="text-xs text-gray-800 text-left ml-2 mb-1">Tipo</label>
              <select
                name="property_type"
                className="border-none bg-transparent focus:outline-none text-xs sm:text-sm text-gray-800 px-2"
                value={filters.property_type}
                onChange={(e) => handleFilterClick("property_type", e.target.value)}
              >
                <option value="">Todos</option>
                <option value="1">Casa</option>
                <option value="2">Apartamento</option>
                <option value="3">Finca</option>
                <option value="4">Local Comercial</option>
              </select>
            </div>

            {/* Ciudad */}
            <div className="flex flex-col w-full lg:w-auto lg:min-w-[150px] lg:flex-1">
              <label className="text-xs text-gray-800 text-left ml-2 mb-1">Ciudad</label>
              <input
                type="text"
                name="city"
                placeholder="Ingrese la Ciudad"
                className="border-none bg-transparent focus:outline-none focus:placeholder-gray-400 text-xs sm:text-sm text-gray-800 px-2"
                value={filters.city}
                onChange={(e) => handleFilterClick("city", e.target.value)}
              />
            </div>

            {/* Barrio */}
            <div className="flex flex-col w-full lg:w-auto lg:min-w-[150px] lg:flex-1">
              <label className="text-xs text-gray-800 text-left ml-2 mb-1">Barrio</label>
              <input
                type="text"
                name="neighborhood"
                placeholder="Ingrese el Barrio"
                className="border-none bg-transparent focus:outline-none focus:placeholder-gray-400 text-xs sm:text-sm text-gray-800 px-2"
                value={filters.neighborhood}
                onChange={(e) => handleFilterClick("neighborhood", e.target.value)}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
              <button
                type="button"
                onClick={toggleAdvanced}
                className="flex items-center justify-center gap-2 lg:gap-8 border border-[#2F8EAC] text-[#2F8EAC] whitespace-nowrap rounded-full px-4 sm:px-6 lg:px-10 py-2 text-sm hover:bg-[#2F8EAC] hover:text-white transition-all duration-300"
              >
                <span className="hidden sm:inline">Búsqueda avanzada</span>
                <span className="sm:hidden">Búsqueda Avanzada</span>
                <LuSettings2 className="text-lg lg:text-xl" />
              </button>

              <button
                type="submit"
                className="bg-[#2F8EAC] text-white rounded-full px-4 sm:px-6 lg:px-8 py-2 text-sm hover:bg-[#2F8EAC]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </form>
        </div>

        {/* Panel de Búsqueda Avanzada */}
        {showAdvanced && (
          <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 mb-4 z-10 mt-4 w-full max-w-sm sm:max-w-2xl lg:max-w-7xl mx-4 sm:mx-6 lg:mx-auto">
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-700 font-medium">Precio máximo: ${priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="650"
                max="500000000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number.parseInt(e.target.value))}
                className="w-full h-2 appearance-none bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-2">Habitaciones</label>
                <input
                  type="number"
                  name="bedrooms_min"
                  placeholder="Mínimo"
                  className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                  value={filters.bedrooms_min}
                  onChange={(e) => handleFilterClick("bedrooms_min", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-2">Baños</label>
                <input
                  type="number"
                  name="bathrooms_min"
                  placeholder="Mínimo"
                  className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                  value={filters.bathrooms_min}
                  onChange={(e) => handleFilterClick("bathrooms_min", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-2">Parqueaderos</label>
                <input
                  type="number"
                  name="parking_spaces"
                  placeholder="Mínimo"
                  className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                  value={filters.parking_spaces}
                  onChange={(e) => handleFilterClick("parking_spaces", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-2">Estrato</label>
                <select
                  name="socioeconomic_stratum"
                  className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                  value={filters.socioeconomic_stratum}
                  onChange={(e) => handleFilterClick("socioeconomic_stratum", e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="fixed top-16 xs:top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-3 xs:px-4 py-2 xs:py-3 rounded z-50 max-w-[90%] xs:max-w-md">
          <div className="flex items-center justify-between">
            <span className="text-xs xs:text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 xs:ml-4 text-red-900 hover:text-red-700 font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      <ChatDomu />

      {/* Sección de propiedades destacadas */}
      <section className="flex flex-col items-center gap-3 xs:gap-4 py-8 xs:py-10 sm:py-12 md:py-16">
        <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl text-[#2F8EAC] text-center font-medium">
          Propiedades Destacadas
        </h3>

        <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-center px-3 xs:px-4 sm:px-6 lg:px-8 leading-tight mb-4 xs:mb-6 sm:mb-8">
          Recomendaciones Para Ti
        </h2>

        {/* Indicador de filtro activo */}
        {filters.operation_type && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Mostrando propiedades en:</span>
            <span className="bg-[#2F8EAC] text-white px-3 py-1 rounded-full text-sm font-medium">
              {filters.operation_type}
            </span>
            <button onClick={resetFilters} className="text-sm text-[#2F8EAC] hover:underline ml-2">
              Ver todas
            </button>
          </div>
        )}

        {/* Listado de propiedades */}
        <div className="w-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-8 justify-items-center">
            {isLoading ? (
              <div className="text-center py-10 col-span-full">
                <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-[#2F8EAC] mx-auto mb-3 xs:mb-4"></div>
                <p className="text-sm xs:text-base text-gray-600">
                  {filters.operation_type
                    ? `Buscando propiedades en ${filters.operation_type.toLowerCase()}...`
                    : "Cargando propiedades..."}
                </p>
              </div>
            ) : properties.length > 0 ? (
              properties.map((property, index) => {
                const uniqueId = property.property_id || property.id || property.ID || `property-${index}`

                // ✅ LÓGICA CORREGIDA PARA EL NOMBRE DEL AGENTE
                const agentFullName =
                  property.agent_name?.trim() || // Primero intenta usar agent_name que viene de la BD
                  (property.name_person && property.last_name
                    ? `${property.name_person.trim()} ${property.last_name.trim()}`.trim()
                    : property.name_person?.trim() || property.last_name?.trim() || "Agente")

                // ✅ OBTENER LA IMAGEN DE LA PROPIEDAD
                const propertyImage = getPropertyImage(property)

                console.log("🔍 Debug propiedad:", {
                  property_id: property.property_id,
                  title: property.property_title,
                  agent_name: property.agent_name,
                  name_person: property.name_person,
                  last_name: property.last_name,
                  agentFullName: agentFullName,
                  propertyImage: propertyImage,
                  main_image_url: property.main_image_url,
                  image_url: property.image_url,
                  has_images: property.has_images,
                  image_count: property.image_count,
                })

                return (
                  <PropertyCard
                    key={uniqueId}
                    address={`${property.address || "Sin dirección"}, ${property.neighborhood || "Sin barrio"}, ${
                      property.city || "Sin ciudad"
                    }`}
                    title={property.property_title || property.title || "Sin título"}
                    rooms={property.bedrooms || property.habitaciones || 0}
                    bathrooms={property.bathrooms || property.banos || 0}
                    area={property.built_area || property.area || 0}
                    price={property.price ? property.price.toLocaleString() : "0"}
                    type={property.operation_type || property.tipo_operacion}
                    agentName={agentFullName} // ✅ Aquí se pasa el nombre correcto
                    imageUrl={propertyImage} // ✅ Aquí se pasa la imagen de la propiedad
                    onClick={() => {
                      console.log("🔍 Propiedad clickeada:", {
                        id: property.property_id,
                        agent_name: property.agent_name,
                        agentFullName: agentFullName,
                        image: propertyImage,
                      })
                      handlePropertyClick(property)
                    }}
                  />
                )
              })
            ) : (
              <div className="text-center py-8 xs:py-10 sm:py-12 col-span-full">
                <div className="text-gray-500 mb-2 text-3xl xs:text-4xl">📭</div>
                <p className="text-sm xs:text-base text-gray-600 mb-3 xs:mb-4">
                  {filters.operation_type
                    ? `No se encontraron propiedades en ${filters.operation_type.toLowerCase()}`
                    : "No se encontraron propiedades con los filtros aplicados"}
                </p>
                <button
                  onClick={resetFilters}
                  className="text-sm xs:text-base text-[#2F8EAC] hover:underline focus:outline-none"
                >
                  Ver todas las propiedades
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botón Ver Más */}
        <Button
          name="➡ Ver Más"
          className="bg-[#2F8EAC] border border-[#2F8EAC] text-white rounded-3xl px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 flex items-center gap-1 xs:gap-2 mt-6 xs:mt-8 sm:mt-10"
        />
      </section>
    </>
  )
}
