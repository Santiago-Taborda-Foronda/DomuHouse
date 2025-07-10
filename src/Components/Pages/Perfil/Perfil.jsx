"use client"
import { useState, useEffect } from "react"
import { User, Edit2, Save, X, Eye, Edit, Trash2, Mail, Lock, Camera, Loader2, AlertCircle, Shield, Check, AlertTriangle } from "lucide-react"

export const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("publicadas")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [misPropiedades, setMisPropiedades] = useState([])
  const [totalMisPropiedades, setTotalMisPropiedades] = useState(0)
  const [alert, setAlert] = useState({
  show: false,
  type: 'info',
  message: ''
});


  // Estados para los modales
  const [newImages, setNewImages] = useState([]);
const [imagesToRemove, setImagesToRemove] = useState([]);

  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    status: "",
    type: "",
    area: "",
    rooms: "",
    bathrooms: "",
  })

  const [userData, setUserData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    contraseña: "••••••••••••••••",
    fechaRegistro: "",
    role: "",
    propiedadesPublicadas: 0,
    propiedadesVendidas: 0,
    verified: false,
    active: false,
  })

  const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  setNewImages([...newImages, ...files]);
  
  // Actualizar las imágenes mostradas en el modal
  setSelectedProperty(prev => ({
    ...prev,
    images: [...prev.images, ...files]
  }));
};

