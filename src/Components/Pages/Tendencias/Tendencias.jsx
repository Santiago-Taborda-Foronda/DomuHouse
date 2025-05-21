import React from 'react';
import { Header } from '../../Layouts/Header/Header';
import { PropertyCard } from '../../Layouts/PropertyCard/PropertyCard';
import { useNavigate } from 'react-router-dom';

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

  // Handler para cuando se hace clic en una propiedad (futura funcionalidad)
  const navigate = useNavigate();

const handlePropertyClick = (property) => {
  navigate('/propiedad-seleccionada', { state: { property } });
};

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
              onClick={() => handlePropertyClick(property)}
            />
          ))}
        </div>
      </div>
    </>
  );
};