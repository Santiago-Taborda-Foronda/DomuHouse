import React from 'react'
import { Header } from '../../Layouts/Header/Header'


export const Terminos = () => {
  return (
    <>
    <Header />
      <div className="max-w-4xl mx-auto px-6 py-10 text-black font-sans">
        <h2 className="text-3xl font-bold text-center mb-10">Términos y Condiciones</h2>

        <h3 className="text-xl font-semibold mb-2">Introducción</h3>
        <p className="mb-4">
          Bienvenido a <strong>DomuHouse</strong>, una plataforma digital destinada a facilitar la compra, venta, alquiler y administración de propiedades. Al acceder y utilizar nuestros servicios, usted acepta cumplir con los presentes términos y condiciones. Le recomendamos leer detenidamente este documento, ya que establece los derechos y obligaciones tanto de los usuarios como de los administradores de la plataforma.
        </p>
        <p className="mb-6">
          DomuHouse se compromete a ofrecer un entorno seguro, transparente y eficiente para la gestión de bienes inmuebles. Estos términos aplican a todos los usuarios, incluidos visitantes, clientes, agentes y administradores.
        </p>

        <h3 className="text-xl font-semibold mb-2"> Uso del Servicio</h3>
        <p className="mb-4">
          El uso de DomuHouse está destinado únicamente a fines legales relacionados con la búsqueda, publicación, comparación, visita y gestión de propiedades. Los usuarios deben proporcionar información veraz, actualizada y completa al momento de registrarse o utilizar cualquiera de las funcionalidades del sistema.
        </p>
        <p className="mb-4">Queda prohibido:</p>
        <ul className="list-disc list-inside mb-6">
          <li>Suplantar la identidad de otras personas o empresas.</li>
          <li>Publicar propiedades falsas o con información engañosa.</li>
          <li>Interferir en el funcionamiento normal del sitio web o sus servicios.</li>
          <li>Usar la plataforma para actividades no relacionadas con el sector inmobiliario.</li>
        </ul>
        <p className="mb-6">
          DomuHouse se reserva el derecho de suspender o cancelar cuentas que infrinjan estos términos o afecten la experiencia de otros usuarios.
        </p>

        <h3 className="text-xl font-semibold mb-2">Terminación</h3>
        <p className="mb-4">
          DomuHouse puede, en cualquier momento y sin previo aviso, suspender o dar por terminado el acceso a su plataforma a cualquier usuario que incumpla estos términos o cuya conducta ponga en riesgo la integridad del sistema o la seguridad de otros usuarios.
        </p>
        <p className="mb-4">
          Asimismo, los usuarios pueden cerrar su cuenta voluntariamente, solicitando la eliminación de sus datos personales según las políticas de privacidad. Al finalizar la relación contractual, se eliminará el acceso a todas las funcionalidades, sin perjuicio de las obligaciones pendientes.
        </p>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Se notificará a los usuarios mediante los canales oficiales de la plataforma sobre cualquier cambio relevante.
        </p>
      </div>
    </>
  )
}

