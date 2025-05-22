import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../../Layouts/Header/Header';

export const PropiedadSeleccionada = () => {
  const { state } = useLocation();
  const property = state?.property;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Imágenes de ejemplo - aquí podrás conectar las imágenes reales de la propiedad
  const propertyImages = [
  "https://picsum.photos/800/400?random=1",
  "https://picsum.photos/800/400?random=2", 
  "https://picsum.photos/800/400?random=3",
  "https://picsum.photos/800/400?random=4",
  "https://picsum.photos/800/400?random=5",
  "https://picsum.photos/800/400?random=6",
  "https://picsum.photos/800/400?random=7",
  "https://picsum.photos/800/400?random=8",
  "https://picsum.photos/800/400?random=9",
  "https://picsum.photos/800/400?random=10",
  "https://picsum.photos/800/400?random=11",
  "https://picsum.photos/800/400?random=12",
  "https://picsum.photos/800/400?random=13",
  "https://picsum.photos/800/400?random=14",
  "https://picsum.photos/800/400?random=15",
  "https://picsum.photos/800/400?random=16",
  "https://picsum.photos/800/400?random=17",
  "https://picsum.photos/800/400?random=18",
  "https://picsum.photos/800/400?random=19",
  "https://picsum.photos/800/400?random=20",
  "https://picsum.photos/800/400?random=21"
  ];

  const totalSlides = propertyImages.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play opcional (descomenta si lo deseas)
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-10">
          <h2 className="text-2xl font-semibold text-gray-600">No se encontraron datos de la propiedad</h2>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header />
    
    {/* Separación del header */}
    <div className="h-8 bg-white"></div>
    
    <div className="max-w-7xl mx-auto px-5 py-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 mb-4">
              {property.title || 'Lakeview Haven, Lake Tahoe'}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>🛏️</span>
                <span>{property.rooms || 4} cuartos</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🚿</span>
                <span>{property.bathrooms || 3} baños</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📐</span>
                <span>{property.area || 2850} m²</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏠</span>
                <span>Casa</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-3xl lg:text-4xl font-bold text-black">
              ${property.price || '250,000'}
            </div>
          </div>
        </div>
        
        {/* Línea divisoria que va desde el título hasta el precio */}
        <div className="w-full h-0.5 bg-gray-200"></div>
      </div>

      {/* Separación extra antes del carrusel */}
      <div className="mb-8"></div>

      {/* Carrusel de imágenes - 3 columnas */}
      <div className="relative w-full h-96 lg:h-[500px] mb-12 rounded-xl overflow-hidden shadow-xl">
        <div className="relative w-full h-full">
          <div 
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Agrupamos las imágenes de 3 en 3 */}
            {Array.from({ length: Math.ceil(propertyImages.length / 3) }, (_, slideIndex) => (
              <div key={slideIndex} className="min-w-full h-full flex gap-2 p-2">
                {propertyImages.slice(slideIndex * 3, slideIndex * 3 + 3).map((image, imageIndex) => (
                  <div key={imageIndex} className="flex-1 h-full">
                    <img 
                      src={image} 
                      alt={`Imagen ${slideIndex * 3 + imageIndex + 1} de la propiedad`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
                {/* Rellenar con espacios vacíos si no hay suficientes imágenes */}
                {propertyImages.slice(slideIndex * 3, slideIndex * 3 + 3).length < 3 && 
                  Array.from({ length: 3 - propertyImages.slice(slideIndex * 3, slideIndex * 3 + 3).length }, (_, emptyIndex) => (
                    <div key={`empty-${emptyIndex}`} className="flex-1 h-full bg-gray-200 rounded-lg"></div>
                  ))
                }
              </div>
            ))}
          </div>
          
          {/* Flechas de navegación */}
          <button 
            onClick={previousSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
          
          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {propertyImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sección izquierda - Descripción y detalles */}
        <div className="lg:col-span-2 space-y-10">
          {/* Descripción */}
          <div className="bg-white p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Descripción</h2>
            
            {/* Línea divisoria debajo del título de sección */}
            <div className="w-16 h-0.5 bg-gray-200 mb-6"></div>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              {property.description || 
              `Esta hermosa propiedad ofrece una experiencia de vida excepcional con acabados de primera calidad y ubicación privilegiada. 
              Perfecta para familias que buscan confort, elegancia y funcionalidad en cada espacio.`}
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Con amplios espacios, diseño moderno y excelente ubicación, esta propiedad representa una oportunidad única 
              de inversión o para establecer su hogar ideal.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Descripción General</h3>
            
            {/* Línea divisoria debajo del subtítulo */}
            <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">{property.rooms || 4}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Camas</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">{property.bathrooms || 3}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Baños</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Garajes</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">{property.area || 2850}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">M²</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">1985</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Año</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-lg font-bold text-blue-600">Casa</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Tipo</div>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="bg-white p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Mapa</h2>
            
            {/* Línea divisoria debajo del título */}
            <div className="w-16 h-0.5 bg-gray-200 mb-6"></div>
            
            <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                className="w-full h-full"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address || 'Lake Tahoe')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
                title="Ubicación de la propiedad"
              />
            </div>
          </div>
        </div>

        {/* Sección derecha - Contacto y propiedades destacadas */}
        <div className="space-y-8">
          {/* Agente de contacto */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Agente</h2>
            
            {/* Línea divisoria debajo del título */}
            <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {property.agentName ? property.agentName.split(' ').map(n => n[0]).join('') : 'MC'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {property.agentName || 'Marina Chvernak'}
                </h3>
                <div className="text-sm text-gray-600">+47 222444666</div>
                <div className="text-sm text-gray-600">marina@example.com</div>
              </div>
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
              Contactar →
            </button>
          </div>

          {/* Propiedades destacadas */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Propiedades Destacadas</h2>
            
            {/* Línea divisoria debajo del título */}
            <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>
            
            {[
              { name: 'Casa Lomas Del Monte', beds: 3, baths: 2, area: 1800, price: 180000 },
              { name: 'Villa Moderna Centro', beds: 2, baths: 1, area: 1200, price: 145000 },
              { name: 'Casa Familiar Premium', beds: 4, baths: 3, area: 2200, price: 220000 }
            ].map((prop, index) => (
              <div key={index} className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0">
                <img 
                  src={`https://source.unsplash.com/80x60/?house,${index}`}
                  alt={prop.name}
                  className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">{prop.name}</h4>
                  <div className="flex gap-3 text-xs text-gray-500 mb-2">
                    <span>🛏️ {prop.beds}</span>
                    <span>🚿 {prop.baths}</span>
                    <span>📐 {prop.area} m²</span>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    ${prop.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </> 
    
  );
};