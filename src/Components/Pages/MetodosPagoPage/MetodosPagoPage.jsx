"use client"

import { useState } from "react"
import {
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  FileText,
  Clock,
  Banknote,
  Wallet,
  QrCode,
} from "lucide-react"

export const MetodosPagoPage = () => {
  const [activeTab, setActiveTab] = useState("metodos")

  const metodosPago = [
    {
      id: "tarjetas",
      name: "Tarjetas de Crédito/Débito",
      icon: <CreditCard className="w-8 h-8" />,
      description: "Visa, Mastercard, American Express",
      comision: "2.9% + $3,000 COP",
      disponible: true,
      procesamiento: "Inmediato",
      limites: "Hasta $50,000,000 COP por transacción",
    },
    {
      id: "pse",
      name: "PSE (Pagos Seguros en Línea)",
      icon: <Banknote className="w-8 h-8" />,
      description: "Débito directo desde tu cuenta bancaria",
      comision: "1.5% + $2,000 COP",
      disponible: true,
      procesamiento: "1-2 días hábiles",
      limites: "Hasta $100,000,000 COP por transacción",
    },
    {
      id: "nequi",
      name: "Nequi",
      icon: <Smartphone className="w-8 h-8" />,
      description: "Pago desde tu billetera digital Nequi",
      comision: "1.8% + $1,500 COP",
      disponible: true,
      procesamiento: "Inmediato",
      limites: "Hasta $20,000,000 COP por transacción",
    },
    {
      id: "daviplata",
      name: "DaviPlata",
      icon: <Wallet className="w-8 h-8" />,
      description: "Pago desde tu cuenta DaviPlata",
      comision: "1.8% + $1,500 COP",
      disponible: true,
      procesamiento: "Inmediato",
      limites: "Hasta $15,000,000 COP por transacción",
    },
    {
      id: "efecty",
      name: "Efecty",
      icon: <QrCode className="w-8 h-8" />,
      description: "Pago en efectivo en puntos Efecty",
      comision: "2.5% + $4,000 COP",
      disponible: true,
      procesamiento: "2-4 horas",
      limites: "Hasta $30,000,000 COP por transacción",
    },
    {
      id: "transferencia",
      name: "Transferencia Bancaria",
      icon: <Building2 className="w-8 h-8" />,
      description: "Transferencia directa entre cuentas",
      comision: "0.5% (mín. $5,000 COP)",
      disponible: true,
      procesamiento: "1-3 días hábiles",
      limites: "Sin límite",
    },
  ]

  const tiposTransaccion = [
    {
      tipo: "Arriendo - Depósito",
      descripcion: "Pago inicial para reservar una propiedad en arriendo",
      participantes: ["Cliente", "Inmobiliaria", "DomuHouse"],
      proceso: [
        "Cliente realiza el pago del depósito",
        "Fondos se retienen en custodia",
        "Inmobiliaria confirma disponibilidad",
        "Se libera el pago a la inmobiliaria",
        "DomuHouse retiene su comisión (3%)",
      ],
      comisionPlataforma: "3%",
      tiempoLiberacion: "24-48 horas",
    },
    {
      tipo: "Arriendo - Mensualidad",
      descripcion: "Pagos mensuales de arriendo",
      participantes: ["Cliente", "Inmobiliaria"],
      proceso: [
        "Cliente programa pago automático",
        "Pago se procesa mensualmente",
        "Inmobiliaria recibe el pago",
        "DomuHouse retiene comisión (1.5%)",
      ],
      comisionPlataforma: "1.5%",
      tiempoLiberacion: "Inmediato",
    },
    {
      tipo: "Compra - Separación",
      descripcion: "Pago inicial para separar una propiedad en venta",
      participantes: ["Cliente", "Inmobiliaria", "DomuHouse"],
      proceso: [
        "Cliente paga separación (5-10% del valor)",
        "Fondos en custodia por 30 días",
        "Se verifica documentación legal",
        "Cliente completa el pago total",
        "Se libera a la inmobiliaria",
        "DomuHouse retiene comisión (2%)",
      ],
      comisionPlataforma: "2%",
      tiempoLiberacion: "Después de escrituración",
    },
    {
      tipo: "Comisión de Agente",
      descripcion: "Pago de comisiones a agentes inmobiliarios",
      participantes: ["Inmobiliaria", "Agente"],
      proceso: [
        "Se completa transacción inmobiliaria",
        "Sistema calcula comisión del agente",
        "Inmobiliaria aprueba el pago",
        "Agente recibe su comisión",
      ],
      comisionPlataforma: "0.5%",
      tiempoLiberacion: "5-7 días hábiles",
    },
  ]

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Métodos de Pago</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Procesamos pagos seguros para todas las transacciones inmobiliarias en nuestra plataforma
          </p>
        </div>

        {/* Pestañas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex rounded-t-2xl overflow-hidden">
            <button
              onClick={() => setActiveTab("metodos")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "metodos"
                  ? "text-white bg-[#2F8EAC] shadow-lg"
                  : "text-gray-600 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              Métodos Disponibles
            </button>
            <button
              onClick={() => setActiveTab("transacciones")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "transacciones"
                  ? "text-white bg-[#2F8EAC] shadow-lg"
                  : "text-gray-600 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              Tipos de Transacciones
            </button>
            <button
              onClick={() => setActiveTab("seguridad")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "seguridad"
                  ? "text-white bg-[#2F8EAC] shadow-lg"
                  : "text-gray-600 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              Seguridad
            </button>
          </div>
        </div>

        {/* Contenido de Métodos de Pago */}
        {activeTab === "metodos" && (
          <div className="space-y-8">
            {/* Métodos de Pago Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metodosPago.map((metodo) => (
                <div
                  key={metodo.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-[#2F8EAC]/10 rounded-xl flex items-center justify-center text-[#2F8EAC]">
                      {metodo.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{metodo.name}</h3>
                      <p className="text-sm text-gray-600">{metodo.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Comisión:</span>
                      <span className="text-sm font-medium text-gray-900">{metodo.comision}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Procesamiento:</span>
                      <span className="text-sm font-medium text-gray-900">{metodo.procesamiento}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Límites:</span>
                      <span className="text-sm font-medium text-gray-900">{metodo.limites}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Estado:</span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                          metodo.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {metodo.disponible ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Disponible
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            No disponible
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Información Importante</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Las comisiones pueden variar según el monto de la transacción</li>
                    <li>• Los tiempos de procesamiento son aproximados y pueden variar</li>
                    <li>• Algunos métodos pueden tener restricciones adicionales</li>
                    <li>• Todas las transacciones están protegidas por nuestro sistema de custodia</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Tipos de Transacciones */}
        {activeTab === "transacciones" && (
          <div className="space-y-8">
            {tiposTransaccion.map((transaccion, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-[#2F8EAC]/10 rounded-xl flex items-center justify-center text-[#2F8EAC]">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{transaccion.tipo}</h3>
                    <p className="text-gray-600 mb-6">{transaccion.descripcion}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Participantes */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Participantes
                        </h4>
                        <div className="space-y-2">
                          {transaccion.participantes.map((participante, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#2F8EAC] rounded-full"></div>
                              <span className="text-sm text-gray-700">{participante}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detalles */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Detalles
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Comisión DomuHouse:</span>
                            <span className="text-sm font-medium text-gray-900">{transaccion.comisionPlataforma}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Tiempo de liberación:</span>
                            <span className="text-sm font-medium text-gray-900">{transaccion.tiempoLiberacion}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Proceso */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Proceso de Pago
                      </h4>
                      <div className="space-y-3">
                        {transaccion.proceso.map((paso, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-[#2F8EAC] text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{paso}</p>
                              {idx < transaccion.proceso.length - 1 && (
                                <div className="w-px h-4 bg-gray-200 ml-3 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contenido de Seguridad */}
        {activeTab === "seguridad" && (
          <div className="space-y-8">
            {/* Medidas de Seguridad */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Seguridad Garantizada</h2>
                <p className="text-gray-600">
                  Protegemos todas las transacciones con los más altos estándares de seguridad
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Encriptación SSL</h3>
                  <p className="text-sm text-gray-600">Todos los datos se transmiten con encriptación de 256 bits</p>
                </div>

                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sistema de Custodia</h3>
                  <p className="text-sm text-gray-600">
                    Los fondos se mantienen seguros hasta completar la transacción
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Verificación KYC</h3>
                  <p className="text-sm text-gray-600">
                    Verificamos la identidad de todos los usuarios de la plataforma
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Detección de Fraude</h3>
                  <p className="text-sm text-gray-600">Monitoreo 24/7 para detectar actividades sospechosas</p>
                </div>

                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cumplimiento Legal</h3>
                  <p className="text-sm text-gray-600">Cumplimos con todas las regulaciones financieras colombianas</p>
                </div>

                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Soporte 24/7</h3>
                  <p className="text-sm text-gray-600">Equipo de soporte disponible para resolver cualquier problema</p>
                </div>
              </div>
            </div>

            {/* Proceso de Disputa */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Proceso de Resolución de Disputas</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#2F8EAC] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reporte del Problema</h3>
                    <p className="text-sm text-gray-600">
                      El usuario reporta el problema a través de nuestro sistema de tickets
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#2F8EAC] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Investigación</h3>
                    <p className="text-sm text-gray-600">
                      Nuestro equipo investiga el caso y recopila toda la información necesaria
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#2F8EAC] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mediación</h3>
                    <p className="text-sm text-gray-600">
                      Facilitamos la comunicación entre las partes para llegar a un acuerdo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#2F8EAC] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Resolución</h3>
                    <p className="text-sm text-gray-600">
                      Se toma una decisión final y se ejecutan las acciones correspondientes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-[#2F8EAC] to-[#1e5f73] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas sobre los pagos?</h2>
          <p className="text-lg opacity-90 mb-6">
            Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#2F8EAC] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Contactar Soporte
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#2F8EAC] transition-colors">
              Ver FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