// Modifica la función handleRemoveImage así:
const handleRemoveImage = (index) => {
  const imgToRemove = selectedProperty.images[index];
  
  // Si es una imagen existente (no nueva), agregar a la lista de imágenes a eliminar
  if (typeof imgToRemove === 'string') {
    setImagesToRemove([...imagesToRemove, imgToRemove]);
  } else if (imgToRemove instanceof File) {
    // Si es una imagen nueva, simplemente quitarla de newImages
    const newIndex = newImages.findIndex(img => 
      img.name === imgToRemove.name && img.size === imgToRemove.size
    );
    if (newIndex !== -1) {
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(newIndex, 1);
      setNewImages(updatedNewImages);
    }
  }
  
  // Filtrar la imagen eliminada
  const updatedImages = [...selectedProperty.images];
  updatedImages.splice(index, 1);
  setSelectedProperty({...selectedProperty, images: updatedImages});
};

  const [tempUserData, setTempUserData] = useState({ ...userData })

  // Función para actualizar localStorage y notificar cambios
  const updateUserDataInStorage = (newUserData) => {
    try {
      const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}")
      const updatedUserData = {
        ...currentUserData,
        name_person: newUserData.nombre,
        name: newUserData.nombre,
        email: newUserData.correo,
        telefono: newUserData.telefono,
      }

      localStorage.setItem("userData", JSON.stringify(updatedUserData))
      window.dispatchEvent(
        new CustomEvent("userDataUpdated", {
          detail: updatedUserData,
        }),
      )
    } catch (error) {
      console.error("❌ Error actualizando localStorage:", error)
    }
  }

  // Función mejorada para obtener y decodificar el token
  const getTokenAndUserInfo = () => {
    if (typeof window === "undefined") return null

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")

    if (!token) {
      console.error("No se encontró token en storage")
      return null
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return {
        token,
        userId: payload.id,
        role: payload.role_id?.toString() || payload.role?.toString() || "2",
        email: payload.email,
        name: payload.name_person || payload.name || "Usuario",
        fullPayload: payload,
      }
    } catch (e) {
      console.error("Error decodificando token:", e)
      return { token }
    }
  }

  // Función mejorada para hacer peticiones autenticadas
  const fetchWithAuth = async (url, options = {}) => {
    const authInfo = getTokenAndUserInfo()

    if (!authInfo?.token) {
      throw new Error("No se encontró token de autenticación")
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authInfo.token}`,
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("❌ Error en fetchWithAuth:", error)
      throw error
    }
  }

  const cargarPropiedadesDelUsuario = async (userId) => {
    try {
      const data = await fetchWithAuth(`http://localhost:10101/api/properties/mis-propiedades/${userId}`)
      setMisPropiedades(data.properties || [])
      setTotalMisPropiedades(data.total || 0)
    } catch (err) {
      console.error("❌ Error al cargar propiedades del usuario:", err)
      setError("Error de conexión. Verifica tu conexión a Internet o la disponibilidad del servidor.")
    }
  }

  // Cargar datos del perfil
  useEffect(() => {
    setIsClient(true)
    const cargarPerfil = async () => {
      try {
        setLoading(true)
        setError(null)
        const authInfo = getTokenAndUserInfo()

        if (!authInfo?.token) {
          setError("No se encontró token de autenticación. Por favor, inicia sesión nuevamente.")
          setLoading(false)
          return
        }

        try {
          const baseUrl = "http://localhost:10101"
          const url = `${baseUrl}/api/getUser/perfil`
          const response = await fetchWithAuth(url)

          if (response.success) {
            const datosUsuario = {
              nombre: response.data.nombre || authInfo.name,
              telefono: response.data.telefono,
              correo: response.data.correo || authInfo.email,
              contraseña: "••••••••••••••••",
              fechaRegistro: response.data.fechaRegistro || new Date().toISOString(),
              role: response.data.role || authInfo.role,
              propiedadesPublicadas: response.data.propiedadesPublicadas || 0,
              propiedadesVendidas: response.data.propiedadesVendidas || 0,
              verified: response.data.verified || false,
              active: response.data.active || true,
            }
            setUserData(datosUsuario)
            setTempUserData(datosUsuario)
          } else {
            throw new Error(response.message || "Error en la respuesta del servidor")
          }
        } catch (backendError) {
          const datosUsuario = {
            nombre: authInfo.name,
            telefono: authInfo.telefono,
            correo: authInfo.email,
            contraseña: "••••••••••••••••",
            fechaRegistro: new Date().toISOString(),
            role: authInfo.role,
            propiedadesPublicadas: 0,
            propiedadesVendidas: 0,
            verified: false,
            active: true,
          }
          setUserData(datosUsuario)
          setTempUserData(datosUsuario)
        }
      } catch (err) {
        setError(err.message || "Error de conexión")
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== "undefined") {
      cargarPerfil()
    }

    const authInfo = getTokenAndUserInfo()
    if (authInfo?.userId) {
      cargarPropiedadesDelUsuario(authInfo.userId)
    }
  }, [])

  // Función para actualizar el perfil
  const actualizarPerfil = async (datosActualizados) => {
    try {
      setSaving(true)
      const baseUrl = "http://localhost:10101"
      const response = await fetchWithAuth(`${baseUrl}/api/update/perfil`, {
        method: "PUT",
        body: JSON.stringify({
          nombre: datosActualizados.nombre,
          telefono: datosActualizados.telefono,
          correo: datosActualizados.correo,
        }),
      })

      if (response.success) {
        const datosActualizadosCompletos = {
          ...userData,
          nombre: response.data.nombre || datosActualizados.nombre,
          telefono: response.data.telefono || datosActualizados.telefono,
          correo: response.data.correo || datosActualizados.correo,
        }

        setUserData(datosActualizadosCompletos)
        setTempUserData(datosActualizadosCompletos)
        updateUserDataInStorage(datosActualizadosCompletos)

        return { success: true }
      } else {
        throw new Error(response.message || "Error al actualizar el perfil")
      }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setTempUserData({ ...userData })
  }

  const handleSave = async () => {
    if (!tempUserData.nombre.trim()) {
      alert("El nombre es obligatorio")
      return
    }
    if (!tempUserData.correo.trim()) {
      alert("El correo es obligatorio")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(tempUserData.correo)) {
      alert("El formato del correo no es válido")
      return
    }

    const resultado = await actualizarPerfil(tempUserData)
    if (resultado.success) {
      setIsEditing(false)
      alert("Perfil actualizado exitosamente")
    } else {
      alert(`Error al actualizar: ${resultado.error}`)
    }
  }

  const handleCancel = () => {
    setTempUserData({ ...userData })
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setTempUserData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Funciones para los modales de propiedades
  const closeModals = () => {
    setShowViewModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedProperty(null)
    setSubmitSuccess(false)
  }

 const handleViewProperty = (propiedad) => {
  // Procesar las imágenes de la propiedad
  let images = [];
  try {
    if (propiedad.image) {
      if (typeof propiedad.image === 'string' && propiedad.image.startsWith("[")) {
        images = JSON.parse(propiedad.image);
      } else if (Array.isArray(propiedad.image)) {
        images = propiedad.image;
      } else if (typeof propiedad.image === 'string') {
        images = [propiedad.image];
      }
    }
  } catch (e) {
    console.error("Error procesando imágenes:", e);
    images = [];
  }

  setSelectedProperty({
    ...propiedad,
    images: images,
    mainImage: images[0] || "/placeholder.svg"
  });
  setShowViewModal(true);
};

 const handleEditProperty = (propiedad) => {
  // Procesar las imágenes de la propiedad igual que en handleViewProperty
  let images = [];
  try {
    if (propiedad.image) {
      if (typeof propiedad.image === 'string' && propiedad.image.startsWith("[")) {
        images = JSON.parse(propiedad.image);
      } else if (Array.isArray(propiedad.image)) {
        images = propiedad.image;
      } else if (typeof propiedad.image === 'string') {
        images = [propiedad.image];
      }
    }
  } catch (e) {
    console.error("Error procesando imágenes:", e);
    images = [];
  }

  setSelectedProperty({
    ...propiedad,
    images: images,
    mainImage: images[0] || "/placeholder.svg"
  });
  
  setEditForm({
    name: propiedad.property_title || "",
    price: String(propiedad.price).replace(/[^\d]/g, "") || "",
    location: propiedad.address || "",
    description: propiedad.description || "",
    status: propiedad.status || "Disponible",
    type: propiedad.property_type || "Casa",
    area: propiedad.built_area || "",
    rooms: String(propiedad.bedrooms || "0"),
    bathrooms: String(propiedad.bathrooms || "0"),
    operation_type: propiedad.operation_type || "Venta"
  });
  
  setShowEditModal(true);
};


  const handleDeleteProperty = (propiedad) => {
    setSelectedProperty(propiedad)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
  if (!selectedProperty) return;

  setIsSubmitting(true);
  try {
    const authInfo = getTokenAndUserInfo();
    if (!authInfo?.token) throw new Error("No se encontró token de autenticación");

    const response = await fetch(
      `http://localhost:10101/api/properties/eliminar/${selectedProperty.property_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar la propiedad");
    }

    // Actualiza el estado local
    setMisPropiedades(prev => 
      prev.filter(p => p.property_id !== selectedProperty.property_id)
    );
    setTotalMisPropiedades(prev => prev - 1);
    setShowDeleteModal(false);
  } catch (err) {
    console.error("Error al eliminar propiedad:", err);
    alert(err.message);
  } finally {
    setIsSubmitting(false);
  }
};

// Modifica la función handleSaveEdit así:
const handleSaveEdit = async () => {
  if (!selectedProperty) return;

  setIsSubmitting(true);
  try {
    const authInfo = getTokenAndUserInfo();
    if (!authInfo?.token) throw new Error("No se encontró token de autenticación");

    const formData = new FormData();
    
    // Agregar datos JSON como un string
    const propertyData = {
      property_title: editForm.name,
      address: editForm.location,
      description: editForm.description,
      price: Number(editForm.price.replace(/\D/g, '')),
      status: editForm.status,
      bedrooms: Number(editForm.rooms),
      bathrooms: Number(editForm.bathrooms),
      built_area: editForm.area,
      property_type: editForm.type,
      operation_type: editForm.operation_type
    };
    formData.append('data', JSON.stringify(propertyData));

    // Agregar imágenes nuevas (asegurarse de que son File objects)
    newImages.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`images`, image);
      }
    });

    // Agregar imágenes a eliminar (solo URLs)
    if (imagesToRemove.length > 0) {
      imagesToRemove.forEach(imgUrl => {
        if (typeof imgUrl === 'string') {
          formData.append('images_to_remove[]', imgUrl);
        }
      });
    }

    const response = await fetch(
      `http://localhost:10101/api/properties/editar/${selectedProperty.property_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
          // NO incluir Content-Type, el navegador lo establecerá automáticamente con el boundary correcto
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la propiedad");
    }

    const result = await response.json();
    console.log("Respuesta del servidor:", result);

    // Actualizar el estado local con las nuevas imágenes
    const updatedImages = [
      ...selectedProperty.images
        .filter(img => !imagesToRemove.some(toRemove => toRemove === img))
        .map(img => typeof img === 'string' ? img : URL.createObjectURL(img)),
      ...result.newImages || [] // Asumiendo que el backend devuelve las URLs de las nuevas imágenes
    ];

    const updatedProperty = {
      ...selectedProperty,
      ...propertyData,
      images: updatedImages,
      image: JSON.stringify(updatedImages) // Mantener compatibilidad con el formato original
    };

    setMisPropiedades(prev =>
      prev.map(p =>
        p.property_id === selectedProperty.property_id ? updatedProperty : p
      )
    );
    
    setSubmitSuccess(true);
    setTimeout(() => {
      setShowEditModal(false);
      setNewImages([]);
      setImagesToRemove([]);
      setSubmitSuccess(false);
    }, 1500);
  } catch (err) {
    console.error("Error al actualizar propiedad:", err);
    alert(`Error al guardar: ${err.message}`);
  } finally {
    setIsSubmitting(false);
  }
};
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  // Funciones auxiliares
  const getNombreRol = (role) => {
    switch (String(role)) {
      case "1":
        return "ADMINISTRADOR"
      case "2":
        return "AGENTE"
      case "3":
        return "USUARIO"
      default:
        return `ROL ${role}`
    }
  }

  const getColorRol = (role) => {
    switch (String(role)) {
      case "1":
        return "bg-red-100 text-red-700 border-red-200"
      case "2":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "3":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const formatearPrecio = (precio) => {
    const amount = typeof precio === "string" ? Number.parseInt(precio.replace(/\D/g, "")) : precio
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "disponible":
        return "bg-green-100 text-green-800 border border-green-200"
      case "arrendada":
      case "alquilada":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "vendida":
        return "bg-purple-100 text-purple-800 border border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ""
    const date = new Date(fecha)
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const obtenerDatos = () => {
    switch (activeTab) {
      case "publicadas":
        return misPropiedades
      default:
        return []
    }
  }

  const obtenerTitulo = () => {
    switch (activeTab) {
      case "publicadas":
        return "Mis Propiedades Publicadas"
      case "adquiridas":
        return "Propiedades Adquiridas"
      default:
        return ""
    }
  }

  const datosActuales = obtenerDatos()

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#2F8EAC] mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#2F8EAC] mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar el perfil</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#287b93] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const CustomAlert = ({ type = 'info', message, onClose }) => {
  const alertStyles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const iconStyles = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  return (
    <div className={`fixed top-4 right-4 z-50 border rounded-lg p-4 shadow-lg flex items-start gap-3 ${alertStyles[type]} max-w-md`}>
      <div className="mt-0.5">{iconStyles[type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header del perfil */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar y información básica */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-[#2F8EAC] to-[#1e5f73] rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">{userData.nombre}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4" />
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getColorRol(userData.role)}`}>
                  {getNombreRol(userData.role)}
                </span>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("publicadas")}
              >
                <div className="text-3xl font-bold text-blue-700">{totalMisPropiedades}</div>
                <div className="text-blue-600 font-medium">Propiedades Publicadas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Personal */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 text-[#2F8EAC] hover:text-[#287b93] transition-colors hover:bg-[#e6f3f6] rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Editar</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#287b93] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span className="text-sm">{saving ? "Guardando..." : "Guardar"}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Cancelar</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <User className="w-4 h-4" />
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempUserData.nombre : userData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:outline-none focus:ring-2 focus:ring-[#2F8EAC]/20 transition-all ${
                      isEditing ? "text-gray-900 bg-white" : "text-gray-600 bg-gray-50"
                    }`}
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Mail className="w-4 h-4" />
                    Correo
                  </label>
                  <input
                    type="email"
                    value={isEditing ? tempUserData.correo : userData.correo}
                    onChange={(e) => handleInputChange("correo", e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:outline-none focus:ring-2 focus:ring-[#2F8EAC]/20 transition-all ${
                      isEditing ? "text-gray-900 bg-white" : "text-gray-600 bg-gray-50"
                    }`}
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Lock className="w-4 h-4" />
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={userData.contraseña}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 bg-gray-50"
                    readOnly
                    placeholder="••••••••••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">Para cambiar tu contraseña, contacta al administrador</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Propiedades */}
          <div className="lg:col-span-2">
            {/* Pestañas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
              <div className="flex rounded-t-2xl overflow-hidden">
                <button
                  onClick={() => setActiveTab("publicadas")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                    activeTab === "publicadas"
                      ? "text-white bg-[#2F8EAC] shadow-lg"
                      : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  Mis Propiedades ({misPropiedades.length})
                </button>
              </div>
            </div>

            {/* Lista de propiedades */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Mis Propiedades Publicadas</h3>
                <p className="text-sm text-gray-500">Administra tus propiedades ({datosActuales.length} propiedades)</p>
              </div>

              <div className="divide-y divide-gray-200">
                {datosActuales.map((propiedad) => {
                  let mainImage = "/placeholder.svg"
                  try {
                    if (propiedad.image) {
                      if (propiedad.image.startsWith("[")) {
                        const images = JSON.parse(propiedad.image)
                        mainImage = images[0] || mainImage
                      } else if (propiedad.image.startsWith("http")) {
                        mainImage = propiedad.image
                      }
                    }
                  } catch (e) {
                    console.error("Error procesando imagen:", e)
                  }

                  return (
                    <div key={propiedad.property_id} className="p-4">
                      <div className="flex gap-4">
                        {/* Imagen principal */}
                        <div className="w-24 h-20 flex-shrink-0">
                          <img
                            src={mainImage || "/placeholder.svg"}
                            alt={propiedad.property_title}
                            className="w-full h-full object-cover rounded border border-gray-200"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg"
                            }}
                          />
                        </div>

                        {/* Detalles de la propiedad */}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{propiedad.property_title}</h4>
                          <p className="text-sm text-gray-600 mb-1">{propiedad.address}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                            <span>{propiedad.bedrooms || 0} hab</span>
                            <span>{propiedad.bathrooms || 0} baños</span>
                            <span>{propiedad.built_area || 0} m²</span>
                            <span className="capitalize text-blue-600">{propiedad.operation_type}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg text-gray-900">{formatearPrecio(propiedad.price)}</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleViewProperty(propiedad)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditProperty(propiedad)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProperty(propiedad)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
    
    {/* /* -------- Modal de Visualización (Ver) -------- */ }
{showViewModal && selectedProperty && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedProperty.property_title}</h2>
            <p className="text-gray-600">{selectedProperty.address}</p>
          </div>
          <button 
            onClick={closeModals}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Imagen principal */}
        <div className="mb-4">
          <img
            src={selectedProperty.images?.[0] || "/placeholder-property.jpg"}
            alt={selectedProperty.property_title}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "/placeholder-property.jpg"
            }}
          />
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Precio</p>
            <p className="font-semibold">{formatearPrecio(selectedProperty.price)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Estado</p>
            <p className={`font-semibold ${getEstadoColor(selectedProperty.status).replace('border', '').trim()}`}>
              {selectedProperty.status}
            </p>
          </div>
          {/* <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Tipo</p>
            <p className="font-semibold">{selectedProperty.property_type}</p>
          </div> */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Área</p>
            <p className="font-semibold">{selectedProperty.built_area} m²</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Habitaciones</p>
            <p className="font-semibold">{selectedProperty.bedrooms}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Baños</p>
            <p className="font-semibold">{selectedProperty.bathrooms}</p>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Descripción</h3>
          <p className="text-gray-600">
            {selectedProperty.description || "No hay descripción disponible."}
          </p>
        </div>

        {/* Detalles adicionales */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Detalles adicionales</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo de operación:</span>
              <span className="font-medium">{selectedProperty.operation_type}</span>
            </div>
            {/* Agrega más detalles según necesites */}
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={closeModals}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* /* -------- Modal de Edición -------- */ }
{showEditModal && selectedProperty && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
    onClick={(e) => {
      if (e.target === e.currentTarget) closeModals()
    }}
  >
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Editar Propiedad</h2>
          <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            ¡Propiedad actualizada exitosamente!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre:</label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            />
          </div>
          
          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio:</label>
            <input
              type="text"
              name="price"
              value={formatearPrecio(editForm.price)}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                handleEditFormChange({ target: { name: 'price', value } });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            />
          </div>
          
          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación:</label>
            <input
              type="text"
              name="location"
              value={editForm.location}
              onChange={handleEditFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            />
          </div>
          
          {/* Tipo de operación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de operación:</label>
            <select
              name="operation_type"
              value={editForm.operation_type}
              onChange={handleEditFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            >
              <option value="Venta">Venta</option>
              <option value="Arriendo">Arriendo</option>
            </select>
          </div>
          
          {/* Tipo de propiedad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de propiedad:</label>
            <select
              name="type"
              value={editForm.type}
              onChange={handleEditFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            >
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Finca">Finca</option>
            </select>
          </div>
          
          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Área (m²):</label>
            <input
              type="number"
              name="area"
              value={editForm.area}
              onChange={handleEditFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            />
          </div>
          
          {/* Habitaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones:</label>
            <input
              type="number"
              name="rooms"
              value={editForm.rooms}
              onChange={handleEditFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            />
          </div>
          
          {/* Baños */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Baños:</label>
            <input
              type="number"
              name="bathrooms"
              value={editForm.bathrooms}
              onChange={handleEditFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            />
          </div>
          
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado:</label>
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            >
              <option value="Disponible">Disponible</option>
              <option value="Vendida">Vendida</option>
              <option value="Arrendada">Arrendada</option>
            </select>
          </div>
        </div>

        {/* Sección de imágenes */}
        <div className="mb-6 mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Imágenes Actuales</h3>
          
          {selectedProperty.images && selectedProperty.images.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {selectedProperty.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                    alt={`Imagen ${index + 1} de la propiedad`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => e.target.src = "/placeholder.svg"}
                  />
                  <button 
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 mb-6">
              No hay imágenes disponibles
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Agregar Nuevas Imágenes</h3>
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
              {newImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {newImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Nueva imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No hay nuevas imágenes seleccionadas</p>
              )}
              
              <label className="inline-flex items-center px-4 py-2 bg-[#2F8EAC] text-white rounded-lg cursor-pointer hover:bg-[#267a95] transition-colors">
                <Camera className="w-4 h-4 mr-2" />
                Seleccionar Nuevas Imágenes
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción:</label>
          <textarea
            name="description"
            value={editForm.description}
            onChange={handleEditFormChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
            placeholder="Describe la propiedad en detalle..."
          />
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={closeModals}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a95] transition-colors flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Modal de Eliminar */}
      {showDeleteModal && selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals()
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Confirmar Eliminación
                </h2>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-gray-600 mb-4">
                  ¿Estás seguro de que deseas eliminar la propiedad <strong>{selectedProperty.property_title}</strong>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600">Esta acción no se puede deshacer.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeModals}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {isSubmitting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}