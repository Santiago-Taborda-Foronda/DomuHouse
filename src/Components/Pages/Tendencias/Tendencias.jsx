import React from 'react';
import { Header } from '../../Layouts/Header/Header';
import Casa from "../../../assets/images/casLujo2.png";

// Componente de tarjeta de propiedad reutilizable
const PropertyCard = ({ address, title, rooms, bathrooms, area, price, agentName }) => {
  return (
    <div className='bg-white flex flex-col rounded-2xl max-w-100 shadow-md overflow-hidden'>
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

export const Tendencias = () => {
  // Datos de muestra - en una aplicación real estos vendrían de una API o props
  const properties = [
    {
      id: 1,
      address: "Ur. La Portada Americana 23 #56",
      title: "Casa Lomas Del Norte",
      rooms: 5,
      bathrooms: 3,
      area: 150,
      price: "7,250.00",
      agentName: "Jane Doe"
    },
    {
      id: 2,
      address: "Ur. La Portada Americana 45 #22",
      title: "Casa Lomas Del Norte",
      rooms: 4,
      bathrooms: 2,
      area: 120,
      price: "6,500.00",
      agentName: "Jane Doe"
    },
    {
      id: 10,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      agentName: "Jane Doe"
    },
    {
      id: 4,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Santiago",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      agentName: "Jane Doe"
    },
    {
      id: 5,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      agentName: "Jane Doe"
    },
    {
      id: 6,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      agentName: "Jane Doe"
    },
    {
      id: 7,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      agentName: "Jane Doe"
    },
    {
      id: 8,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      agentName: "Jane Doe"
    },
    {
      id: 9,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      agentName: "Jane Doe"
    },
    // Puedes agregar más propiedades según sea necesario
  ];

  return (
    <>
      <Header />
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
              agentName={property.agentName}
            />
          ))}
        </div>
      </div>
    </>
  );
};