import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Eye, EyeOff, Building, User, UserCheck, ArrowLeft, ArrowRight, Copy, Check } from "lucide-react"

export const Registrarse = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userType, setUserType] = useState("cliente")
  const [tokenCopied, setTokenCopied] = useState(false)

  // Estados para el formulario de usuario
  const [userData, setUserData] = useState({
    name_person: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    token: "",
    realEstateId: "",
  })

  // Estados para el formulario de inmobiliaria
  const [inmobiliariaData, setInmobiliariaData] = useState({
    nombre_inmobiliaria: "",
    descripcion_inmobiliaria: "",
    nit: "",
    responsible: "",
    address: "",
    city: "",
    phone_inmobiliaria: "",
    email_inmobiliaria: "",
    logo: null,
  })

  const userTypeOptions = [
    {
      value: "cliente",
      label: "Cliente",
      icon: User,
      description: "Buscar propiedades",
    },
    {
      value: "agente",
      label: "Agente",
      icon: UserCheck,
      description: "Vender propiedades",
    },
    {
      value: "administrador",
      label: "Administrador",
      icon: Building,
      description: "Gestionar inmobiliaria",
    },
  ]

  const handleTokenChange = (e) => {
    const tokenValue = e.target.value.trim()
    setUserData((prev) => ({
      ...prev,
      token: tokenValue,
    }))
    if (error) setError("")
    if (success) setSuccess("")
    console.log("Token capturado:", tokenValue)
  }

  const copyTokenToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(userData.token)
      setTokenCopied(true)
      setTimeout(() => setTokenCopied(false), 2000)
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }

  const handleUserDataChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleInmobiliariaDataChange = (e) => {
    const { name, value } = e.target
    setInmobiliariaData({ ...inmobiliariaData, [name]: value })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setInmobiliariaData({
        ...inmobiliariaData,
        logo: file,
      })
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  // Función para validar el token antes de enviar
  const validateTokenBeforeSend = () => {
    const token = userData.token.trim()
    if (!token) {
      setError("El token es requerido para agentes")
      return false
    }

    // Validar formato del token si es necesario
    if (token.length < 3) {
      setError("El token debe tener al menos 3 caracteres")
      return false
    }

    return true
  }

  const validateStep1 = () => {
    if (!userData.name_person.trim()) {
    if (!userData.name_person.trim()) {
      setError("El nombre es requerido")
      return false
    }
    if (!userData.last_name.trim()) {
      setError("Los apellidos son requeridos")
      return false
    }
    if (!userData.email.trim()) {
      setError("El email es requerido")
      return false
    }
    if (userData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }
    if (userType === "agente" && !userData.token.trim()) {
      setError("El token es requerido para agentes")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (userType !== "administrador") return true

    if (!inmobiliariaData.nombre_inmobiliaria.trim()) {
      setError("El nombre de la inmobiliaria es obligatorio")
      return false
    }
    if (!inmobiliariaData.nit.trim()) {
      setError("El NIT es requerido")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")
    if (currentStep === 1 && validateStep1()) {
      if (userType === "administrador") {
        setCurrentStep(2)
      } else {
        handleSubmit()
      }
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit()
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
    setError("")
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      let endpoint, payload

      if (userType === "agente") {
        endpoint = "http://localhost:10101/api/registro-agente"

        // Validar token antes de enviar
        if (!validateTokenBeforeSend()) {
          setIsLoading(false)
          return
        }

        // Asegurar que el token se envía correctamente
        const tokenToSend = userData.token.trim()

        payload = {
          name_person: userData.name_person.trim(),
          last_name: userData.last_name.trim(),
          email: userData.email.trim(),
          phone: userData.phone.trim() || null,
          password: userData.password,
          token: tokenToSend,
        }

        console.log("Enviando datos de agente:", payload)
        console.log("Token específico:", tokenToSend)
      } else if (userType === "administrador") {
        endpoint = "http://localhost:10101/register"
        payload = {
          ...userData,
          role: userType,
          ...inmobiliariaData,
        }
      } else {
        // Cliente
        endpoint = "http://localhost:10101/register"
        payload = { ...userData, role: userType }
      }

      console.log("Endpoint:", endpoint)
      console.log("Payload completo:", payload)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("Status de respuesta:", response.status)

      const data = await response.json()
      console.log("Respuesta del servidor:", data)

      if (response.ok) {
        setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login...")
        setTimeout(() => {
          navigate("/Login", {
            state: { message: "Cuenta creada exitosamente. Ahora puedes iniciar sesión." },
          })
        }, 2000)
      } else {
        // Manejo mejorado de errores específicos para tokens
        let errorMessage = "Error al crear la cuenta"

        if (data.error) {
          errorMessage = data.error
        } else if (data.message) {
          errorMessage = data.message
        } else if (data.details) {
          errorMessage = data.details
        }

        // Mensajes específicos para problemas de token
        if (errorMessage.toLowerCase().includes("token")) {
          if (
            errorMessage.toLowerCase().includes("not found") ||
            errorMessage.toLowerCase().includes("no encontrado") ||
            errorMessage.toLowerCase().includes("invalid")
          ) {
            errorMessage = "El token proporcionado no es válido o no existe. Verifica con tu administrador."
          } else if (errorMessage.toLowerCase().includes("expired")) {
            errorMessage = "El token ha expirado. Solicita un nuevo token a tu administrador."
          }
        }

        setError(errorMessage)
        console.error("Error del servidor:", data)
      }
    } catch (error) {
      console.error("Error durante el registro:", error)
      setError("Error de conexión. Por favor, verifica que el servidor esté funcionando.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Selección de tipo de usuario */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 text-center">¿Qué tipo de cuenta necesitas?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userTypeOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <button
                key={option.value}
                onClick={() => setUserType(option.value)}
                type="button"
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md ${
                  userType === option.value
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-gray-200 hover:border-sky-300"
                }`}
              >
                <IconComponent className="mx-auto mb-2 h-8 w-8" />
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500 mt-1">{option.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Formulario de datos personales */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name_person" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              id="name_person"
              name="name_person"
              value={userData.name_person}
              onChange={handleUserDataChange}
              placeholder="Tu nombre"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={userData.last_name}
              onChange={handleUserDataChange}
              placeholder="Tus apellidos"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleUserDataChange}
            placeholder="Tu número de teléfono"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleUserDataChange}
            placeholder="tu@email.com"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={userData.password}
              onChange={handleUserDataChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors pr-12"
              disabled={isLoading}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Campo para agente - Token de invitación MEJORADO */}
        {userType === "agente" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <label htmlFor="token" className="text-sm font-medium text-blue-800">
                Token de invitación *
              </label>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <textarea
                  id="token"
                  name="token"
                  value={userData.token}
                  onChange={handleTokenChange}
                  placeholder="Pega aquí el token que te proporcionó tu administrador"
                  className="w-full p-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none h-20 text-sm font-mono bg-white"
                  disabled={isLoading}
                  required
                />
                {userData.token && (
                  <button
                    type="button"
                    onClick={copyTokenToClipboard}
                    className="absolute top-2 right-2 p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                    title="Copiar token"
                  >
                    {tokenCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>

              {userData.token && (
                <div className="bg-white border border-blue-200 rounded-md p-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-600 font-medium">Token verificado:</span>
                    <span className="text-green-600 font-medium">✓ {userData.token.length} caracteres</span>
                  </div>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 break-all">
                    {userData.token.substring(0, 50)}...
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-blue-700 flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                Solicita este token a tu administrador de inmobiliaria
              </p>
              <p className="text-blue-600 flex items-center">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                Copia y pega el token completo sin modificaciones
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building className="mx-auto h-12 w-12 text-sky-500 mb-2" />
        <h3 className="text-lg font-medium text-gray-800">Información de tu Inmobiliaria</h3>
        <p className="text-sm text-gray-600">Completa los datos de tu empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre_inmobiliaria" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la inmobiliaria *
          </label>
          <input
            type="text"
            id="nombre_inmobiliaria"
            name="nombre_inmobiliaria"
            value={inmobiliariaData.nombre_inmobiliaria}
            onChange={handleInmobiliariaDataChange}
            placeholder="Ej: Inmobiliaria Los Pinos"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="nit" className="block text-sm font-medium text-gray-700 mb-1">
            NIT o registro legal *
          </label>
          <input
            type="text"
            id="nit"
            name="nit"
            value={inmobiliariaData.nit}
            onChange={handleInmobiliariaDataChange}
            placeholder="123456789-1"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="descripcion_inmobiliaria" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la empresa
        </label>
        <textarea
          id="descripcion_inmobiliaria"
          name="descripcion_inmobiliaria"
          value={inmobiliariaData.descripcion_inmobiliaria}
          onChange={handleInmobiliariaDataChange}
          placeholder="Breve descripción de tu inmobiliaria y servicios"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors h-24 resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={inmobiliariaData.address}
            onChange={handleInmobiliariaDataChange}
            placeholder="Dirección de la oficina"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={inmobiliariaData.city}
            onChange={handleInmobiliariaDataChange}
            placeholder="Ciudad y departamento"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-3">Logo de la inmobiliaria</p>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {inmobiliariaData.logo ? (
              <img
                src={URL.createObjectURL(inmobiliariaData.logo) || "/placeholder.svg"}
                alt="Logo preview"
                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={isLoading} />
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                {inmobiliariaData.logo ? "Cambiar logo" : "Subir logo"}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Formatos: Solo imagenes PNG. Máximo 5MB</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Información de contacto adicional (opcional)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="tel"
            name="phone_inmobiliaria"
            value={inmobiliariaData.phone_inmobiliaria}
            onChange={handleInmobiliariaDataChange}
            placeholder="Teléfono de la empresa"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
          <input
            type="email"
            name="email_inmobiliaria"
            value={inmobiliariaData.email_inmobiliaria}
            onChange={handleInmobiliariaDataChange}
            placeholder="Email corporativo"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-32 h-30 rounded-xl flex items-center justify-center mr-3">
              <div className="w-20 h-20 bg-sky-500 rounded-lg flex items-center justify-center">
                <Building className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-sky-600">
              DOMU<span className="text-gray-800">HOUSE</span>
            </h1>
          </div>
          <p className="text-gray-600">{currentStep === 1 ? "Crea tu cuenta" : "Registra tu inmobiliaria"}</p>
        </div>

        {/* Progress indicator */}
        {userType === "administrador" && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-sky-500" : "bg-gray-200"}`}></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
            </div>
          </div>
        )}

        {/* Main form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="max-w-full overflow-hidden">
            {currentStep === 1 ? renderStep1() : renderStep2()}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 mt-8 border-t border-gray-200">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </button>
              )}

              <div className={`${currentStep === 1 ? "w-full sm:ml-auto sm:w-auto" : "order-1 sm:order-2"}`}>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className={`w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      {currentStep === 1 && userType === "administrador" ? "Continuar" : "Crear Cuenta"}
                      {currentStep === 1 && userType === "administrador" && <ArrowRight className="ml-2 h-4 w-4" />}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Login link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/Login" className="text-sky-500 hover:text-sky-600 font-medium">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
}