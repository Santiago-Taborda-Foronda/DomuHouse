"use client"

import { useState } from "react"
import { Search, Mail, MessageSquare, Send, User, X } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import AgentSideBar from "./Components/AgentSideBar"

export default function ContactarCliente() {
  const [activeSection, setActiveSection] = useState("Contactar Clientes")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState(null)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const toggleAgentSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const clientes = [
    {
      id: 1,
      nombre: "Luis Torres",
      email: "luis23@gmail.com",
      telefono: "+57 300 123 4567",
      ultimoContacto: "2024-03-15",
      propiedadInteres: "Casa 01",
    },
    {
      id: 2,
      nombre: "Juan Ruiz",
      email: "juan22@gmail.com",
      telefono: "+57 301 234 5678",
      ultimoContacto: "2024-03-18",
      propiedadInteres: "Casa 02",
    },
    {
      id: 3,
      nombre: "Andrés Ríos",
      email: "andres@gmail.com",
      telefono: "+57 302 345 6789",
      ultimoContacto: "2024-03-20",
      propiedadInteres: "Casa 03",
    },
    {
      id: 4,
      nombre: "María González",
      email: "maria.gonzalez@email.com",
      telefono: "+57 303 456 7890",
      ultimoContacto: "2024-03-12",
      propiedadInteres: "Apartamento 01",
    },
    {
      id: 5,
      nombre: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      telefono: "+57 304 567 8901",
      ultimoContacto: "2024-03-10",
      propiedadInteres: "Local Comercial 01",
    },
  ]

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleContactClient = (cliente) => {
    setSelectedClient(cliente)
    setMessage("")
    setSubmitSuccess(false)
  }

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Por favor escribe un mensaje")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulación de envío de mensaje
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const messageData = {
        clienteId: selectedClient.id,
        clienteNombre: selectedClient.nombre,
        clienteEmail: selectedClient.email,
        mensaje: message.trim(),
        fechaEnvio: new Date().toISOString(),
        tipo: "email",
      }

      console.log("Mensaje enviado:", messageData)

      setSubmitSuccess(true)
      setMessage("")

      // Limpiar después de 3 segundos
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedClient(null)
      }, 3000)
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      alert("Error al enviar el mensaje. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterMessage = () => {
    if (!message.trim()) {
      alert("Por favor escribe un mensaje")
      return
    }

    // Registrar mensaje sin enviar
    const messageData = {
      clienteId: selectedClient.id,
      clienteNombre: selectedClient.nombre,
      mensaje: message.trim(),
      fechaRegistro: new Date().toISOString(),
      tipo: "registro",
      estado: "borrador",
    }

    console.log("Mensaje registrado:", messageData)
    alert("Mensaje registrado como borrador")
    setMessage("")
  }

  const handleCancel = () => {
    setSelectedClient(null)
    setMessage("")
    setSubmitSuccess(false)
  }

  return (
    <>
      <Header toggleAgentSidebar={toggleAgentSidebar} />
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar fijo siempre visible en desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <AgentSideBar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sidebarOpen={true} // Siempre abierto en desktop
            setSidebarOpen={() => {}} // Función vacía
            toggleSidebar={() => {}} // Función vacía
          />
        </div>

        {/* Sidebar móvil con overlay */}
        <AgentSideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toggleSidebar={toggleAgentSidebar}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Overlay para móvil cuando el sidebar está abierto */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Contenido principal con margen izquierdo para el sidebar */}
        <main className="lg:ml-72 pt-16">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contactar Clientes</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestiona y contacta con tus clientes potenciales ({clientes.length} clientes)
                </p>
              </div>
            </div>

            {/* Panel de búsqueda y estadísticas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">Búsqueda de clientes</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  />
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{clientes.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Total Clientes</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xl sm:text-2xl font-bold text-[#2F8EAC]">
                    {clientes.filter((c) => c.ultimoContacto === "2024-03-20").length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Contactados Hoy</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {clientes.filter((c) => c.ultimoContacto >= "2024-03-18").length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Esta Semana</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {Math.round(
                      (clientes.filter((c) => c.ultimoContacto >= "2024-03-15").length / clientes.length) * 100,
                    )}
                    %
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Tasa Contacto</p>
                </div>
              </div>
            </div>

            {/* Tabla de clientes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Lista de Clientes</h3>
                <p className="text-sm text-gray-500">Contacta y gestiona tus clientes potenciales</p>
              </div>

              {filteredClientes.length === 0 ? (
                <div className="p-8 sm:p-12 text-center text-gray-500">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
                  <p className="text-gray-500">No hay clientes que coincidan con tu búsqueda.</p>
                </div>
              ) : (
                <>
                  {/* Vista de tarjetas para móvil y tablet */}
                  <div className="block lg:hidden">
                    {filteredClientes.map((cliente) => (
                      <div key={cliente.id} className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">{cliente.nombre}</p>
                                <p className="text-xs text-gray-500">{cliente.email}</p>
                                <p className="text-xs text-blue-600 mt-1">{cliente.propiedadInteres}</p>
                                <p className="text-xs text-gray-600 mt-1">Último contacto: {cliente.ultimoContacto}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <button
                                onClick={() => handleContactClient(cliente)}
                                className="bg-[#2F8EAC] text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-[#267a95] transition-colors flex items-center gap-2 font-medium shadow-sm"
                              >
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                                Contactar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vista de tabla para desktop */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Contacto
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Último Contacto
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredClientes.map((cliente) => (
                          <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{cliente.nombre}</div>
                                  <div className="text-xs text-blue-600">{cliente.propiedadInteres}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                <div className="text-sm text-gray-900">{cliente.email}</div>
                                <div className="text-xs text-gray-500">{cliente.telefono}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">{cliente.ultimoContacto}</div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleContactClient(cliente)}
                                className="bg-[#2F8EAC] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#267a95] transition-colors flex items-center gap-2 font-medium shadow-sm"
                              >
                                <Mail className="w-4 h-4" />
                                Contactar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Modal de Contacto - Responsive */}
        {selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancel()
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#2F8EAC]" />
                    Iniciar Contacto
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitSuccess && (
                  <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                    ¡Mensaje enviado exitosamente a {selectedClient.nombre}!
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Para:</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-gray-900 font-medium truncate">{selectedClient.nombre}</span>
                        <span className="text-gray-500 text-sm truncate">{selectedClient.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Propiedad de Interés:</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="text-gray-700">{selectedClient.propiedadInteres}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono:</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="text-gray-700">{selectedClient.telefono}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje:</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors resize-none"
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleRegisterMessage}
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Registrar Mensaje
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={isSubmitting}
                      className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm ${
                        isSubmitting
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
