import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoDomuHouse from '../../../../assets/images/Logo-DomuHouse.png';
import { LayoutDashboard, Building, Plus, Calendar, MapPin, Users, Phone, TrendingUp, User, LogOut, X, Home } from 'lucide-react';

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

    const handleMenuClick = (path) => {
        navigate(path);
        if (setSidebarOpen) {
            setSidebarOpen(false);
        }
    };

    const isActive = (path) => {
        return location.pathname === path || (path === "/AgentDashboard" && location.pathname === "/AgentDashboard");
    };

    return (
        <div className="w-64 sm:w-72 lg:w-64 bg-white shadow-lg relative h-screen flex flex-col">
            {setSidebarOpen && (
                <div className="lg:hidden absolute top-4 right-4 z-10">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
                <div className="flex items-center space-x-2">
                    <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-20 h-auto" />

                    <h1 className="text-sm sm:text-base lg:text-lg font-semibold">
                        DOMU<span className="text-[#2F8EAC]">HOUSE</span>
                    </h1>
                </div>
            </div>

            <nav className="flex-1 py-2 sm:py-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleMenuClick(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors duration-200 ${isActive(item.path)
                                    ? 'bg-blue-50 text-[#2F8EAC] border-r-2 border-[#2F8EAC]'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#2F8EAC]'
                                }`}
                        >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium truncate">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-3 sm:p-4 border-t bg-gray-50">
                <button
                    onClick={() => navigate('/Login')}
                    className="w-full flex items-center space-x-2 sm:space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">Cerrar Sesión</p>
                        <p className="text-xs text-gray-500 truncate">DomuHouse</p>
                    </div>
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                </button>
            </div>
        </div>
    );
}