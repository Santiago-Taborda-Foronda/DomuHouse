import React, { useState, useEffect } from 'react';
import LogoRobot from '../../../assets/images/robot.png';
import Casa from '../../../assets/images/casLujo2.jpg';
import { LuSettings2 } from "react-icons/lu";
import { ChatDomu } from '../../UI/ChatDomu/ChatDomu';
import { Button } from '../../UI/Button/Button';
import "../../../App";

const PropertyCard = ({ address, title, rooms, bathrooms, area, price, agentName, onClick }) => {
    return (
        <div className='bg-white flex flex-col rounded-2xl max-w-100 shadow-md overflow-hidden cursor-pointer' onClick={onClick}>
            <div className="relative w-full h-52">
                <img
                    src={Casa}
                    alt="Propiedad"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full text-white text-sm px-4 py-2">
                    <span>{address}</span>
                </div>
            </div>

            <div className="px-4 pt-2 pb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
                <div className="flex items-center text-gray-600 text-sm gap-4 mb-4">
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
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <img
                            src="/api/placeholder/32/32"
                            alt={agentName}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-800">{agentName}</span>
                    </div>
                    <span className="text-base font-semibold text-gray-900">${price}</span>
                </div>
            </div>
        </div>
    );
};

export const Main = () => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [priceRange, setPriceRange] = useState(250000000); // Ajustado para incluir el precio de la propiedad
    const [properties, setProperties] = useState([]);
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
                const res = await fetch('http://localhost:10101/api/propiedades/aprobadas');
                const data = await res.json();
                setProperties(data);
                setError(null);
            } catch (error) {
                console.error("Error al cargar propiedades:", error);
                setError("Error al cargar propiedades");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // Manejar búsqueda
    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.target);
            const searchParams = {
                ...filters,
                price_max: priceRange
            };

            // Agregar campos del formulario básico
            if (formData.get('property_type')) searchParams.property_type = formData.get('property_type');
            if (formData.get('city')) searchParams.city = formData.get('city');
            if (formData.get('neighborhood')) searchParams.neighborhood = formData.get('neighborhood');
            
            // Agregar campos avanzados si están visibles
            if (showAdvanced) {
                if (formData.get('bedrooms_min')) searchParams.bedrooms_min = formData.get('bedrooms_min');
                if (formData.get('socioeconomic_stratum')) searchParams.socioeconomic_stratum = formData.get('socioeconomic_stratum');
                if (formData.get('bathrooms_min')) searchParams.bathrooms_min = formData.get('bathrooms_min');
                if (formData.get('parking_spaces')) searchParams.parking_spaces = formData.get('parking_spaces');
            }

            // Construir query params
            const queryParams = new URLSearchParams();
            Object.entries(searchParams).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await fetch(`http://localhost:10101/search?${queryParams}`);
            const data = await response.json();
            setProperties(data);
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            setError("Error al realizar la búsqueda");
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar clic en propiedad
    const handlePropertyClick = (propertyId) => {
        // Aquí puedes implementar la navegación a los detalles de la propiedad
        console.log("Propiedad seleccionada:", propertyId);
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
                            onClick={() => {
                                setFilters(prev => ({...prev, operation_type: 'Venta'}));
                            }}
                        />
                        <Button 
                            name="Arriendo" 
                            className={`rounded-2xl px-10 p-2 ${
                                filters.operation_type === 'Arriendo' 
                                    ? 'bg-[#2F8EAC] text-white' 
                                    : 'bg-transparent border border-white text-white'
                            }`}
                            onClick={() => {
                                setFilters(prev => ({...prev, operation_type: 'Arriendo'}));
                            }}
                        />
                    </div>

                    <form onSubmit={handleSearch} className="flex bg-white rounded-full shadow-lg px-10 py-6 gap-6 items-center w-[85%] max-w-7xl mx-auto">
                        <div className="flex flex-col w-55">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Tipo</label>
                            <select 
                                name="property_type" 
                                className="border-none bg-transparent focus:outline-none text-sm text-gray-800 px-2"
                                defaultValue=""
                            >
                                <option value="">Todos</option>
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="local">Local Comercial</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-70">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Ingrese la Ciudad"
                                className="border-none bg-transparent focus:outline-none focus:placeholder-gray-400 text-sm text-gray-800 px-2"
                            />
                        </div>

                        <div className="flex flex-col w-70">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Barrio</label>
                            <input
                                type="text"
                                name="neighborhood"
                                placeholder="Ingrese el Barrio"
                                className="border-none bg-transparent focus:outline-none focus:placeholder-gray-400 text-sm text-gray-800 px-2"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={toggleAdvanced}
                            className="flex items-center gap-8 border border-[#2F8EAC] text-[#2F8EAC] rounded-full px-10 py-2 text-sm"
                        >
                            {showAdvanced ? "Búsqueda avanzada" : "Búsqueda avanzada"}
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
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Baños</label>
                                <input
                                    type="number"
                                    name="bathrooms_min"
                                    placeholder="Mínimo"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Parqueaderos</label>
                                <input
                                    type="number"
                                    name="parking_spaces"
                                    placeholder="Mínimo"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Estrato</label>
                                <select 
                                    name="socioeconomic_stratum"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                        onClick={() => {
                            setFilters({});
                            setPriceRange(500000000);
                            setShowAdvanced(false);
                        }}
                    />
                    <Button
                        name="Apartamento"
                        className="bg-[#F4F4F4] text-black rounded-3xl px-6 py-2"
                        onClick={() => {
                            setFilters(prev => ({...prev, property_type: 'apartamento'}));
                        }}
                    />
                    <Button
                        name="Casa"
                        className="bg-[#F4F4F4] text-black rounded-3xl px-6 py-2"
                        onClick={() => {
                            setFilters(prev => ({...prev, property_type: 'casa'}));
                        }}
                    />
                </div>

                <div className='px-6 md:px-10 lg:px20 py-10'>
                    <div className='flex flex-wrap justify-center gap-8'>
                        {isLoading ? (
                            <div className="text-center py-10">Cargando propiedades...</div>
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
                            <div className="text-center py-10">No se encontraron propiedades con los filtros aplicados</div>
                        )}
                    </div>
                </div>

                <Button
                    name="➡ Ver Más"
                    className="bg-[#2F8EAC] border border-[#2F8EAC] text-white rounded-3xl px-6 py-2 flex items-center gap-2"
                />
            </section>
        </>
    );
};