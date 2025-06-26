"use client"

import { useState } from "react"
import { Eye, EyeOff, Building, User, UserCheck, ArrowLeft, ArrowRight } from "lucide-react"
import LogoDomuHouse from "../../../../assets/images/Logo-DomuHouse.png"

export const Registrarse = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userType, setUserType] = useState("cliente")
  const [registeredPersonId, setRegisteredPersonId] = useState(null)

  // State for user form
  const [userData, setUserData] = useState({
    name_person: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    token: "",
  })

  // State for real estate form, including logo
  const [inmobiliariaData, setInmobiliariaData] = useState({
    name_realestate: "",
    descripcion_inmobiliaria: "",
    nit: "",
    address: "",
    city: "",
    department: "",
    phone_inmobiliaria: "",
    email_inmobiliaria: "",
    num_properties: "",
    logo: null, // Store the logo file
    logoPreview: null, // Store the logo preview URL
  })

  const userTypeOptions = [
    { value: "cliente", label: "Cliente", icon: User, description: "Buscar propiedades" },
    { value: "agente", label: "Agente", icon: UserCheck, description: "Vender propiedades" },
    { value: "administrador", label: "Administrador", icon: Building, description: "Gestionar inmobiliaria" },
  ]

  const handleUserDataChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleInmobiliariaDataChange = (e) => {
    const { name, value, files } = e.target
    if (name === "logo") {
      const file = files[0]
      if (file) {
        // Create a preview URL for the selected image
        const previewUrl = URL.createObjectURL(file)
        setInmobiliariaData({ ...inmobiliariaData, logo: file, logoPreview: previewUrl })
      } else {
        setInmobiliariaData({ ...inmobiliariaData, logo: null, logoPreview: null })
      }
    } else {
      setInmobiliariaData({ ...inmobiliariaData, [name]: value })
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const validateStep1 = () => {
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

    if (!inmobiliariaData.name_realestate.trim()) {
      setError("El nombre de la inmobiliaria es obligatorio")
      return false
    }
    if (!inmobiliariaData.nit.trim()) {
      setError("El NIT es requerido")
      return false
    }
    if (!inmobiliariaData.phone_inmobiliaria && !userData.phone) {
      setError("El teléfono es requerido")
      return false
    }
    if (!inmobiliariaData.email_inmobiliaria && !userData.email) {
      setError("El email es requerido")
      return false
    }
    if (!inmobiliariaData.city.trim()) {
      setError("La ciudad es requerida")
      return false
    }
    if (!inmobiliariaData.department.trim()) {
      setError("El departamento es requerido")
      return false
    }
    if (!inmobiliariaData.address.trim()) {
      setError("La dirección es requerida")
      return false
    }
    if (!inmobiliariaData.descripcion_inmobiliaria.trim()) {
      setError("La descripción es requerida")
      return false
    }
    if (!inmobiliariaData.num_properties || isNaN(Number.parseInt(inmobiliariaData.num_properties))) {
      setError("El número de propiedades es requerido y debe ser un número")
      return false
    }
    if (!inmobiliariaData.logo) {
      setError("El logo de la inmobiliaria es requerido")
      return false
    }
    if (!registeredPersonId) {
      setError("No se ha registrado un usuario válido. Por favor, completa el paso 1.")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")
    if (currentStep === 1 && validateStep1()) {
      if (userType === "administrador") {
        handleSubmit()
      } else {
        handleSubmit()
      }
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmitInmobiliaria()
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
    setError("")
  }

  const redirectToLogin = () => {
    window.location.href = "/login"
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const payload = { ...userData, role: userType }
      console.log("Payload sent to /api/admin/registro:", payload)

      const response = await fetch("http://localhost:10101/api/admin/registerAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("Full register response:", data)

      if (response.ok) {
        if (userType === "administrador") {
          const personId = data.data?.insertId || data.insertId || data.person_id || data.id || data.user_id || data.userId
          console.log("Extracted personId:", personId)

          if (!personId || isNaN(Number(personId))) {
            setError("El servidor no devolvió un ID de usuario válido. Respuesta: " + JSON.stringify(data))
            return
          }
          setRegisteredPersonId(Number(personId))
          setSuccess("Usuario registrado exitosamente. Ahora registra tu inmobiliaria.")
          setCurrentStep(2)
        } else {
          setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login...")
          setTimeout(() => {
            redirectToLogin()
          }, 2000)
        }
      } else {
        setError(data.message || "Error al crear la cuenta. Respuesta: " + JSON.stringify(data))
      }
    } catch (error) {
      console.error("Error during registration:", error)
      setError("Error de conexión. Por favor, intenta de nuevo. Detalles: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitInmobiliaria = async () => {
  setIsLoading(true)
  setError("")
  setSuccess("")

   try {
      // Verificar que tenemos un person_id válido
      if (!registeredPersonId) {
        setError("No se ha registrado un usuario válido. Por favor, completa el paso 1.")
        return
      }

      const endpoint = "http://localhost:10101/api/inmobiliarias/registerRealEstate"
      
      // Preparar los datos según lo que espera el backend
      const payload = {
        name_realestate: inmobiliariaData.name_realestate,
        nit: inmobiliariaData.nit,
        phone: inmobiliariaData.phone_inmobiliaria || userData.phone,
        email: inmobiliariaData.email_inmobiliaria || userData.email,
        num_properties: Number(inmobiliariaData.num_properties),
        department: inmobiliariaData.department,
        city: inmobiliariaData.city,
        adress: inmobiliariaData.address, // Nota: tu backend usa "adress" no "address"
        description: inmobiliariaData.descripcion_inmobiliaria,
        person_id: Number(registeredPersonId)
      }

      console.log("Payload enviado a inmobiliaria:", payload)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("Response status:", response.status)
      
      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok) {
        setSuccess("¡Inmobiliaria registrada exitosamente! Redirigiendo al login...")
        setTimeout(() => {
          redirectToLogin()
        }, 2000)
      } else {
        setError(data.message || "Error al registrar la inmobiliaria")
      }
    } catch (error) {
      console.error("Error al registrar inmobiliaria:", error)
      setError("Error de conexión. Por favor, intenta de nuevo. Detalles: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  const renderStep1 = () => (
    <div className="space-y-6">
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
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {userType === "agente" && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
              Token de invitación *
            </label>
            <input
              type="text"
              id="token"
              name="token"
              value={userData.token}
              onChange={handleUserDataChange}
              placeholder="Token proporcionado por tu administrador"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-600 mt-1">Solicita este token a tu administrador de inmobiliaria</p>
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
        {registeredPersonId && (
          <p className="text-xs text-green-600 mt-2">✓ Usuario registrado con ID: {registeredPersonId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name_realestate" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la inmobiliaria *
          </label>
          <input
            type="text"
            id="name_realestate"
            name="name_realestate"
            value={inmobiliariaData.name_realestate}
            onChange={handleInmobiliariaDataChange}
            placeholder="Ej: Inmobiliaria Los Pinos"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
            required
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
            required
          />
        </div>
      </div>

      {/* Aesthetically styled logo upload section */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
          Logo de la inmobiliaria *
        </label>
        <div className="flex items-center space-x-4">
          <label
            htmlFor="logo"
            className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Seleccionar Logo</span>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleInmobiliariaDataChange}
              className="hidden"
              disabled={isLoading}
              required
            />
          </label>
          {inmobiliariaData.logo && (
            <span className="text-sm text-gray-600">
              {inmobiliariaData.logo.name}
            </span>
          )}
        </div>
        {inmobiliariaData.logoPreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
              <img
                src={inmobiliariaData.logoPreview}
                alt="Vista previa del logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">Sube una imagen en formato PNG o JPG (máximo 2MB)</p>
      </div>

      <div>
        <label htmlFor="descripcion_inmobiliaria" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la empresa *
        </label>
        <textarea
          id="descripcion_inmobiliaria"
          name="descripcion_inmobiliaria"
          value={inmobiliariaData.descripcion_inmobiliaria}
          onChange={handleInmobiliariaDataChange}
          placeholder="Breve descripción de tu inmobiliaria y servicios"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors h-24 resize-none"
          disabled={isLoading}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección *
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
            required
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={inmobiliariaData.city}
            onChange={handleInmobiliariaDataChange}
            placeholder="Ej: Armenia"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Departamento *
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={inmobiliariaData.department}
          onChange={handleInmobiliariaDataChange}
          placeholder="Ej: Quindío"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="num_properties" className="block text-sm font-medium text-gray-700 mb-1">
          Número de propiedades *
        </label>
        <input
          type="number"
          id="num_properties"
          name="num_properties"
          value={inmobiliariaData.num_properties}
          onChange={handleInmobiliariaDataChange}
          placeholder="Ej: 3"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
          disabled={isLoading}
          required
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Información de contacto adicional</p>
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-32 h-30 rounded-xl flex items-center justify-center mr-3">
              <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-30 h-auto" />
            </div>
            <h1 className="text-3xl font-bold text-sky-600">
              DOMU<span className="text-gray-800">HOUSE</span>
            </h1>
          </div>
          <p className="text-gray-600">{currentStep === 1 ? "Crea tu cuenta" : "Registra tu inmobiliaria"}</p>
        </div>

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

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            {currentStep === 1 ? renderStep1() : renderStep2()}

            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </button>
              )}

              <div className={currentStep === 1 ? "ml-auto" : ""}>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className={`flex items-center px-8 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors ${
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

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button onClick={redirectToLogin} className="text-sky-500 hover:text-sky-600 font-medium">
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
