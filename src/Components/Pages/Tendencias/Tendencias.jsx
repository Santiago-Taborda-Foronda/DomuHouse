import React from 'react';
import { Header } from '../../Layouts/Header/Header';
import { PropertyCard } from '../../Layouts/PropertyCard/PropertyCard';
import { useNavigate } from 'react-router-dom';

export const Tendencias = () => {
  // Datos de muestra con información completa de agentes
  const properties = [
    {
      id: 1,
      address: "Ur. La Portada Americana 23 #56",
      title: "Casa Lomas Del Norte",
      rooms: 5,
      bathrooms: 3,
      area: 150,
      price: "7,250.00",
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
      title: "Casa Lomas Del Norte",
      rooms: 4,
      bathrooms: 2,
      area: 120,
      price: "6,500.00",
      description: "Casa moderna con excelente ubicación y espacios amplios.",
      agentInfo: {
        name: "Jane Doe",
        phone: "+57 3224456789",
        email: "jane.doe@realestate.com",
        initials: "JD",
        whatsapp: "+57 3224456789"
      }
    },
    {
      id: 10,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      description: "Amplia casa familiar con jardín y garage para dos vehículos.",
      agentInfo: {
        name: "Jane Doe",
        phone: "+57 3224456789",
        email: "jane.doe@realestate.com",
        initials: "JD",
        whatsapp: "+57 3224456789"
      }
    },
    {
      id: 4,
      address: "Ur. La Portada Americana 12 #78",
      title: "Mega Casa Santiago",
      rooms: 54,
      bathrooms: 30,
      area: 1000,
      price: "100,800.00",
      description: "Casa de lujo con múltiples amenidades y espacios únicos.",
      agentInfo: {
        name: "Augusto Rodas",
        phone: "+57 3156789012",
        email: "augusto.rodas@realestate.com",
        initials: "AR",
        whatsapp: "+57 3156789012"
      }
    },
    {
      id: 5,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      description: "Casa espaciosa con diseño contemporáneo y acabados premium.",
      agentInfo: {
        name: "María González",
        phone: "+57 3187654321",
        email: "maria.gonzalez@realestate.com",
        initials: "MG",
        whatsapp: "+57 3187654321"
      }
    },
    {
      id: 6,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      description: "Propiedad ideal para familias grandes con espacios bien distribuidos.",
      agentInfo: {
        name: "Carlos Mendoza",
        phone: "+57 3209876543",
        email: "carlos.mendoza@realestate.com",
        initials: "CM",
        whatsapp: "+57 3209876543"
      }
    },
    {
      id: 7,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      description: "Casa con excelente iluminación natural y áreas sociales amplias.",
      agentInfo: {
        name: "Ana Sofía López",
        phone: "+57 3123456789",
        email: "ana.lopez@realestate.com",
        initials: "AL",
        whatsapp: "+57 3123456789"
      }
    },
    {
      id: 8,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      description: "Hermosa propiedad con piscina y zonas verdes privadas.",
      agentInfo: {
        name: "Roberto Silva",
        phone: "+57 3145678901",
        email: "roberto.silva@realestate.com",
        initials: "RS",
        whatsapp: "+57 3145678901"
      }
    },
    {
      id: 9,
      address: "Ur. La Portada Americana 12 #78",
      title: "Casa Lomas Del Norte",
      rooms: 6,
      bathrooms: 4,
      area: 200,
      price: "9,800.00",
      description: "Casa moderna con tecnología inteligente integrada.",
      agentInfo: {
        name: "Patricia Ruiz",
        phone: "+57 3167890123",
        email: "patricia.ruiz@realestate.com",
        initials: "PR",
        whatsapp: "+57 3167890123"
      }
    }
  ];

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
              agentName={property.agentInfo.name}
              onClick={() => handlePropertyClick(property)}
            />
          ))}
        </div>
      </div>
    </>
  );
};