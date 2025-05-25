import React from 'react'
import { X, Home, Search, Star, MessageSquare, Heart, Building2, Percent, User, ShoppingCart, CreditCard, LogOut } from 'lucide-react'
import LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import { Navbar } from '../Navbar/Navbar'
import { ItemsNavbar } from '../../UI/ItemsNavbar/ItemsNavbar'
import { Button } from '../../UI/Button/Button'

export const SidebarMenu = ({ isOpen, toggleMenu, isAuthenticated, handleLogout }) => {
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