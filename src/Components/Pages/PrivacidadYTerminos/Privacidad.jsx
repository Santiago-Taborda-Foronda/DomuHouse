import React from 'react'
import { Header } from '../../Layouts/Header/Header'

export const Privacidad = () => {
  return (
    <>  
    <Header />
    <div className="max-w-4xl mx-auto px-6 py-10 text-black font-sans">
      <h2 className="text-3xl font-bold text-center mb-10">Políticas de Privacidad</h2>

      <h3 className="text-xl font-semibold mb-2">Introducción</h3>
      <p className="mb-6">
        En <strong>DomuHouse</strong>, valoramos tu privacidad y nos comprometemos a proteger la información personal que compartes con nosotros. Estas políticas de privacidad describen cómo recopilamos, usamos y protegemos tus datos cuando utilizas nuestra plataforma inmobiliaria. Al acceder y utilizar nuestros servicios, aceptas las prácticas descritas en esta política.
      </p>

      <h3 className="text-xl font-semibold mb-2"> Recopilación de datos</h3>
      <p className="mb-4">Para ofrecerte un servicio personalizado y eficiente, recopilamos diferentes tipos de información, incluyendo:</p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Datos personales:</strong> Como nombre, correo electrónico, número de teléfono y dirección.</li>
        <li><strong>Datos de uso:</strong> Información sobre cómo interactúas con nuestra plataforma, incluyendo búsquedas, propiedades visitadas y preferencias.</li>
        <li><strong>Datos técnicos:</strong> Dirección IP, tipo de dispositivo, navegador y datos de cookies para mejorar tu experiencia y seguridad.</li>
      </ul>
      <p className="mb-6">
        Recopilamos estos datos cuando te registras, navegas, contactas a agentes o realizas cualquier acción dentro de DomuHouse.
      </p>

      <h3 className="text-xl font-semibold mb-2"> Uso de la Información</h3>
      <p className="mb-4">La información recopilada se utiliza para:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Facilitar y mejorar la experiencia de búsqueda y selección de propiedades.</li>
        <li>Personalizar el contenido y las recomendaciones según tus preferencias.</li>
        <li>Contactarte para soporte, información relevante y comunicaciones relacionadas con tu cuenta o propiedades de interés.</li>
        <li>Cumplir con obligaciones legales y garantizar la seguridad de la plataforma y sus usuarios.</li>
      </ul>
      <p>
        No compartimos tu información personal con terceros sin tu consentimiento explícito, salvo en los casos requeridos por ley.
      </p>
    </div>
    </>
    
  )
}

