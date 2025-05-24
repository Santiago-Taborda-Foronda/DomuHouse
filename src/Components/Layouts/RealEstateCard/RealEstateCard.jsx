import React from 'react';
import DefaultLogo from "../../../assets/images/casLujo2.png"; // Ajusta la ruta según sea necesario

/**
 * Componente de tarjeta de inmobiliaria reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre de la inmobiliaria
 * @param {string} props.address - Dirección de la inmobiliaria
 * @param {number} props.propertyCount - Cantidad de inmuebles
 * @param {string} props.administrator - Nombre del administrador a cargo
 * @param {string} [props.logoUrl] - URL opcional del logo (si no se proporciona, se usa el logo por defecto)
 * @param {Function} [props.onClick] - Función opcional para manejar el clic en la tarjeta
 * @returns {JSX.Element} - Componente RealEstateCard
 */
export const RealEstateCard = ({ 
  name, 
  address, 
  propertyCount, 
  administrator,
  logoUrl,
  onClick
}) => {
  return (
    <div 
      className='bg-white flex flex-col rounded-2xl max-w-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Sección del logo */}
      <div className="relative w-full h-52 bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
        <img
          src={logoUrl || DefaultLogo}
          alt={`Logo de ${name}`}
          className="max-w-32 max-h-32 object-contain"
        />
        <div className="absolute top-4 right-4 bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {propertyCount} inmuebles
        </div>
      </div>

      {/* Información de la inmobiliaria */}
      <div className="px-4 pt-2 pb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">{name}</h2>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-gray-500 text-sm min-w-fit">📍</span>
            <span className="text-gray-600 text-sm line-clamp-2">{address}</span>
          </div>
        </div>
        
        <hr className="my-3" />
        
        {/* Administrador */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {administrator.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Administrador</span>
              <span className="text-sm text-gray-800 font-medium">{administrator}</span>
            </div>
          </div>
          <div className="text-sky-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};