"use client"

import { useState, useEffect } from "react"
import {
  User,
  Edit2,
  Save,
  X,
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
  Shield,
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
    role: "",
    propiedadesPublicadas: 0,
    propiedadesVendidas: 0,
    verified: false,
    active: false,
  })

  const [tempUserData, setTempUserData] = useState({ ...userData })

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

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Función para obtener y decodificar el token
  const getTokenAndUserInfo = () => {
    if (typeof window === "undefined") return null

    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    const finalToken = authToken || token

    if (!finalToken) return null

    try {
      // Decodificar el JWT para extraer la información del usuario
      const tokenParts = finalToken.split(".")
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))

        return {
          token: finalToken,
          userId: payload.id || payload.person_id || payload.user_id,
          role: payload.role_id || payload.role,
          email: payload.email,
          name: payload.name_person || payload.name,
          fullPayload: payload,
        }
      }
    } catch (e) {
      console.error("Error decodificando JWT:", e)
    }

    return { token: finalToken }
  }

  // Función para hacer peticiones autenticadas
  const fetchWithAuth = async (url, options = {}) => {
    const authInfo = getTokenAndUserInfo()

    if (!authInfo || !authInfo.token) {
      throw new Error("No se encontró token de autenticación")
    }

    console.log("🌐 Haciendo petición a:", url)
    console.log("🔑 Info de autenticación:", {
      hasToken: !!authInfo.token,
      userId: authInfo.userId,
      role: authInfo.role,
      email: authInfo.email,
    })

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo.token}`,
        ...options.headers,
      },
    })

    console.log("📡 Status de respuesta:", response.status)

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

      if (response.status === 403) {
        throw new Error("No tienes permisos para acceder a esta información")
      }

      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      } catch (e) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    }

    return response.json()
  }

  // Cargar datos del perfil
  useEffect(() => {
    if (!isClient) return

    const cargarPerfil = async () => {
      try {
        setLoading(true)
        setError(null)

        const authInfo = getTokenAndUserInfo()
        if (!authInfo || !authInfo.token) {
          console.error("❌ No se encontró token de autenticación")
          setError("No se encontró token de autenticación. Por favor, inicia sesión nuevamente.")
          setLoading(false)
          return
        }

        console.log("🔍 Información de autenticación extraída del JWT:", authInfo)

        const baseUrl = "https://domuhouse.onrender.com"
        const url = `${baseUrl}/api/perfil`

        const response = await fetchWithAuth(url)
        console.log("🔍 Respuesta del servidor:", response)

        if (response.success) {
          console.log("✅ Perfil cargado exitosamente:", response.data)

          // Mapear correctamente los datos, usando la info del JWT como fallback
          const datosUsuario = {
            nombre: response.data.nombre || authInfo.name || "",
            telefono: response.data.telefono || "",
            correo: response.data.correo || authInfo.email || "",
            contraseña: "••••••••••••••••",
            fechaRegistro: response.data.fechaRegistro || new Date().toISOString(),
            role: response.data.role || authInfo.role || "",
            propiedadesPublicadas: response.data.propiedadesPublicadas || 0,
            propiedadesVendidas: response.data.propiedadesVendidas || 0,
            verified: response.data.verified || false,
            active: response.data.active || false,
          }

          setUserData(datosUsuario)
          setTempUserData(datosUsuario)
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

      const response = await fetchWithAuth(`${baseUrl}/api/perfil`, {
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
          nombre: response.data.nombre || "",
          telefono: response.data.telefono || "",
          correo: response.data.correo || "",
          propiedadesPublicadas: response.data.propiedadesPublicadas || 0,
          propiedadesVendidas: response.data.propiedadesVendidas || 0,
          verified: response.data.verified || false,
          active: response.data.active || false,
        }

        setUserData(datosActualizadosCompletos)
        setTempUserData(datosActualizadosCompletos)
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

  // Función para obtener el nombre del rol
  const getNombreRol = (role) => {
    switch (String(role)) {
      case "1":
        return "ADMINISTRADOR"
      case "2":
        return "USUARIO"
      case "3":
        return "AGENTE"
      default:
        return `ROL ${role}`
    }
  }

  // Función para obtener el color del rol
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
              <p className="text-gray-600 mt-1">Miembro desde {formatearFecha(userData.fechaRegistro)}</p>

              {/* Mostrar estado de verificación */}
              <div className="flex items-center gap-4 mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${userData.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {userData.verified ? "Verificado" : "Sin verificar"}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${userData.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {userData.active ? "Activo" : "Inactivo"}
                </span>
              </div>
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
              </div>
            </div>

            {/* Lista de propiedades */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">{obtenerTitulo()}</h3>
                <p className="text-sm text-gray-500">Administra tus propiedades ({datosActuales.length} propiedades)</p>
              </div>

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
                              title="Eliminar propiedad"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
