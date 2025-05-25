import React from 'react';
import { Header } from '../../Layouts/Header/Header';
import { PropertyCard } from '../../Layouts/PropertyCard/PropertyCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, User, Building } from 'lucide-react';

export const InmobiliariaSeleccionada = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { realEstate } = location.state || {};

  // Si no hay datos de inmobiliaria, redirigir
  if (!realEstate) {
    navigate('/inmobiliarias');
    return null;
  }

  // Función para generar propiedades basadas en el propertyCount
  const generateProperties = (count, realEstateName, realEstateId) => {
    const propertyTypes = [
      "Casa Lomas Del Norte",
      "Apartamento Moderno",
      "Casa Familiar",
      "Duplex Premium",
      "Casa Colonial",
      "Apartaestudio",
      "Casa Campestre",
      "Penthouse",
      "Casa Esquinera",
      "Loft Moderno"
    ];

    const addresses = [
      "Ur. La Portada Americana",
      "Barrio Centro",
      "Zona Rosa",
      "Ciudadela del Café",
      "Barrio Modelo",
      "La Castellana",
      "Bosques de Pinares",
      "Villa del Prado",
      "Nuevo Horizonte",
      "Portal del Quindío"
    ];

    const agents = [
      { name: "Jane Doe", phone: "+57 3224456789", email: "jane.doe@realestate.com", initials: "JD" },
      { name: "Augusto Rodas", phone: "+57 3156789012", email: "augusto.rodas@realestate.com", initials: "AR" },
      { name: "María González", phone: "+57 3187654321", email: "maria.gonzalez@realestate.com", initials: "MG" },
      { name: "Carlos Mendoza", phone: "+57 3209876543", email: "carlos.mendoza@realestate.com", initials: "CM" },
      { name: "Ana Sofía López", phone: "+57 3123456789", email: "ana.lopez@realestate.com", initials: "AL" },
      { name: "Roberto Silva", phone: "+57 3145678901", email: "roberto.silva@realestate.com", initials: "RS" },
      { name: "Patricia Ruiz", phone: "+57 3167890123", email: "patricia.ruiz@realestate.com", initials: "PR" },
      { name: "Fernando García", phone: "+57 3198765432", email: "fernando.garcia@realestate.com", initials: "FG" },
      { name: "Claudia Sánchez", phone: "+57 3176543210", email: "claudia.sanchez@realestate.com", initials: "CS" },
      { name: "Jorge Herrera", phone: "+57 3143456789", email: "jorge.herrera@realestate.com", initials: "JH" }
    ];

    const descriptions = [
      "Hermosa casa en una ubicación privilegiada con acabados de primera calidad.",
      "Propiedad moderna con excelente ubicación y espacios amplios.",
      "Amplia casa familiar con jardín y garage para dos vehículos.",
      "Casa espaciosa con diseño contemporáneo y acabados premium.",
      "Propiedad ideal para familias grandes con espacios bien distribuidos.",
      "Casa con excelente iluminación natural y áreas sociales amplias.",
      "Hermosa propiedad con piscina y zonas verdes privadas.",
      "Casa moderna con tecnología inteligente integrada.",
      "Propiedad con vista panorámica y acabados de lujo.",
      "Casa esquinera con múltiples espacios y excelente ventilación."
    ];

    return Array.from({ length: count }, (_, index) => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      // Generar números aleatorios para las características
      const rooms = Math.floor(Math.random() * 6) + 2; // 2-7 habitaciones
      const bathrooms = Math.floor(Math.random() * 4) + 1; // 1-4 baños
      const area = Math.floor(Math.random() * 200) + 80; // 80-280 m²
      const basePrice = Math.floor(Math.random() * 15000) + 3000; // 3000-18000
      const price = (basePrice + (index * 100)).toLocaleString('es-CO', { minimumFractionDigits: 2 });

      return {
        id: `${realEstateId}-${index + 1}`,
        address: `${randomAddress} ${Math.floor(Math.random() * 100) + 1} #${Math.floor(Math.random() * 99) + 1}`,
        title: randomType,
        rooms: rooms,
        bathrooms: bathrooms,
        area: area,
        price: price,
        description: randomDescription,
        agentInfo: {
          name: randomAgent.name,
          phone: randomAgent.phone,
          email: randomAgent.email,
          initials: randomAgent.initials,
          whatsapp: randomAgent.phone
        }
      };
    });
  };

  const properties = generateProperties(realEstate.propertyCount, realEstate.name, realEstate.id);

  const handlePropertyClick = (property) => {
    navigate('/propiedad-seleccionada', { state: { property } });
  };

  const handleBackClick = () => {
    navigate('/inmobiliarias');
  };

  return (
    <>
      <Header />
      <div className='px-6 md:px-10 lg:px-20 py-10'>
        {/* Botón de regreso */}
        <button 
          onClick={handleBackClick}
          className='flex items-center gap-2 text-sky-600 hover:text-sky-800 mb-6 transition-colors'
        >
          <ArrowLeft size={20} />
          <span>Volver a Inmobiliarias</span>
        </button>

        {/* Información de la inmobiliaria */}
        <div className='bg-white rounded-2xl shadow-lg p-8 mb-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Columna izquierda - Info principal */}
            <div>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center'>
                  <Building className='text-sky-600' size={32} />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-gray-800'>{realEstate.name}</h1>
                  <p className='text-sky-600 font-medium'>{realEstate.propertyCount} propiedades disponibles</p>
                </div>
              </div>
              
              <p className='text-gray-600 text-lg leading-relaxed mb-6'>
                {realEstate.description}
              </p>
            </div>

            {/* Columna derecha - Información de contacto */}
            <div className='bg-sky-50 rounded-xl p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>Información de Contacto</h3>
              
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <User className='text-sky-600' size={20} />
                  <div>
                    <p className='text-sm text-gray-500'>Persona Encargada</p>
                    <p className='font-medium text-gray-800'>{realEstate.administrator}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <MapPin className='text-sky-600' size={20} />
                  <div>
                    <p className='text-sm text-gray-500'>Dirección</p>
                    <p className='font-medium text-gray-800'>{realEstate.address}</p>
                    <p className='text-sm text-gray-500'>Armenia, Quindío</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Phone className='text-sky-600' size={20} />
                  <div>
                    <p className='text-sm text-gray-500'>Teléfono</p>
                    <p className='font-medium text-gray-800'>{realEstate.phone}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Mail className='text-sky-600' size={20} />
                  <div>
                    <p className='text-sm text-gray-500'>Correo Electrónico</p>
                    <p className='font-medium text-gray-800'>{realEstate.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Título de propiedades */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Propiedades Disponibles</h2>
          <p className='text-gray-600'>Explora todas las propiedades que {realEstate.name} tiene para ofrecerte</p>
        </div>

        {/* Grid de propiedades */}
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
              agentName={property.agentInfo.name}
              onClick={() => handlePropertyClick(property)}
            />
          ))}
        </div>

        {/* Estadísticas de la inmobiliaria */}
        <div className='mt-12 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4 text-center'>Estadísticas de {realEstate.name}</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-white rounded-xl p-4 text-center shadow-sm'>
              <h4 className='text-2xl font-bold text-sky-600'>{properties.length}</h4>
              <p className='text-gray-600 text-sm'>Propiedades</p>
            </div>
            <div className='bg-white rounded-xl p-4 text-center shadow-sm'>
              <h4 className='text-2xl font-bold text-sky-600'>
                {Math.round(properties.reduce((sum, p) => sum + p.area, 0) / properties.length)}
              </h4>
              <p className='text-gray-600 text-sm'>m² Promedio</p>
            </div>
            <div className='bg-white rounded-xl p-4 text-center shadow-sm'>
              <h4 className='text-2xl font-bold text-sky-600'>
                {Math.round(properties.reduce((sum, p) => sum + p.rooms, 0) / properties.length)}
              </h4>
              <p className='text-gray-600 text-sm'>Habitaciones Prom.</p>
            </div>
            <div className='bg-white rounded-xl p-4 text-center shadow-sm'>
              <h4 className='text-2xl font-bold text-sky-600'>
                ${Math.round(properties.reduce((sum, p) => sum + parseFloat(p.price.replace(/,/g, '')), 0) / properties.length).toLocaleString()}
              </h4>
              <p className='text-gray-600 text-sm'>Precio Promedio</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};