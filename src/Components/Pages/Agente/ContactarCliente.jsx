"use client"

import { useState, useEffect } from "react"

import { Search, MessageSquare, Send, User, X, AlertCircle } from "lucide-react"

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

  const [submitError, setSubmitError] = useState("")

  // Estados para la API

  const [clients, setClients] = useState([])

  const [clientsLoading, setClientsLoading] = useState(false)

  const [clientsError, setClientsError] = useState("")

  const [agentId, setAgentId] = useState(null)

  // Estados para visitas

  const [visits, setVisits] = useState([])

  const [visitsLoading, setVisitsLoading] = useState(false)

  const [visitsError, setVisitsError] = useState("")

  const [filterType, setFilterType] = useState("todos")

  // 🔧 Función para alternar el sidebar de agente

  const toggleAgentSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Obtener agentId del localStorage

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("agentId") : null

    if (stored) setAgentId(stored)
  }, [])

  // ✅ 1. OBTENER CLIENTES DESDE LA API

  useEffect(() => {
    const fetchClients = async () => {
      setClientsLoading(true)

      setClientsError("")

      try {
        const response = await fetch("http://localhost:10101/api/clients")

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        console.log("✅ Clientes cargados:", data)

        const clientsList = Array.isArray(data) ? data : data.clients || data.data || []

        setClients(clientsList)
      } catch (error) {
        console.error("❌ Error cargando clientes:", error)

        setClientsError(error.message)

        setClients([])
      } finally {
        setClientsLoading(false)
      }
    }

    fetchClients()
  }, [])

  // ✅ OBTENER VISITAS DEL AGENTE

  useEffect(() => {
    if (!agentId) return

    const fetchVisits = async () => {
      setVisitsLoading(true)

      setVisitsError("")

      try {
        const response = await fetch(`http://localhost:10101/api/agents/${agentId}/visits`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        console.log("✅ Visitas cargadas:", data)

        const visitsList = Array.isArray(data) ? data : data.visits || data.data || []

        setVisits(visitsList)
      } catch (error) {
        console.error("❌ Error cargando visitas:", error)

        setVisitsError(error.message)

        setVisits([])
      } finally {
        setVisitsLoading(false)
      }
    }

    fetchVisits()
  }, [agentId])

  // ✅ FUNCIÓN PARA ACTUALIZAR ÚLTIMO CONTACTO

  const updateClientLastContact = (clientId) => {
    const today = new Date().toISOString().split("T")[0]

    setClients((prevClients) =>
      prevClients.map((client) =>
        client.clientId === clientId || client.id === clientId
          ? { ...client, lastContact: today, ultimoContacto: today }
          : client,
      ),
    )
  }

  // Filtrar y ordenar clientes

  const getFilteredAndSortedClients = () => {
    const filtered = clients.filter(
      (cliente) =>
        cliente.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const clientsWithVisits = []

    const clientsWithoutVisits = []

    filtered.forEach((cliente) => {
      const hasVisits = visits.some(
        (visit) =>
          visit.clientId === (cliente.clientId || cliente.id) ||
          visit.client_id === (cliente.clientId || cliente.id) ||
          visit.clientEmail === cliente.email ||
          visit.client_email === cliente.email,
      )

      if (hasVisits) {
        clientsWithVisits.push(cliente)
      } else {
        clientsWithoutVisits.push(cliente)
      }
    })

    switch (filterType) {
      case "con-visitas":
        return clientsWithVisits

      case "sin-visitas":
        return clientsWithoutVisits

      case "todos":

      default:
        return [...clientsWithVisits, ...clientsWithoutVisits]
    }
  }

  const filteredClientes = getFilteredAndSortedClients()

  const handleContactClient = (cliente) => {
    setSelectedClient(cliente)


    setMessage("")


    setSubmitSuccess(false)

    setSubmitError("")
  }

  // ✅ 2. GUARDAR MENSAJE

  const handleRegisterMessage = async () => {
    if (!message.trim()) {
      setSubmitError("Por favor escribe un mensaje")

      return
    }

    if (!agentId) {
      setSubmitError("Sesión expirada. Vuelve a iniciar sesión.")

      return
    }

    setIsSubmitting(true)

    setSubmitError("")

    try {
      console.log("📝 Guardando mensaje con datos:", {
        senderId: Number(agentId),

        receiverId: selectedClient.clientId || selectedClient.id,

        content: message.trim(),
      })

      const res = await fetch("http://localhost:10101/api/messages/save", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          senderId: Number(agentId),

          receiverId: selectedClient.clientId || selectedClient.id,

          content: message.trim(),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))

        throw new Error(errorData.error || errorData.message || `Error ${res.status}`)
      }

      const result = await res.json()

      console.log("✅ Mensaje guardado:", result)

      updateClientLastContact(selectedClient.clientId || selectedClient.id)

      setSubmitSuccess(true)


      setMessage("")

      setTimeout(() => {
        setSubmitSuccess(false)


        setSelectedClient(null)
      }, 3000)
    } catch (e) {
      console.error("❌ Error guardando mensaje:", e)

      setSubmitError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ 3. ENVIAR MENSAJE

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setSubmitError("Por favor escribe un mensaje")

      return
    }

    if (!agentId) {
      setSubmitError("Sesión expirada. Vuelve a iniciar sesión.")

      return
    }

    setIsSubmitting(true)

    setSubmitError("")

    try {
      console.log("📝 Guardando mensaje antes de enviar...")

      const saveRes = await fetch("http://localhost:10101/api/messages/save", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          senderId: Number(agentId),

          receiverId: selectedClient.clientId || selectedClient.id,

          content: message.trim(),
        }),
      })

      if (!saveRes.ok) {
        const errorData = await saveRes.json().catch(() => ({}))

        throw new Error(errorData.error || errorData.message || `Error al guardar: ${saveRes.status}`)
      }

      const savedMessage = await saveRes.json()

      console.log("✅ Mensaje guardado:", savedMessage)

      console.log("📤 Enviando mensaje...")

      const sendRes = await fetch("http://localhost:10101/api/messages/send", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          senderId: Number(agentId),

          receiverId: selectedClient.clientId || selectedClient.id,

          subject: "Contacto desde tu agente inmobiliario",

          content: message.trim(),
        }),
      })

      if (!sendRes.ok) {
        const errorData = await sendRes.json().catch(() => ({}))

        throw new Error(errorData.error || errorData.message || `Error al enviar: ${sendRes.status}`)
      }

      const result = await sendRes.json()

      console.log("✅ Mensaje enviado:", result)

      updateClientLastContact(selectedClient.clientId || selectedClient.id)

      setSubmitSuccess(true)

      setMessage("")

      setTimeout(() => {
        setSubmitSuccess(false)

        setSelectedClient(null)
      }, 3000)
    } catch (e) {
      console.error("❌ Error enviando mensaje:", e)

      setSubmitError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedClient(null)


    setMessage("")


    setSubmitSuccess(false)

    setSubmitError("")
  }

  // Calcular estadísticas

  const today = new Date().toISOString().split("T")[0]

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const clientsWithVisits = clients.filter((cliente) =>
    visits.some(
      (visit) =>
        visit.clientId === (cliente.clientId || cliente.id) ||
        visit.client_id === (cliente.clientId || cliente.id) ||
        visit.clientEmail === cliente.email ||
        visit.client_email === cliente.email,
    ),
  ).length

  const clientsWithoutVisits = clients.length - clientsWithVisits

  const stats = {
    total: clients.length,

    withVisits: clientsWithVisits,

    withoutVisits: clientsWithoutVisits,

    contactedToday: clients.filter((c) => c.lastContact === today || c.ultimoContacto === today).length,

    contactedThisWeek: clients.filter((c) => c.lastContact >= weekAgo || c.ultimoContacto >= weekAgo).length,
  }

  // Función para obtener la propiedad de interés del cliente

  const getClientPropertyInterest = (clientId, clientEmail) => {
    const clientVisits = visits.filter(
      (visit) =>
        visit.clientId === clientId ||
        visit.client_id === clientId ||
        visit.clientEmail === clientEmail ||
        visit.client_email === clientEmail,
    )

    if (clientVisits.length === 0) {
      return "Sin visitas programadas"
    }

    const latestVisit = clientVisits.sort(
      (a, b) => new Date(b.visitDate || b.visit_date) - new Date(a.visitDate || a.visit_date),
    )[0]

    return (
      latestVisit.propertyTitle ||
      latestVisit.property_title ||
      latestVisit.propertyAddress ||
      latestVisit.property_address ||
      `Propiedad ID: ${latestVisit.propertyId || latestVisit.property_id}` ||
      "Propiedad no especificada"
    )
  }

  return (
    <>
      {/* 🔧 Pasar toggleAgentSidebar al Header */}

      <Header toggleAgentSidebar={toggleAgentSidebar} />

      <main className="lg:ml-72 pt-16">
        {/* 🔧 Sidebar de Agente con props actualizadas */}

        <AgentSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} toggleSidebar={toggleAgentSidebar} />

        {/* 🔧 CONTENIDO PRINCIPAL CON ESPACIADO MEJORADO */}

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contactar Clientes</h1>

              <p className="text-gray-600 mt-1">
                Gestiona y contacta con tus clientes potenciales
                {clientsLoading || visitsLoading ? " (Cargando...)" : ` (${clients.length} clientes)`}
              </p>
            </div>
          </div>
        </div>

        {/* 🔧 Contenido principal con padding mejorado */}

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Mensaje de error de carga */}

          {clientsError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />

                <p className="text-red-700 text-sm">Error cargando clientes: {clientsError}</p>
              </div>
            </div>
          )}

          {/* Mensaje de error de visitas */}

          {visitsError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />

                <p className="text-red-700 text-sm">Error cargando visitas: {visitsError}</p>
              </div>
            </div>
          )}

          {/* 🔧 Panel de búsqueda y estadísticas con espaciado mejorado */}

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Búsqueda de clientes</h2>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setFilterType("todos")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterType === "todos" ? "bg-[#2F8EAC] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todos ({stats.total})
                </button>

                <button
                  onClick={() => setFilterType("con-visitas")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterType === "con-visitas"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Con Visitas ({stats.withVisits})
                </button>

                <button
                  onClick={() => setFilterType("sin-visitas")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterType === "sin-visitas"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Sin Visitas ({stats.withoutVisits})
                </button>
              </div>

              {/* Estadísticas */}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">{clientsLoading ? "..." : stats.total}</div>

                  <div className="text-sm text-gray-600">Total Clientes</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {clientsLoading || visitsLoading ? "..." : stats.withVisits}
                  </div>

                  <div className="text-sm text-gray-600">Con Visitas</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600">
                    {clientsLoading || visitsLoading ? "..." : stats.withoutVisits}
                  </div>

                  <div className="text-sm text-gray-600">Sin Visitas</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-[#2F8EAC]">
                    {clientsLoading ? "..." : stats.total > 0 ? Math.round((stats.withVisits / stats.total) * 100) : 0}%
                  </div>

                  <div className="text-sm text-gray-600">Con Visitas</div>
                </div>
              </div>
            </div>

            {/* Tabla de clientes */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Lista de Clientes</h2>

                <p className="text-gray-600 text-sm mt-1">Contacta y gestiona tus clientes potenciales</p>
              </div>

              {clientsLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 border-2 border-[#2F8EAC] border-t-transparent rounded-full animate-spin"></div>

                    <span className="font-medium">Cargando clientes...</span>
                  </div>

                  <p className="text-gray-500 text-sm mt-2">Por favor espera mientras cargamos la información.</p>
                </div>
              ) : filteredClientes.length === 0 ? (
                <div className="p-8 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />

                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>

                  <p className="text-gray-600">
                    {clients.length === 0
                      ? "No hay clientes registrados en el sistema."
                      : "No hay clientes que coincidan con tu búsqueda."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Vista de tarjetas para móvil y tablet */}

                  <div className="block lg:hidden divide-y divide-gray-200">
                    {filteredClientes.map((cliente) => (
                      <div key={cliente.clientId || cliente.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {visits.some(
                                (visit) =>
                                  visit.clientId === (cliente.clientId || cliente.id) ||
                                  visit.client_id === (cliente.clientId || cliente.id) ||
                                  visit.clientEmail === cliente.email ||
                                  visit.client_email === cliente.email,
                              ) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Con visitas
                                </span>
                              )}
                            </div>

                            <h3 className="font-semibold text-gray-900 truncate">{cliente.name || cliente.nombre}</h3>

                            <p className="text-sm text-gray-600 truncate">{cliente.email}</p>

                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {getClientPropertyInterest(cliente.clientId || cliente.id, cliente.email)}
                            </p>
                          </div>

                          <button
                            onClick={() => handleContactClient(cliente)}
                            className="bg-[#2F8EAC] text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-[#267a95] transition-colors flex items-center gap-2 font-medium shadow-sm"
                          >
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                            Contactar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vista de tabla para desktop */}


                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>

                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contacto
                          </th>

                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClientes.map((cliente) => (
                          <tr key={cliente.clientId || cliente.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-gradient-to-r from-[#2F8EAC] to-[#267a95] rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {visits.some(
                                      (visit) =>
                                        visit.clientId === (cliente.clientId || cliente.id) ||
                                        visit.client_id === (cliente.clientId || cliente.id) ||
                                        visit.clientEmail === cliente.email ||
                                        visit.client_email === cliente.email,
                                    ) && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Con visitas
                                      </span>
                                    )}
                                  </div>

                                  <div className="font-medium text-gray-900">{cliente.name || cliente.nombre}</div>

                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {getClientPropertyInterest(cliente.clientId || cliente.id, cliente.email)}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{cliente.email}</div>

                              <div className="text-sm text-gray-500">
                                {cliente.phone || cliente.telefono || "Sin teléfono"}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleContactClient(cliente)}
                                className="bg-[#2F8EAC] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#267a95] transition-colors flex items-center gap-2 font-medium shadow-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
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
        </div>

        {/* Modal de Contacto - Responsive con fondo grisáceo */}

        {selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancel()
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Iniciar Contacto</h2>

                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {submitSuccess && (
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      <p className="text-blue-700 font-medium">
                        ¡Mensaje procesado exitosamente para {selectedClient.name || selectedClient.nombre}!
                      </p>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />

                      <p className="text-red-700">{submitError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Para:</label>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="font-medium text-gray-900">{selectedClient.name || selectedClient.nombre}</div>

                      <div className="text-sm text-gray-600">{selectedClient.email}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Propiedad de Interés:</label>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-700">
                        {getClientPropertyInterest(selectedClient.clientId || selectedClient.id, selectedClient.email)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono:</label>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-700">
                        {selectedClient.phone || selectedClient.telefono || "Sin teléfono"}
                      </div>
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
                      className={`w-full sm:flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Guardando..." : "Registrar Mensaje"}
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
      </main>
    </>
  )
}
