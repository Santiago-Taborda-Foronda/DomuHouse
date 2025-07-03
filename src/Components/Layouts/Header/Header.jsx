"use client"

import { useState, useEffect } from "react"
import { Menu, UserCircle, Settings, LogOut, User } from "lucide-react"
import LogoDomuHouse from "../../../assets/images/Logo-DomuHouse.png"
import "../../../index.css"
import { Button } from "../../UI/Button/Button"
import { SidebarMenu } from "../SidebarMenu/SidebarMenu"

export const Header = ({ toggleSidebar, toggleAgentSidebar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentPath, setCurrentPath] = useState("")

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu)

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

  // Verificar autenticación al montar el componente
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

  const simulateLogin = () => {
    localStorage.setItem("authToken", "fake-token-for-development")
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: 1,
        name: "Juan Pérez",
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

  // Verificar si estamos en la página de Mi Inmobiliaria
  const isInInmobiliariaPage = currentPath.includes("/mi-inmobiliaria") || currentPath.includes("/MiInmobiliaria")

  // Verificar si estamos en la página de Agente
  const isInAgentPage =
    currentPath.includes("/AgentDashboard") ||
    currentPath.includes("/MisPropiedades") ||
    currentPath.includes("/CrearPropiedad") ||
    currentPath.includes("/VisitasAgendadas") ||
    currentPath.includes("/ProgramarVisita") ||
    currentPath.includes("/ContactarCliente") ||
    currentPath.includes("/EstadoInteres")

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm h-16">
        <div className="flex items-center gap-4">
          {/* Botón hamburguesa para páginas normales (NO Mi Inmobiliaria NI Agente) */}
          {!isInInmobiliariaPage && !isInAgentPage && (
            <button onClick={toggleMenu} className="focus:outline-none">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Botón hamburguesa para Mi Inmobiliaria */}
          {isInInmobiliariaPage && toggleSidebar && (
            <button onClick={() => toggleSidebar()} className="focus:outline-none lg:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* 🔧 NUEVO: Botón hamburguesa para páginas de Agente */}
          {isInAgentPage && toggleAgentSidebar && (
            <button onClick={() => toggleAgentSidebar()} className="focus:outline-none lg:hidden">
              <Menu className="w-6 h-6 text-gray-700 " />
            </button>
          )}

          <img src={LogoDomuHouse || "/placeholder.svg"} alt="LogoDomuHouse" className="w-20 h-auto" />
          <h1 className="text-base sm:text-lg title-montserrat">
            DOMU<span className="text-[#2F8EAC]">HOUSE</span>
          </h1>
        </div>

        {/* Botones del header o perfil de usuario */}
        <div className="flex items-center space-x-2">
          {/* Botón Mi Inmobiliaria - Siempre presente */}
          <Button
            name="Mi Inmobiliaria"
            Route="/mi-inmobiliaria/propiedades"
            className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm"
          />

          <Button
            name="Mi Agente"
            Route="/AgentDashboard"
            className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm"
          />

          {isAuthenticated && userInfo ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {userInfo.avatar ? (
                  <img
                    src={userInfo.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-8 h-8 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {userInfo.name_person || userInfo.nombre || userInfo.email?.split("@")[0] || "Usuario"}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      window.location.href = "/perfil"
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} />
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      window.location.href = "/configuracion"
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} />
                    Configuración
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                name="Regístrate"
                Route="/Registrarse"
                className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm"
              />
              <Button
                name="Iniciar"
                Route="/Login"
                className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm"
              />
            </>
          )}
        </div>
      </header>

      <div className="h-16"></div>

      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>}

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
