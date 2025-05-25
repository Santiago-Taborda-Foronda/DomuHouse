import React from 'react'
import { X, LayoutDashboard, Building2, HandCoins, Users, FileText, Calendar, BarChart3, User, UserCheck, LogOut } from 'lucide-react'
import LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import { Navbar } from '../Navbar/Navbar'
import { ItemsNavbar } from '../../UI/ItemsNavbar/ItemsNavbar'
import { Button } from '../../UI/Button/Button'

export const SidebarInmobiliaria = ({ isOpen, toggleMenu, isAuthenticated, handleLogout }) => {
  const handleNavigation = (route) => {
    window.location.href = route
  }

  return (
    <>
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
              <div className="ml-2">
                <span className="text-lg title-montserrat">DOMU<span className='text-[#2F8EAC]'>HOUSE</span></span>
                <p className="text-sm text-gray-500">Panel de gestión</p>
              </div>
            </div>
            
            {/* Botón cerrar */}
            <button onClick={toggleMenu} className="absolute top-4 right-4 focus:outline-none">
              <X className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex flex-col gap-6 mt-8">
              <section>
                <h3 className="font-semibold text-gray-700 mb-2 title-montserrat">Gestión Principal</h3>
                <Navbar>
                  <ul className="space-y-2">
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><LayoutDashboard size={18}/>Dashboard</div>} 
                      Route="/mi-inmobiliaria/dashboard" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Building2 size={18}/>Propiedades</div>} 
                      Route="/mi-inmobiliaria/propiedades" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><HandCoins size={18}/>Ventas y Alquileres</div>} 
                      Route="/mi-inmobiliaria/ventas-alquileres" 
                    />
                  </ul>
                </Navbar>
              </section>

              <section>
                <h3 className="font-semibold text-gray-700 mb-2 title-montserrat">Clientes y Contratos</h3>
                <Navbar>
                  <ul className="space-y-2">
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Users size={18}/>Clientes</div>} 
                      Route="/mi-inmobiliaria/clientes" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><FileText size={18}/>Contratos</div>} 
                      Route="/mi-inmobiliaria/contratos" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Calendar size={18}/>Agenda / Visitas</div>} 
                      Route="/mi-inmobiliaria/agenda" 
                    />
                  </ul>
                </Navbar>
              </section>

              <section>
                <h3 className="font-semibold text-gray-700 mb-2 title-montserrat">Reportes y Usuarios</h3>
                <Navbar>
                  <ul className="space-y-2">
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><BarChart3 size={18}/>Reportes</div>} 
                      Route="/mi-inmobiliaria/reportes" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><User size={18}/>Usuarios</div>} 
                      Route="/mi-inmobiliaria/usuarios" 
                    />
                  </ul>
                </Navbar>
              </section>

              <section>
                <h3 className="font-semibold text-gray-700 mb-2 title-montserrat">Administración</h3>
                <Navbar>
                  <ul className="space-y-2">
                    <ItemsNavbar 
                      content={
                        <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                          <UserCheck size={18}/>
                          <div>
                            <span className="block">Agentes</span>
                            <span className="text-xs text-gray-500">Administradores</span>
                          </div>
                        </div>
                      } 
                      Route="/mi-inmobiliaria/agentes-admin" 
                    />
                  </ul>
                </Navbar>
              </section>
            </div>
            
            {/* Cerrar sesión movido al final - solo mostrar si está autenticado */}
            {isAuthenticated && (
              <section className="pt-4 border-t mt-6 mb-4">
                <Button 
                  name={<div className="flex items-center gap-2"><LogOut size={18}/>Cerrar Sesión en DomuHouse</div>}
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