import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../Layouts/Header/Header';

export const PropiedadSeleccionada = () => {
  const { state } = useLocation();
  const { id } = useParams(); // Para obtener el ID de la URL
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(state?.property || null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(!property);
  const [error, setError] = useState(null);

  // Función para obtener la propiedad por ID si no viene en el state
  const fetchProperty = async (propertyId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/properties/${propertyId}`);
      
      if (!response.ok) {
        throw new Error('Propiedad no encontrada');
      }
      
      const data = await response.json();
      setProperty(data.property);
      
      // También obtener propiedades relacionadas
      fetchRelatedProperties(propertyId);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener propiedades relacionadas
  const fetchRelatedProperties = async (propertyId) => {
    try {
      const response = await fetch(`http://localhost:10101/api/properties/${propertyId}/related?limit=3`);
      if (response.ok) {
        const data = await response.json();
        setRelatedProperties(data.related_properties || []);
      }
    } catch (error) {
      console.error('Error fetching related properties:', error);
    }
  };

  useEffect(() => {
    if (!property && id) {
      fetchProperty(id);
    } else if (property && id) {
      fetchRelatedProperties(id);
    }
  }, [id, property]);

  // Obtener imágenes de la propiedad - usar las imágenes reales o fallback
  const getPropertyImages = () => {
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images;
    }
    
    // Fallback a imágenes de ejemplo si no hay imágenes reales
    return [
      "https://picsum.photos/800/400?random=1",
      "https://picsum.photos/800/400?random=2", 
      "https://picsum.photos/800/400?random=3",
      "https://picsum.photos/800/400?random=4",
      "https://picsum.photos/800/400?random=5"
    ];
  };

  const propertyImages = getPropertyImages();
  const totalSlides = Math.ceil(propertyImages.length / 3);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play opcional
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Función para formatear precio
  const formatPrice = (price) => {
    if (!price) return 'Precio no disponible';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Función para formatear área
  const formatArea = (area) => {
    if (!area) return 'N/A';
    return `${area} m²`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Cargando propiedad...</h2>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-10">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            {error || 'No se encontraron datos de la propiedad'}
          </h2>
          <button
            onClick={() => navigate('/properties')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver a propiedades
          </button>
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
                {property.title || 'Propiedad sin título'}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <span>🛏️</span>
                  <span>{property.bedrooms || 0} habitaciones</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🚿</span>
                  <span>{property.bathrooms || 0} baños</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📐</span>
                  <span>{formatArea(property.built_area)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🏠</span>
                  <span>{property.property_type || 'N/A'}</span>
                </div>
                {property.parking_spaces > 0 && (
                  <div className="flex items-center gap-1">
                    <span>🚗</span>
                    <span>{property.parking_spaces} parqueaderos</span>
                  </div>
                )}
              </div>

              {/* Información de ubicación */}
              {property.address && (
                <div className="text-sm text-gray-600 mb-2">
                  📍 {property.address}
                  {property.neighborhood && `, ${property.neighborhood}`}
                  {property.city && `, ${property.city}`}
                </div>
              )}

              {/* Tipo de operación y estrato */}
              <div className="flex gap-4 text-sm">
                {property.operation_type && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {property.operation_type}
                  </span>
                )}
                {property.socioeconomic_stratum && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Estrato {property.socioeconomic_stratum}
                  </span>
                )}
                {property.status && (
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    property.status === 'Disponible' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-3xl lg:text-4xl font-bold text-black">
                {formatPrice(property.price)}
              </div>
            </div>
          </div>
          
          {/* Línea divisoria */}
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
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="min-w-full h-full flex gap-2 p-2">
                  {propertyImages.slice(slideIndex * 3, slideIndex * 3 + 3).map((image, imageIndex) => (
                    <div key={imageIndex} className="flex-1 h-full">
                      <img 
                        src={image} 
                        alt={`Imagen ${slideIndex * 3 + imageIndex + 1} de la propiedad`}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = `https://picsum.photos/800/400?random=${slideIndex * 3 + imageIndex + 1}`;
                        }}
                      />
                    </div>
                  ))}
                  {/* Rellenar con espacios vacíos si no hay suficientes imágenes */}
                  {propertyImages.slice(slideIndex * 3, slideIndex * 3 + 3).length < 3 && 
                    Array.from({ length: 3 - propertyImages.slice(slideIndex * 3, slideIndex * 3 + 3).length }, (_, emptyIndex) => (
                      <div key={`empty-${emptyIndex}`} className="flex-1 h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    ))
                  }
                </div>
              ))}
            </div>
            
            {/* Flechas de navegación */}
            {totalSlides > 1 && (
              <>
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
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sección izquierda - Descripción y detalles */}
          <div className="lg:col-span-2 space-y-10">
            {/* Descripción */}
            <div className="bg-white p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Descripción</h2>
              
              <div className="w-16 h-0.5 bg-gray-200 mb-6"></div>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                {property.description || 
                'Esta hermosa propiedad ofrece una experiencia de vida excepcional con acabados de primera calidad y ubicación privilegiada. Perfecta para familias que buscan confort, elegancia y funcionalidad en cada espacio.'}
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">Características Generales</h3>
              
              <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{property.bedrooms || 0}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Habitaciones</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{property.bathrooms || 0}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Baños</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{property.parking_spaces || 0}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Parqueaderos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{property.built_area || 0}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">M² Construidos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{property.total_area || property.built_area || 0}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">M² Totales</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-lg font-bold text-blue-600">{property.property_type || 'N/A'}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Tipo</div>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ubicación</h2>
              
              <div className="w-16 h-0.5 bg-gray-200 mb-6"></div>
              
              <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  className="w-full h-full"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    property.address || `${property.city || ''} ${property.neighborhood || ''}`
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Contactar Agente</h2>
              
              <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {property.agentInfo?.initials || 
                   (property.agentInfo?.name ? 
                    property.agentInfo.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                    'AG')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {property.agentInfo?.name || 'Agente Inmobiliario'}
                  </h3>
                  {property.agentInfo?.phone && (
                    <div className="text-sm text-gray-600">{property.agentInfo.phone}</div>
                  )}
                  {property.agentInfo?.email && (
                    <div className="text-sm text-gray-600">{property.agentInfo.email}</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate('/contact-agent', { 
                  state: { 
                    agent: property.agentInfo, 
                    property: property 
                  } 
                })}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Contactar →
              </button>
            </div>

            {/* Propiedades relacionadas */}
            {relatedProperties.length > 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Propiedades Similares</h2>
                
                <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>
                
                {relatedProperties.map((prop, index) => (
                  <div 
                    key={prop.id || index} 
                    className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    onClick={() => navigate(`/property/${prop.id}`)}
                  >
                    <img 
                      src={prop.images?.[0] || `https://picsum.photos/80/60?random=${index + 10}`}
                      alt={prop.title}
                      className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/80/60?random=${index + 10}`;
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-800 mb-1">
                        {prop.title || `Propiedad ${index + 1}`}
                      </h4>
                      <div className="flex gap-3 text-xs text-gray-500 mb-2">
                        <span>🛏️ {prop.bedrooms || 0}</span>
                        <span>🚿 {prop.bathrooms || 0}</span>
                        <span>📐 {formatArea(prop.built_area)}</span>
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        {formatPrice(prop.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </> 
  );
};