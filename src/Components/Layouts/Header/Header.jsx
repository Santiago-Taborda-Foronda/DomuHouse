import React, { useState, useEffect } from 'react'
import { Menu, UserCircle, Settings, LogOut, User } from 'lucide-react'
import LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import '../../../index.css'
import { Button } from '../../UI/Button/Button'
import { SidebarMenu } from '../SidebarMenu/SidebarMenu'

export const Header = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu)

  // Función para verificar el estado de autenticación
  const checkAuthStatus = () => {
    // Aquí puedes verificar si hay un token en localStorage, sessionStorage, etc.
    // Por ejemplo:
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUserInfo(JSON.parse(userData))
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
    
    // Escuchar cambios en el localStorage (útil para cuando se hace login/logout en otra pestaña)
    const handleStorageChange = () => {
      checkAuthStatus()
    }
    
    // Escuchar cambios de ruta
    const handleLocationChange = () => {
      checkCurrentPath()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('popstate', handleLocationChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  // Función para hacer logout
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setIsAuthenticated(false)
    setUserInfo(null)
    setShowUserMenu(false)
    // Redirigir al home o donde prefieras
    window.location.href = '/'
  }

  const simulateLogin = () => {
    localStorage.setItem('authToken', 'fake-token-for-development')
    localStorage.setItem('userData', JSON.stringify({
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      avatar: null
    }))
    checkAuthStatus()
  }

  // // Función temporal para simular logout (SOLO PARA DESARROLLO)
  // const simulateLogout = () => {
  //   localStorage.removeItem('authToken')
  //   localStorage.removeItem('userData')
  //   checkAuthStatus()
  // }

  // Verificar si estamos en la página de Mi Inmobiliaria
  const isInInmobiliariaPage = currentPath.includes('/mi-inmobiliaria') || 
                               currentPath.includes('/MiInmobiliaria')

  return (
    <>
      {/* Header - Fijo en pantalla al hacer scroll */}
      <header className="flex items-center justify-between px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm h-16">
          <div className="flex items-center gap-4">
            {/* Botón hamburguesa - Solo se muestra si NO estamos en Mi Inmobiliaria */}
            {!isInInmobiliariaPage && (
              <button onClick={toggleMenu} className="focus:outline-none">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            )}

            {/* Botón hamburguesa para Mi Inmobiliaria - Solo se muestra EN Mi Inmobiliaria */}
            {isInInmobiliariaPage && toggleSidebar && (
              <button onClick={toggleSidebar} className="focus:outline-none lg:hidden">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            )}

            {/* Logo */}
            <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-20 h-auto" />
            <h1 className='text-base sm:text-lg title-montserrat'>DOMU<span className='text-[#2F8EAC]'>HOUSE</span></h1>
          </div>

          {/* Botones del header o perfil de usuario */}
          <div className="flex items-center space-x-2">
            {/* <div className="flex items-center space-x-2 mr-4 p-2 bg-yellow-100 rounded border-yellow-300 border"> */}
              {/* <span className="text-xs text-yellow-800">DEV:</span> */}
              {/* <button 
                onClick={simulateLogin}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Simular Login
              </button>
              <button 
                onClick={simulateLogout}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Simular Logout
              </button> */}
            {/* </div> */}

            {/* Botón Mi Inmobiliaria - Siempre presente */}
            <Button 
              name="Mi Inmobiliaria" 
              Route="/MiInmobiliaria" 
              className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm"
            />

             <Button 
              name="Mi Agente" 
              Route="/MiInmobiliaria" 
              className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-3 py-2 rounded-xl text-sm"
            />

            {!isAuthenticated ? (
              // Mostrar botones de registro e inicio de sesión si NO está autenticado
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
            ) : (
              // Mostrar perfil de usuario si SÍ está autenticado
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {/* Avatar del usuario - puedes usar una imagen real si la tienes */}
                  {userInfo?.avatar ? (
                    <img 
                      src={userInfo.avatar} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {userInfo?.name || 'Usuario'}
                  </span>
                </button>

                {/* Menú desplegable del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <button 
                      onClick={() => {
                        setShowUserMenu(false)
                        // Navegar al perfil
                        window.location.href = '/perfil'
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} />
                      Mi Perfil
                    </button>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false)
                        // Navegar a configuración
                        window.location.href = '/configuracion'
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
            )}
          </div>
      </header>

      {/* Espacio para compensar el header fijo - Ahora con altura exacta */}
      <div className="h-16"></div>

      {/* Overlay para cerrar menú de usuario al hacer clic fuera */}
     {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )} 

      {/* Componente del menú lateral - Solo se muestra si NO estamos en Mi Inmobiliaria */}
      {!isInInmobiliariaPage && (
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