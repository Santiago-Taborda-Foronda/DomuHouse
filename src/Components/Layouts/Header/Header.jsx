import React, { useState } from 'react'
import { Menu, X, Home, Search, Star, MessageSquare, Heart, Building2, Percent, User, ShoppingCart, CreditCard, LogOut } from 'lucide-react'
import LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import '../../../index.css' // Importa el archivo CSS de fuentes
import { Navbar } from '../Navbar/Navbar'
import { ItemsNavbar } from '../../UI/ItemsNavbar/ItemsNavbar'
import { Button } from '../../UI/Button/Button'

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Header - Fijo en pantalla al hacer scroll */}
      <header className="flex items-center justify-between px-4 bg-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
          {/* Botón hamburguesa */}
          <button onClick={toggleMenu} className="focus:outline-none">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-24" />
          <h1 className='text-lg title-montserrat'>DOMU<span className='text-[#2F8EAC]'>HOUSE</span> </h1>
        </div>

        {/* Botones del header (ejemplo) */}
        <div className="space-x-2">
          <Button 
            name="Regístrate" 
            Route="/Registrarse" 
            className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-4 py-2 rounded-xl"
          />
          <Button 
            name="Iniciar" 
            Route="/Login" 
            className="bg-[#2F8EAC] hover:bg-sky-600 active:bg-sky-700 transition duration-150 ease-in-out text-white px-4 py-2 rounded-xl"
          />
        </div>
      </header>

      {/* Espacio para compensar el header fijo */}
      <div className="h-16"></div>

      {/* Sidebar y Overlay */}
      {isOpen && (
        <>
          {/* Overlay - fondo oscuro cuando el menú está abierto */}
          <div
            className="fixed inset-0 bg-transparent bg-opacity-30 z-40 transition-opacity duration-300"
            onClick={toggleMenu}
          ></div>

          {/* Menú lateral */}
          <aside className="fixed top-0 left-0 w-72 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform duration-300 ease-in-out transform">
            {/* Logo en la parte superior del menú */}
            <div className="flex items-center mb-6">
              <img src={LogoDomuHouse} alt="LogoDomuHouse" className="w-24" />
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
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><Search size={18}/>Búsqueda Avanzada</div>} 
                      Route="/busqueda" 
                    />
                    <ItemsNavbar 
                      content={<div className="flex items-center gap-2 text-gray-600 hover:text-blue-600"><MessageSquare size={18}/>Chatbot Domu</div>} 
                      Route="/chatbot" 
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
            
            {/* Cerrar sesión movido al final */}
            <section className="pt-4 border-t mt-6 mb-4">
              <Button 
                name={<div className="flex items-center gap-2"><LogOut size={18}/>Cerrar sesión en DomuHouse</div>}
                Route="/logout"
                className="text-sm text-blue-600 hover:underline bg-transparent p-0"
              />
            </section>
          </aside>
        </>
      )}
    </>
  )
}