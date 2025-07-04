"use client"

import { useEffect, useState } from "react"
import { Calendar, User, Home, Phone, MapPin } from "lucide-react"

import AgentSideBar from "./Components/AgentSideBar"

import { Header } from "../../Layouts/Header/Header"

export default function ProgramarVisita() {
  /* ----------------------- ESTADOS BÁSICOS ----------------------- */
  const [activeSection, setActiveSection] = useState("Programar Visitas")

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [submitError, setSubmitError] = useState("")

  const [submitSuccess, setSubmitSuccess] = useState(false)

  const toggleAgentSidebar = () => setSidebarOpen(!sidebarOpen)

  /* ----------------------- AGENT ID ------------------------------ */
  const [agentId, setAgentId] = useState(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("agentId") : null
    if (stored) setAgentId(stored)
  }, [])

  /* ----------------------- VISITAS EXISTENTES ------------------- */
  const [visits, setVisits] = useState([])
  const [visitsLoading, setVisitsLoading] = useState(false)
  const [visitsError, setVisitsError] = useState("")

  useEffect(() => {
    if (!agentId) return

    setVisitsLoading(true)
    setVisitsError("")

    fetch(`https://domuhouse.onrender.com/api/agents/${agentId}/visits`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar visitas")
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.visits || data.results || data.data || []
        setVisits(list)
        console.log("Visitas cargadas:", list)
      })
      .catch((err) => {
        console.error("Error cargando visitas:", err)
        setVisitsError(err.message)
        setVisits([])
      })
      .finally(() => setVisitsLoading(false))
  }, [agentId])

  /* ----------------------- PROPIEDADES DEL AGENTE --------------- */
  const [properties, setProperties] = useState([])
  const [propertiesLoading, setPropertiesLoading] = useState(false)
  const [propertiesError, setPropertiesError] = useState("")

  useEffect(() => {
    if (!agentId) return

    setPropertiesLoading(true)
    setPropertiesError("")

    fetch(`https://domuhouse.onrender.com/api/agents/${agentId}/properties`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar propiedades")
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.properties || data.results || data.data || []
        if (!Array.isArray(list)) throw new Error("Formato de respuesta inesperado")
        setProperties(list)
        console.log("Propiedades cargadas:", list)
      })
      .catch((err) => {
        console.error("Error cargando propiedades:", err)
        setPropertiesError(err.message)
        setProperties([])
      })
      .finally(() => setPropertiesLoading(false))
  }, [agentId])

  /* ----------------------- CLIENTES (role_id = 3) ---------------- */
  const [clients, setClients] = useState([])
  const [clientsLoading, setClientsLoading] = useState(false)
  const [clientsError, setClientsError] = useState("")

  useEffect(() => {
    setClientsLoading(true)
    setClientsError("")

    fetch("https://domuhouse.onrender.com/api/clients")
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar clientes")
        return r.json()
      })
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch((err) => {
        setClientsError(err.message)
        setClients([])
      })
      .finally(() => setClientsLoading(false))
  }, [])

  /* ----------------------- FORM DATA ----------------------------- */
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    propertyId: "",
    visitDate: "",
    visitTime: "",
    visitType: "presencial",
    notes: "",
    propertyAddress: "",
    agentName: "",
    agentPhone: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "propertyId") {
      const selected = properties.find((p) => String(p.property_id || p.propertyId) === String(value))
      setFormData((prev) => ({ ...prev, propertyAddress: selected?.address || "" }))
    }
  }

  /* ----------------------- VALIDACIÓN DE TRASLAPE --------------- */
  const isSlotTaken = (dateISO, time) => {
    const requestedStart = new Date(`${dateISO}T${time}:00`)
    const requestedEnd = new Date(requestedStart.getTime() + 60 * 60 * 1000) // +1 hora

    return visits.some((v) => {
      const [visitDate] = v.visitDate.split(" ")
      const visitStart = new Date(`${visitDate}T${v.visitTime}`)
      const visitEnd = new Date(visitStart.getTime() + 60 * 60 * 1000) // +1 hora

      // Verifica si hay traslape de horario
      return requestedStart < visitEnd && requestedEnd > visitStart
    })
  }

  /* ----------------------- VALIDACIONES -------------------------- */
  const required = ["clientName", "clientPhone", "propertyId", "visitDate", "visitTime", "agentName", "agentPhone"]
  const fieldLabel = {
    clientName: "Nombre del Cliente",
    clientPhone: "Teléfono del Cliente",
    propertyId: "Propiedad",
    visitDate: "Fecha",
    visitTime: "Hora",
    agentName: "Nombre del Agente",
    agentPhone: "Teléfono del Agente",
  }

  const validateForm = () => {
    // Validar campos requeridos
    for (const f of required) {
      if (!formData[f]) {
        setSubmitError(`El campo ${fieldLabel[f]} es requerido`)
        return false
      }
    }

    // Validar email
    if (formData.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      setSubmitError("El email del cliente no es válido")

      return false
    }

    // Validar fecha no sea en el pasado
    const sel = new Date(formData.visitDate)
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    if (sel < today) {
      setSubmitError("La fecha de la visita no puede ser en el pasado")
      return false
    }

    // ✅ Validar traslape de horarios
    if (isSlotTaken(formData.visitDate, formData.visitTime)) {
      setSubmitError("Ya hay una visita programada en ese horario. Elige otro.")
      return false
    }

    return true
  }

  /* ----------------------- SUBMIT ORGANIZADO --------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")

    setSubmitSuccess(false)

    if (!validateForm()) return

    if (!agentId) return setSubmitError("Sesión expirada. Vuelve a iniciar sesión.")

    setIsSubmitting(true)

    try {
      // ✅ Formato correcto del payload según especificación
      const data = {
        propertyId: Number.parseInt(formData.propertyId), // Convertir a número
        visitDate: `${formData.visitDate} ${formData.visitTime}`, // Formato: "2025-07-04 10:00"
        status: "Pendiente",
        visitType: formData.visitType, // "presencial" o "virtual"
        notes: formData.notes.trim() || "", // Texto del cliente (puede estar vacío)
        client: {
          name: formData.clientName.trim(),
          phone: formData.clientPhone.trim(),
          email: formData.clientEmail.trim() || null, // null si está vacío
        },
        // Información del agente (si es necesaria)
        agent: {
          name: formData.agentName.trim(),
          phone: formData.agentPhone.trim(),
        },
      }

      console.log("📤 Enviando payload:", data)

      const response = await fetch(`https://domuhouse.onrender.com/api/agents/${agentId}/visits/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`

        if (response.status === 409) {
          throw new Error("Ya hay una visita programada en ese horario. Por favor elige otra hora.")
        }

        try {
          const errorData = await response.json()
          console.error("❌ Error del servidor:", errorData)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          console.error("❌ Error parseando respuesta de error:", parseError)
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("✅ Visita agendada con éxito:", result)

      setSubmitSuccess(true)

      // ✅ Recargar visitas después de crear una nueva
      if (agentId) {
        fetch(`https://domuhouse.onrender.com/api/agents/${agentId}/visits`)
          .then((res) => res.json())
          .then((data) => {
            const list = Array.isArray(data) ? data : data.visits || data.results || data.data || []
            setVisits(list)
          })
          .catch((err) => console.error("Error recargando visitas:", err))
      }

      setTimeout(resetForm, 1500)
    } catch (error) {
      console.error("❌ Error al agendar visita:", error)
      setSubmitError(error.message || "Error al programar la visita.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      propertyId: "",
      visitDate: "",
      visitTime: "",
      visitType: "presencial",
      notes: "",
      propertyAddress: "",
      agentName: "",
      agentPhone: "",
    })

    setSubmitError("")

    setSubmitSuccess(false)
  }

  /* ----------------------- OPCIONES HORA ------------------------- */
  const generateTimeOptions = () => {
    const times = []
    for (let h = 8; h <= 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        times.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
      }
    }

    return times
  }

  /* ----------------------- VERIFICAR CLIENTE --------------------- */
  const isClientRegistered = (email) => {
    if (!email || clientsLoading) return null
    return clients.find((c) => c.email === email)
  }

  /* ----------------------- VERIFICAR HORARIO OCUPADO ------------- */
  const isTimeSlotBusy = (date, time) => {
    if (!date || !time || visitsLoading) return false
    return isSlotTaken(date, time)
  }

  // ----------------------- RENDER --------------------------------
  return (
    <>
      <Header toggleAgentSidebar={toggleAgentSidebar} />

      <div className="min-h-screen bg-gray-50">
        {/* Sidebar fijo siempre visible en desktop */}

        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <AgentSideBar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sidebarOpen={true}
            setSidebarOpen={() => {}}
            toggleSidebar={() => {}}
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

        {/* Contenido principal con margen izquierdo para el sidebar */}

        <main className="lg:ml-72 pt-16">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header de la página */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Programar Visita</h1>

                <p className="text-gray-600 text-sm mt-1">Agenda una nueva visita para tus clientes</p>
              </div>
            </div>

            {/* Mensajes de estado */}

            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                ¡Visita programada exitosamente!
              </div>
            )}

            {/* Mensaje si no hay agentId */}
            {!agentId && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Cargando información del agente...</span>
                </div>
              </div>
            )}

            {/* Mensaje de error de clientes */}
            {clientsError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                Error cargando clientes: {clientsError}
              </div>
            )}

            {/* Mensaje de error de visitas */}
            {visitsError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                Error cargando visitas existentes: {visitsError}
              </div>
            )}

            {/* Alerta si el cliente no está registrado */}
            {formData.clientEmail && !clientsLoading && !isClientRegistered(formData.clientEmail) && (
              <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    ⚠️ Este email no corresponde a un cliente registrado. Asegúrate de que el cliente esté registrado con
                    role_id = 3.
                  </span>
                </div>
              </div>
            )}

            {/* Alerta si el horario está ocupado */}
            {formData.visitDate &&
              formData.visitTime &&
              !visitsLoading &&
              isTimeSlotBusy(formData.visitDate, formData.visitTime) && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      ❌ Ya hay una visita programada en este horario. Por favor selecciona otra fecha u hora.
                    </span>
                  </div>
                </div>
              )}

            {/* Formulario principal */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-6 sm:space-y-8">
                  {/* Información del Cliente */}

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-[#2F8EAC]" />

                      <h3 className="font-semibold text-gray-800">Información del Cliente</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>

                        <input
                          type="text"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                          placeholder="Nombre del cliente"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>

                        <input
                          type="tel"
                          name="clientPhone"
                          value={formData.clientPhone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                          placeholder="+57 300 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email (Debe ser de un cliente registrado)
                      </label>
                      <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                        placeholder="cliente@email.com"
                      />
                      {formData.clientEmail && (
                        <p
                          className={`text-xs mt-1 ${
                            clientsLoading
                              ? "text-gray-500"
                              : isClientRegistered(formData.clientEmail)
                                ? "text-green-600"
                                : "text-orange-600"
                          }`}
                        >
                          {clientsLoading
                            ? "Verificando cliente..."
                            : isClientRegistered(formData.clientEmail)
                              ? "✓ Cliente registrado encontrado"
                              : "⚠️ Cliente no encontrado en el sistema"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Separador visual */}

                  <div className="border-t border-gray-100"></div>

                  {/* Información de la Propiedad */}

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="w-5 h-5 text-[#2F8EAC]" />

                      <h3 className="font-semibold text-gray-800">Información de la Propiedad</h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Propiedad *</label>

                      <select
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleInputChange}
                        required
                        disabled={!agentId || propertiesLoading}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {!agentId && <option>Esperando información del agente...</option>}
                        {agentId && propertiesLoading && <option>Cargando propiedades...</option>}
                        {agentId && propertiesError && <option>Error: {propertiesError}</option>}
                        {agentId && !propertiesLoading && !propertiesError && (
                          <>
                            <option value="">Selecciona una propiedad</option>
                            {properties.length === 0 ? (
                              <option disabled>No hay propiedades disponibles</option>
                            ) : (
                              properties.map((p) => (
                                <option key={p.propertyId ?? p.property_id} value={p.propertyId ?? p.property_id}>
                                  {`${p.propertyTitle ?? p.property_title ?? "Sin título"} - ${p.address ?? "Sin dirección"}`}
                                </option>
                              ))
                            )}
                          </>
                        )}
                      </select>
                    </div>

                    {formData.propertyAddress && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>

                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{formData.propertyAddress}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Separador visual */}

                  <div className="border-t border-gray-100"></div>

                  {/* Información de la Visita */}

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-[#2F8EAC]" />

                      <h3 className="font-semibold text-gray-800">Detalles de la Visita</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>

                        <input
                          type="date"
                          name="visitDate"
                          value={formData.visitDate}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hora *</label>

                        <select
                          name="visitTime"
                          value={formData.visitTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                        >
                          <option value="">Selecciona una hora</option>
                          {generateTimeOptions().map((time) => {
                            const isBusy =
                              formData.visitDate && !visitsLoading && isTimeSlotBusy(formData.visitDate, time)
                            return (
                              <option
                                key={time}
                                value={time}
                                disabled={isBusy}
                                className={isBusy ? "text-red-500" : ""}
                              >
                                {time} {isBusy ? "(Ocupado)" : ""}
                              </option>
                            )
                          })}
                        </select>
                        {visitsLoading && <p className="text-xs text-gray-500 mt-1">Verificando disponibilidad...</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Visita</label>

                        <select
                          name="visitType"
                          value={formData.visitType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                        >
                          <option value="presencial">Presencial</option>

                          <option value="virtual">Virtual</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notas Adicionales</label>

                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors resize-none"
                        placeholder="Información adicional sobre la visita..."
                      />
                    </div>
                  </div>

                  {/* Separador visual */}

                  <div className="border-t border-gray-100"></div>

                  {/* Información del Agente */}

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="w-5 h-5 text-[#2F8EAC]" />

                      <h3 className="font-semibold text-gray-800">Información del Agente</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Agente *</label>

                        <input
                          type="text"
                          name="agentName"
                          value={formData.agentName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                          placeholder="Nombre del agente responsable"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono del Agente *</label>

                        <input
                          type="tel"
                          name="agentPhone"
                          value={formData.agentPhone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                          placeholder="+57 300 123 4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Separador visual */}

                  <div className="border-t border-gray-100"></div>

                  {/* Botones de Acción */}

                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Limpiar Formulario
                    </button>


                    <button
                      type="submit"
                      disabled={isSubmitting || !agentId}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl font-medium transition-colors shadow-sm ${
                        isSubmitting || !agentId
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Programando...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          Programar Visita
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
