import { useState } from "react"
import { Menu, Search, Mail, MessageSquare, Send, User, X } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"

export default function ContactarCliente() {
  const [activeSection, setActiveSection] = useState("Contactar Clientes")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState(null)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <AgentSideBar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Contactar Clientes</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Contactar Clientes</h1>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
                <p className="text-sm text-gray-600">Total Clientes</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-[#2F8EAC]">
                  {clientes.filter((c) => c.ultimoContacto === "2024-03-20").length}
                </p>
                <p className="text-sm text-gray-600">Contactados Hoy</p>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {filteredClientes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No se encontraron clientes</div>
              ) : (
                filteredClientes.map((cliente) => (
                  <div key={cliente.id} className="p-4 border-b last:border-b-0">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{cliente.nombre}</h3>
                          <p className="text-xs text-gray-500">{cliente.email}</p>
                          <p className="text-xs text-gray-500">{cliente.propiedadInteres}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600">Último contacto: {cliente.ultimoContacto}</p>
                        <button
                          onClick={() => handleContactClient(cliente)}
                          className="bg-[#2F8EAC] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#256b82] transition-colors flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correo Electrónico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contactar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClientes.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron clientes
                      </td>
                    </tr>
                  ) : (
                    filteredClientes.map((cliente) => (
                      <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{cliente.nombre}</p>
                              <p className="text-xs text-gray-500">{cliente.propiedadInteres}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm text-gray-900">{cliente.email}</p>
                            <p className="text-xs text-gray-500">{cliente.telefono}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleContactClient(cliente)}
                            className="bg-[#2F8EAC] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#256b82] transition-colors flex items-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            Contactar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact Modal */}
          {selectedClient && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCancel()
                }
              }}
            >
              <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#2F8EAC]" />
                      Iniciar Contacto
                    </h2>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {submitSuccess && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                      ¡Mensaje enviado exitosamente a {selectedClient.nombre}!
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Para:</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <User className="w-4 h-4 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">{selectedClient.nombre}</span>
                          <span className="text-gray-500 text-sm">{selectedClient.email}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad de Interés:</label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-gray-700">{selectedClient.propiedadInteres}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-gray-700">{selectedClient.telefono}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje:</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                        placeholder="Escribe tu mensaje aquí..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleRegisterMessage}
                        disabled={isSubmitting}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Registrar Mensaje
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={isSubmitting}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          isSubmitting
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-[#2F8EAC] text-white hover:bg-[#256b82]"
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
      </div>
    </div>
  )
}
