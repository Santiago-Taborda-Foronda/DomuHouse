"use client"

import { useState } from "react"
import {
  FileText,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Building2,
  CreditCard,
  Scale,
  UserX,
  Mail,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Home,
} from "lucide-react"

export const Terminos = () => {
  const [activeSection, setActiveSection] = useState(null)

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const secciones = [
    {
      id: "introduccion",
      titulo: "Introducción",
      icono: <FileText className="w-6 h-6" />,
      contenido: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Bienvenido a <strong className="text-[#2F8EAC]">DomuHouse</strong>, una plataforma digital destinada a
            facilitar la compra, venta, alquiler y administración de propiedades inmobiliarias. Al acceder y utilizar
            nuestros servicios, usted acepta cumplir con los presentes términos y condiciones.
          </p>
          <p className="text-gray-700 leading-relaxed">
            DomuHouse opera como una plataforma que conecta múltiples inmobiliarias independientes, sus agentes y
            clientes potenciales, facilitando transacciones inmobiliarias seguras y transparentes en todo Colombia.
          </p>
          <div className="bg-[#2F8EAC]/5 border border-[#2F8EAC]/20 rounded-xl p-6">
            <h4 className="font-semibold text-[#2F8EAC] mb-3">Alcance de la Plataforma</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                  <span className="text-sm text-gray-700">Múltiples inmobiliarias registradas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                  <span className="text-sm text-gray-700">Agentes inmobiliarios certificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                  <span className="text-sm text-gray-700">Clientes compradores y arrendatarios</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                  <span className="text-sm text-gray-700">Propiedades en venta y arriendo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                  <span className="text-sm text-gray-700">Sistema de pagos integrado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                  <span className="text-sm text-gray-700">Herramientas de gestión inmobiliaria</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Estos términos aplican a todos los usuarios de la plataforma, incluidos
                  visitantes, clientes, agentes inmobiliarios, administradores de inmobiliarias y personal de DomuHouse.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  <strong>Última actualización:</strong> 15 de enero de 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "definiciones",
      titulo: "Definiciones",
      icono: <Users className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Para efectos de estos términos y condiciones, se establecen las siguientes definiciones:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                DomuHouse
              </h4>
              <p className="text-sm text-gray-700">
                La plataforma digital, sus servicios, tecnología y marca, operada por DomuHouse S.A.S., empresa
                colombiana dedicada a la intermediación inmobiliaria digital.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2F8EAC]" />
                Usuario
              </h4>
              <p className="text-sm text-gray-700">
                Cualquier persona natural o jurídica que acceda, navegue, se registre o utilice los servicios de la
                plataforma DomuHouse.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                Inmobiliaria
              </h4>
              <p className="text-sm text-gray-700">
                Empresa legalmente constituida y registrada en DomuHouse que ofrece servicios inmobiliarios a través de
                la plataforma.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserX className="w-5 h-5 text-[#2F8EAC]" />
                Agente
              </h4>
              <p className="text-sm text-gray-700">
                Profesional inmobiliario vinculado a una inmobiliaria registrada, autorizado para gestionar propiedades
                y atender clientes.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Home className="w-5 h-5 text-[#2F8EAC]" />
                Propiedad
              </h4>
              <p className="text-sm text-gray-700">
                Bien inmueble (casa, apartamento, local, oficina, terreno) publicado en la plataforma para venta o
                arriendo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2F8EAC]" />
                Transacción
              </h4>
              <p className="text-sm text-gray-700">
                Cualquier operación financiera realizada a través de la plataforma, incluyendo pagos, depósitos,
                comisiones y transferencias.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Nota Importante</h4>
                <p className="text-sm text-yellow-700">
                  DomuHouse actúa como intermediario tecnológico y no es propietario de las propiedades publicadas. Las
                  transacciones se realizan entre usuarios independientes bajo la supervisión de la plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "uso",
      titulo: "Uso del Servicio",
      icono: <CheckCircle className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            El uso de DomuHouse está destinado únicamente a fines legales relacionados con la búsqueda, publicación,
            comparación, visita y gestión de propiedades inmobiliarias.
          </p>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Usos Permitidos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-800 mb-2">Para Clientes:</h5>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Buscar y filtrar propiedades</li>
                    <li>• Contactar agentes e inmobiliarias</li>
                    <li>• Programar visitas a propiedades</li>
                    <li>• Realizar pagos y transacciones</li>
                    <li>• Guardar propiedades favoritas</li>
                    <li>• Recibir recomendaciones personalizadas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-800 mb-2">Para Inmobiliarias/Agentes:</h5>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Publicar y gestionar propiedades</li>
                    <li>• Administrar carteras de clientes</li>
                    <li>• Procesar transacciones inmobiliarias</li>
                    <li>• Generar reportes y estadísticas</li>
                    <li>• Gestionar comisiones y pagos</li>
                    <li>• Utilizar herramientas de marketing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Usos Prohibidos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-red-800 mb-2">Actividades Fraudulentas:</h5>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Suplantar identidad de personas o empresas</li>
                    <li>• Publicar propiedades falsas o inexistentes</li>
                    <li>• Proporcionar información engañosa</li>
                    <li>• Realizar transacciones fraudulentas</li>
                    <li>• Crear cuentas múltiples sin autorización</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-800 mb-2">Actividades Técnicas:</h5>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Interferir con el funcionamiento del sitio</li>
                    <li>• Realizar ataques cibernéticos</li>
                    <li>• Extraer datos sin autorización</li>
                    <li>• Usar bots o scripts automatizados</li>
                    <li>• Violar sistemas de seguridad</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-3">Requisitos de Registro</h4>
              <p className="text-sm text-blue-700 mb-3">
                Los usuarios deben proporcionar información veraz, actualizada y completa al registrarse:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h5 className="font-medium text-blue-800 text-sm">Información Personal</h5>
                  <p className="text-xs text-blue-700">Datos de identificación válidos y actualizados</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h5 className="font-medium text-blue-800 text-sm">Contacto Verificado</h5>
                  <p className="text-xs text-blue-700">Email y teléfono verificables y funcionales</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h5 className="font-medium text-blue-800 text-sm">Documentación</h5>
                  <p className="text-xs text-blue-700">Documentos legales según el tipo de usuario</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "responsabilidades",
      titulo: "Responsabilidades",
      icono: <Scale className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Cada tipo de usuario tiene responsabilidades específicas dentro de la plataforma DomuHouse:
          </p>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                Responsabilidades de DomuHouse
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Servicios Técnicos:</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Mantener la plataforma operativa 24/7</li>
                    <li>• Garantizar la seguridad de los datos</li>
                    <li>• Procesar pagos de forma segura</li>
                    <li>• Proporcionar soporte técnico</li>
                    <li>• Actualizar y mejorar la plataforma</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Servicios de Intermediación:</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Facilitar conexiones entre usuarios</li>
                    <li>• Verificar identidad de usuarios</li>
                    <li>• Mediar en disputas cuando sea necesario</li>
                    <li>• Mantener estándares de calidad</li>
                    <li>• Cumplir con regulaciones aplicables</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2F8EAC]" />
                Responsabilidades de Inmobiliarias
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Información y Documentación:</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Verificar la veracidad de las propiedades</li>
                    <li>• Mantener documentación legal actualizada</li>
                    <li>• Proporcionar información precisa de precios</li>
                    <li>• Actualizar disponibilidad de propiedades</li>
                    <li>• Cumplir con normativas inmobiliarias</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Atención al Cliente:</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Responder consultas de forma oportuna</li>
                    <li>• Coordinar visitas a propiedades</li>
                    <li>• Gestionar procesos de transacción</li>
                    <li>• Supervisar el trabajo de sus agentes</li>
                    <li>• Resolver problemas con clientes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserX className="w-5 h-5 text-[#2F8EAC]" />
                Responsabilidades de Agentes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Profesionalismo:</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Mantener licencia profesional vigente</li>
                    <li>• Actuar con ética y transparencia</li>
                    <li>• Proporcionar asesoría profesional</li>
                    <li>• Cumplir con códigos de conducta</li>
                    <li>• Mantener confidencialidad de clientes</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Gestión de Propiedades:</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Verificar información de propiedades</li>
                    <li>• Coordinar visitas y presentaciones</li>
                    <li>• Facilitar procesos de negociación</li>
                    <li>• Mantener comunicación con clientes</li>
                    <li>• Reportar actividades a la inmobiliaria</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-[#2F8EAC]" />
                Responsabilidades de Clientes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Información Personal:</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Proporcionar datos veraces y actualizados</li>
                    <li>• Mantener información de contacto vigente</li>
                    <li>• Verificar identidad cuando sea requerido</li>
                    <li>• Notificar cambios en su situación</li>
                    <li>• Proteger sus credenciales de acceso</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Transacciones:</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Realizar pagos de forma oportuna</li>
                    <li>• Cumplir con compromisos adquiridos</li>
                    <li>• Comunicar problemas o cambios</li>
                    <li>• Respetar términos de negociación</li>
                    <li>• Proporcionar documentación requerida</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800 mb-1">Limitación de Responsabilidad</h4>
                <p className="text-sm text-orange-700">
                  DomuHouse actúa como intermediario tecnológico y no se hace responsable por disputas entre usuarios,
                  calidad de propiedades, o incumplimientos contractuales entre partes. Nuestra responsabilidad se
                  limita a facilitar la conexión y proporcionar herramientas tecnológicas seguras.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "pagos",
      titulo: "Pagos y Comisiones",
      icono: <DollarSign className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            DomuHouse facilita transacciones seguras entre usuarios y cobra comisiones por los servicios prestados:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Estructura de Comisiones
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Arriendo - Depósito:</span>
                  <span className="text-sm font-medium text-blue-800">3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Arriendo - Mensualidad:</span>
                  <span className="text-sm font-medium text-blue-800">1.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Venta - Separación:</span>
                  <span className="text-sm font-medium text-blue-800">2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Comisión Agente:</span>
                  <span className="text-sm font-medium text-blue-800">0.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Sistema de Custodia
              </h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Fondos retenidos hasta completar transacción</li>
                <li>• Verificación de documentación legal</li>
                <li>• Liberación automática según términos</li>
                <li>• Protección contra fraudes</li>
                <li>• Resolución de disputas</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-semibold text-yellow-800 mb-3">Política de Reembolsos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-yellow-800 mb-2">Reembolsos Automáticos:</h5>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Propiedad no disponible al momento del pago</li>
                  <li>• Información falsa o engañosa verificada</li>
                  <li>• Cancelación dentro de 24 horas</li>
                  <li>• Fallas técnicas de la plataforma</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-yellow-800 mb-2">Reembolsos por Solicitud:</h5>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Disputas resueltas a favor del cliente</li>
                  <li>• Incumplimiento por parte de la inmobiliaria</li>
                  <li>• Problemas legales con la propiedad</li>
                  <li>• Casos especiales evaluados individualmente</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-semibold text-red-800 mb-3">Pagos Atrasados y Penalidades</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800">Mora en Pagos</h5>
                  <p className="text-sm text-red-700">
                    Los pagos atrasados generan intereses de mora del 1.5% mensual sobre el valor adeudado.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800">Suspensión de Servicios</h5>
                  <p className="text-sm text-red-700">
                    El acceso a la plataforma puede ser suspendido por pagos atrasados superiores a 30 días.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "propiedad",
      titulo: "Propiedad Intelectual",
      icono: <Shield className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Todos los derechos de propiedad intelectual relacionados con DomuHouse están protegidos por las leyes
            aplicables:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Propiedad de DomuHouse
              </h4>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• Marca registrada "DomuHouse"</li>
                <li>• Diseño y arquitectura de la plataforma</li>
                <li>• Código fuente y algoritmos</li>
                <li>• Base de datos y estructura</li>
                <li>• Contenido original y documentación</li>
                <li>• Metodologías y procesos propios</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Contenido de Usuarios
              </h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Fotografías de propiedades</li>
                <li>• Descripciones y textos</li>
                <li>• Videos y tours virtuales</li>
                <li>• Documentos y planos</li>
                <li>• Comentarios y reseñas</li>
                <li>• Información de contacto</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Licencia de Uso</h4>
            <p className="text-sm text-blue-700 mb-4">
              Al utilizar DomuHouse, los usuarios otorgan una licencia limitada, no exclusiva y revocable para:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-blue-800 mb-2">Uso Permitido:</h5>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Mostrar contenido en la plataforma</li>
                  <li>• Optimizar búsquedas y recomendaciones</li>
                  <li>• Generar estadísticas agregadas</li>
                  <li>• Mejorar servicios de la plataforma</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-blue-800 mb-2">Restricciones:</h5>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• No venta a terceros</li>
                  <li>• No uso comercial independiente</li>
                  <li>• No modificación sin autorización</li>
                  <li>• No distribución fuera de la plataforma</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-semibold text-red-800 mb-3">Infracciones y Sanciones</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800">Uso No Autorizado</h5>
                  <p className="text-sm text-red-700">
                    El uso no autorizado de contenido protegido puede resultar en suspensión inmediata de la cuenta y
                    acciones legales correspondientes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800">Proceso de Reclamación</h5>
                  <p className="text-sm text-red-700">
                    Los propietarios de contenido pueden reportar infracciones a través de nuestro sistema de
                    reclamaciones DMCA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "terminacion",
      titulo: "Terminación",
      icono: <UserX className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            La relación contractual entre DomuHouse y los usuarios puede terminar por diversas circunstancias:
          </p>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Terminación por DomuHouse
              </h4>
              <p className="text-sm text-red-700 mb-3">
                DomuHouse puede suspender o terminar cuentas de usuario en los siguientes casos:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-red-800 mb-2">Violaciones Graves:</h5>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Fraude o actividades ilegales</li>
                    <li>• Suplantación de identidad</li>
                    <li>• Publicación de información falsa</li>
                    <li>• Ataques a la plataforma</li>
                    <li>• Violación de derechos de terceros</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-800 mb-2">Incumplimientos Reiterados:</h5>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Pagos atrasados recurrentes</li>
                    <li>• Violaciones menores repetidas</li>
                    <li>• Comportamiento inadecuado</li>
                    <li>• Incumplimiento de políticas</li>
                    <li>• Uso indebido de la plataforma</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <UserX className="w-5 h-5 text-blue-600" />
                Terminación por Usuario
              </h4>
              <p className="text-sm text-blue-700 mb-3">Los usuarios pueden terminar su relación con DomuHouse:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Proceso de Cancelación:</h5>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Solicitud formal por escrito</li>
                    <li>• Completar transacciones pendientes</li>
                    <li>• Liquidar pagos adeudados</li>
                    <li>• Transferir o eliminar propiedades</li>
                    <li>• Confirmar eliminación de datos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Período de Gracia:</h5>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• 30 días para completar procesos</li>
                    <li>• Acceso limitado durante transición</li>
                    <li>• Respaldo de información importante</li>
                    <li>• Notificación a contactos relevantes</li>
                    <li>• Resolución de disputas pendientes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">Efectos de la Terminación</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-yellow-800 mb-2">Inmediatos:</h5>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• Pérdida de acceso a la plataforma</li>
                    <li>• Suspensión de servicios activos</li>
                    <li>• Retención de fondos en disputa</li>
                    <li>• Notificación a usuarios relacionados</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-yellow-800 mb-2">A Largo Plazo:</h5>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• Eliminación de datos personales</li>
                    <li>• Archivo de registros legales</li>
                    <li>• Finalización de obligaciones</li>
                    <li>• Liberación de responsabilidades</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-800 mb-3">Supervivencia de Términos</h4>
              <p className="text-sm text-green-700 mb-3">
                Algunos términos continúan vigentes después de la terminación:
              </p>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Obligaciones de pago pendientes</li>
                <li>• Responsabilidades por daños causados</li>
                <li>• Derechos de propiedad intelectual</li>
                <li>• Cláusulas de confidencialidad</li>
                <li>• Disposiciones de resolución de disputas</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "modificaciones",
      titulo: "Modificaciones y Contacto",
      icono: <Mail className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Modificaciones a los Términos
            </h4>
            <div className="space-y-4">
              <p className="text-sm text-blue-700">
                DomuHouse se reserva el derecho de modificar estos términos y condiciones en cualquier momento para:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Razones para Modificación:</h5>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Cambios en la legislación aplicable</li>
                    <li>• Nuevos servicios o funcionalidades</li>
                    <li>• Mejoras en seguridad y privacidad</li>
                    <li>• Optimización de procesos</li>
                    <li>• Retroalimentación de usuarios</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Proceso de Notificación:</h5>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Notificación por email registrado</li>
                    <li>• Aviso en la plataforma por 30 días</li>
                    <li>• Publicación en sitio web oficial</li>
                    <li>• Período de gracia para adaptación</li>
                    <li>• Opción de cancelación sin penalidad</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2F8EAC]/5 border border-[#2F8EAC]/20 rounded-xl p-6">
            <h4 className="font-semibold text-[#2F8EAC] mb-4">Información de Contacto</h4>
            <p className="text-sm text-gray-700 mb-4">
              Para consultas, reclamaciones o soporte relacionado con estos términos y condiciones:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email General</p>
                    <p className="text-sm text-gray-700">soporte@domuhouse.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Asuntos Legales</p>
                    <p className="text-sm text-gray-700">legal@domuhouse.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teléfono</p>
                    <p className="text-sm text-gray-700">+57 (300) 123-4567</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-[#2F8EAC] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dirección Física</p>
                    <p className="text-sm text-gray-700">
                      DomuHouse S.A.S.
                      <br />
                      Calle 123 #45-67, Oficina 801
                      <br />
                      Medellín, Antioquia, Colombia
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Horario de Atención</p>
                    <p className="text-sm text-gray-700">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-green-800 mb-3">Resolución de Disputas</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-green-800">Jurisdicción</h5>
                  <p className="text-sm text-green-700">
                    Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa será resuelta
                    en los tribunales competentes de Medellín, Antioquia.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-green-800">Mediación</h5>
                  <p className="text-sm text-green-700">
                    Antes de iniciar procesos judiciales, las partes se comprometen a intentar resolver disputas a
                    través de mediación o arbitraje según sea apropiado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#2F8EAC] mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Aceptación de Términos</h4>
                <p className="text-sm text-gray-700">
                  Al utilizar DomuHouse, usted confirma que ha leído, entendido y acepta estar sujeto a estos términos y
                  condiciones en su totalidad. Si no está de acuerdo con alguna parte de estos términos, debe abstenerse
                  de utilizar nuestros servicios.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#2F8EAC] rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce los términos que rigen el uso de DomuHouse y los derechos y obligaciones de todos los usuarios de
            nuestra plataforma inmobiliaria.
          </p>
        </div>

        {/* Navegación de secciones */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Índice de Contenidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {secciones.map((seccion) => (
              <button
                key={seccion.id}
                onClick={() => toggleSection(seccion.id)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  activeSection === seccion.id
                    ? "bg-[#2F8EAC] text-white shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className={`${activeSection === seccion.id ? "text-white" : "text-[#2F8EAC]"}`}>
                  {seccion.icono}
                </div>
                <span className="text-sm font-medium">{seccion.titulo}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de secciones */}
        <div className="space-y-8">
          {secciones.map((seccion) => (
            <div
              key={seccion.id}
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
                activeSection === seccion.id || activeSection === null ? "block" : "hidden"
              }`}
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#2F8EAC]/10 rounded-xl flex items-center justify-center text-[#2F8EAC]">
                    {seccion.icono}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{seccion.titulo}</h2>
                </div>
                {seccion.contenido}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-[#2F8EAC] to-[#1e5f73] rounded-2xl p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">¿Tienes dudas sobre nuestros términos?</h2>
          <p className="text-lg opacity-90 mb-6">
            Nuestro equipo legal está disponible para aclarar cualquier aspecto de estos términos y condiciones
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#2F8EAC] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Contactar Equipo Legal
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#2F8EAC] transition-colors">
              Preguntas Frecuentes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
