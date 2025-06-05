import React from 'react'
import { X, LayoutDashboard, Building2, HandCoins, Users, FileText, Calendar, BarChart3, User, UserCheck, LogOut, UsersRound } from 'lucide-react'
import LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import { useNavigate, useLocation } from 'react-router-dom'

export const SidebarInmobiliaria = ({ isOpen, toggleMenu, isAuthenticated, handleLogout, isFixedLayout = false }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Función para verificar si una ruta está activa
  const isActiveRoute = (route) => {
    // Para la página de propiedades, también considerar rutas relacionadas
    if (route === '/mi-inmobiliaria/propiedades') {
      return location.pathname === route || 
             location.pathname === '/mi-inmobiliaria' || 
             location.pathname.startsWith('/mi-inmobiliaria/propiedades')
    }
    return location.pathname === route
  }

  // Función para manejar navegación
  const handleNavigation = (route) => {
    navigate(route)
    // Cerrar el sidebar en móviles después de navegar (solo si no es layout fijo)
    if (!isFixedLayout && window.innerWidth < 1024) {
      toggleMenu()
    }
  }

  // Componente personalizado para elementos del menú con estado activo
  const MenuItem = ({ icon: Icon, label, route, subtitle = null }) => {
    const isActive = isActiveRoute(route)
    
    return (
      <li>
        <button
          onClick={() => handleNavigation(route)}
          className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-all duration-200 ${
            isActive 
              ? 'bg-blue-50 text-[#2F8EAC] border-r-4 border-[#2F8EAC] font-medium shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-[#2F8EAC]'
          }`}
        >
          <Icon size={18} className={isActive ? 'text-[#2F8EAC]' : ''} />
          <div className="flex flex-col">
            <span className="text-sm">{label}</span>
            {subtitle && (
              <span className="text-xs text-gray-500">{subtitle}</span>
            )}
          </div>
        </button>
      </li>
    )
  }

  // Si es layout fijo, renderizar solo el contenido del sidebar
  if (isFixedLayout) {
    return (
      <div className="p-6 h-full">
        {/* Logo en la parte superior del menú */}
        <div className="flex items-center mb-6">
          <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-20" />
          <div className="ml-2">
            <span className="text-lg title-montserrat">DOMU<span className='text-[#2F8EAC]'>HOUSE</span></span>
            <p className="text-sm text-gray-500">Panel de gestión</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-8">
          {/* Gestión Principal */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
              Gestión Principal
            </h3>
            <ul className="space-y-1">
              <MenuItem 
                icon={LayoutDashboard}
                label="Dashboard"
                route="/mi-inmobiliaria/dashboard"
              />
              <MenuItem 
                icon={Building2}
                label="Propiedades"
                route="/mi-inmobiliaria/propiedades"
              />
              <MenuItem 
                icon={UsersRound}
                label="Gestión de Agentes"
                route="/mi-inmobiliaria/gestion-agentes"
              />
              <MenuItem 
                icon={HandCoins}
                label="Ventas y Alquileres"
                route="/mi-inmobiliaria/ventas-alquileres"
              />
            </ul>
          </section>

          {/* Clientes y Contratos */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
              Clientes y Contratos
            </h3>
            <ul className="space-y-1">
              <MenuItem 
                icon={Users}
                label="Clientes"
                route="/mi-inmobiliaria/clientes"
              />
              <MenuItem 
                icon={FileText}
                label="Contratos"
                route="/mi-inmobiliaria/contratos"
              />
              <MenuItem 
                icon={Calendar}
                label="Agenda / Visitas"
                route="/mi-inmobiliaria/agenda"
              />
            </ul>
          </section>

          {/* Reportes y Usuarios */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
              Reportes y Usuarios
            </h3>
            <ul className="space-y-1">
              <MenuItem 
                icon={BarChart3}
                label="Reportes"
                route="/mi-inmobiliaria/reportes"
              />
              <MenuItem 
                icon={User}
                label="Usuarios"
                route="/mi-inmobiliaria/usuarios"
              />
            </ul>
          </section>

          {/* Administración */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
              Administración
            </h3>
            <ul className="space-y-1">
              <MenuItem 
                icon={UserCheck}
                label="Agentes"
                route="/mi-inmobiliaria/agentes-admin"
                subtitle="Administradores"
              />
            </ul>
          </section>
        </div>
        
        {/* Cerrar sesión - solo mostrar si está autenticado */}
        {isAuthenticated && (
          <section className="pt-4 border-t mt-6 mb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut size={18} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Cerrar Sesión</span>
                <span className="text-xs text-gray-500">DomuHouse</span>
              </div>
            </button>
          </section>
        )}
      </div>
    )
  }

  // Layout original para versión móvil/overlay
  return (
    <>
      {/* Sidebar y Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 lg:hidden"
            onClick={toggleMenu}
          ></div>

          {/* Menú lateral */}
          <aside className="fixed top-0 left-0 w-72 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform duration-300 ease-in-out transform">
            {/* Logo en la parte superior del menú */}
            <div className="flex items-center mb-6">
              <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-20" />
              <div className="ml-2">
                <span className="text-lg title-montserrat">DOMU<span className='text-[#2F8EAC]'>HOUSE</span></span>
                <p className="text-sm text-gray-500">Panel de gestión</p>
              </div>
            </div>
            
            {/* Botón cerrar */}
            <button 
              onClick={toggleMenu} 
              className="absolute top-4 right-4 focus:outline-none hover:bg-gray-100 p-1 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex flex-col gap-6 mt-8">
              {/* Gestión Principal */}
              <section>
                <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
                  Gestión Principal
                </h3>
                <ul className="space-y-1">
                  <MenuItem 
                    icon={LayoutDashboard}
                    label="Dashboard"
                    route="/mi-inmobiliaria/dashboard"
                  />
                  <MenuItem 
                    icon={Building2}
                    label="Propiedades"
                    route="/mi-inmobiliaria/propiedades"
                  />
                  <MenuItem 
                    icon={UsersRound}
                    label="Gestión de Agentes"
                    route="/mi-inmobiliaria/gestion-agentes"
                  />
                  <MenuItem 
                    icon={HandCoins}
                    label="Ventas y Alquileres"
                    route="/mi-inmobiliaria/ventas-alquileres"
                  />
                </ul>
              </section>

              {/* Clientes y Contratos */}
              <section>
                <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
                  Clientes y Contratos
                </h3>
                <ul className="space-y-1">
                  <MenuItem 
                    icon={Users}
                    label="Clientes"
                    route="/mi-inmobiliaria/clientes"
                  />
                  <MenuItem 
                    icon={FileText}
                    label="Contratos"
                    route="/mi-inmobiliaria/contratos"
                  />
                  <MenuItem 
                    icon={Calendar}
                    label="Agenda / Visitas"
                    route="/mi-inmobiliaria/agenda"
                  />
                </ul>
              </section>

              {/* Reportes y Usuarios */}
              <section>
                <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
                  Reportes y Usuarios
                </h3>
                <ul className="space-y-1">
                  <MenuItem 
                    icon={BarChart3}
                    label="Reportes"
                    route="/mi-inmobiliaria/reportes"
                  />
                  <MenuItem 
                    icon={User}
                    label="Usuarios"
                    route="/mi-inmobiliaria/usuarios"
                  />
                </ul>
              </section>

              {/* Administración */}
              <section>
                <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
                  Administración
                </h3>
                <ul className="space-y-1">
                  <MenuItem 
                    icon={UserCheck}
                    label="Agentes"
                    route="/mi-inmobiliaria/agentes-admin"
                    subtitle="Administradores"
                  />
                </ul>
              </section>
            </div>
            
            {/* Cerrar sesión - solo mostrar si está autenticado */}
            {isAuthenticated && (
              <section className="pt-4 border-t mt-6 mb-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                    <span className="text-xs text-gray-500">DomuHouse</span>
                  </div>
                </button>
              </section>
            )}
          </aside>
        </>
      )}
    </>
  )
}