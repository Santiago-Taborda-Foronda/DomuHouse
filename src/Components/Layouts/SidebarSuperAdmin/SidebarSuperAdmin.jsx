"use client"
import { X, LayoutDashboard, Building2, BarChart3, Settings, CreditCard, UserCheck, LogOut, Crown } from "lucide-react"
import LogoDomuHouse from "../../../assets/images/Logo-DomuHouse.png"
import { useNavigate, useLocation } from "react-router-dom"

export const SidebarSuperAdmin = ({ isOpen, toggleMenu, isAuthenticated, handleLogout, isFixedLayout = false }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Función para verificar si una ruta está activa
  const isActiveRoute = (route) => {
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
              ? "bg-[#2F8EAC]/10 text-[#2F8EAC] border-r-4 border-[#2F8EAC] font-medium shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-[#2F8EAC]"
          }`}
        >
          <Icon size={18} className={isActive ? "text-[#2F8EAC]" : ""} />
          <div className="flex flex-col">
            <span className="text-sm">{label}</span>
            {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
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
        <div className="text-center mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-[#2F8EAC]" />
            <h1 className="text-xl font-bold text-gray-800 title-montserrat">
              <span className="text-[#2F8EAC]">Super</span> Admin
            </h1>
          </div>
          <p className="text-sm text-gray-600">Panel de Control Maestro</p>
          <div className="w-12 h-1 bg-[#2F8EAC] mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="flex flex-col gap-6 mt-8">
          {/* Panel Principal */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
              Panel Principal
            </h3>
            <ul className="space-y-1">
              <MenuItem icon={LayoutDashboard} label="Dashboard" route="/super-admin/dashboard" />
              <MenuItem icon={BarChart3} label="Analytics Globales" route="/super-admin/analytics" />
            </ul>
          </section>

          {/* Gestión de Plataforma */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
              Gestión de Plataforma
            </h3>
            <ul className="space-y-1">
              <MenuItem
                icon={Building2}
                label="Inmobiliarias"
                route="/super-admin/inmobiliarias"
                subtitle="Gestionar empresas"
              />
              <MenuItem
                icon={UserCheck}
                label="Administradores"
                route="/super-admin/administradores"
                subtitle="Gestionar admins"
              />
            </ul>
          </section>

          {/* Facturación y Sistema */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
              Sistema y Facturación
            </h3>
            <ul className="space-y-1">
              <MenuItem
                icon={CreditCard}
                label="Facturación"
                route="/super-admin/facturacion"
                subtitle="Suscripciones y pagos"
              />
              <MenuItem
                icon={Settings}
                label="Configuración"
                route="/super-admin/configuracion"
                subtitle="Ajustes del sistema"
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
              <img src={LogoDomuHouse || "/placeholder.svg"} alt="LogoDomuHouse" className="w-20" />
              <div className="ml-2">
                <span className="text-lg title-montserrat">
                  DOMU<span className="text-[#2F8EAC]">HOUSE</span>
                </span>
                <p className="text-sm text-gray-500">Super Admin</p>
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
              {/* Panel Principal */}
              <section>
                <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
                  Panel Principal
                </h3>
                <ul className="space-y-1">
                  <MenuItem icon={LayoutDashboard} label="Dashboard" route="/super-admin/dashboard" />
                  <MenuItem icon={BarChart3} label="Analytics Globales" route="/super-admin/analytics" />
                </ul>
              </section>

              {/* Gestión de Plataforma */}
              <section>
                <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
                  Gestión de Plataforma
                </h3>
                <ul className="space-y-1">
                  <MenuItem
                    icon={Building2}
                    label="Inmobiliarias"
                    route="/super-admin/inmobiliarias"
                    subtitle="Gestionar empresas"
                  />
                  <MenuItem
                    icon={UserCheck}
                    label="Administradores"
                    route="/super-admin/administradores"
                    subtitle="Gestionar admins"
                  />
                </ul>
              </section>

              {/* Facturación y Sistema */}
              <section>
                <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
                  Sistema y Facturación
                </h3>
                <ul className="space-y-1">
                  <MenuItem
                    icon={CreditCard}
                    label="Facturación"
                    route="/super-admin/facturacion"
                    subtitle="Suscripciones y pagos"
                  />
                  <MenuItem
                    icon={Settings}
                    label="Configuración"
                    route="/super-admin/configuracion"
                    subtitle="Ajustes del sistema"
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
