import React, { useState, useEffect } from 'react';
import LogoRobot from '../../../assets/images/robot.png';
import Casa from '../../../assets/images/casLujo2.jpg';
import { LuSettings2 } from "react-icons/lu";
import { ChatDomu } from '../../UI/ChatDomu/ChatDomu';
import { Button } from '../../UI/Button/Button';
import { useNavigate } from 'react-router-dom';
import "../../../App";

const PropertyCard = ({ address, title, rooms, bathrooms, area, price, type, agentName, onClick }) => {
    // Función para obtener el color y texto de la etiqueta según el tipo
    const getOperationStyle = (operationType) => {
        switch(operationType?.toLowerCase()) {
            case 'venta':
                return { bg: 'bg-green-500', text: 'En Venta' };
            case 'arriendo':
            case 'alquiler':
                return { bg: 'bg-blue-500', text: 'En Alquiler' };
            default:
                return { bg: 'bg-green-500', text: 'En Venta' };
        }
    };

    const operationStyle = getOperationStyle(type);

    return (
        <div className='bg-white flex flex-col rounded-2xl w-80 shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300' onClick={onClick}>
            <div className="relative w-full h-48">
                <img
                    src={Casa}
                    alt="Propiedad"
                    className="w-full h-full object-cover"
                />
                {/* Etiqueta de tipo de operación */}
                <div className={`absolute top-3 right-3 ${operationStyle.bg} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                    {operationStyle.text}
                </div>
                {/* Overlay con dirección */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-sm px-4 py-3">
                    <span className="font-medium">{address}</span>
                </div>
            </div>

            <div className="px-5 py-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
                
                <div className="flex items-center text-gray-600 text-sm gap-6 mb-4">
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
                
                <hr className="border-gray-200 mb-4" />
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2F8EAC] to-[#1e6b7a] flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {agentName ? agentName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'AG'}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{agentName}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">${price}</span>
                </div>
            </div>
        </div>
    );
};

export const Main = () => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [priceRange, setPriceRange] = useState(250000000);
    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        operation_type: '',
        property_type: '',
        city: '',
        neighborhood: '',
        keyword: '',
        bedrooms_min: '',
        bathrooms_min: '',
        parking_spaces: '',
        socioeconomic_stratum: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleAdvanced = () => setShowAdvanced(!showAdvanced);

    // Cargar propiedades iniciales
    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            try {
                // ✅ CORREGIDO: Usando la ruta que SÍ existe
                const res = await fetch('http://localhost:10101/api/properties');
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                console.log('Datos recibidos:', data);
                
                // El controlador devuelve { success: true, count: X, properties: [...] }
                if (data.success && data.properties) {
                    setProperties(data.properties);
                } else if (Array.isArray(data)) {
                    // Por si acaso devuelve directamente el array
                    setProperties(data);
                } else {
                    console.warn('Formato de datos inesperado:', data);
                    setProperties([]);
                }
                
                setError(null);
            } catch (error) {
                console.error("Error al cargar propiedades:", error);
                setError("Error al cargar propiedades: " + error.message);
                setProperties([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // ✅ FUNCIÓN DE BÚSQUEDA COMPLETAMENTE CORREGIDA
    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.target);
            
            // ✅ Construir parámetros de búsqueda usando filtros en memoria
            const searchParams = new URLSearchParams();
            
            // Agregar operation_type desde filtros
            if (filters.operation_type) {
                searchParams.append('operation_type', filters.operation_type);
            }
            
            // Agregar property_type desde filtros
            if (filters.property_type) {
                searchParams.append('property_type', filters.property_type);
            }
            
            // Agregar campos del formulario
            const city = formData.get('city') || filters.city;
            if (city) searchParams.append('city', city);
            
            const neighborhood = formData.get('neighborhood') || filters.neighborhood;
            if (neighborhood) searchParams.append('neighborhood', neighborhood);
            
            // Agregar precio máximo
            if (priceRange && priceRange > 0) {
                searchParams.append('price_max', priceRange.toString());
            }
            
            // Agregar campos avanzados si están visibles
            if (showAdvanced) {
                const bedrooms = formData.get('bedrooms_min') || filters.bedrooms_min;
                if (bedrooms) searchParams.append('bedrooms_min', bedrooms);
                
                const bathrooms = formData.get('bathrooms_min') || filters.bathrooms_min;
                if (bathrooms) searchParams.append('bathrooms_min', bathrooms);
                
                const parking = formData.get('parking_spaces') || filters.parking_spaces;
                if (parking) searchParams.append('parking_spaces', parking);
                
                const stratum = formData.get('socioeconomic_stratum') || filters.socioeconomic_stratum;
                if (stratum) searchParams.append('socioeconomic_stratum', stratum);
            }

            console.log('🔍 Parámetros de búsqueda:', searchParams.toString());

            // ✅ PROBLEMA PRINCIPAL CORREGIDO: Usar ruta que existe
            let searchUrl = 'http://localhost:10101/api/properties';
            
            // Si hay parámetros de búsqueda, intentar filtrar del lado del cliente
            // O usar la ruta de propiedades por tipo si solo se busca por tipo
            if (filters.property_type && !city && !neighborhood && !priceRange) {
                searchUrl = `http://localhost:10101/api/properties/type/${filters.property_type}`;
            } else if (searchParams.toString()) {
                // Si tienes búsqueda avanzada, usar todas las propiedades y filtrar del lado del cliente
                searchUrl = 'http://localhost:10101/api/properties';
            }

            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Respuesta de búsqueda:', data);
            
            let filteredProperties = [];
            
            if (data.success && data.properties) {
                filteredProperties = data.properties;
            } else if (Array.isArray(data)) {
                filteredProperties = data;
            } else {
                filteredProperties = [];
            }

            // ✅ FILTRADO DEL LADO DEL CLIENTE (temporal hasta que tengas búsqueda avanzada en backend)
            if (searchParams.toString() && searchUrl.includes('/api/properties') && !searchUrl.includes('/type/')) {
                filteredProperties = filteredProperties.filter(property => {
                    let matches = true;
                    
                    // Filtrar por operation_type
                    if (filters.operation_type && property.operation_type !== filters.operation_type) {
                        matches = false;
                    }
                    
                    // Filtrar por city
                    const searchCity = city || filters.city;
                    if (searchCity && !property.city?.toLowerCase().includes(searchCity.toLowerCase())) {
                        matches = false;
                    }
                    
                    // Filtrar por neighborhood
                    const searchNeighborhood = neighborhood || filters.neighborhood;
                    if (searchNeighborhood && !property.neighborhood?.toLowerCase().includes(searchNeighborhood.toLowerCase())) {
                        matches = false;
                    }
                    
                    // Filtrar por precio máximo
                    if (priceRange && property.price > priceRange) {
                        matches = false;
                    }
                    
                    // Filtros avanzados
                    if (showAdvanced) {
                        const bedroomsMin = parseInt(formData.get('bedrooms_min') || filters.bedrooms_min || '0');
                        if (bedroomsMin > 0 && property.bedrooms < bedroomsMin) {
                            matches = false;
                        }
                        
                        const bathroomsMin = parseInt(formData.get('bathrooms_min') || filters.bathrooms_min || '0');
                        if (bathroomsMin > 0 && property.bathrooms < bathroomsMin) {
                            matches = false;
                        }
                        
                        const parkingMin = parseInt(formData.get('parking_spaces') || filters.parking_spaces || '0');
                        if (parkingMin > 0 && property.parking_spaces < parkingMin) {
                            matches = false;
                        }
                        
                        const stratumFilter = parseInt(formData.get('socioeconomic_stratum') || filters.socioeconomic_stratum || '0');
                        if (stratumFilter > 0 && property.socioeconomic_stratum !== stratumFilter) {
                            matches = false;
                        }
                    }
                    
                    return matches;
                });
            }
            
            console.log(`✅ Propiedades filtradas: ${filteredProperties.length}`);
            setProperties(filteredProperties);
            
        } catch (error) {
            console.error("❌ Error en la búsqueda:", error);
            setError("Error al realizar la búsqueda: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar clic en propiedad
    const handlePropertyClick = (property) => {
    // Transformar los datos de la API al formato que espera PropiedadSeleccionada
    const transformedProperty = {
        id: property.property_id,
        property_id: property.property_id,
        title: property.property_title || property.title,
        property_title: property.property_title,
        address: property.address,
        city: property.city,
        neighborhood: property.neighborhood,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        built_area: property.built_area,
        total_area: property.total_area || property.built_area,
        price: property.price,
        operation_type: property.operation_type,
        property_type: property.property_type_name || property.property_type,
        socioeconomic_stratum: property.socioeconomic_stratum,
        parking_spaces: property.parking_spaces || 0,
        description: property.description || `Hermosa ${property.property_type_name || 'propiedad'} ubicada en ${property.neighborhood}, ${property.city}. Esta propiedad cuenta con ${property.bedrooms} habitaciones, ${property.bathrooms} baños y ${property.built_area}m² construidos.`,
        status: property.status || 'Disponible',
        images: property.images || [], // Si tu API devuelve imágenes
        agentInfo: {
            name: property.agent_name || 'Agente Inmobiliario',
            phone: property.agent_phone || '+57 300 000 0000',
            email: property.agent_email || 'agente@inmobiliaria.com',
            initials: property.agent_name ? 
                property.agent_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 
                'AG',
            whatsapp: property.agent_phone || property.agent_whatsapp || '+57 300 000 0000'
        }
    };
    
    console.log('Navegando a propiedad:', transformedProperty);
    navigate('/propiedad-seleccionada', { state: { property: transformedProperty } });
};

    // Manejar filtros de botones
    const handleFilterClick = (filterType, value) => {
        setFilters(prev => ({...prev, [filterType]: value}));
    };

    // Resetear filtros
    const resetFilters = () => {
        setFilters({
            operation_type: '',
            property_type: '',
            city: '',
            neighborhood: '',
            keyword: '',
            bedrooms_min: '',
            bathrooms_min: '',
            parking_spaces: '',
            socioeconomic_stratum: ''
        });
        setPriceRange(500000000);
        setShowAdvanced(false);
        
        // ✅ CORREGIDO: Usar la ruta correcta
        const fetchAllProperties = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:10101/api/properties');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                
                if (data.success && data.properties) {
                    setProperties(data.properties);
                } else if (Array.isArray(data)) {
                    setProperties(data);
                } else {
                    setProperties([]);
                }
                setError(null);
            } catch (error) {
                console.error("Error al cargar propiedades:", error);
                setError("Error al cargar propiedades: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAllProperties();
    };

    return (
        <>
            <div className="relative h-[800px] bg-cover bg-center flex flex-col justify-center items-center text-white text-center" style={{ backgroundImage: "url('/src/assets/images/Casa2.jpg')" }}>
                <div className="absolute inset-0 bg-black/30 z-0"></div>

                <div className="relative z-10 w-full flex flex-col justify-center items-center">
                    <h1 className="font-bold text-5xl mb-10">Encuentra Tu Lugar Ideal</h1>

                    <div className="flex gap-4 mb-6">
                        <Button 
                            name="Venta" 
                            className={`rounded-2xl px-10 p-2 ${
                                filters.operation_type === 'Venta' 
                                    ? 'bg-[#2F8EAC] text-white' 
                                    : 'bg-transparent border border-white text-white'
                            }`}
                            onClick={() => handleFilterClick('operation_type', 'Venta')}
                        />
                        <Button 
                            name="Arriendo" 
                            className={`rounded-2xl px-10 p-2 ${
                                filters.operation_type === 'Arriendo' 
                                    ? 'bg-[#2F8EAC] text-white' 
                                    : 'bg-transparent border border-white text-white'
                            }`}
                            onClick={() => handleFilterClick('operation_type', 'Arriendo')}
                        />
                    </div>

                    <form onSubmit={handleSearch} className="flex bg-white rounded-full shadow-lg px-10 py-6 gap-6 items-center w-[85%] max-w-7xl mx-auto">
                        <div className="flex flex-col w-55">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Tipo</label>
                            <select 
                                name="property_type" 
                                className="border-none bg-transparent focus:outline-none text-sm text-gray-800 px-2"
                                defaultValue=""
                                value={filters.property_type}
                                onChange={(e) => handleFilterClick('property_type', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="1">Casa</option>
                                <option value="2">Apartamento</option>
                                <option value="3">Finca</option>
                                <option value="4">Local Comercial</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-70">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Ingrese la Ciudad"
                                className="border-none bg-transparent focus:outline-none focus:placeholder-gray-400 text-sm text-gray-800 px-2"
                                value={filters.city}
                                onChange={(e) => handleFilterClick('city', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-70">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Barrio</label>
                            <input
                                type="text"
                                name="neighborhood"
                                placeholder="Ingrese el Barrio"
                                className="border-none bg-transparent focus:outline-none focus:placeholder-gray-400 text-sm text-gray-800 px-2"
                                value={filters.neighborhood}
                                onChange={(e) => handleFilterClick('neighborhood', e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={toggleAdvanced}
                            className="flex items-center gap-8 border border-[#2F8EAC] text-[#2F8EAC] rounded-full px-10 py-2 text-sm"
                        >
                            Búsqueda avanzada
                            <LuSettings2 className='text-[#2F8EAC] text-xl'/>
                        </button>

                        <button
                            type="submit"
                            className="bg-[#2F8EAC] text-white rounded-full px-8 py-2 text-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                </div>

                {/* Panel de Búsqueda Avanzada */}
                {showAdvanced && (
                    <div className="bg-white shadow-lg rounded-2xl p-6 mb-4 z-10 mt-4 w-[85%] max-w-7xl">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-700 font-medium">
                                    Precio máximo: ${priceRange.toLocaleString()}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="650"
                                max="500000000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-2 appearance-none bg-gray-200 rounded-lg accent-teal-600 cursor-pointer"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Habitaciones</label>
                                <input
                                    type="number"
                                    name="bedrooms_min"
                                    placeholder="Mínimo"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={filters.bedrooms_min}
                                    onChange={(e) => handleFilterClick('bedrooms_min', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Baños</label>
                                <input
                                    type="number"
                                    name="bathrooms_min"
                                    placeholder="Mínimo"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={filters.bathrooms_min}
                                    onChange={(e) => handleFilterClick('bathrooms_min', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Parqueaderos</label>
                                <input
                                    type="number"
                                    name="parking_spaces"
                                    placeholder="Mínimo"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={filters.parking_spaces}
                                    onChange={(e) => handleFilterClick('parking_spaces', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Estrato</label>
                                <select 
                                    name="socioeconomic_stratum"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={filters.socioeconomic_stratum}
                                    onChange={(e) => handleFilterClick('socioeconomic_stratum', e.target.value)}
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
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
                    {error}
                </div>
            )}

            <ChatDomu />

            <section className='flex flex-col items-center gap-4 m-15'>
                <h3 className='text-2xl text-[#2F8EAC]'>Propiedades Destacadas</h3>
                <h2 className='text-4xl font-bold'>Recomendaciones Para Ti</h2>

                <div className='flex gap-5'>
                    <Button
                        name="Ver Todo"
                        className="bg-[#2F8EAC] border border-[#2F8EAC] text-white rounded-3xl px-6 py-2 flex items-center gap-2"
                        onClick={resetFilters}
                    />
                    <Button
                        name="Apartamento"
                        className={`rounded-3xl px-6 py-2 ${
                            filters.property_type === '2' 
                                ? 'bg-[#2F8EAC] text-white' 
                                : 'bg-[#F4F4F4] text-black'
                        }`}
                        onClick={() => handleFilterClick('property_type', '2')}
                    />
                    <Button
                        name="Casa"
                        className={`rounded-3xl px-6 py-2 ${
                            filters.property_type === '1' 
                                ? 'bg-[#2F8EAC] text-white' 
                                : 'bg-[#F4F4F4] text-black'
                        }`}
                        onClick={() => handleFilterClick('property_type', '1')}
                    />
                    <Button
                        name="Finca"
                        className={`rounded-3xl px-6 py-2 ${
                            filters.property_type === '3' 
                                ? 'bg-[#2F8EAC] text-white' 
                                : 'bg-[#F4F4F4] text-black'
                        }`}
                        onClick={() => handleFilterClick('property_type', '3')}
                    />
                </div>

                <div className='flex flex-wrap justify-center gap-8'>
    {isLoading ? (
        <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F8EAC] mx-auto mb-4"></div>
            Cargando propiedades...
        </div>
    ) : properties.length > 0 ? (
        properties.map((property) => (
            <PropertyCard
                key={property.property_id}
                address={(() => {
                    const parts = [property.address, property.neighborhood, property.city]
                        .filter(part => part && part.trim())
                        .map(part => part.trim());
                    return parts.join(', ');
                })()}
                title={property.property_title}
                rooms={property.bedrooms || 0}
                bathrooms={property.bathrooms || 0}
                area={property.built_area || 0}
                price={property.price ? property.price.toLocaleString() : '0'}
                type={property.operation_type}
                agentName={property.agent_name || "Agente"}
                // ✅ CORRECCIÓN PRINCIPAL: Pasar el objeto completo de la propiedad
                onClick={() => handlePropertyClick(property)}
            />
        ))
    ) : (
        <div className="text-center py-10">
            <div className="text-gray-500 mb-2">📭</div>
            <p className="text-gray-600">No se encontraron propiedades con los filtros aplicados</p>
            <button 
                onClick={resetFilters}
                className="mt-4 text-[#2F8EAC] hover:underline"
            >
                Ver todas las propiedades
            </button>
        </div>
    )}
</div>
                <Button
                    name="➡ Ver Más"
                    className="bg-[#2F8EAC] border border-[#2F8EAC] text-white rounded-3xl px-6 py-2 flex items-center gap-2"
                />
            </section>
        </>
    );
};