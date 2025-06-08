"use client"

import { useState, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Header } from "../../Layouts/Header/Header"

export const PropiedadSeleccionada = () => {
  const { state } = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()

  // Estado inicial
  const [property, setProperty] = useState(null)
  const [relatedProperties, setRelatedProperties] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [images, setImages] = useState([])

  // Función para obtener la propiedad
  const fetchProperty = async (propertyId) => {
    try {
      setLoading(true)
      setError(null)

      // Obtener datos de la propiedad
      const response = await fetch(`https://domuhouse.onrender.com/api/properties/${propertyId}`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Propiedad no encontrada`)
      }

      const data = await response.json()

      // Usar los datos tal como vienen de la API
      setProperty(data.property)
      await fetchPropertyImages(propertyId)
      fetchRelatedProperties(propertyId)
    } catch (error) {
      console.error("Error fetching property:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener imágenes de la propiedad
  const fetchPropertyImages = async (propertyId) => {
    try {
      const response = await fetch(`https://domuhouse.onrender.com/api/properties/${propertyId}/images`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Procesar las imágenes
      const processedImages = data.images
        .map((img) => {
          let imageUrl = img.url || img.image_url || img.path

          // Si la URL no es absoluta, construir la URL completa
          if (imageUrl && !imageUrl.startsWith("http")) {
            imageUrl = `http://localhost:10101${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`
          }

          return {
            id: img.id || `img-${Math.random().toString(36).substr(2, 9)}`,
            url: imageUrl,
            description: img.description || `Property image`,
            is_main: img.is_main || false,
          }
        })
        .filter((img) => img.url) // Filtra imágenes sin URL

      setImages(processedImages)
    } catch (error) {
      console.error("Error fetching images:", error)
      setImages([])
    }
  }

  // Función para obtener propiedades relacionadas
  const fetchRelatedProperties = async (propertyId) => {
    try {
      const response = await fetch(`https://domuhouse.onrender.com/api/properties/related/${propertyId}`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron cargar propiedades relacionadas`)
      }

      const data = await response.json()
      setRelatedProperties(data.properties || [])
    } catch (error) {
      console.error("Error fetching related properties:", error)
      setRelatedProperties([])
    }
  }

  useEffect(() => {
    console.log("PropiedadSeleccionada - state:", state)
    console.log("PropiedadSeleccionada - id:", id)

    // Si tenemos la propiedad del estado de navegación, usarla
    if (state?.property) {
      console.log("Usando propiedad del state:", state.property)
      setProperty(state.property)
      setLoading(false)

      // Cargar imágenes para la propiedad del estado
      const propId = state.property.property_id || state.property.id
      if (propId) {
        fetchPropertyImages(propId)
        fetchRelatedProperties(propId)
      }
    } else if (id) {
      // Si no tenemos la propiedad en el estado, cargarla desde la API
      console.log("Cargando propiedad desde API con ID:", id)
      fetchProperty(id)
    } else {
      setError("No se pudo identificar la propiedad")
      setLoading(false)
    }
  }, [id, state])

  // Función para obtener las imágenes a mostrar
  const getDisplayImages = () => {
    // Si tenemos imágenes de la base de datos, usarlas
    if (images.length > 0) {
      return images.map((img) => img.url)
    }

    // Si no hay imágenes de BD, usar fallback
    return [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ]
  }

  // Funciones para el carrusel
  const displayImages = getDisplayImages()
  const totalSlides = Math.ceil(displayImages.length / 3)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Función para manejar errores de carga de imágenes
  const handleImageError = (e, imageUrl, index) => {
    const fallbackImages = [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ]

    const fallbackIndex = index % fallbackImages.length
    e.target.src = fallbackImages[fallbackIndex]
    e.target.onerror = null // Evitar loops infinitos
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    if (!price || price === 0) return "Precio no disponible"

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Función para formatear área
  const formatArea = (area) => {
    if (!area) return "N/A"
    return `${area} m²`
  }

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Cargando propiedad...</h2>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-10">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            {error || "No se encontraron datos de la propiedad"}
          </h2>
          <p className="text-gray-500 mb-6">La propiedad que buscas no está disponible o no existe.</p>
          <button
            onClick={() => navigate("/properties")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver a propiedades
          </button>
        </div>
      </div>
    )
  }

  // Crear información del agente con valores por defecto
  const agentInfo = {
    name: property.agent_name || "Agente Inmobiliario",
    phone: property.agent_phone || "+57 300 000 0000",
    email: property.agent_email || "agente@inmobiliaria.com",
    initials: property.agent_name
      ? property.agent_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "AG",
  }

  return (
    <>
      <Header />

      <div className="h-8 bg-white"></div>

      <div className="max-w-7xl mx-auto px-5 py-8 bg-white min-h-screen">
        {/* Header con información de la propiedad */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 mb-4">
                {property.property_title || property.title || "Propiedad sin título"}
              </h1>

              {/* Información básica */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <span>🛏️</span>
                  <span>{property.bedrooms || 0} habitaciones</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🚿</span>
                  <span>{property.bathrooms || 0} baños</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📐</span>
                  <span>{formatArea(property.built_area || property.total_area)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🏠</span>
                  <span>{property.property_type || "Casa"}</span>
                </div>
                {property.parking_spaces > 0 && (
                  <div className="flex items-center gap-1">
                    <span>🚗</span>
                    <span>{property.parking_spaces} parqueaderos</span>
                  </div>
                )}
              </div>

              {/* Información de ubicación */}
              {(property.address || property.neighborhood || property.city) && (
                <div className="text-sm text-gray-600 mb-2">
                  📍 {[property.address, property.neighborhood, property.city].filter(Boolean).join(", ")}
                </div>
              )}

              {/* Badges de estado */}
              <div className="flex gap-4 text-sm">
                {property.operation_type && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{property.operation_type}</span>
                )}
                {property.socioeconomic_stratum && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Estrato {property.socioeconomic_stratum}
                  </span>
                )}
                {property.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      property.status === "Disponible" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {property.status}
                  </span>
                )}
              </div>
            </div>

            {/* Precio */}
            <div className="flex flex-col items-end">
              <div className="text-3xl lg:text-4xl font-bold text-black">{formatPrice(property.price)}</div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="w-full h-0.5 bg-gray-200"></div>
        </div>

        {/* Carrusel de imágenes */}
        <div className="relative w-full h-96 lg:h-[500px] mb-12 rounded-xl overflow-hidden shadow-xl">
          {/* Indicador de número de imágenes */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm z-20">
            📷 {displayImages.length} {displayImages.length === 1 ? "imagen" : "imágenes"}
          </div>

          {/* Contenedor principal del carrusel */}
          <div className="relative w-full h-full bg-gray-100">
            <div
              className="flex transition-transform duration-300 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Generar slides agrupando imágenes de 3 en 3 */}
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="min-w-full h-full flex gap-2 p-2">
                  {displayImages.slice(slideIndex * 3, slideIndex * 3 + 3).map((imageUrl, imageIndex) => {
                    const globalIndex = slideIndex * 3 + imageIndex
                    return (
                      <div key={globalIndex} className="flex-1 h-full relative">
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Imagen ${globalIndex + 1} de la propiedad`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => handleImageError(e, imageUrl, globalIndex)}
                          loading={globalIndex < 3 ? "eager" : "lazy"}
                        />

                        {/* Overlay con información de la imagen */}
                        {images[globalIndex] && (
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            {images[globalIndex].is_main ? "⭐ Principal" : `📸 ${globalIndex + 1}`}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Rellenar espacios vacíos si no hay suficientes imágenes */}
                  {displayImages.slice(slideIndex * 3, slideIndex * 3 + 3).length < 3 &&
                    Array.from(
                      {
                        length: 3 - displayImages.slice(slideIndex * 3, slideIndex * 3 + 3).length,
                      },
                      (_, emptyIndex) => (
                        <div
                          key={`empty-${slideIndex}-${emptyIndex}`}
                          className="flex-1 h-full bg-gray-200 rounded-lg flex items-center justify-center"
                        >
                          <div className="text-center text-gray-400">
                            <div className="text-4xl mb-2">🖼️</div>
                            <span className="text-sm">Sin imagen</span>
                          </div>
                        </div>
                      ),
                    )}
                </div>
              ))}
            </div>

            {/* Controles de navegación */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={previousSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={24} className="text-gray-700" />
                </button>

                {/* Indicadores de slide */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide ? "bg-white shadow-lg" : "bg-white bg-opacity-50 hover:bg-opacity-75"
                      }`}
                      aria-label={`Ir al slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mensaje si no hay imágenes */}
          {displayImages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🖼️</div>
                <p>No hay imágenes disponibles</p>
              </div>
            </div>
          )}
        </div>

        {/* Grid principal - Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sección izquierda - Descripción y detalles */}
          <div className="lg:col-span-2 space-y-10">
            {/* Descripción */}
            <div className="bg-white p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Descripción</h2>

              <div className="w-16 h-0.5 bg-gray-200 mb-6"></div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {property.description ||
                  "Esta hermosa propiedad ofrece una experiencia de vida excepcional con acabados de primera calidad y ubicación privilegiada. Perfecta para familias que buscan confort, elegancia y funcionalidad en cada espacio."}
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">Características Generales</h3>

              <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>

              {/* Grid de características */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{property.bedrooms || 0}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Habitaciones</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{property.bathrooms || 0}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Baños</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{property.parking_spaces || 0}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Parqueaderos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {property.built_area || property.total_area || 0}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">M² Construidos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {property.total_area || property.built_area || 0}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">M² Totales</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-lg font-bold text-blue-600">{property.property_type || "Casa"}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Tipo</div>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ubicación</h2>

              <div className="w-16 h-0.5 bg-gray-200 mb-6"></div>

              <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  className="w-full h-full"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    property.address ||
                      [property.city, property.neighborhood].filter(Boolean).join(" ") ||
                      "Bogotá, Colombia",
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  loading="lazy"
                  title="Ubicación de la propiedad"
                />
              </div>

              {/* Información adicional de ubicación */}
              {(property.address || property.neighborhood || property.city) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">📍 Dirección</h4>
                  <p className="text-gray-700">
                    {[property.address, property.neighborhood, property.city].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sección derecha - Contacto y propiedades destacadas */}
          <div className="space-y-8">
            {/* Agente de contacto */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Contactar Agente</h2>

              <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  {agentInfo.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{agentInfo.name}</h3>
                  <div className="text-sm text-gray-600 flex items-center gap-1">📞 {agentInfo.phone}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">✉️ {agentInfo.email}</div>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/contact-agent", {
                    state: {
                      agent: agentInfo,
                      property: property,
                    },
                  })
                }
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Contactar Agente →
              </button>
            </div>

            {/* Propiedades relacionadas */}
            {relatedProperties.length > 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Propiedades Similares</h2>

                <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>

                <div className="space-y-4">
                  {relatedProperties.map((prop, index) => (
                    <div
                      key={prop.id || prop.property_id || index}
                      className="flex gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
                      onClick={() => navigate(`/property/${prop.id || prop.property_id}`)}
                    >
                      <img
                        src={prop.images?.[0]?.url || `https://picsum.photos/80/60?random=${index + 100}`}
                        alt={prop.title || prop.property_title}
                        className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60&q=80`
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                          {prop.title || prop.property_title || `Propiedad ${index + 1}`}
                        </h4>
                        <div className="flex gap-3 text-xs text-gray-500 mb-2">
                          <span>🛏️ {prop.bedrooms || 0}</span>
                          <span>🚿 {prop.bathrooms || 0}</span>
                          <span>📐 {formatArea(prop.built_area || prop.total_area)}</span>
                        </div>
                        <div className="text-sm font-bold text-green-600">{formatPrice(prop.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional si no hay propiedades relacionadas */}
            {relatedProperties.length === 0 && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                <div className="text-4xl mb-2">🏠</div>
                <p className="text-sm text-gray-600">No hay propiedades similares disponibles en este momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
