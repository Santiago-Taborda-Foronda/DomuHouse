import React from 'react';
import { Header } from '../../Layouts/Header/Header';
import { RealEstateCard } from '../../../Components/Layouts/RealEstateCard/RealEstateCard';
import { useNavigate } from 'react-router-dom';

export const ShowInmobiliarias = () => {
  // Datos de muestra con información completa de inmobiliarias
  const realEstates = [
    {
      id: 1,
      name: "Inmobiliaria Horizonte",
      address: "Av. Bolivar #123, Centro Comercial Plaza Norte, Local 45-B",
      propertyCount: 47,
      administrator: "María Elena Rodríguez",
      logoUrl: null, // Usará el logo por defecto
      description: "Especialistas en propiedades residenciales y comerciales con más de 15 años de experiencia.",
      phone: "+57 3201234567",
      email: "info@horizonte.com"
    },
    {
      id: 2,
      name: "Propiedades del Valle S.A.S",
      address: "Calle 85 #12-34, Edificio Torre Business, Oficina 801",
      propertyCount: 72,
      administrator: "Carlos Alberto Mendoza",
      logoUrl: null,
      description: "Líderes en el mercado inmobiliario del valle con servicios integrales.",
      phone: "+57 3157654321",
      email: "contacto@propiedadesdelvalle.com"
    },
    {
      id: 3,
      name: "Elite Real Estate",
      address: "Carrera 15 #45-67, Zona Rosa, Edificio Premium Piso 3",
      propertyCount: 128,
      administrator: "Ana Sofía Jiménez",
      logoUrl: null,
      description: "Inmobiliaria de lujo especializada en propiedades premium y exclusivas.",
      phone: "+57 3109876543",
      email: "elite@realestate.co"
    },
    {
      id: 4,
      name: "Constructora & Inmobiliaria Norte",
      address: "Av. Norte #89-12, Sector Industrial, Bodega 15",
      propertyCount: 95,
      administrator: "Roberto Silva Vargas",
      logoUrl: null,
      description: "Constructora e inmobiliaria con proyectos propios y gestión de terceros.",
      phone: "+57 3184567890",
      email: "info@constructoranorte.com"
    },
    {
      id: 5,
      name: "Inmuebles Modernos Ltda",
      address: "Diagonal 23 #56-78, Centro Histórico, Casa Colonial Restaurada",
      propertyCount: 34,
      administrator: "Patricia Moreno Luna",
      logoUrl: null,
      description: "Especialistas en apartamentos modernos y lofts en el centro de la ciudad.",
      phone: "+57 3225678901",
      email: "modernos@inmuebles.co"
    },
    {
      id: 6,
      name: "Finca Raíz Integral",
      address: "Calle 50 #78-90, Barrio Residencial Los Pinos",
      propertyCount: 156,
      administrator: "Jorge Luis Herrera",
      logoUrl: null,
      description: "Servicios integrales de finca raíz: compra, venta, arriendo y administración.",
      phone: "+57 3143456789",
      email: "integral@fincaraiz.com"
    },
    {
      id: 7,
      name: "Hogar Perfecto Inmobiliaria",
      address: "Transversal 10 #34-56, Conjunto Residencial Las Flores, Local 12",
      propertyCount: 63,
      administrator: "Claudia Beatriz Sánchez",
      logoUrl: null,
      description: "Tu hogar perfecto nos inspira. Especializados en vivienda familiar.",
      phone: "+57 3167890123",
      email: "hogarperfecto@inmobiliaria.co"
    },
    {
      id: 8,
      name: "Inversiones Inmobiliarias S.A.",
      address: "Avenida Principal #100-25, Torre Empresarial, Piso 12",
      propertyCount: 203,
      administrator: "Fernando García Ruiz",
      logoUrl: null,
      description: "Inversiones seguras en el sector inmobiliario con alta rentabilidad.",
      phone: "+57 3198765432",
      email: "inversiones@inmobiliarias.com"
    },
    {
      id: 9,
      name: "Casa & Campo Propiedades",
      address: "Km 5 Vía a Vereda La Esperanza, Finca Villa María",
      propertyCount: 41,
      administrator: "Esperanza Villa Campo",
      logoUrl: null,
      description: "Especialistas en propiedades rurales, fincas y terrenos campestres.",
      phone: "+57 3176543210",
      email: "casaycampo@propiedades.co"
    }
  ];

  const navigate = useNavigate();

  const handleRealEstateClick = (realEstate) => {
    navigate('/inmobiliaria-seleccionada', { state: { realEstate } });
  };

  return (
    <>
      <Header />
      <div className='px-6 md:px-10 lg:px-20 py-10'>
        {/* Título de la sección */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Inmobiliarias Registradas</h1>
          <p className='text-gray-600'>Conoce todas las inmobiliarias que forman parte de nuestra plataforma</p>
        </div>

        {/* Grid de tarjetas */}
        <div className='flex flex-wrap justify-center gap-6'>
          {realEstates.map(realEstate => (
            <RealEstateCard
              key={realEstate.id}
              name={realEstate.name}
              address={realEstate.address}
              propertyCount={realEstate.propertyCount}
              administrator={realEstate.administrator}
              logoUrl={realEstate.logoUrl}
              onClick={() => handleRealEstateClick(realEstate)}
            />
          ))}
        </div>

        {/* Estadísticas generales */}
        <div className='mt-12 bg-sky-50 rounded-2xl p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
            <div className='bg-white rounded-xl p-4 shadow-sm'>
              <h3 className='text-2xl font-bold text-sky-600'>{realEstates.length}</h3>
              <p className='text-gray-600'>Inmobiliarias Registradas</p>
            </div>
            <div className='bg-white rounded-xl p-4 shadow-sm'>
              <h3 className='text-2xl font-bold text-sky-600'>
                {realEstates.reduce((total, re) => total + re.propertyCount, 0)}
              </h3>
              <p className='text-gray-600'>Total de Inmuebles</p>
            </div>
            <div className='bg-white rounded-xl p-4 shadow-sm'>
              <h3 className='text-2xl font-bold text-sky-600'>
                {Math.round(realEstates.reduce((total, re) => total + re.propertyCount, 0) / realEstates.length)}
              </h3>
              <p className='text-gray-600'>Promedio por Inmobiliaria</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};