import React, { useState, useEffect } from 'react'
import { Menu, X, Home, Search, Star, MessageSquare, Heart, Building2, Percent, User, ShoppingCart, CreditCard, LogOut, UserCircle, Settings } from 'lucide-react'
import LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import '../../../index.css'
import { Navbar } from '../Navbar/Navbar'
import { ItemsNavbar } from '../../UI/ItemsNavbar/ItemsNavbar'
import { Button } from '../../UI/Button/Button'

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

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

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuthStatus()
    
    // Escuchar cambios en el localStorage (útil para cuando se hace login/logout en otra pestaña)
    const handleStorageChange = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
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

  return (
    <>
      {/* Header - Fijo en pantalla al hacer scroll */}
      <header className="flex items-center justify-between px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm h-16">
        <div className="flex items-center gap-4">
          {/* Botón hamburguesa */}
          <button onClick={toggleMenu} className="focus:outline-none">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-20 h-auto" />
          <h1 className='text-base sm:text-lg title-montserrat'>DOMU<span className='text-[#2F8EAC]'>HOUSE</span></h1>
        </div>

        {/* Botones del header o perfil de usuario */}
        <div className="flex items-center space-x-2">
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

      {/* Sidebar y Overlay */}
      {isOpen && (
        <>
          {/* Overlay - fondo oscuro cuando el menú está abierto */}
          <div
            className="fixed inset-0 bg-opacity-30 z-40 transition-opacity duration-300"
            onClick={toggleMenu}
          ></div>

          {/* Menú lateral */}
          <aside className="fixed top-0 left-0 w-72 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform duration-300 ease-in-out transform">
            {/* Logo en la parte superior del menú */}
            <div className="flex items-center mb-6">
              <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-20" />
              <span className="text-lg title-montserrat ml-2">DOMU<span className='text-[#2F8EAC]'>HOUSE</span></span>
            </div>
            
            {/* Botón cerrar */}
            <button onClick={toggleMenu} className="absolute top-4 right-4 focus:outline-none">
              <X className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex flex-col gap-6 mt-8">
              <section>
                <h3 className="font-semibold text-gray-700 mb-2 title-montserrat">Principal</h3>
                <Navbar>
                  <ul className="space-y-2">
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Home size={18}/>Inicio</div>} 
                      Route="/" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Search size={18}/>Publicar Inmobiliaria</div>} 
                      Route="/CrearInmobiliarias" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><MessageSquare size={18}/>Inmobiliarias</div>} 
                      Route="/inmobiliarias" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Star size={18}/>Tendencias</div>} 
                      Route="/tendencias" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Heart size={18}/>Favoritos</div>} 
                      Route="/favoritos" 
                    />
                  </ul>
                </Navbar>
              </section>

              <section>
                <h3 className="font-semibold text-gray-700 mb-2 title-montserrat">Propiedades</h3>
                <Navbar>
                  <ul className="space-y-2">
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Building2 size={18}/>Destacadas</div>} 
                      Route="/propiedades/destacadas" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Building2 size={18}/>Nuevas</div>} 
                      Route="/propiedades/nuevas" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Percent size={18}/>En Oferta</div>} 
                      Route="/propiedades/ofertas" 
                    />
                  </ul>
                </Navbar>
              </section>

              <section>
                <h3 className="font-semibold text-gray-700 mb-2 title-montserrat">Agentes / Contacto</h3>
                <Navbar>
                  <ul className="space-y-2">
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><User size={18}/>Nuestros Agentes</div>} 
                      Route="/agentes" 
                    />
                  </ul>
                </Navbar>
              </section>

              <section>
                <h3 className="font-semibold text-gray-700 mb-2 title-montserrat">Servicios</h3>
                <Navbar>
                  <ul className="space-y-2">
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><ShoppingCart size={18}/>Compra y Venta</div>} 
                      Route="/servicios/compra-venta" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><ShoppingCart size={18}/>Alquileres</div>} 
                      Route="/servicios/alquileres" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><CreditCard size={18}/>Métodos de Pago</div>} 
                      Route="/servicios/pagos" 
                    />
                  </ul>
                </Navbar>
              </section>
            </div>
            
            {/* Cerrar sesión movido al final - solo mostrar si está autenticado */}
            {isAuthenticated && (
              <section className="pt-4 border-t mt-6 mb-4">
                <Button 
                  name={<div className="flex items-center gap-2"><LogOut size={18}/>Cerrar sesión en DomuHouse</div>}
                  onClick={handleLogout}
                  className="text-sm text-blue-600 hover:underline bg-transparent p-0"
                />
              </section>
            )}
          </aside>
        </>
      )}
    </>
  )
}