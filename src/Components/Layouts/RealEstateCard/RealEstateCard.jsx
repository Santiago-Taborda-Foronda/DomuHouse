import React from 'react';
import DefaultLogo from "../../../assets/images/casLujo2.png"; // Ajusta la ruta seg煤n sea necesario
import { Phone, Mail } from 'lucide-react';
/**
 * Componente de tarjeta de inmobiliaria reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre de la inmobiliaria
 * @param {string} props.address - Direcci贸n de la inmobiliaria
 * @param {number} props.propertyCount - Cantidad de inmuebles
 * @param {string} [props.administrator] - Nombre del administrador a cargo (opcional)
 * @param {string} [props.logoUrl] - URL opcional del logo (si no se proporciona, se usa el logo por defecto)
 * @param {Function} [props.onClick] - Funci贸n opcional para manejar el clic en la tarjeta
 * @returns {JSX.Element} - Componente RealEstateCard
 */export const RealEstateCard = ({
  name,
  address,
  city,
  department,
  phone,
  email,
  propertyCount,
  adminName,
  adminLastName,
  logoUrl,
  onClick,
}) => {
  // Funci贸n para obtener iniciales del administrador
  const getInitials = (name, lastName) => {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'AD';
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Secci贸n del logo */}
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <img
          src={logoUrl || DefaultLogo}
          alt={`Logo de ${name}`}
          className="max-w-28 max-h-28 object-contain transition-transform duration-300 hover:scale-105"
          onError={(e) => { 
            e.target.src = DefaultLogo;
            e.target.className = "max-w-28 max-h-28 object-contain";
          }}
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
          {propertyCount} {propertyCount === 1 ? 'inmueble' : 'inmuebles'}
        </div>
      </div>

      {/* Informaci贸n */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{name}</h2>

        <div className="space-y-2 text-gray-700 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-gray-500">馃搷</span>
            <span className="line-clamp-2">
              {address}, {city}, {department}
            </span>
          </div>
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="line-clamp-1">{email}</span>
            </div>
          )}
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Administrador */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {getInitials(adminName, adminLastName)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Administrador</span>
              <span className="text-sm text-gray-800 font-medium">
                {adminName} {adminLastName}
              </span>
            </div>
          </div>
          <div className="text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};