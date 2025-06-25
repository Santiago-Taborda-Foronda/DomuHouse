"use client"

import { useState } from "react"
import {
  Shield,
  Eye,
  Lock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Database,
  Globe,
  UserCheck,
} from "lucide-react"

export const Privacidad = () => {
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
            En <strong className="text-[#2F8EAC]">DomuHouse</strong>, valoramos tu privacidad y nos comprometemos a
            proteger la información personal que compartes con nosotros. Estas políticas de privacidad describen cómo
            recopilamos, usamos y protegemos tus datos cuando utilizas nuestra plataforma inmobiliaria.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Al acceder y utilizar nuestros servicios, aceptas las prácticas descritas en esta política. Como plataforma
            que conecta múltiples inmobiliarias, agentes y clientes, manejamos diferentes tipos de información con los
            más altos estándares de seguridad y transparencia.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Última actualización:</strong> 15 de enero de 2024
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Te notificaremos sobre cualquier cambio importante en nuestras políticas de privacidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "recopilacion",
      titulo: "Recopilación de Datos",
      icono: <Database className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Para ofrecerte un servicio personalizado y eficiente, recopilamos diferentes tipos de información:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Datos Personales</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Nombre completo y documento de identidad</li>
                <li>• Correo electrónico y número de teléfono</li>
                <li>• Dirección de residencia</li>
                <li>• Información financiera (para transacciones)</li>
                <li>• Preferencias de búsqueda inmobiliaria</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Datos de Uso</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Propiedades visitadas y guardadas</li>
                <li>• Búsquedas realizadas y filtros aplicados</li>
                <li>• Interacciones con agentes e inmobiliarias</li>
                <li>• Tiempo de navegación y páginas visitadas</li>
                <li>• Historial de transacciones</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Datos Técnicos</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Dirección IP y ubicación geográfica</li>
                <li>• Tipo de dispositivo y navegador</li>
                <li>• Cookies y tecnologías similares</li>
                <li>• Datos de rendimiento de la aplicación</li>
                <li>• Logs de seguridad y acceso</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Datos de Terceros</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Información de redes sociales (si conectas)</li>
                <li>• Datos de verificación de identidad</li>
                <li>• Referencias de otros usuarios</li>
                <li>• Información pública de registros</li>
                <li>• Datos de servicios de geolocalización</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Recopilación Automática</h4>
                <p className="text-sm text-yellow-700">
                  Algunos datos se recopilan automáticamente cuando usas nuestra plataforma para mejorar tu experiencia
                  y garantizar la seguridad del servicio.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "uso",
      titulo: "Uso de la Información",
      icono: <CheckCircle className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            La información recopilada se utiliza para los siguientes propósitos legítimos:
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                Servicios Principales
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 ml-4">
                <li>• Facilitar la búsqueda y selección de propiedades</li>
                <li>• Conectar clientes con inmobiliarias y agentes</li>
                <li>• Procesar transacciones y pagos de forma segura</li>
                <li>• Gestionar cuentas de usuarios, inmobiliarias y agentes</li>
                <li>• Proporcionar soporte técnico y atención al cliente</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                Personalización y Mejoras
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 ml-4">
                <li>• Personalizar contenido y recomendaciones</li>
                <li>• Analizar tendencias del mercado inmobiliario</li>
                <li>• Mejorar la funcionalidad de la plataforma</li>
                <li>• Desarrollar nuevas características y servicios</li>
                <li>• Optimizar la experiencia del usuario</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                Comunicación y Marketing
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 ml-4">
                <li>• Enviar notificaciones sobre propiedades de interés</li>
                <li>• Comunicar actualizaciones del servicio</li>
                <li>• Proporcionar información relevante del mercado</li>
                <li>• Enviar newsletters (con tu consentimiento)</li>
                <li>• Realizar encuestas de satisfacción</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                Seguridad y Cumplimiento
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 ml-4">
                <li>• Verificar la identidad de usuarios y prevenir fraudes</li>
                <li>• Cumplir con obligaciones legales y regulatorias</li>
                <li>• Proteger la seguridad de la plataforma</li>
                <li>• Resolver disputas y problemas técnicos</li>
                <li>• Mantener registros para auditorías</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "compartir",
      titulo: "Compartir Información",
      icono: <Users className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            No vendemos tu información personal. Solo compartimos datos en las siguientes circunstancias:
          </p>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Con tu Consentimiento
              </h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Cuando contactas directamente a una inmobiliaria o agente</li>
                <li>• Al solicitar información sobre una propiedad específica</li>
                <li>• Para programar visitas o citas</li>
                <li>• Cuando autorizas explícitamente el intercambio</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Proveedores de Servicios
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Procesadores de pagos (para transacciones seguras)</li>
                <li>• Servicios de verificación de identidad</li>
                <li>• Proveedores de hosting y almacenamiento en la nube</li>
                <li>• Servicios de análisis y métricas</li>
                <li>• Proveedores de soporte técnico</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Requerimientos Legales
              </h4>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Cuando sea requerido por ley o autoridades competentes</li>
                <li>• Para proteger nuestros derechos legales</li>
                <li>• En casos de investigaciones de fraude o actividades ilegales</li>
                <li>• Para cumplir con procesos judiciales</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Transferencias Empresariales</h4>
            <p className="text-sm text-gray-700">
              En caso de fusión, adquisición o venta de activos, tu información podría ser transferida como parte de la
              transacción. Te notificaremos con anticipación sobre cualquier cambio en la propiedad o uso de tu
              información personal.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "seguridad",
      titulo: "Seguridad de Datos",
      icono: <Lock className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Implementamos múltiples capas de seguridad para proteger tu información personal:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-blue-900">Encriptación</h4>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• SSL/TLS para transmisión de datos</li>
                <li>• Encriptación AES-256 para almacenamiento</li>
                <li>• Hashing seguro para contraseñas</li>
                <li>• Certificados de seguridad actualizados</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-green-900">Control de Acceso</h4>
              </div>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Autenticación de dos factores (2FA)</li>
                <li>• Controles de acceso basados en roles</li>
                <li>• Monitoreo de actividad sospechosa</li>
                <li>• Sesiones seguras con expiración</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-purple-900">Infraestructura</h4>
              </div>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• Servidores seguros con firewall</li>
                <li>• Respaldos automáticos y redundancia</li>
                <li>• Centros de datos certificados</li>
                <li>• Actualizaciones de seguridad regulares</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-orange-900">Monitoreo</h4>
              </div>
              <ul className="space-y-2 text-sm text-orange-800">
                <li>• Detección de intrusiones 24/7</li>
                <li>• Análisis de comportamiento anómalo</li>
                <li>• Logs de auditoría detallados</li>
                <li>• Respuesta rápida a incidentes</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Reporte de Incidentes</h4>
                <p className="text-sm text-yellow-700">
                  Si detectas alguna actividad sospechosa en tu cuenta, contáctanos inmediatamente. Tenemos protocolos
                  establecidos para responder rápidamente a cualquier incidente de seguridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "derechos",
      titulo: "Tus Derechos",
      icono: <UserCheck className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Como usuario de DomuHouse, tienes los siguientes derechos sobre tu información personal:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2F8EAC] rounded-full"></div>
                Acceso
              </h4>
              <p className="text-sm text-gray-700">
                Puedes solicitar una copia de toda la información personal que tenemos sobre ti.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2F8EAC] rounded-full"></div>
                Rectificación
              </h4>
              <p className="text-sm text-gray-700">
                Puedes corregir o actualizar información inexacta o incompleta en cualquier momento.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2F8EAC] rounded-full"></div>
                Eliminación
              </h4>
              <p className="text-sm text-gray-700">
                Puedes solicitar la eliminación de tu información personal, sujeto a ciertas excepciones legales.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2F8EAC] rounded-full"></div>
                Portabilidad
              </h4>
              <p className="text-sm text-gray-700">
                Puedes solicitar que transfiramos tu información a otro servicio en un formato estructurado.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2F8EAC] rounded-full"></div>
                Oposición
              </h4>
              <p className="text-sm text-gray-700">
                Puedes oponerte al procesamiento de tu información para ciertos propósitos como marketing directo.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2F8EAC] rounded-full"></div>
                Limitación
              </h4>
              <p className="text-sm text-gray-700">
                Puedes solicitar que limitemos el procesamiento de tu información en ciertas circunstancias.
              </p>
            </div>
          </div>

          <div className="bg-[#2F8EAC]/5 border border-[#2F8EAC]/20 rounded-xl p-6">
            <h4 className="font-semibold text-[#2F8EAC] mb-3">¿Cómo ejercer tus derechos?</h4>
            <p className="text-sm text-gray-700 mb-4">
              Para ejercer cualquiera de estos derechos, puedes contactarnos a través de:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-[#2F8EAC]" />
                <span>privacidad@domuhouse.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-[#2F8EAC]" />
                <span>+57 (300) 123-4567</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Responderemos a tu solicitud dentro de 30 días calendario. Podemos solicitar verificación de identidad
              antes de procesar tu solicitud.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "cookies",
      titulo: "Cookies y Tecnologías Similares",
      icono: <Globe className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra plataforma:
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Cookies Esenciales</h4>
              <p className="text-sm text-blue-800 mb-2">
                Necesarias para el funcionamiento básico de la plataforma. No se pueden desactivar.
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Autenticación y sesiones de usuario</li>
                <li>• Preferencias de idioma y región</li>
                <li>• Funcionalidad del carrito de propiedades</li>
                <li>• Seguridad y prevención de fraudes</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 mb-3">Cookies de Rendimiento</h4>
              <p className="text-sm text-green-800 mb-2">
                Nos ayudan a entender cómo los usuarios interactúan con nuestra plataforma.
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Análisis de tráfico y uso de páginas</li>
                <li>• Métricas de rendimiento del sitio</li>
                <li>• Identificación de errores técnicos</li>
                <li>• Optimización de la experiencia del usuario</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h4 className="font-semibold text-purple-900 mb-3">Cookies de Personalización</h4>
              <p className="text-sm text-purple-800 mb-2">
                Permiten personalizar el contenido y las recomendaciones según tus preferencias.
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Recordar búsquedas y filtros aplicados</li>
                <li>• Propiedades guardadas y favoritas</li>
                <li>• Recomendaciones personalizadas</li>
                <li>• Configuraciones de interfaz</li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h4 className="font-semibold text-orange-900 mb-3">Cookies de Marketing</h4>
              <p className="text-sm text-orange-800 mb-2">
                Utilizadas para mostrar anuncios relevantes y medir la efectividad de campañas.
              </p>
              <ul className="text-xs text-orange-700 space-y-1">
                <li>• Seguimiento de conversiones</li>
                <li>• Publicidad personalizada</li>
                <li>• Análisis de campañas de marketing</li>
                <li>• Retargeting y remarketing</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Control de Cookies</h4>
            <p className="text-sm text-gray-700 mb-4">Puedes controlar y configurar las cookies a través de:</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Configuración de tu navegador web</li>
              <li>• Nuestro centro de preferencias de cookies</li>
              <li>• Herramientas de opt-out de terceros</li>
            </ul>
            <p className="text-xs text-gray-600 mt-4">
              Ten en cuenta que desactivar ciertas cookies puede afectar la funcionalidad de la plataforma.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contacto",
      titulo: "Contacto y Actualizaciones",
      icono: <Mail className="w-6 h-6" />,
      contenido: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu información personal, no
            dudes en contactarnos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2F8EAC]/5 border border-[#2F8EAC]/20 rounded-xl p-6">
              <h4 className="font-semibold text-[#2F8EAC] mb-4">Información de Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-700">privacidad@domuhouse.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teléfono</p>
                    <p className="text-sm text-gray-700">+57 (300) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-[#2F8EAC] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dirección</p>
                    <p className="text-sm text-gray-700">
                      Calle 123 #45-67
                      <br />
                      Medellín, Colombia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-4">Actualizaciones de Política</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Notificaciones</p>
                    <p className="text-sm text-blue-800">
                      Te notificaremos por email sobre cambios importantes en esta política.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Revisiones</p>
                    <p className="text-sm text-blue-800">
                      Recomendamos revisar esta política periódicamente para estar al día con nuestras prácticas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Compromiso con la Privacidad</h4>
                <p className="text-sm text-green-700">
                  En DomuHouse, la protección de tu privacidad es fundamental para nosotros. Continuamente mejoramos
                  nuestras prácticas de seguridad y privacidad para ofrecerte la mejor experiencia posible mientras
                  mantenemos tus datos seguros.
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
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Políticas de Privacidad</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu privacidad es nuestra prioridad. Conoce cómo protegemos y utilizamos tu información personal en
            DomuHouse.
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
          <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas sobre tu privacidad?</h2>
          <p className="text-lg opacity-90 mb-6">
            Nuestro equipo de privacidad está disponible para resolver todas tus dudas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#2F8EAC] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Contactar Equipo de Privacidad
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#2F8EAC] transition-colors">
              Centro de Ayuda
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
