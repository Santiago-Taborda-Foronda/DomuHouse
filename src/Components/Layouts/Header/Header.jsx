"use client"

import { useState, useEffect } from "react"
import {
  Menu,
  UserCircle,
  Settings,
  LogOut,
  User,
  FileText,
  CreditCard,
  Home,
  Building2,
  X,
  MoreHorizontal,
} from "lucide-react"
import LogoDomuHouse from "../../../assets/images/Logo-DomuHouse.png"
import "../../../index.css"
import { Button } from "../../UI/Button/Button"
import { SidebarMenu } from "../SidebarMenu/SidebarMenu"

export const Header = ({ toggleSidebar, toggleAgentSidebar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showInfoMenu, setShowInfoMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [currentPath, setCurrentPath] = useState("")

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu)
  const toggleInfoMenu = () => setShowInfoMenu(!showInfoMenu)
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu)

  // Función para verificar el estado de autenticación
  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      const parsedUserData = JSON.parse(userData)
      console.log("Datos de userData en localStorage:", parsedUserData)
      setIsAuthenticated(true)
      setUserInfo(parsedUserData)
    } else {
      setIsAuthenticated(false)
      setUserInfo(null)
    }
  }

  // Verificar la ruta actual
  const checkCurrentPath = () => {
    setCurrentPath(window.location.pathname)
  }

  useEffect(() => {
    checkAuthStatus()
    checkCurrentPath()

    const handleStorageChange = () => {
      checkAuthStatus()
    }

    const handleLocationChange = () => {
      checkCurrentPath()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("popstate", handleLocationChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("popstate", handleLocationChange)
    }
  }, [])

  // Función para hacer logout
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    setIsAuthenticated(false)
    setUserInfo(null)
    setShowUserMenu(false)
    window.location.href = "/"
  }

  // Funciones de simulación para desarrollo
  const simulateLogin = () => {
    localStorage.setItem("authToken", "fake-token-for-development")
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: 1,
        name: "Juan Pérez",
        first_name: "Juan",
        email: "juan@example.com",
        avatar: null,
      }),
    )
    checkAuthStatus()
  }

  const simulateLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    checkAuthStatus()
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
  const renderSidebarButton = () => {
    if (isInInmobiliariaPage && toggleSidebar) {
      return (
        <button onClick={toggleSidebar} className="focus:outline-none lg:hidden p-1 hover:bg-gray-100 rounded-lg">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )
    }

    if (isInAgentPage && toggleAgentSidebar) {
      return (
        <button onClick={toggleAgentSidebar} className="focus:outline-none lg:hidden p-1 hover:bg-gray-100 rounded-lg">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )
    }

    // Botón hamburguesa para páginas normales
    if (!isInInmobiliariaPage && !isInAgentPage) {
      return (
        <button onClick={toggleMenu} className="focus:outline-none p-1 hover:bg-gray-100 rounded-lg">
          <Menu className="w-5 h-5 text-gray-700" />
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

  // Función para cerrar todos los menús
  const closeAllMenus = () => {
    setShowUserMenu(false)
    setShowInfoMenu(false)
    setShowMobileMenu(false)
  }

  // Función para navegar y cerrar menús móviles
  const handleMobileNavigation = (url) => {
    window.location.href = url
    setShowMobileMenu(false)
  }

  return (
    <>
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm h-16">
        {/* Sección izquierda */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Botón hamburguesa */}
          {renderSidebarButton()}

          {/* Logo y título */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={LogoDomuHouse || "/placeholder.svg"}
              alt="LogoDomuHouse"
              className="w-16 sm:w-20 h-auto flex-shrink-0"
            />
            <h1 className="text-sm sm:text-base lg:text-lg title-montserrat truncate">
              DOMU<span className="text-[#2F8EAC]">HOUSE</span>
            </h1>
          </div>

          {/* Navegación principal - Solo mostrar en páginas generales y desde tablet */}
          {!isInInmobiliariaPage && !isInAgentPage && (
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 ml-4 lg:ml-6">
              <a
                href="/"
                className={`flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-medium transition duration-150 ease-in-out ${
                  isActiveRoute("/") ? "text-[#2F8EAC]" : "text-gray-700 hover:text-[#2F8EAC]"
                }`}
              >
                <Home size={14} className="lg:w-4 lg:h-4" />
                <span>Inicio</span>
              </a>
              <a
                href="/inmobiliarias"
                className={`flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-medium transition duration-150 ease-in-out ${
                  isActiveRoute("/inmobiliarias") ? "text-[#2F8EAC]" : "text-gray-700 hover:text-[#2F8EAC]"
                }`}
              >
                <Building2 size={14} className="lg:w-4 lg:h-4" />
                <span>Inmobiliarias</span>
              </a>
            </nav>
          )}
        </div>

        {/* Sección derecha */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Botones principales - Desktop */}
          <div className="hidden xl:flex items-center gap-2">
            <Button
              name="Mi Inmobiliaria"
              Route="/mi-inmobiliaria/dashboard"
              className="bg-[#2F8EAC] hover:bg-[#267a95] transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm whitespace-nowrap"
            />
            <Button
              name="Mi Agente"
              Route="/AgentDashboard"
              className="bg-[#2F8EAC] hover:bg-[#267a95] transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm whitespace-nowrap"
            />

            {!isAuthenticated ? (
              <>
                <Button
                  name="Regístrate"
                  Route="/Registrarse"
                  className="bg-[#2F8EAC] hover:bg-[#267a95] transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm whitespace-nowrap"
                />
                <Button
                  name="Iniciar"
                  Route="/Login"
                  className="bg-[#2F8EAC] hover:bg-[#267a95] transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm whitespace-nowrap"
                />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  name="Mi Perfil"
                  Route="/perfil"
                  className="bg-gray-100 hover:bg-[#2F8EAC] hover:text-white text-gray-700 px-3 py-2 rounded-xl text-sm transition duration-150 ease-in-out whitespace-nowrap"
                />
              </div>
            )}
          </div>

          {/* Botones principales - Tablet y Desktop medio */}
          <div className="hidden md:flex xl:hidden items-center gap-1">
            <Button
              name="Inmob."
              Route="/mi-inmobiliaria/dashboard"
              className="bg-[#2F8EAC] hover:bg-[#267a95] transition duration-150 ease-in-out text-white px-2 py-2 rounded-lg text-xs"
            />
            <Button
              name="Agente"
              Route="/AgentDashboard"
              className="bg-[#2F8EAC] hover:bg-[#267a95] transition duration-150 ease-in-out text-white px-2 py-2 rounded-lg text-xs"
            />

            {!isAuthenticated ? (
              <>
                <Button
                  name="Registro"
                  Route="/Registrarse"
                  className="bg-[#2F8EAC] hover:bg-[#267a95] transition duration-150 ease-in-out text-white px-2 py-2 rounded-lg text-xs"
                />
                <Button
                  name="Login"
                  Route="/Login"
                  className="bg-[#2F8EAC] hover:bg-[#267a95] transition duration-150 ease-in-out text-white px-2 py-2 rounded-lg text-xs"
                />
              </>
            ) : (
              <Button
                name="Perfil"
                Route="/perfil"
                className="bg-gray-100 hover:bg-[#2F8EAC] hover:text-white text-gray-700 px-2 py-2 rounded-lg text-xs transition duration-150 ease-in-out"
              />
            )}
          </div>

          {/* Avatar/Usuario - Siempre visible */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {userInfo?.avatar ? (
                  <img
                    src={userInfo.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-700 hidden xl:block max-w-20 truncate">
                  {userInfo?.first_name ||
                    userInfo?.name ||
                    userInfo?.name_person ||
                    userInfo?.nombre ||
                    userInfo?.email?.split("@")[0] ||
                    "Usuario"}
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
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      window.location.href = "/configuracion"
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1"
                  >
                    <Settings size={16} />
                    Configuración
                  </button>
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
          )}

          {/* Menú hamburguesa móvil */}
          <button onClick={toggleMobileMenu} className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-transparent bg-opacity-50" onClick={() => setShowMobileMenu(false)}></div>

          {/* Menú */}
          <div className="fixed top-16 right-0 w-72 bg-white shadow-lg border-l border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Menú</h3>
                <button onClick={() => setShowMobileMenu(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Navegación principal en móvil */}
                {!isInInmobiliariaPage && !isInAgentPage && (
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Navegación</h4>
                    <button
                      onClick={() => handleMobileNavigation("/")}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg transition-colors ${
                        isActiveRoute("/") ? "bg-[#2F8EAC] text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Home size={18} />
                      <span>Inicio</span>
                    </button>
                    <button
                      onClick={() => handleMobileNavigation("/inmobiliarias")}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg transition-colors ${
                        isActiveRoute("/inmobiliarias") ? "bg-[#2F8EAC] text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Building2 size={18} />
                      <span>Inmobiliarias</span>
                    </button>
                  </div>
                )}

                {/* Botones principales */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Accesos Rápidos</h4>
                  <button
                    onClick={() => handleMobileNavigation("/mi-inmobiliaria/dashboard")}
                    className="flex items-center gap-3 w-full px-3 py-3 text-left bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a95] transition-colors"
                  >
                    <Building2 size={18} />
                    <span>Mi Inmobiliaria</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigation("/AgentDashboard")}
                    className="flex items-center gap-3 w-full px-3 py-3 text-left bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a95] transition-colors"
                  >
                    <User size={18} />
                    <span>Mi Agente</span>
                  </button>
                </div>

                {/* Autenticación */}
                {!isAuthenticated ? (
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Cuenta</h4>
                    <button
                      onClick={() => handleMobileNavigation("/Registrarse")}
                      className="flex items-center gap-3 w-full px-3 py-3 text-left bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a95] transition-colors"
                    >
                      <UserCircle size={18} />
                      <span>Regístrate</span>
                    </button>
                    <button
                      onClick={() => handleMobileNavigation("/Login")}
                      className="flex items-center gap-3 w-full px-3 py-3 text-left border border-[#2F8EAC] text-[#2F8EAC] rounded-lg hover:bg-[#2F8EAC] hover:text-white transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Iniciar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Mi Cuenta</h4>
                    <button
                      onClick={() => handleMobileNavigation("/perfil")}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User size={18} />
                      <span>Mi Perfil</span>
                    </button>
                    <button
                      onClick={() => handleMobileNavigation("/configuracion")}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Settings size={18} />
                      <span>Configuración</span>
                    </button>
                  </div>
                )}

                {/* Información */}
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Información</h4>
                  <button
                    onClick={() => handleMobileNavigation("/terminos-condiciones")}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FileText size={18} />
                    <span>Términos y Condiciones</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigation("/metodos-pago")}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <CreditCard size={18} />
                    <span>Métodos de Pago</span>
                  </button>
                </div>

                {/* Cerrar sesión para usuarios autenticados */}
                {isAuthenticated && (
                  <div className="border-t border-gray-200 pt-3">
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowMobileMenu(false)
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}

                {/* Botones de desarrollo (opcional - puedes remover en producción) */}
                {process.env.NODE_ENV === "development" && (
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Desarrollo</h4>
                    <button
                      onClick={simulateLogin}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <User size={18} />
                      <span>Simular Login</span>
                    </button>
                    <button
                      onClick={simulateLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Simular Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Espacio para compensar el header fijo */}
      <div className="h-16"></div>

      {/* Overlays para cerrar menús al hacer clic fuera */}
      {(showUserMenu || showInfoMenu) && <div className="fixed inset-0 z-40" onClick={closeAllMenus}></div>}

      {/* Componente del menú lateral - Solo se muestra si NO estamos en Mi Inmobiliaria Y NO estamos en páginas de Agente */}
      {!isInInmobiliariaPage && !isInAgentPage && (
        <SidebarMenu
          isOpen={isOpen}
          toggleMenu={toggleMenu}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
      )}
    </>
  )
}
