"use client"

import { useState, useEffect } from "react"
import Casa from "../../../assets/images/casLujo2.jpg"
import { LuSettings2 } from "react-icons/lu"
import { ChatDomu } from "../../UI/ChatDomu/ChatDomu"
import { Button } from "../../UI/Button/Button"
import "../../../App"

const PropertyCard = ({ address, title, rooms, bathrooms, area, price, agentName, onClick }) => {
    return (
        <div
            className="bg-white flex flex-col rounded-2xl 
                        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-100
                        shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <div
                className="relative w-full 
                            h-40 sm:h-44 md:h-48 lg:h-52"
            >
                <img src={Casa || "/placeholder.svg"} alt="Propiedad" className="w-full h-full object-cover" />
                <div
                    className="absolute bottom-0 left-0 w-full text-white 
                                text-xs sm:text-sm
                                px-2 sm:px-4 py-1 sm:py-2"
                >
                    <span className="drop-shadow-lg">{address}</span>
                </div>
            </div>

            <div
                className="px-3 sm:px-4 
                            pt-2 sm:pt-2 
                            pb-3 sm:pb-4"
            >
                <h2
                    className="text-sm sm:text-base lg:text-lg 
                               font-semibold text-gray-800 
                               mb-2 sm:mb-3 
                               line-clamp-2"
                >
                    {title}
                </h2>

                <div
                    className="flex flex-col sm:flex-row sm:items-center 
                                text-gray-600 
                                text-xs sm:text-sm
                                gap-1 sm:gap-4 
                                mb-3 sm:mb-4"
                >
                    <span className="flex items-center gap-1">
                        Cuartos: <strong>{rooms}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                        Baños: <strong>{bathrooms}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                        m²: <strong>{area}</strong>
                    </span>
                </div>

                <hr className="my-2" />

                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                                mt-3 sm:mt-4 
                                gap-2 sm:gap-0"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src="/api/placeholder/32/32"
                            alt={agentName}
                            className="w-6 h-6 sm:w-8 sm:h-8 
                                       rounded-full object-cover"
                        />
                        <span className="text-xs sm:text-sm text-gray-800 truncate">{agentName}</span>
                    </div>
                    <span
                        className="text-sm sm:text-base 
                                     font-semibold text-gray-900"
                    >
                        ${price}
                    </span>
                </div>
            </div>
        </div>
    )
}

