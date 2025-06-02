import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, User, ArrowLeft } from 'lucide-react';
import { Header } from '../../Layouts/Header/Header';

const UpdateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Campos básicos
    title: '',
    address: '',
    type: '',
    description: '',
    
    // Campos numéricos específicos
    rooms: '',
    bathrooms: '',
    area: '',
    price: '',
    
    // Información del agente
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    agentWhatsapp: '',
    
    // Información adicional
    propertyType: 'venta',
    additionalRoomInfo: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Para nuevas imágenes
  const [existingImages, setExistingImages] = useState([]); // Imágenes existentes
  const [imagesToDelete, setImagesToDelete] = useState([]); // IDs de imágenes a eliminar
  const [precioEstimado, setPrecioEstimado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [propertyNotFound, setPropertyNotFound] = useState(false);

  // Cargar datos existentes de la propiedad
  useEffect(() => {
    const loadPropertyData = async () => {
      if (!id) {
        setPropertyNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // AQUÍ EL BACKEND DEBE IMPLEMENTAR EL ENDPOINT PARA OBTENER LA PROPIEDAD
        /*
        const response = await fetch(`/api/properties/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setPropertyNotFound(true);
            return;
          }
          throw new Error('Error al cargar la propiedad');
        }
        
        const property = await response.json();
        */
        
        // SIMULACIÓN TEMPORAL (remover cuando se conecte al backend real)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red
        
        // Datos simulados - reemplazar con datos reales del backend
        const property = {
          id: id,
          title: 'Casa en venta ejemplo',
          address: 'Calle 123 #45-67, Ciudad',
          type: 'casa',
          description: 'Hermosa casa con excelente ubicación...',
          rooms: 3,
          bathrooms: 2,
          area: 120,
          price: '250000000',
          propertyType: 'venta',
          additionalRoomInfo: 'Incluye estudio',
          agent: {
            name: 'Juan Pérez',
            phone: '3001234567',
            email: 'juan@ejemplo.com',
            whatsapp: '3001234567'
          },
          images: [
            { id: 1, url: 'https://via.placeholder.com/300x200?text=Imagen+1' },
            { id: 2, url: 'https://via.placeholder.com/300x200?text=Imagen+2' }
          ]
        };
        
        // Llenar el formulario con los datos existentes
        setFormData({
          title: property.title || '',
          address: property.address || '',
          type: property.type || '',
          description: property.description || '',
          rooms: property.rooms?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          area: property.area?.toString() || '',
          price: property.price || '',
          agentName: property.agent?.name || '',
          agentPhone: property.agent?.phone || '',
          agentEmail: property.agent?.email || '',
          agentWhatsapp: property.agent?.whatsapp || '',
          propertyType: property.propertyType || 'venta',
          additionalRoomInfo: property.additionalRoomInfo || ''
        });
        
        // Cargar imágenes existentes
        setExistingImages(property.images || []);
        
      } catch (error) {
        console.error('Error al cargar propiedad:', error);
        setSubmitError('Error al cargar los datos de la propiedad');
      } finally {
        setIsLoading(false);
      }
    };

    loadPropertyData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    // Para mostrar preview de nuevas imágenes
    setSelectedImages(prev => [...prev, ...imageUrls]);
    // Para enviar al backend
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeNewImage = (indexToRemove) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    setImagesToDelete(prev => [...prev, imageId]);
  };

  // Función para validar el formulario
  const validateForm = () => {
    const requiredFields = [
      'title', 'address', 'type', 'description', 'rooms', 
      'bathrooms', 'area', 'price', 'agentName', 'agentPhone', 'agentEmail'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`El campo ${field} es requerido`);
        return false;
      }
    }
    
    // Validar que rooms, bathrooms y area sean números válidos
    if (isNaN(formData.rooms) || formData.rooms < 0) {
      setSubmitError('El número de habitaciones debe ser válido');
      return false;
    }
    
    if (isNaN(formData.bathrooms) || formData.bathrooms < 0) {
      setSubmitError('El número de baños debe ser válido');
      return false;
    }
    
    if (isNaN(formData.area) || formData.area <= 0) {
      setSubmitError('El área debe ser un número válido mayor a 0');
      return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.agentEmail)) {
      setSubmitError('El email del agente no es válido');
      return false;
    }
    
    return true;
  };

  // Función para actualizar la propiedad
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetear estados
    setSubmitError('');
    setSubmitSuccess(false);
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Crear FormData para enviar archivos e información
      const formDataToSend = new FormData();
      
      // Preparar datos actualizados de la propiedad
      const propertyData = {
        // Información básica
        title: formData.title.trim(),
        address: formData.address.trim(),
        type: formData.type,
        description: formData.description.trim(),
        propertyType: formData.propertyType,
        
        // Características numéricas
        rooms: parseInt(formData.rooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        price: formData.price.replace(/[^\d]/g, ''),
        
        // Información del agente
        agent: {
          name: formData.agentName.trim(),
          phone: formData.agentPhone.trim(),
          email: formData.agentEmail.trim().toLowerCase(),
          whatsapp: formData.agentWhatsapp.trim() || formData.agentPhone.trim()
        },
        
        // Información adicional
        additionalRoomInfo: formData.additionalRoomInfo.trim(),
        
        // Imágenes a eliminar
        imagesToDelete: imagesToDelete,
        
        // Metadatos
        updatedAt: new Date().toISOString()
      };
      
      // Agregar datos JSON al FormData
      formDataToSend.append('propertyData', JSON.stringify(propertyData));
      
      // Agregar nuevas imágenes al FormData
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`newImages`, file);
      });
      
      // AQUÍ ES DONDE EL DESARROLLADOR BACKEND DEBE IMPLEMENTAR LA LLAMADA
      /*
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT', // o PATCH según la implementación
        body: formDataToSend,
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la propiedad');
      }
      
      const result = await response.json();
      */
      
      // SIMULACIÓN TEMPORAL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Datos preparados para actualización:', {
        propertyId: id,
        propertyData,
        newImageCount: imageFiles.length,
        imagesToDelete: imagesToDelete,
        formDataKeys: Array.from(formDataToSend.keys())
      });
      
      // Éxito
      setSubmitSuccess(true);
      
      // Opcional: redirigir después del éxito
      setTimeout(() => {
        navigate('/MiInmobiliaria');
      }, 2000);
      
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      setSubmitError(error.message || 'Error al actualizar la propiedad. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSolicitarValoracion = async () => {
    if (!formData.area || !formData.type || !formData.address) {
      alert('Por favor completa el área, tipo de propiedad y dirección para solicitar valoración');
      return;
    }
    
    try {
      // Simulación temporal de valoración
      const basePrice = Math.random() * 500000 + 200000;
      const formattedPrice = new Intl.NumberFormat('es-CO').format(basePrice);
      setPrecioEstimado(formattedPrice);
      
      setFormData(prev => ({
        ...prev,
        price: formattedPrice
      }));
      
    } catch (error) {
      console.error('Error en valoración:', error);
      alert('Error al solicitar valoración. Intenta de nuevo.');
    }
  };

  const handleGoBack = () => {
    navigate('/MiInmobiliaria');
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos de la propiedad...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Propiedad no encontrada
  if (propertyNotFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h1>
            <p className="text-gray-600 mb-6">La propiedad que buscas no existe o ha sido eliminada.</p>
            <button
              onClick={handleGoBack}
              className="bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors"
            >
              Volver a Propiedades
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Propiedades
          </button>
        </div>

        {/* Mensajes de estado */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {submitError}
          </div>
        )}
        
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            ¡Propiedad actualizada exitosamente!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Formulario */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Editar Propiedad
              </h1>
              
              <div className="space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Información Básica
                  </h3>
                  
                  <input
                    type="text"
                    name="title"
                    placeholder="Título de la Propiedad *"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Dirección Completa *"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tipo de Propiedad *</option>
                      <option value="casa">Casa</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="local">Local Comercial</option>
                      <option value="oficina">Oficina</option>
                      <option value="terreno">Terreno</option>
                    </select>

                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="venta">En Venta</option>
                      <option value="alquiler">En Alquiler</option>
                    </select>
                  </div>
                </div>

                {/* Características de la propiedad */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Características
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      name="rooms"
                      placeholder="Habitaciones *"
                      value={formData.rooms}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                      type="number"
                      name="bathrooms"
                      placeholder="Baños *"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                      type="number"
                      name="area"
                      placeholder="Área (m²) *"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <input
                    type="text"
                    name="additionalRoomInfo"
                    placeholder="Información Adicional de Habitaciones"
                    value={formData.additionalRoomInfo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <input
                    type="text"
                    name="price"
                    placeholder="Precio (sin símbolo $) *"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Información del agente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Información del Agente
                  </h3>
                  
                  <input
                    type="text"
                    name="agentName"
                    placeholder="Nombre del Agente *"
                    value={formData.agentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      name="agentPhone"
                      placeholder="Teléfono *"
                      value={formData.agentPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                      type="tel"
                      name="agentWhatsapp"
                      placeholder="WhatsApp (opcional)"
                      value={formData.agentWhatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <input
                    type="email"
                    name="agentEmail"
                    placeholder="Email del Agente *"
                    value={formData.agentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <textarea
                    name="description"
                    placeholder="Descripción de la Propiedad *"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-[#2F8EAC] text-white hover:bg-[#267a95]'
                  }`}
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Propiedad'}
                </button>
              </div>
            </div>

            {/* Panel derecho */}
            <div className="space-y-6">
              {/* Sección de imágenes existentes */}
              {existingImages.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Imágenes Actuales
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`Propiedad ${image.id}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de nuevas imágenes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {existingImages.length > 0 ? 'Agregar Nuevas Imágenes' : 'Imágenes de la Propiedad'}
                </h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  {selectedImages.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Nueva imagen ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {selectedImages.length} nueva(s) imagen(es) seleccionada(s)
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="w-16 h-12 bg-gray-300 rounded flex items-center justify-center">
                          📷
                        </div>
                      </div>
                      <p className="text-gray-500 mb-4">No hay nuevas imágenes seleccionadas</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    Seleccionar Nuevas Imágenes
                  </label>
                </div>
              </div>

              {/* Valoración automática */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Valoración Automática
                  </p>
                  {precioEstimado && (
                    <p className="text-2xl font-bold text-green-600">
                      ${precioEstimado}
                    </p>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={handleSolicitarValoracion}
                  className="w-full bg-[#2F8EAC] text-white py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>📊</span>
                  Solicitar Nueva Valoración
                </button>
                
                {precioEstimado && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    * El precio se ha actualizado automáticamente en el formulario
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProperty;