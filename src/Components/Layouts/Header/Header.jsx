"use client"
import { useState, useEffect } from "react"
import { Menu, UserCircle, LogOut, User, FileText, CreditCard, Home, Building2 } from "lucide-react"

export const Header = ({ toggleSidebar, toggleAgentSidebar }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showInfoMenu, setShowInfoMenu] = useState(false)
  const [currentPath, setCurrentPath] = useState("")

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu)
  const toggleInfoMenu = () => setShowInfoMenu(!showInfoMenu)

  // Función para verificar el estado de autenticación
  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      setIsAuthenticated(true)
      try {
        const parsedUserData = JSON.parse(userData)
        setUserInfo(parsedUserData)
        console.log("✅ Header - Datos de usuario cargados:", parsedUserData)
      } catch (error) {
        console.error("❌ Error parsing userData:", error)
        setUserInfo(null)
      }
    } else {
      setIsAuthenticated(false)
      setUserInfo(null)
    }
  }

  // Verificar la ruta actual
  const checkCurrentPath = () => {
    setCurrentPath(window.location.pathname)
  }

  // ✅ AQUÍ ESTÁ LA SOLUCIÓN: Escuchar el evento personalizado
  const handleUserDataUpdate = (event) => {
    console.log("🔄 Header - Recibido evento de actualización de usuario:", event.detail)
    setUserInfo(event.detail)
    // También actualizar el estado de autenticación si es necesario
    if (event.detail) {
      setIsAuthenticated(true)
    }
  }

  useEffect(() => {
    checkAuthStatus()
    checkCurrentPath()

    const handleStorageChange = () => {
      console.log("📦 Header - Detectado cambio en localStorage")
      checkAuthStatus()
    }

    const handleLocationChange = () => {
      checkCurrentPath()
    }

    // ✅ Agregar listener para el evento personalizado
    window.addEventListener("userDataUpdated", handleUserDataUpdate)
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("popstate", handleLocationChange)

    return () => {
      // ✅ Limpiar el listener del evento personalizado
      window.removeEventListener("userDataUpdated", handleUserDataUpdate)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("popstate", handleLocationChange)
    }
  }, [])

  // Función para hacer logout
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("token") // Por si acaso también está guardado con este nombre
    setIsAuthenticated(false)
    setUserInfo(null)
    setShowUserMenu(false)
    window.location.href = "/"
  }

  // Verificar si estamos en páginas especiales
  const isInInmobiliariaPage = currentPath.includes("/mi-inmobiliaria") || currentPath.includes("/MiInmobiliaria")
  const isInAgentPage =
    currentPath.includes("/AgentDashboard") ||
    currentPath.includes("/MisPropiedades") ||
    currentPath.includes("/CrearPropiedad") ||
    currentPath.includes("/VisitasAgendadas") ||
    currentPath.includes("/ProgramarVisita") ||
    currentPath.includes("/ContactarCliente") ||
    currentPath.includes("/EstadoInteres")

  // Función para determinar qué botón hamburguesa mostrar
  const renderHamburgerButton = () => {
    if (isInInmobiliariaPage && toggleSidebar) {
      return (
        <button onClick={toggleSidebar} className="focus:outline-none lg:hidden">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )
    }
    if (isInAgentPage && toggleAgentSidebar) {
      return (
        <button onClick={toggleAgentSidebar} className="focus:outline-none lg:hidden">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )
    }
    return null
  }

  // Función para verificar si una ruta está activa
  const isActiveRoute = (route) => {
    if (route === "/") {
      return currentPath === "/" || currentPath === ""
    }
    return currentPath.includes(route)
  }

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm h-16">
        <div className="flex items-center gap-4">
          {/* Botón hamburguesa solo para dashboards específicos */}
          {renderHamburgerButton()}

          {/* Logo */}
          <img src="/placeholder.svg?height=40&width=80" alt="LogoDomuHouse" className="w-20 h-auto" />
          <h1 className="text-base sm:text-lg font-bold">
            DOMU<span className="text-[#2F8EAC]">HOUSE</span>
          </h1>

          {/* Navegación principal - Solo mostrar en páginas generales */}
          {!isInInmobiliariaPage && !isInAgentPage && (
            <nav className="hidden md:flex items-center gap-6 ml-6">
              <a
                href="/"
                className={`flex items-center gap-2 text-sm font-medium transition duration-150 ease-in-out ${
                  isActiveRoute("/") ? "text-[#2F8EAC]" : "text-gray-700 hover:text-[#2F8EAC]"
                }`}
              >
                <Home size={16} />
                <span>Inicio</span>
              </a>
              <a
                href="/inmobiliarias"
                className={`flex items-center gap-2 text-sm font-medium transition duration-150 ease-in-out ${
                  isActiveRoute("/inmobiliarias") ? "text-[#2F8EAC]" : "text-gray-700 hover:text-[#2F8EAC]"
                }`}
              >
                <Building2 size={16} />
                <span>Inmobiliarias</span>
              </a>
            </nav>
          )}
        </div>

        {/* Botones del header */}
        <div className="flex items-center space-x-2">
          {/* Menú de información (Términos y Métodos de pago) */}
          <div className="relative">
            {showInfoMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    setShowInfoMenu(false)
                    window.location.href = "/terminos-condiciones"
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2"
                >
                  <FileText size={16} />
                  Términos y Condiciones
                </button>
                <button
                  onClick={() => {
                    setShowInfoMenu(false)
                    window.location.href = "/metodos-pago"
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2"
                >
                  <CreditCard size={16} />
                  Métodos de Pago
                </button>
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            // Botones de autenticación
            <>
              <button
                onClick={() => (window.location.href = "/Registrarse")}
                className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm"
              >
                Regístrate
              </button>
              <button
                onClick={() => (window.location.href = "/Login")}
                className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm"
              >
                Iniciar
              </button>
            </>
          ) : (
            // Perfil de usuario
            <div className="flex items-center space-x-2">
              {/* Menú desplegable del usuario */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {userInfo?.avatar ? (
                    <img
                      src={userInfo.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {userInfo?.name_person || userInfo?.name || "Usuario"}
                  </span>
                </button>

                {/* Menú desplegable del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        window.location.href = "/perfil"
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1"
                    >
                      <User size={16} />
                      Mi Perfil
                    </button>

                    {userInfo?.role_id === 3 && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          window.location.href = "/Usuario/CrearPropiedadUsuario"
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1"
                      >
                        <Home size={16} />
                        Crear Propiedad
                      </button>
                    )}

                    <hr className="my-1" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Espacio para compensar el header fijo */}
      <div className="h-16"></div>

      {/* Overlays para cerrar menús al hacer clic fuera */}
      {(showUserMenu || showInfoMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false)
            setShowInfoMenu(false)
          }}
        ></div>
      )}
    </>
  )
}
