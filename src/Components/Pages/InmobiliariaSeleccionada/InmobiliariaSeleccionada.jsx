"use client"
import React from "react"
import { Header } from "../../Layouts/Header/Header"
import { PropertyCard } from "../../Layouts/PropertyCard/PropertyCard"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Phone, Mail, MapPin, Building } from "lucide-react"

export const InmobiliariaSeleccionada = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { realEstate } = location.state || {}

  // Estados para manejar las propiedades del backend
  const [properties, setProperties] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  // Función para obtener las iniciales del agente
  const getAgentInitials = (name) => {
    if (!name || name.trim() === "" || name === "Agente") return "AD"
    return name
      .trim()
      .split(" ")
      .filter((n) => n.length > 0) // Filtrar espacios vacíos
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  // Función para obtener información del agente principal
  const getMainAgent = () => {
    if (properties.length === 0) return null
    // Tomar el primer agente disponible o el más frecuente
    const agentCounts = {}
    properties.forEach((property) => {
      const agentKey = `${property.agent_name} ${property.agent_lastname}`
      agentCounts[agentKey] = (agentCounts[agentKey] || 0) + 1
    })

    // Encontrar el agente con más propiedades
    const mainAgentName = Object.keys(agentCounts).reduce((a, b) => (agentCounts[a] > agentCounts[b] ? a : b))

    // Encontrar la información completa del agente principal
    const mainAgentProperty = properties.find(
      (property) => `${property.agent_name} ${property.agent_lastname}` === mainAgentName,
    )

    return {
      name: mainAgentName,
      phone: mainAgentProperty.agent_phone,
      email: mainAgentProperty.agent_email,
      initials: getAgentInitials(mainAgentName),
    }
  }

  // useEffect para cargar propiedades desde el backend
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `http://localhost:10101/api/inmobiliarias/admin/${realEstate.person_id}/properties`,
        )
        if (!response.ok) throw new Error("No se encontraron propiedades para esta inmobiliaria.")
        const data = await response.json()
        setProperties(data)
      } catch (err) {
        console.error("Error al cargar propiedades:", err)
        setError(err.message || "Error al obtener propiedades.")
      } finally {
        setLoading(false)
      }
    }

    if (realEstate) {
      fetchProperties()
    }
  }, [realEstate])

  // Función actualizada para manejar el click en propiedades
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

  const handleBackClick = () => {
    navigate("/inmobiliarias")
  }

  // Obtener información del agente principal
  const mainAgent = getMainAgent()

  // Manejo de estados de loading y error
  if (loading)
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        </div>
      </>
    )

  if (error)
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="text-red-600" size={32} />
            </div>
            <p className="text-red-600 text-lg font-medium mb-2">Error al cargar propiedades</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </>
    )

  if (!realEstate) {
    navigate("/inmobiliarias")
    return null
  }

  return (
    <>
      <Header />
      <div className="px-6 md:px-10 lg:px-20 py-10">
        {/* Botón de regreso */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-sky-600 hover:text-sky-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a Inmobiliarias</span>
        </button>

        {/* Información de la inmobiliaria */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Info principal */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center">
                  <Building className="text-sky-600" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{realEstate.name}</h1>
                  <p className="text-sky-600 font-medium">{properties.length} propiedades disponibles</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{realEstate.description}</p>
            </div>

            {/* Columna derecha - Información de contacto */}
            <div className="bg-sky-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                {/* Mostrar información del agente si está disponible */}
                {mainAgent ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#2F8EAC] to-[#1e6b7a] flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
                        {mainAgent.initials}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Agente Principal</p>
                        <p className="font-medium text-gray-800">{mainAgent.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-sky-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono del Agente</p>
                        <p className="font-medium text-gray-800">{mainAgent.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-sky-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Correo del Agente</p>
                        <p className="font-medium text-gray-800">{mainAgent.email}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Mostrar información del administrador si no hay agentes */
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#2F8EAC] to-[#1e6b7a] flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
                      {getAgentInitials(realEstate.administrator)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Persona Encargada</p>
                      <p className="font-medium text-gray-800">{realEstate.administrator}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="text-sky-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium text-gray-800">{realEstate.address}</p>
                    <p className="text-sm text-gray-500">Armenia, Quindío</p>
                  </div>
                </div>
                {/* Información general de la inmobiliaria */}
                <div className="flex items-center gap-3">
                  <Phone className="text-sky-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono Inmobiliaria</p>
                    <p className="font-medium text-gray-800">{realEstate.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-sky-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Correo Inmobiliaria</p>
                    <p className="font-medium text-gray-800">{realEstate.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Título de propiedades */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Propiedades Disponibles</h2>
          <p className="text-gray-600">Explora todas las propiedades que {realEstate.name} tiene para ofrecerte</p>
        </div>

        {/* Mensaje si no hay propiedades */}
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades disponibles</h3>
            <p className="text-gray-500">Esta inmobiliaria no tiene propiedades registradas en este momento.</p>
          </div>
        ) : (
          <>
            {/* Grid de propiedades usando PropertyCard */}
            <div className="flex flex-wrap justify-center gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.property_id}
                  address={`${property.city}, ${property.neighborhood}`}
                  title={property.property_title}
                  rooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.built_area}
                  price={Number.parseFloat(property.price).toLocaleString("es-CO")}
                  agentName={`${property.agent_name} ${property.agent_lastname}`}
                  image={getAgentInitials(`${property.agent_name} ${property.agent_lastname}`)}
                  onClick={() => handlePropertyClick(property)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
