"use client"
import { useState, useEffect } from "react"
import { User, Edit2, Save, X, Eye, Edit, Trash2, Mail, Lock, Camera, Loader2, AlertCircle, Shield } from "lucide-react"

export const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("publicadas")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [misPropiedades, setMisPropiedades] = useState([])
  const [totalMisPropiedades, setTotalMisPropiedades] = useState(0)

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

  // Función para actualizar localStorage y notificar cambios
  const updateUserDataInStorage = (newUserData) => {
    try {
      // Obtener datos actuales del localStorage
      const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}")

      // Actualizar con los nuevos datos
      const updatedUserData = {
        ...currentUserData,
        name_person: newUserData.nombre,
        name: newUserData.nombre,
        email: newUserData.correo,
        telefono: newUserData.telefono,
      }

      // Guardar en localStorage
      localStorage.setItem("userData", JSON.stringify(updatedUserData))

      // Disparar evento personalizado para notificar al Header
      window.dispatchEvent(
        new CustomEvent("userDataUpdated", {
          detail: updatedUserData,
        }),
      )

      console.log("✅ Datos actualizados en localStorage:", updatedUserData)
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

    console.log("🔑 Token obtenido del storage:", token)

    if (!token) {
      console.error("No se encontró token en storage")
      return null
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      console.log("🔍 Payload decodificado:", payload)

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

    console.log("🔍 DEBUG - authInfo completo:", authInfo)
    console.log("🔍 DEBUG - token existe:", !!authInfo?.token)
    console.log("🔍 DEBUG - token length:", authInfo?.token?.length)

    if (!authInfo?.token) {
      console.error("❌ No hay token disponible para la petición")
      throw new Error("No se encontró token de autenticación")
    }

    console.log("🌐 Realizando petición a:", url)
    console.log("🔑 Token que se enviará:", authInfo.token)

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authInfo.token}`,
      ...options.headers,
    }

    console.log("🔍 DEBUG - Headers que se envían:", headers)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log("📡 Respuesta recibida. Status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("❌ Error en la respuesta:", errorData)
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ Datos recibidos:", data)
      return data
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
        console.log("🔍 Información de autenticación:", authInfo)

        if (!authInfo?.token) {
          console.error("❌ No se encontró token de autenticación")
          setError("No se encontró token de autenticación. Por favor, inicia sesión nuevamente.")
          setLoading(false)
          return
        }

        // Primero intenta cargar desde el backend
        try {
          const baseUrl = "http://localhost:10101"
          const url = `${baseUrl}/api/getUser/perfil`

          console.log("🔍 Intentando cargar perfil desde:", url)
          const response = await fetchWithAuth(url)

          if (response.success) {
            console.log("✅ Perfil cargado desde backend:", response.data)
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
            console.error("⚠️ El backend respondió pero con error. Usando datos del token.")
            throw new Error(response.message || "Error en la respuesta del servidor")
          }
        } catch (backendError) {
          console.warn("⚠️ No se pudo cargar desde el backend. Usando datos del token:", backendError)

          // Fallback: usa los datos del token si el backend falla
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
        console.error("❌ Error al cargar perfil:", err)
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
      console.log("🔄 Intentando actualizar perfil con datos:", datosActualizados)

      const response = await fetchWithAuth(`${baseUrl}/api/update/perfil`, {
        method: "PUT",
        body: JSON.stringify({
          nombre: datosActualizados.nombre,
          telefono: datosActualizados.telefono,
          correo: datosActualizados.correo,
        }),
      })

      console.log("📡 Respuesta de actualización:", response)

      if (response.success) {
        const datosActualizadosCompletos = {
          ...userData,
          nombre: response.data.nombre || datosActualizados.nombre,
          telefono: response.data.telefono || datosActualizados.telefono,
          correo: response.data.correo || datosActualizados.correo,
        }

        setUserData(datosActualizadosCompletos)
        setTempUserData(datosActualizadosCompletos)

        // ✅ AQUÍ ESTÁ LA SOLUCIÓN: Actualizar localStorage y notificar al Header
        updateUserDataInStorage(datosActualizadosCompletos)

        return { success: true }
      } else {
        throw new Error(response.message || "Error al actualizar el perfil")
      }
    } catch (err) {
      console.error("❌ Error al actualizar perfil:", err)
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
        return "AGENTE"
      case "3":
        return "USUARIO"
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
    const amount = typeof precio === "string" ? Number.parseInt(precio.replace(/\D/g, "")) : precio
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
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
                  // Manejo seguro de imágenes
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
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
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
    </div>
  )
}
