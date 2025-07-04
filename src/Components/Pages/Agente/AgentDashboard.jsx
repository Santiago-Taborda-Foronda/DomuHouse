import { useState, useEffect, useCallback } from "react"
import { Home, Calendar, MessageSquare, Clock } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"
import { Outlet } from "react-router-dom"
import { Header } from "../../Layouts/Header/Header"

export default function AgentDashboard() {
  /* ───────── control de navegación ───────── */
  const [activeSection, setActiveSection] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleAgentSidebar = () => setSidebarOpen(!sidebarOpen)

  /* ───────── datos del backend ───────── */
  const [agentId, setAgentId] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [properties, setProperties] = useState([])
  const [visits, setVisits] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ───────── nuevos estados para las secciones ───────── */
  const [recentActivity, setRecentActivity] = useState([])
  const [upcomingVisits, setUpcomingVisits] = useState([])

  /* ───────── función para construir actividad reciente ───────── */
  const buildRecentActivity = useCallback((visits, messages) => {
    const activity = []

    // Agregar mensajes a la actividad
    if (messages && messages.length > 0) {
      messages.forEach((msg) => {
        activity.push({
          id: `msg-${msg.message_id || msg.id || Math.random()}`,
          type: "message",
          title: `Nuevo mensaje de ${msg.sender_name || msg.client_name || "Cliente"}`,
          subtitle: msg.property_title || msg.property_name || "Propiedad",
          time: getRelativeTime(msg.created_at || msg.date),
          icon: MessageSquare,
          timestamp: new Date(msg.created_at || msg.date || Date.now()),
        })
      })
    }

    // Agregar visitas a la actividad (usando los campos exactos de tu VisitService)
    if (visits && visits.length > 0) {
      visits.forEach((visit) => {
        let activityTitle = "Visita programada"
        // Usar el campo visitStatus que devuelve tu backend
        switch (visit.visitStatus) {
          case "Confirmada":
            activityTitle = "Visita confirmada"
            break
          case "Pendiente":
            activityTitle = "Visita pendiente"
            break
          case "Cancelada":
            activityTitle = "Visita cancelada"
            break
          default:
            activityTitle = "Visita programada"
        }

        activity.push({
          id: `visit-${visit.visitId || Math.random()}`,
          type: "visit",
          title: activityTitle,
          subtitle: visit.propertyTitle || "Propiedad",
          time: getRelativeTime(visit.visitDate),
          icon: Calendar,
          timestamp: new Date(visit.visitDate || Date.now()),
        })
      })
    }

    // Ordenar por timestamp (más reciente primero) y tomar solo los primeros 6
    return activity.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6)
  }, [])

  /* ───────── función para obtener tiempo relativo ───────── */
  const getRelativeTime = (dateString) => {
    if (!dateString) return "Hace poco"
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `${diffInMinutes} min`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} día${diffInDays > 1 ? "s" : ""}`

    return date.toLocaleDateString("es-ES")
  }

  /* ───────── función para formatear fecha y hora ───────── */
  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return { date: "Sin fecha", time: "Sin hora" }

    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

    let formattedTime = "Sin hora"
    if (timeString) {
      // Si timeString viene en formato HH:MM:SS desde tu backend
      const timeParts = timeString.split(":")
      if (timeParts.length >= 2) {
        const hours = Number.parseInt(timeParts[0])
        const minutes = timeParts[1]
        const ampm = hours >= 12 ? "PM" : "AM"
        const displayHours = hours % 12 || 12
        formattedTime = `${displayHours}:${minutes} ${ampm}`
      }
    }

    return { date: formattedDate, time: formattedTime }
  }

  /* ───────── función mejorada para determinar si una visita es futura ───────── */
  const isFutureVisit = (visitDate, visitTime) => {
    if (!visitDate) return false // sin fecha → no la muestro

    const now = new Date()
    const target = new Date(visitDate)

    // Si hay hora específica, combinarla con la fecha
    if (visitTime) {
      const [h, m] = visitTime.split(":").map(Number)
      if (!isNaN(h) && !isNaN(m)) {
        target.setHours(h, m, 0, 0)
      }
    }

    return target >= now
  }

  /* ───────── fetch principal ───────── */
  const fetchAgentData = async (id) => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔍 Cargando datos para agente ID:", id)

      const [propertiesRes, visitsRes, messagesRes] = await Promise.all([
        fetch(`http://localhost:10101/api/agents/${id}/properties`),
        fetch(`http://localhost:10101/api/agents/${id}/visits`),
        fetch(`http://localhost:10101/api/agents/${id}/messages?limit=10`),
      ])

      console.log("📡 Respuestas del servidor:", {
        properties: propertiesRes.status,
        visits: visitsRes.status,
        messages: messagesRes.status,
      })

      // Verificar si las respuestas son exitosas
      if (!propertiesRes.ok) {
        console.warn("⚠️ Error en propiedades:", propertiesRes.status)
      }
      if (!visitsRes.ok) {
        console.warn("⚠️ Error en visitas:", visitsRes.status)
      }
      if (!messagesRes.ok) {
        console.warn("⚠️ Error en mensajes:", messagesRes.status)
      }

      // Obtener los datos JSON
      const [propertiesRes_json, visitsRes_json, messagesRes_json] = await Promise.all([
        propertiesRes.ok ? propertiesRes.json() : { properties: [] },
        visitsRes.ok ? visitsRes.json() : { visits: [] },
        messagesRes.ok ? messagesRes.json() : [],
      ])

      console.log("📊 Respuestas JSON completas:", {
        propertiesResponse: propertiesRes_json,
        visitsResponse: visitsRes_json,
        messagesResponse: messagesRes_json,
      })

      // 🔹 Extraer los arrays correctamente según la estructura de tu backend
      const validPropertiesData = Array.isArray(propertiesRes_json?.properties)
        ? propertiesRes_json.properties
        : Array.isArray(propertiesRes_json)
          ? propertiesRes_json
          : []

      // 🔹 CORRECCIÓN: Las visitas vienen envueltas en un objeto { visits: [...] }
      const rawVisits = visitsRes_json?.visits ?? visitsRes_json
      const validVisitsData = Array.isArray(rawVisits) ? rawVisits : []

      const validMessagesData = Array.isArray(messagesRes_json)
        ? messagesRes_json
        : Array.isArray(messagesRes_json?.messages)
          ? messagesRes_json.messages
          : []

      console.log("📊 Datos recibidos:", {
        properties: validPropertiesData,
        visits: validVisitsData,
        messages: validMessagesData,
      })

      console.log("✅ Datos validados:", {
        propertiesCount: validPropertiesData.length,
        visitsCount: validVisitsData.length,
        messagesCount: validMessagesData.length,
      })

      setProperties(validPropertiesData)
      setVisits(validVisitsData)
      setMessages(validMessagesData)

      // 🔷 Transformar visits para upcomingVisits (usando los campos exactos de tu VisitService)
      const upcoming = validVisitsData
        .filter((visit) => {
          // Filtrar solo visitas futuras usando los campos de tu backend
          return isFutureVisit(visit.visitDate, visit.visitTime)
        })
        .map((visit) => {
          const { date, time } = formatDateTime(visit.visitDate, visit.visitTime)
          return {
            id: visit.visitId,
            clientName: visit.clientName || "Cliente",
            property: visit.propertyTitle || "Propiedad",
            date: date,
            time: time,
            rawDate: visit.visitDate,
            status: visit.visitStatus,
            address: visit.propertyAddress,
            clientPhone: visit.clientPhone,
          }
        })
        .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate)) // Ordenar por fecha
        .slice(0, 5) // Mostrar solo las próximas 5

      console.log("🟢 upcomingVisits:", upcoming)
      setUpcomingVisits(upcoming)

      // 🔷 Construir actividad reciente con mensajes y visitas
      const activity = buildRecentActivity(validVisitsData, validMessagesData)
      setRecentActivity(activity)

      console.log("🔷 Actividad reciente generada:", activity)
      console.log("🔷 Próximas visitas generadas:", upcoming)
    } catch (error) {
      console.error("❌ Error cargando datos del agente:", error)
      setError(`Error de conexión: ${error.message}`)
      // 🔹 Establecer arrays vacíos en caso de error
      setProperties([])
      setVisits([])
      setMessages([])
      setRecentActivity([])
      setUpcomingVisits([])
    } finally {
      setLoading(false)
    }
  }

  /* ───────── on mount ───────── */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userData") || "{}")
    const id = stored.person_id ?? stored.id

    if (!id) {
      setError("No se encontró el ID del agente.")
      setLoading(false)
      return
    }

    setAgentId(id)
    setCurrentUser(stored)
    fetchAgentData(id)
  }, [buildRecentActivity])

  /* ───────── métricas ───────── */
  const metricCards = [
    { title: "Propiedades", icon: Home, value: properties.length, subtitle: "Totales" },
    { title: "Visitas", icon: Calendar, value: visits.length, subtitle: "Programadas" },
    { title: "Mensajes", icon: MessageSquare, value: messages.length, subtitle: "Sin leer" },
  ]

  /* ───────── vistas de carga / error ───────── */
  if (loading) {
    return (
      <>
        <Header toggleAgentSidebar={toggleAgentSidebar} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F8EAC] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header toggleAgentSidebar={toggleAgentSidebar} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md">
              <h3 className="font-semibold mb-2">Error al cargar datos</h3>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ───────── render principal ───────── */
  return (
    <>
      <Header toggleAgentSidebar={toggleAgentSidebar} />

      {/* Sidebar desktop */}
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

      {/* Overlay para móvil cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Contenido principal con margen izquierdo para el sidebar */}
      <main className="lg:ml-72 pt-16">
        <div className="p-4 sm:p-6">
          {/* Header de la página */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-base mt-1">Panel de control y estadísticas generales</p>
              {/* 🔹 Mostrar información del usuario */}
              {currentUser && (
                <p className="text-sm text-gray-500 mt-1">Bienvenido, {currentUser.name || currentUser.email}</p>
              )}
            </div>
          </div>

          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {metricCards.map(({ title, icon: Icon, value, subtitle }) => (
              <div key={title} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" />
                      <span className="text-3xl sm:text-4xl font-bold text-gray-800">{value}</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
                    <p className="text-lg sm:text-xl font-semibold text-gray-800">{title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nuevas secciones: Actividad Reciente y Próximas Visitas */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            {/* Actividad Reciente */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
              <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Actividad Reciente</h2>
                <p className="text-xs sm:text-sm text-gray-500">Últimas interacciones con tus propiedades</p>
              </div>
              <div className="p-4 sm:p-5">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividad reciente</h3>
                    <p className="text-gray-500">Las actividades aparecerán aquí cuando ocurran.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => {
                      const IconComponent = activity.icon
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-sky-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.subtitle}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-xs text-gray-400">{activity.time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Próximas Visitas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-3">
              <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Próximas Visitas</h2>
                <p className="text-xs sm:text-sm text-gray-500">Citas programadas</p>
              </div>
              <div className="p-4 sm:p-5">
                {upcomingVisits.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay visitas programadas</h3>
                    <p className="text-gray-500">Las citas aparecerán aquí cuando se programen.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingVisits.map((visit) => (
                      <div key={visit.id} className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-1 h-12 bg-sky-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{visit.clientName}</p>
                            <p className="text-xs text-gray-600">{visit.property}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{visit.date}</span>
                            </div>
                            {/* Mostrar estado de la visita */}
                            {visit.status && (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                                  visit.status === "Confirmada"
                                    ? "bg-sky-100 text-sky-800"
                                    : visit.status === "Pendiente"
                                      ? "bg-indigo-100 text-indigo-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {visit.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-sm font-medium text-gray-900">{visit.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Outlet />
    </>
  )
}