export const Main = () => {
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

    // Cargar propiedades iniciales
    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true)
            try {
                const res = await fetch("http://localhost:10101/api/propiedades/aprobadas")
                const data = await res.json()
                setProperties(data)
                setError(null)
            } catch (error) {
                console.error("Error al cargar propiedades:", error)
                setError("Error al cargar propiedades")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProperties()
    }, [])

    // Manejar búsqueda
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

            // Agregar campos del formulario básico
            if (formData.get("property_type")) searchParams.property_type = formData.get("property_type")
            if (formData.get("city")) searchParams.city = formData.get("city")
            if (formData.get("neighborhood")) searchParams.neighborhood = formData.get("neighborhood")

            // Agregar campos avanzados si están visibles
            if (showAdvanced) {
                if (formData.get("bedrooms_min")) searchParams.bedrooms_min = formData.get("bedrooms_min")
                if (formData.get("socioeconomic_stratum"))
                    searchParams.socioeconomic_stratum = formData.get("socioeconomic_stratum")
                if (formData.get("bathrooms_min")) searchParams.bathrooms_min = formData.get("bathrooms_min")
                if (formData.get("parking_spaces")) searchParams.parking_spaces = formData.get("parking_spaces")
            }

            // Construir query params
            const queryParams = new URLSearchParams()
            Object.entries(searchParams).forEach(([key, value]) => {
                if (value && value !== "") {
                    queryParams.append(key, value.toString())
                }
            })

            const response = await fetch(`http://localhost:10101/search?${queryParams}`)
            const data = await response.json()
            setProperties(data)
        } catch (error) {
            console.error("Error en la búsqueda:", error)
            setError("Error al realizar la búsqueda")
        } finally {
            setIsLoading(false)
        }
    }

    // Manejar clic en propiedad
    const handlePropertyClick = (propertyId) => {
        console.log("Propiedad seleccionada:", propertyId)
    }

    // Manejar filtros de botones
    const handleFilterClick = (filterType, value) => {
        setFilters((prev) => ({ ...prev, [filterType]: value }))
    }

    return (
        <>
            <div
                className="relative 
                            h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]
                            bg-cover bg-center flex flex-col justify-center items-center text-white text-center
                            px-4 sm:px-6 md:px-8 lg:px-12"
                style={{ backgroundImage: "url('/src/assets/images/Casa2.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/30 z-0"></div>

                <div className="relative z-10 w-full flex flex-col justify-center items-center">
                    <h1
                        className="font-bold 
                                   text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                                   mb-6 sm:mb-8 lg:mb-10
                                   leading-tight"
                    >
                        Encuentra Tu Lugar Ideal
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <Button
                            name="Venta"
                            className={`rounded-2xl 
                                        px-6 sm:px-8 lg:px-10 
                                        py-2 
                                        text-sm sm:text-base
                                        transition-all duration-300" ${filters.operation_type === "Venta" 
                                        ? 'bg-[#2F8EAC] text-white' 
                                        : 'bg-transparent border border-white text-white'
                                }`}
                            onClick={() => handleFilterClick("operation_type", "Venta")}
                        />
                        <Button
                            name="Arriendo"
                            className={`rounded-2xl 
                                        px-6 sm:px-8 lg:px-10 
                                        py-2 
                                        text-sm sm:text-base
                                        transition-all duration-300 ${filters.operation_type === "Arriendo"
                                        ? 'bg-[#2F8EAC] text-white' 
                                        : 'bg-transparent border border-white text-white'
                                }`}
                            onClick={() => handleFilterClick("operation_type", "Arriendo")}
                        />
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col lg:flex-row 
                                     bg-white rounded-2xl lg:rounded-full 
                                     shadow-xl
                                     px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10
                                     py-3 xs:py-4 sm:px-5 md:py-6
                                     gap-3 xs:gap-4 md:gap-5 lg:gap-6
                                     items-stretch lg:items-center
                                     w-[85%]
                                     max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl
                                     mx-auto
                "

                    >
                        <div className="flex flex-col w-full lg:w-auto lg:min-w-[120px]">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Tipo</label>
                            <select
                                name="property_type"
                                className="border-none bg-transparent focus:outline-none 
                                           text-sm text-gray-800 px-2"
                                defaultValue=""
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

                        <div className="flex flex-col w-full lg:w-auto lg:min-w-[150px]">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Ingrese la Ciudad"
                                className="border-none bg-transparent focus:outline-none focus:placeholder-gray-400 
                                           text-sm text-gray-800 px-2"
                                value={filters.city}
                                onChange={(e) => handleFilterClick("city", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-full lg:w-auto lg:min-w-[150px]">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Barrio</label>
                            <input
                                type="text"
                                name="neighborhood"
                                placeholder="Ingrese el Barrio"
                                className="border-none bg-transparent focus:outline-none focus:placeholder-gray-400 
                                           text-sm text-gray-800 px-2"
                                value={filters.neighborhood}
                                onChange={(e) => handleFilterClick("neighborhood", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                            <button
                                type="button"
                                onClick={toggleAdvanced}
                                className="flex items-center justify-center 
                                           gap-2 lg:gap-8
                                           border border-[#2F8EAC] text-[#2F8EAC] 
                                           whitespace-nowrap rounded-full 
                                           px-4 sm:px-6 lg:px-10
                                           py-2 
                                           text-sm
                                           hover:bg-[#2F8EAC] hover:text-white
                                           transition-all duration-300"
                            >
                                <span className="hidden sm:inline">Búsqueda avanzada</span>
                                <span className="sm:hidden">Búsqueda Avanzada</span>
                                <LuSettings2 className="text-lg lg:text-xl" />
                            </button>

                            <button
                                type="submit"
                                className="bg-[#2F8EAC] text-white rounded-full 
                                           px-4 sm:px-6 lg:px-8
                                           py-2 
                                           text-sm
                                           hover:bg-[#2F8EAC]/90
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? "Buscando..." : "Buscar"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Panel de Búsqueda Avanzada */}
                {showAdvanced && (
                    <div
                        className="bg-white shadow-xl rounded-2xl 
                                    p-4 sm:p-6 
                                    mb-4 z-10 mt-4 
                                    w-full max-w-sm sm:max-w-2xl lg:max-w-7xl
                                    mx-4 sm:mx-6 lg:mx-auto"
                    >
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
                                className="w-full h-2 appearance-none bg-gray-200 rounded-lg accent-teal-600 cursor-pointer"
                            />
                        </div>

                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                                        gap-4 sm:gap-6
                                        mb-4 sm:mb-6"
                        >
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-600 mb-2">Habitaciones</label>
                                <input
                                    type="number"
                                    name="bedrooms_min"
                                    placeholder="Mínimo"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 
                                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 
                                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 
                                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    value={filters.parking_spaces}
                                    onChange={(e) => handleFilterClick("parking_spaces", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-gray-600 mb-2">Estrato</label>
                                <select
                                    name="socioeconomic_stratum"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 
                                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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

            {error && (
                <div
                    className="fixed 
                                top-16 sm:top-20 
                                left-1/2 transform -translate-x-1/2 
                                bg-red-100 border border-red-400 text-red-700 
                                px-4 py-3 rounded-lg shadow-lg
                                z-50 
                                mx-4 sm:mx-6
                                text-sm
                                max-w-sm sm:max-w-md"
                >
                    {error}
                </div>
            )}

            <ChatDomu />

            <section
                className="flex flex-col items-center 
                                gap-4 sm:gap-6 lg:gap-8
                                mx-4 sm:mx-6 lg:mx-12 xl:mx-16
                                my-8 sm:my-12 lg:my-15"
            >
                <h3
                    className="text-lg sm:text-xl lg:text-2xl 
                               text-[#2F8EAC] text-center font-medium"
                >
                    Propiedades Destacadas
                </h3>
                <h2
                    className="text-2xl sm:text-3xl lg:text-4xl 
                               font-bold text-center 
                               px-4 sm:px-6 lg:px-8
                               leading-tight"
                >
                    Recomendaciones Para Ti
                </h2>

                <div
                    className="px-4 sm:px-6 lg:px-10 xl:px-20 
                                py-6 sm:py-8 lg:py-10
                                w-full"
                >
                    <div
                        className="grid 
                                    grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
                                    gap-4 sm:gap-6 lg:gap-8
                                    justify-items-center"
                    >
                        {isLoading ? (
                            <div
                                className="col-span-full text-center 
                                            py-8 sm:py-10 lg:py-12
                                            text-sm sm:text-base lg:text-lg"
                            >
                                Cargando propiedades...
                            </div>
                        ) : properties.length > 0 ? (
                            properties.map((property) => (
                                <PropertyCard
                                    key={property.property_id}
                                    address={`${property.address}, ${property.neighborhood}, ${property.city}`}
                                    title={property.property_title}
                                    rooms={property.bedrooms}
                                    bathrooms={property.bathrooms}
                                    area={property.built_area}
                                    price={property.price}
                                    agentName={property.agent_name || "Jane Doe"}
                                    onClick={() => handlePropertyClick(property.property_id)}
                                />
                            ))
                        ) : (
                            <div
                                className="col-span-full text-center 
                                            py-8 sm:py-10 lg:py-12
                                            text-sm sm:text-base lg:text-lg
                                            px-4 sm:px-6 lg:px-8"
                            >
                                No se encontraron propiedades con los filtros aplicados
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    name="➡ Ver Más"
                    className="bg-[#2F8EAC] border border-[#2F8EAC] text-white rounded-3xl 
                               px-4 sm:px-6 lg:px-8
                               py-2 sm:py-2.5 lg:py-3
                               flex items-center gap-2 
                               text-sm sm:text-base lg:text-lg
                               hover:bg-[#2F8EAC]/90 hover:shadow-lg
                               transition-all duration-300"
                />
            </section>
        </>
    )
}
