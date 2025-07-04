import React from 'react'
import LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import { MdEmail } from "react-icons/md"
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-300 py-10 px-8 text-sm text-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6
        max-[920px]:flex-col max-[768px]:items-center max-[480px]:px-4 max-[352px]:px-2">

        {/* Logo */}
        <div className="flex items-center gap-2 max-[480px]:flex-col max-[480px]:items-start">
          <img
            src={LogoDomuHouse}
            alt="LogoDomuHouse"
            className="w-30 h-auto max-[480px]:w-24"
          />
          <span className="text-2xl font-semibold text-black">
            DOMU<span className="text-[#2F8EAC]">HOUSE</span>
          </span>

        </div>

        {/* Enlaces útiles */}
        <div className="max-[480px]:text-center max-[352px]:text-sm">
          <h3 className="font-semibold mb-2">Enlaces útiles</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Inicio</a></li>
            <li><a href="#" className="hover:underline">Propiedades</a></li>
            <li><a href="#" className="hover:underline">Contacto</a></li>
            <li><a href="/metodos-pago" className="hover:underline">Métodos de pago</a></li>
            <li>
              <Link to="/Privacidad" className="hover:underline">
                Políticas de privacidad
              </Link>
            </li>
            <li>
              <Link to="/Terminos" className="hover:underline">
                Términos y Condiciones
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto rápido */}
        <div className="max-[480px]:text-center max-[352px]:text-sm">
          <h3 className="font-semibold mb-2">Contacto rápido</h3>
          <div className="flex items-center gap-2 justify-start max-[480px]:justify-center">
            <MdEmail className='text-[#2F8EAC] text-xl' />
            <span>domuhouse62@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-6 border-t border-gray-300 pt-4 text-center text-gray-700">
        <h3 className="font-semibold text-sm max-[480px]:text-xs">
          © 2025 DomuHouse. Todos los derechos reservados
        </h3>
      </div>
    </footer>
  )
}
