import React from 'react';
import Casa from "../../../assets/images/casLujo2.png"; // Ajusta la ruta según sea necesario

/**
 * Componente de tarjeta de propiedad reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {string} props.address - Dirección de la propiedad
 * @param {string} props.title - Título de la propiedad
 * @param {number} props.rooms - Número de habitaciones
 * @param {number} props.bathrooms - Número de baños
 * @param {number} props.area - Área en metros cuadrados
 * @param {string} props.price - Precio de la propiedad (formato string)
 * @param {string} props.agentName - Nombre del agente
 * @param {string} [props.imageUrl] - URL opcional de la imagen (si no se proporciona, se usa la imagen por defecto)
 * @param {Function} [props.onClick] - Función opcional para manejar el clic en la tarjeta
 * @returns {JSX.Element} - Componente PropertyCard
 */
export const PropertyCard = ({ 
  address, 
  title, 
  rooms, 
  bathrooms, 
  area, 
  price, 
  agentName,
  imageUrl,
  onClick
}) => {
  return (
    <div 
      className='bg-white flex flex-col rounded-2xl max-w-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="relative w-full h-52">
        <img
          src={imageUrl || Casa}
          alt={title}
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