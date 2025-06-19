import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, Plus, Calendar, MapPin, Users, Phone, TrendingUp, User, LogOut, X } from 'lucide-react';

export default function AgentSideBar({ sidebarOpen, setSidebarOpen }) {
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
    };

    // Componente personalizado para elementos del menú con estado activo
    const MenuItem = ({ icon: Icon, label, route }) => {
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
                    <span className="text-sm">{label}</span>
                </button>
            </li>
        );
    };

    return (
        <div className="w-64 sm:w-72 lg:w-64 bg-white shadow-lg h-screen flex flex-col p-6">
            {/* Título del Portal */}
            <div className="text-center mb-8 pb-4 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-800 title-montserrat">
                    Portal de <span className='text-[#2F8EAC]'>Agentes</span>
                </h1>
                <div className="w-12 h-1 bg-[#2F8EAC] mx-auto mt-2 rounded-full"></div>
            </div>

            <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
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
        </div>
    );
}