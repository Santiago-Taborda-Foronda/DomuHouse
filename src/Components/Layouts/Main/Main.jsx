import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoRobot from '../../../assets/images/robot.png';
import Casa from '../../../assets/images/casLujo2.jpg';
import { LuSettings2 } from "react-icons/lu";
import { ChatDomu } from '../../UI/ChatDomu/ChatDomu';
import { Button } from '../../UI/Button/Button';
import { PropertyCard } from '../PropertyCard/PropertyCard'; // Importa tu componente PropertyCard
import "../../../App";

export const Main = () => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [priceRange, setPriceRange] = useState(2500000);
    const toggleAdvanced = () => setShowAdvanced(!showAdvanced);
    const navigate = useNavigate();

    const handlePropertyClick = (property) => {
        navigate('/propiedad-seleccionada', { state: { property } });
    };

    const properties = [
    {
        id: 1,
        address: "Ur. La Portada Americana 23 #56",
        title: "Casa Lomas Del Norte",
        rooms: 5,
        bathrooms: 3,
        area: 150,
        price: "7,250.00",
        type: "venta",
        description: "Hermosa casa en una ubicación privilegiada con acabados de primera calidad.",
        agentInfo: {
            name: "Jane Doe",
            phone: "+57 3224456789",
            email: "jane.doe@realestate.com",
            initials: "JD",
            whatsapp: "+57 3224456789"
        }
    },
    {
        id: 2,
        address: "Ur. La Portada Americana 45 #22",
        title: "Casa Lomas Del Sur",
        rooms: 4,
        bathrooms: 2,
        area: 120,
        price: "3,500.00",
        type: "alquiler",
        description: "Casa moderna con excelente ubicación y espacios amplios.",
        agentInfo: {
            name: "Angelica Smith",
            phone: "+57 3224456789",
            email: "angelicasm231@gmai..com",
            initials: "JD",
            whatsapp: "+57 3224456789"
        }
    }
];

    return (
        <>
            <div className="relative h-[800px] bg-cover bg-center flex flex-col justify-center items-center text-white text-center" style={{ backgroundImage: "url('/src/assets/images/Casa2.jpg')" }}>

                {/* Overlay suave */}
                <div className="absolute inset-0 bg-black/30 z-0"></div>

                {/* Contenido */}
                <div className="relative z-10 w-full flex flex-col justify-center items-center">
                    <h1 className="font-bold text-5xl mb-10">Encuentra Tu Lugar Ideal</h1>

                    <div className="flex gap-4 mb-6">
                        <Button name="Venta" className="bg-[#2F8EAC] text-white rounded-2xl px-10 p-2" />
                        <Button name="Arriendo" className="bg-transparent border border-white text-white rounded-2xl px-10 p-2" />
                    </div>
                    <form className="flex bg-white rounded-full shadow-lg px-10 py-6 gap-6 items-center w-[85%] max-w-7xl mx-auto">
                        <div className="flex flex-col w-55">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Tipo</label>
                            <select className="border-none bg-transparent focus:outline-none text-sm text-gray-800 px-2">
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="local">Local Comercial</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-70">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Ubicación</label>
                            <input
                                type="text"
                                name="ubicacion"
                                placeholder="Norte"
                                className="border-none bg-transparent focus:outline-none text-sm text-gray-800 px-2"
                            />
                        </div>

                        <div className="flex flex-col w-70">
                            <label className="text-xs text-gray-800 text-left ml-2 mb-1">Palabra clave</label>
                            <input
                                type="text"
                                name="palabraClave"
                                placeholder="Búsqueda por palabra"
                                className="border-none bg-transparent focus:outline-none text-sm text-gray-800 px-2"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={toggleAdvanced}
                            className="flex items-center gap-2 border border-[#2F8EAC] text-[#2F8EAC] rounded-full px-10 py-2 text-sm whitespace-nowrap"
                        >
                            {showAdvanced ? "Búsqueda avanzada" : "Búsqueda avanzada"}
                            <LuSettings2 className='text-[#2F8EAC] text-xl' />
                        </button>

                        <button
                            type="submit"
                            className="bg-[#2F8EAC] text-white rounded-full px-8 py-2 text-sm"
                        >
                            Buscar
                        </button>
                    </form>
                </div>
                {/* Panel de Búsqueda Avanzada */}
                {showAdvanced && (
                    <div className="bg-white shadow-lg rounded-2xl p-6 mb-4 z-10 mt-4">
                        {/* Precio */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-700 font-medium">
                                    Precio: $650 - ${priceRange.toLocaleString()}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="650"
                                max="2500000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-2 appearance-none bg-gray-200 rounded-lg accent-teal-600 cursor-pointer"
                            />
                        </div>

                        {/* Filtros en Flexbox */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Habitaciones</label>
                                <input
                                    type="number"
                                    placeholder="2"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Baños</label>
                                <input
                                    type="number"
                                    placeholder="2"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Parqueaderos</label>
                                <input
                                    type="number"
                                    placeholder="2"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Estado</label>
                                <select className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                    <option value="nueva">Nueva</option>
                                    <option value="usada">Usada</option>
                                </select>
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Cercanía a Servicios</label>
                                <select className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                    <option value="transporte">Transporte</option>
                                    <option value="escuelas">Escuelas</option>
                                </select>
                            </div>

                            <div className="flex flex-col flex-1 min-w-48">
                                <label className="text-xs text-gray-600 mb-2">Descripción</label>
                                <input
                                    type="text"
                                    placeholder="Opcional"
                                    className="text-sm px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Renderizar tarjetas de propiedades */}
            <div className='px-6 md:px-10 lg:px20 py-10'>
            <div className='flex flex-wrap justify-center gap-6'>
                {properties.map(property => (
                    <PropertyCard
                        key={property.id}
                        address={property.address}
                        title={property.title}
                        rooms={property.rooms}
                        bathrooms={property.bathrooms}
                        area={property.area}
                        price={property.price}
                        type={property.type}
                        agentName={property.agentInfo.name}
                        onClick={() => handlePropertyClick(property)}
                    />
                ))}
            </div>
        </div>
        </>
    );
};