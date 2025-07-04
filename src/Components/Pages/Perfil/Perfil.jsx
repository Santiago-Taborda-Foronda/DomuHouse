"use client"
import { useState, useEffect } from "react"
import {
  User,
  Edit2,
  Save,
  X,
  Building2,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Lock,
  Camera,
  Loader2,
  AlertCircle,
} from "lucide-react"

export const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("publicadas")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const [userData, setUserData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    contraseña: "••••••••••••••••",
    fechaRegistro: "",
    propiedadesPublicadas: 0,
    propiedadesVendidas: 0,
  })
  const [tempUserData, setTempUserData] = useState({ ...userData })

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Función corregida para obtener el token - ahora busca 'authToken' primero
  const getToken = () => {
    if (typeof window === "undefined") {
      console.log("🔍 getToken: Ejecutándose en el servidor, retornando null")
      return null
    }

    // Buscar primero 'authToken' que es como lo guarda tu Login
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    console.log("🔍 Tokens encontrados:", {
      authToken: authToken ? "✅ Existe" : "❌ No existe",
      token: token ? "✅ Existe" : "❌ No existe",
    })

    // Verificar también otros posibles nombres de token
    const possibleTokenKeys = ["access_token", "jwt", "user_token"]
    possibleTokenKeys.forEach((key) => {
      const tokenValue = localStorage.getItem(key) || sessionStorage.getItem(key)
      if (tokenValue) {
        console.log(`🔍 Token encontrado con clave '${key}':`, tokenValue.substring(0, 20) + "...")
      }
    })

    // Priorizar 'authToken' ya que es como lo guarda tu Login
    const finalToken = authToken || token
    console.log("🔍 Token final:", finalToken ? "✅ Disponible" : "❌ No disponible")

    if (finalToken) {
      console.log("🔍 Token (primeros 20 caracteres):", finalToken.substring(0, 20) + "...")
    }

    return finalToken
  }

  // Función para hacer peticiones autenticadas
  const fetchWithAuth = async (url, options = {}) => {
    const token = getToken()

    if (!token) {
      throw new Error("No se encontró token de autenticación")
    }

    console.log("🌐 Haciendo petición a:", url)
    console.log("🔑 Usando token:", token.substring(0, 20) + "...")

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    console.log("📡 Status de respuesta:", response.status)
    console.log("📡 Response OK:", response.ok)

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("authToken")
          sessionStorage.removeItem("token")
          sessionStorage.removeItem("authToken")
          window.location.href = "/login"
        }
        throw new Error("Sesión expirada")
      }

      // Intentar obtener el mensaje de error del servidor
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      } catch (e) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    }

    return response.json()
  }

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (!isClient) {
      console.log("🔍 useEffect: Esperando a que el cliente esté listo...")
      return
    }

    console.log("🔍 useEffect: Cliente listo, iniciando carga del perfil...")

    const cargarPerfil = async () => {
      try {
        setLoading(true)
        setError(null)

        // Debugging: Mostrar todas las claves en localStorage
        console.log("🔍 Todas las claves en localStorage:", Object.keys(localStorage))
        console.log("🔍 Todas las claves en sessionStorage:", Object.keys(sessionStorage))

        // Verificar si hay token antes de hacer la petición
        const token = getToken()
        if (!token) {
          console.error("❌ No se encontró token de autenticación")
          setError("No se encontró token de autenticación. Por favor, inicia sesión nuevamente.")
          setLoading(false)
          return
        }

        console.log("🔍 Token encontrado, haciendo petición al servidor...")

        // Usar la misma URL base que tu Login
        const baseUrl = "https://domuhouse.onrender.com"
        const url = `${baseUrl}/api/perfil`

        console.log("🔍 URL de la petición:", url)

        const response = await fetchWithAuth(url)

        console.log("🔍 Respuesta del servidor:", response)

        if (response.success) {
          console.log("✅ Perfil cargado exitosamente:", response.data)
          setUserData(response.data)
          setTempUserData(response.data)
        } else {
          console.error("❌ Error en la respuesta:", response.message)
          setError(response.message || "Error al cargar el perfil")
        }
      } catch (err) {
        console.error("❌ Error al cargar perfil:", err)
        setError(err.message || "Error de conexión")
      } finally {
        setLoading(false)
      }
    }

    cargarPerfil()
  }, [isClient])

  // Función para actualizar el perfil
  const actualizarPerfil = async (datosActualizados) => {
    try {
      setSaving(true)

      const baseUrl = "https://domuhouse.onrender.com"
      const response = await fetchWithAuth(`${baseUrl}/api/users/perfil`, {
        method: "PUT",
        body: JSON.stringify(datosActualizados),
      })

      if (response.success) {
        setUserData(response.data)
        setTempUserData(response.data)
        return { success: true }
      } else {
        throw new Error(response.message || "Error al actualizar el perfil")
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err)
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
    // Validaciones básicas
    if (!tempUserData.nombre.trim()) {
      alert("El nombre es obligatorio")
      return
    }

    if (!tempUserData.correo.trim()) {
      alert("El correo es obligatorio")
      return
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(tempUserData.correo)) {
      alert("El formato del correo no es válido")
      return
    }

    // Validar formato de teléfono (opcional)
    if (tempUserData.telefono && !tempUserData.telefono.match(/^\+?[0-9\s-]+$/)) {
      alert("El formato del teléfono no es válido")
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

  const handleRetry = () => {
    console.log("🔄 Reintentando...")
    debugTokenInfo()

    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  // Datos de ejemplo para las propiedades
  const propiedadesPublicadas = [
    {
      id: 1,
      address: "Ur La Portada Americana 23 #56",
      title: "Casa Lomas Del Norte",
      rooms: 3,
      bathrooms: 3,
      area: 120,
      price: "7250000",
      type: "casa",
      propertyType: "venta",
      status: "Disponible",
      image: "/placeholder.svg?height=80&width=120",
    },
  ]

  const propiedadesAdquiridas = [
    {
      id: 101,
      address: "Calle 15 #45-67, Zona Rosa",
      title: "Apartamento Moderno Centro",
      rooms: 2,
      bathrooms: 2,
      area: 85,
      price: "4500000",
      type: "apartamento",
      propertyType: "compra",
      status: "Comprada",
      fechaAdquisicion: "2024-03-15",
      vendedor: "Juan Pérez",
      image: "/placeholder.svg?height=80&width=120",
    },
  ]

  const propiedadesFavoritas = []

  // Funciones auxiliares
  const formatearPrecio = (precio) => {
    const numero = typeof precio === "string" ? Number.parseInt(precio.replace(/[^\d]/g, "")) : precio
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numero)
  }

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case "disponible":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200"
      case "alquilada":
      case "arrendada":
        return "bg-blue-100 text-blue-700 border border-blue-200"
      case "vendida":
      case "comprada":
        return "bg-purple-100 text-purple-700 border border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
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
        return propiedadesPublicadas
      case "adquiridas":
        return propiedadesAdquiridas
      case "favoritas":
        return propiedadesFavoritas
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
      case "favoritas":
        return "Propiedades Favoritas"
      default:
        return ""
    }
  }

  const datosActuales = obtenerDatos()

  // Función para debugging - mostrar información del token
  const debugTokenInfo = () => {
    if (typeof window === "undefined") return

    console.log("=== DEBUG TOKEN INFO ===")
    console.log("localStorage keys:", Object.keys(localStorage))
    console.log("sessionStorage keys:", Object.keys(sessionStorage))

    // Buscar cualquier cosa que parezca un token
    Object.keys(localStorage).forEach((key) => {
      const value = localStorage.getItem(key)
      if (value && (value.length > 50 || key.toLowerCase().includes("token") || key.toLowerCase().includes("auth"))) {
        console.log(`localStorage['${key}']:`, value.substring(0, 50) + "...")
      }
    })

    Object.keys(sessionStorage).forEach((key) => {
      const value = sessionStorage.getItem(key)
      if (value && (value.length > 50 || key.toLowerCase().includes("token") || key.toLowerCase().includes("auth"))) {
        console.log(`sessionStorage['${key}']:`, value.substring(0, 50) + "...")
      }
    })
    console.log("========================")
  }

  // No renderizar nada hasta que estemos en el cliente
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

  // Mostrar loading
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

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar el perfil</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#287b93] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

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
              <p className="text-gray-600">Miembro desde {formatearFecha(userData.fechaRegistro)}</p>
            </div>

            {/* Estadísticas */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-700">{userData.propiedadesPublicadas}</div>
                <div className="text-blue-600 font-medium">Propiedades Publicadas</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-700">{userData.propiedadesVendidas}</div>
                <div className="text-green-600 font-medium">Propiedades Vendidas</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-700">{propiedadesAdquiridas.length}</div>
                <div className="text-purple-600 font-medium">Propiedades Adquiridas</div>
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
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempUserData.telefono : userData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
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
                    type={isEditing ? "text" : "password"}
                    value={isEditing ? tempUserData.contraseña : userData.contraseña}
                    onChange={(e) => handleInputChange("contraseña", e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:outline-none focus:ring-2 focus:ring-[#2F8EAC]/20 transition-all ${
                      isEditing ? "text-gray-900 bg-white" : "text-gray-600 bg-gray-50"
                    }`}
                    readOnly={!isEditing}
                    placeholder={isEditing ? "Ingresa nueva contraseña (opcional)" : ""}
                  />
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
                  Mis Propiedades ({propiedadesPublicadas.length})
                </button>
                <button
                  onClick={() => setActiveTab("adquiridas")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                    activeTab === "adquiridas"
                      ? "text-white bg-[#2F8EAC] shadow-lg"
                      : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  Adquiridas ({propiedadesAdquiridas.length})
                </button>
                <button
                  onClick={() => setActiveTab("favoritas")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                    activeTab === "favoritas"
                      ? "text-white bg-[#2F8EAC] shadow-lg"
                      : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  Favoritas ({propiedadesFavoritas.length})
                </button>
              </div>
            </div>

            {/* Lista de propiedades */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">{obtenerTitulo()}</h3>
                <p className="text-sm text-gray-500">
                  {activeTab === "favoritas"
                    ? `Tus propiedades favoritas (${datosActuales.length} propiedades)`
                    : `Administra tus propiedades (${datosActuales.length} propiedades)`}
                </p>
              </div>

              {datosActuales.length === 0 ? (
                <div className="text-center py-16">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === "favoritas" ? "No tienes propiedades favoritas" : "No hay propiedades"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === "favoritas"
                      ? "Aún no has marcado ninguna propiedad como favorita."
                      : `Aún no has ${activeTab === "adquiridas" ? "adquirido" : "agregado"} ninguna propiedad.`}
                  </p>
                  {activeTab === "publicadas" && (
                    <button className="px-6 py-3 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#287b93] transition-colors">
                      Publicar Primera Propiedad
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {datosActuales.map((propiedad) => (
                    <div key={propiedad.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <img
                          src={propiedad.image || "/placeholder.svg"}
                          alt={propiedad.title}
                          className="w-24 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{propiedad.title}</h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {propiedad.address}
                              </p>
                            </div>
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(propiedad.status)}`}
                            >
                              {propiedad.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{propiedad.rooms} hab</span>
                            <span>{propiedad.bathrooms} baños</span>
                            <span>{propiedad.area} m²</span>
                            <span className="capitalize text-blue-600">{propiedad.propertyType}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-gray-900">{formatearPrecio(propiedad.price)}</div>
                            <div className="flex items-center gap-2">
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {activeTab !== "adquiridas" && (
                                <button
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Editar propiedad"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={activeTab === "favoritas" ? "Quitar de favoritas" : "Eliminar propiedad"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {activeTab === "adquiridas" && propiedad.fechaAdquisicion && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Adquirida: {formatearFecha(propiedad.fechaAdquisicion)}
                                </span>
                                <span>Vendedor: {propiedad.vendedor}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
