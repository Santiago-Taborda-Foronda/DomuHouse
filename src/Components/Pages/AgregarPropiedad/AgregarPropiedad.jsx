import React, { useState } from 'react';
import { Menu, User, ArrowLeft } from 'lucide-react';
import { Header } from '../../Layouts/Header/Header';

const AgregarPropiedad = () => {
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
    propertyType: 'Venta', // Cambiado de 'venta' a 'Venta'
    additionalRoomInfo: '',
    
    // Nuevos campos para backend
    socioeconomic_stratum: '',
    city: '',
    neighborhood: '',
    parking_spaces: '',
    total_area: '',
    latitude: '',
    longitude: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [precioEstimado, setPrecioEstimado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    
    setSelectedImages(prev => [...prev, ...imageUrls]);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Mapeo de tipos de propiedad a IDs del backend
  const getPropertyTypeId = (type) => {
    const typeMap = {
      'casa': 1,
      'apartamento': 2,
      'local': 3,
      'oficina': 4,
      'terreno': 5
    };
    return typeMap[type] || 1;
  };

  // Función para mapear el tipo de operación del frontend al backend
  const mapOperationType = (frontendType) => {
    const operationMap = {
      'Venta': 'Venta',
      'Arriendo': 'Arriendo',
      'Arriendo con opción de compra': 'Arriendo con opción de compra'
    };
    return operationMap[frontendType] || 'Venta';
  };

  // Función para validar el formulario
  const validateForm = () => {
    const requiredFields = [
      'title', 'address', 'type', 'description', 'rooms', 
      'bathrooms', 'area', 'price', 'agentName', 'agentPhone', 'agentEmail',
      'city', 'neighborhood'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`El campo ${field} es requerido`);
        return false;
      }
    }
    
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
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.agentEmail)) {
      setSubmitError('El email del agente no es válido');
      return false;
    }
    
    if (imageFiles.length === 0) {
      setSubmitError('Debe seleccionar al menos una imagen');
      return false;
    }

    if (imageFiles.length > 10) {
      setSubmitError('Máximo 10 imágenes permitidas');
      return false;
    }
    
    return true;
  };

  // Función para envío al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitError('');
    setSubmitSuccess(false);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Crear FormData para enviar archivos e información
      const formDataToSend = new FormData();
      
      // Mapear campos del frontend a los que espera el backend
      formDataToSend.append('address', formData.address.trim()); // Nota: el backend usa 'adress'
      formDataToSend.append('property_title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price.replace(/[^\d]/g, ''));
      formDataToSend.append('status', 'Disponible');
      formDataToSend.append('person_id', '1'); // Debes obtener esto del usuario logueado
      formDataToSend.append('property_type_id', getPropertyTypeId(formData.type));
      formDataToSend.append('socioeconomic_stratum', formData.socioeconomic_stratum || '3');
      formDataToSend.append('city', formData.city.trim());
      formDataToSend.append('neighborhood', formData.neighborhood.trim());
      formDataToSend.append('operation_type', mapOperationType(formData.propertyType)); // Usar la función de mapeo
      formDataToSend.append('bedrooms', parseInt(formData.rooms));
      formDataToSend.append('bathrooms', parseInt(formData.bathrooms));
      formDataToSend.append('parking_spaces', parseInt(formData.parking_spaces) || 0);
      formDataToSend.append('built_area', parseInt(formData.area));
      formDataToSend.append('total_area', parseInt(formData.total_area) || parseInt(formData.area));
      formDataToSend.append('latitude', formData.latitude || '0');
      formDataToSend.append('longitude', formData.longitude || '0');
      
      // Agregar imágenes
      imageFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });
      
      // Llamada al API del backend
      const response = await fetch('http://localhost:10101/api/properties', {
        method: 'POST',
        body: formDataToSend,
        // No agregar Content-Type header, el browser lo maneja automáticamente con FormData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la propiedad');
      }
      
      const result = await response.json();
      console.log('Propiedad creada exitosamente:', result);
      
      setSubmitSuccess(true);
      
      // Limpiar formulario después del éxito
      setTimeout(() => {
        resetForm();
      }, 2000);
      
    } catch (error) {
      console.error('Error al enviar propiedad:', error);
      setSubmitError(error.message || 'Error al registrar la propiedad. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

// ------------------------

//   const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   setSubmitError('');
//   setSubmitSuccess(false);
  
//   if (!validateForm()) {
//     return;
//   }
  
//   setIsSubmitting(true);
  
//   try {
//     // Crear FormData para enviar archivos e información
//     const formDataToSend = new FormData();
    
//     // Mapear campos del frontend a los que espera el backend
//     formDataToSend.append('address', formData.address.trim()); // Corregido: 'address' en lugar de 'adress'
//     formDataToSend.append('property_title', formData.title.trim());
//     formDataToSend.append('description', formData.description.trim());
//     formDataToSend.append('price', formData.price.replace(/[^\d]/g, ''));
//     formDataToSend.append('status', 'Disponible');
//     formDataToSend.append('person_id', '1'); // TODO: Obtener del usuario autenticado
//     formDataToSend.append('property_type_id', getPropertyTypeId(formData.type));
//     formDataToSend.append('socioeconomic_stratum', formData.socioeconomic_stratum || '3');
//     formDataToSend.append('city', formData.city.trim());
//     formDataToSend.append('neighborhood', formData.neighborhood.trim());
//     formDataToSend.append('operation_type', mapOperationType(formData.propertyType));
//     formDataToSend.append('bedrooms', parseInt(formData.rooms));
//     formDataToSend.append('bathrooms', parseInt(formData.bathrooms));
//     formDataToSend.append('parking_spaces', parseInt(formData.parking_spaces) || 0);
//     formDataToSend.append('built_area', parseInt(formData.area));
//     formDataToSend.append('total_area', parseInt(formData.total_area) || parseInt(formData.area));
//     formDataToSend.append('latitude', formData.latitude || '0');
//     formDataToSend.append('longitude', formData.longitude || '0');
    
//     // Agregar imágenes
//     imageFiles.forEach((file) => {
//       formDataToSend.append('images', file); // 'images' debe coincidir con el nombre en multer
//     });
    
//     // Llamada al API del backend
//     const response = await fetch('http://localhost:10101/api/properties', {
//       method: 'POST',
//       body: formDataToSend,
//       credentials: 'include', // Incluir cookies para autenticación si es necesario
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'Error al crear la propiedad');
//     }
    
//     const result = await response.json();
//     console.log('Propiedad creada exitosamente:', result);
    
//     setSubmitSuccess(true);
    
//     // Limpiar formulario después del éxito
//     setTimeout(() => {
//       resetForm();
//     }, 2000);
    
//   } catch (error) {
//     console.error('Error al enviar propiedad:', error);
//     setSubmitError(error.message || 'Error al registrar la propiedad. Intenta de nuevo.');
//   } finally {
//     setIsSubmitting(false);
//   }
// };
  
  const resetForm = () => {
    setFormData({
      title: '',
      address: '',
      type: '',
      description: '',
      rooms: '',
      bathrooms: '',
      area: '',
      price: '',
      agentName: '',
      agentPhone: '',
      agentEmail: '',
      agentWhatsapp: '',
      propertyType: 'Venta', // Cambiado de 'venta' a 'Venta'
      additionalRoomInfo: '',
      socioeconomic_stratum: '',
      city: '',
      neighborhood: '',
      parking_spaces: '',
      total_area: '',
      latitude: '',
      longitude: ''
    });
    setSelectedImages([]);
    setImageFiles([]);
    setPrecioEstimado('');
    setSubmitError('');
    setSubmitSuccess(false);
  };

  const handleSolicitarValoracion = async () => {
    if (!formData.area || !formData.type || !formData.address) {
      alert('Por favor completa el área, tipo de propiedad y dirección para solicitar valoración');
      return;
    }
    
    try {
      // Simulación temporal - puedes implementar un endpoint de valoración
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
    window.history.back();
  };

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
            Volver
          </button>
        </div>

        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {submitError}
          </div>
        )}
        
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            ¡Propiedad registrada exitosamente!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Agregar Propiedad
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
                    <input
                      type="text"
                      name="city"
                      placeholder="Ciudad *"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                      type="text"
                      name="neighborhood"
                      placeholder="Barrio *"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

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
                      <option value="Venta">En Venta</option>
                      <option value="Arriendo">En Arriendo</option>
                      <option value="Arriendo con opción de compra">Arriendo con opción de compra</option>
                    </select>
                  </div>

                  <select
                    name="socioeconomic_stratum"
                    value={formData.socioeconomic_stratum}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Estrato Socioeconómico</option>
                    <option value="1">Estrato 1</option>
                    <option value="2">Estrato 2</option>
                    <option value="3">Estrato 3</option>
                    <option value="4">Estrato 4</option>
                    <option value="5">Estrato 5</option>
                    <option value="6">Estrato 6</option>
                  </select>
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
                      name="parking_spaces"
                      placeholder="Parqueaderos"
                      value={formData.parking_spaces}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="area"
                      placeholder="Área Construida (m²) *"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                      type="number"
                      name="total_area"
                      placeholder="Área Total (m²)"
                      value={formData.total_area}
                      onChange={handleInputChange}
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

                {/* Ubicación GPS (opcional) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Ubicación GPS (Opcional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="latitude"
                      placeholder="Latitud"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                      type="number"
                      name="longitude"
                      placeholder="Longitud"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
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
                  {isSubmitting ? 'Registrando...' : 'Registrar Propiedad'}
                </button>
              </div>
            </div>

            {/* Panel derecho */}
            <div className="space-y-6">
              {/* Sección de imágenes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Imágenes de la Propiedad *
                </h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  {selectedImages.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Propiedad ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {selectedImages.length} imagen(es) seleccionada(s) (máximo 10)
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="w-16 h-12 bg-gray-300 rounded flex items-center justify-center">
                          📷
                        </div>
                      </div>
                      <p className="text-gray-500 mb-4">No hay imágenes seleccionadas</p>
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
                    {selectedImages.length > 0 ? 'Agregar más imágenes' : 'Seleccionar Imágenes *'}
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
                  Solicitar Valoración Automática
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

export default AgregarPropiedad;