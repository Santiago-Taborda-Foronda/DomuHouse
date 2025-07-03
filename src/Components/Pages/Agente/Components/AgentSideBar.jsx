import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, Plus, Calendar, MapPin, Users, Phone, TrendingUp, User, LogOut, X } from 'lucide-react';

export default function AgentSideBar({ 
  sidebarOpen, 
  setSidebarOpen, 
  toggleSidebar 
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/AgentDashboard" },
    { name: "Mis Propiedades", icon: Building, path: "/MisPropiedades" },
    { name: "Crear Propiedad", icon: Plus, path: "/CrearPropiedad" },
    { name: "Visitas Agendadas", icon: Calendar, path: "/VisitasAgendadas" },
    { name: "Programar Visitas", icon: MapPin, path: "/ProgramarVisita" },
    { name: "Contactar Clientes", icon: Phone, path: "/ContactarCliente" },
    { name: "Estado De Interés", icon: TrendingUp, path: "/EstadoInteres" },
  ];

  // Función para verificar si una ruta está activa
  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  // Función para manejar navegación
  const handleNavigation = (route) => {
    navigate(route);
    // Cerrar el sidebar en móviles después de navegar
    if (window.innerWidth < 1024) {
      if (setSidebarOpen) setSidebarOpen(false);
      if (toggleSidebar) toggleSidebar();
    }
  };

  // Función para cerrar el sidebar
  const closeSidebar = () => {
    if (setSidebarOpen) setSidebarOpen(false);
    if (toggleSidebar) toggleSidebar();
  };

  // Componente personalizado para elementos del menú con estado activo
  const MenuItem = ({ icon: Icon, label, route, subtitle = null }) => {
    const isActive = isActiveRoute(route);
    
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
    );
  };

  // Contenido del sidebar (reutilizable)
  const SidebarContent = ({ showCloseButton = false }) => (
    <>
      {/* Título del Portal */}
      <div className="text-center mb-8 pb-4 border-b border-gray-100 relative">
        <h1 className="text-xl font-bold text-gray-800 title-montserrat">
          Portal de <span className='text-[#2F8EAC]'>Agentes</span>
        </h1>
        <div className="w-12 h-1 bg-[#2F8EAC] mx-auto mt-2 rounded-full"></div>
        
        {/* Botón cerrar - Solo en versión móvil */}
        {showCloseButton && (
          <button 
            onClick={closeSidebar} 
            className="absolute top-0 right-0 focus:outline-none hover:bg-gray-100 p-1 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 mt-8">
        {/* Gestión de Propiedades */}
        <section>
          <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
            Gestión de Propiedades
          </h3>
          <ul className="space-y-1">
            <MenuItem 
              icon={LayoutDashboard}
              label="Dashboard"
              route="/AgentDashboard"
            />
            <MenuItem 
              icon={Building}
              label="Mis Propiedades"
              route="/MisPropiedades"
            />
            <MenuItem 
              icon={Plus}
              label="Crear Propiedad"
              route="/CrearPropiedad"
            />
          </ul>
        </section>

        {/* Gestión de Visitas */}
        <section>
          <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
            Gestión de Visitas
          </h3>
          <ul className="space-y-1">
            <MenuItem 
              icon={Calendar}
              label="Visitas Agendadas"
              route="/VisitasAgendadas"
            />
            <MenuItem 
              icon={MapPin}
              label="Programar Visitas"
              route="/ProgramarVisita"
            />
          </ul>
        </section>

        {/* Gestión de Clientes */}
        <section>
          <h3 className="font-semibold text-gray-700 mb-3 title-montserrat text-xs uppercase tracking-wide">
            Gestión de Clientes
          </h3>
          <ul className="space-y-1">
            <MenuItem 
              icon={Phone}
              label="Contactar Clientes"
              route="/ContactarCliente"
            />
            <MenuItem 
              icon={TrendingUp}
              label="Estado De Interés"
              route="/EstadoInteres"
            />
          </ul>
        </section>
      </div>
      
      {/* Cerrar sesión */}
      <section className="pt-4 border-t mt-6 mb-4">
        <button
          onClick={() => navigate('/Login')}
          className="w-full flex items-center gap-3 px-3 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut size={18} />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Cerrar Sesión</span>
            <span className="text-xs text-gray-500">DomuHouse</span>
          </div>
        </button>
      </section>
    </>
  );

  return (
    <>
      {/* Sidebar Desktop - Fijo y siempre visible en pantallas grandes */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-16 lg:w-72 lg:h-[calc(100vh-4rem)] lg:bg-white lg:shadow-lg lg:overflow-y-auto lg:z-30">
        <div className="p-6 h-full">
          <SidebarContent showCloseButton={false} />
        </div>
      </aside>

      {/* Sidebar Mobile - Overlay con animación */}
      {sidebarOpen && (
        <>
          {/* Overlay de fondo */}
          <div
            className="fixed inset-0 bg-transparent bg-opacity-30 z-40 transition-opacity duration-300 lg:hidden"
            onClick={closeSidebar}
          ></div>

          {/* Menú lateral móvil */}
          <aside className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform lg:hidden">
            <div className="p-6 h-full">
              <SidebarContent showCloseButton={true} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}