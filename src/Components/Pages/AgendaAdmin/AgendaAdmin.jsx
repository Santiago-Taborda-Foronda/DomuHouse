import { useState, useEffect } from "react"
import { Calendar, Clock, CheckCircle, XCircle, Eye, Search } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"

export const AgendaAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split("T")[0])
  const [estadoFiltro, setEstadoFiltro] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [visitasData, setVisitasData] = useState([])
  const [visitaSeleccionada, setVisitaSeleccionada] = useState(null)

  useEffect(() => {
    const fetchVisitas = async () => {
      try {
        const resp = await fetch("http://localhost:10101/api/visitas")
        const data = await resp.json()
        setVisitasData(data)
      } catch (err) {
        console.error("Error al obtener visitas:", err)
      }
    }
    fetchVisitas()
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const handleLogout = () => setIsAuthenticated(false)

  const visitasFiltradas = visitasData
    .filter((v) => v.visit_date.split("T")[0] === fechaSeleccionada)
    .filter((v) => (estadoFiltro === "todos" ? true : v.status.toLowerCase() === estadoFiltro.toLowerCase()))
    .filter(
      (v) =>
        busqueda === "" ||
        `${v.person_id}`.includes(busqueda) ||
        `${v.property_id}`.includes(busqueda) ||
        v.notes?.toLowerCase().includes(busqueda.toLowerCase()),
    )

  const obtenerColorEstado = (estado) => {
    const estadoLower = estado.toLowerCase()
    switch (estadoLower) {
      case "confirmada":
        return "text-green-600 bg-green-50"
      case "pendiente":
        return "text-yellow-600 bg-yellow-50"
      case "cancelada":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const obtenerIconoEstado = (estado) => {
    const estadoLower = estado.toLowerCase()
    switch (estadoLower) {
      case "confirmada":
        return <CheckCircle className="w-4 h-4" />
      case "pendiente":
        return <Clock className="w-4 h-4" />
      case "cancelada":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const estadisticasDia = {
    totalVisitas: visitasFiltradas.length,
    confirmadas: visitasFiltradas.filter((v) => v.status.toLowerCase() === "confirmada").length,
    pendientes: visitasFiltradas.filter((v) => v.status.toLowerCase() === "pendiente").length,
    canceladas: visitasFiltradas.filter((v) => v.status.toLowerCase() === "cancelada").length,
  }

  const verDetalleVisita = (visita) => {
    setVisitaSeleccionada(visita)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hasSidebar toggleSidebar={toggleSidebar} />
      <div className="flex pt-16">
        <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r overflow-y-auto z-30">
          <SidebarInmobiliaria
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout
          />
        </aside>
        {isSidebarOpen && (
          <SidebarInmobiliaria
            isOpen
            toggleMenu={toggleSidebar}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={false}
          />
        )}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-6 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agenda de Visitas</h1>
            <p className="text-gray-600 text-sm mt-1">Gestiona y supervisa todas las visitas programadas</p>

            {/* Filtros */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-xl focus:ring-[#2F8EAC]"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  className="w-full px-4 py-2 border rounded-xl focus:ring-[#2F8EAC]"
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ID cliente, ID propiedad, notas..."
                    className="w-full pl-12 pr-4 py-2 border rounded-xl focus:ring-[#2F8EAC]"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Estadísticas del día */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 mt-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <div className="text-xl font-bold text-gray-900">{estadisticasDia.totalVisitas}</div>
                    <p className="text-sm text-gray-600">Total Visitas</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-xl font-bold text-green-600">{estadisticasDia.confirmadas}</div>
                    <p className="text-sm text-gray-600">Confirmadas</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="text-xl font-bold text-yellow-600">{estadisticasDia.pendientes}</div>
                    <p className="text-sm text-gray-600">Pendientes</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-xl font-bold text-red-600">{estadisticasDia.canceladas}</div>
                    <p className="text-sm text-gray-600">Canceladas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de visitas */}
            <div className="mt-8 bg-white rounded-2xl shadow border-gray-100 border">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  Visitas para el{" "}
                  {new Date(fechaSeleccionada).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">Gestiona y edita la información de las visitas</p>
              </div>
              <div className="divide-y divide-slate-100">
                {visitasFiltradas.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <Calendar className="mx-auto w-12 h-12 text-gray-300" />
                    <p className="mt-4">No hay visitas programadas para estos filtros</p>
                  </div>
                ) : (
                  visitasFiltradas
                    .sort((a, b) => a.visit_date.localeCompare(b.visit_date))
                    .map((visita) => (
                      <div key={visita.visit_id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-[#2F8EAC]">
                                {new Date(visita.visit_date).toLocaleTimeString("es-CO", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="text-xs text-gray-500">{visita.visit_type}</div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(visita.status)}`}
                                >
                                  {obtenerIconoEstado(visita.status)}
                                  {visita.status.charAt(0).toUpperCase() + visita.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                Cliente ID: <span className="font-medium">{visita.person_id}</span>
                              </p>
                              <p className="text-sm text-gray-700">
                                Propiedad ID: <span className="font-medium">{visita.property_id}</span>
                              </p>
                              {visita.notes && (
                                <p className="text-xs text-gray-500 mt-1 truncate">Notas: {visita.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => verDetalleVisita(visita)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-[#2F8EAC] hover:bg-[#24708B] rounded-xl transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Ver detalle
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de detalle de visita */}
      {visitaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl border border-gray-200 relative">
            {/* Botón de cerrar */}
            <button
              onClick={() => setVisitaSeleccionada(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
            {/* Título */}
            <h2 className="text-2xl font-bold text-[#2F8EAC] mb-6 text-center">Detalle de la Visita</h2>
            {/* Datos organizados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-medium text-gray-500">Cliente</p>
                <p className="text-gray-900">{visitaSeleccionada.nombre || "—"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Teléfono</p>
                <p className="text-gray-900">{visitaSeleccionada.telefono || "—"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Propiedad</p>
                <p className="text-gray-900">{visitaSeleccionada.nombre_propiedad || "—"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Dirección</p>
                <p className="text-gray-900">{visitaSeleccionada.direccion || "—"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Fecha</p>
                <p className="text-gray-900">{new Date(visitaSeleccionada.visit_date).toLocaleDateString("es-CO")}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Hora</p>
                <p className="text-gray-900">
                  {new Date(visitaSeleccionada.visit_date).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {/* Estado con color */}
              <div className="sm:col-span-2">
                <p className="font-medium text-gray-500">Estado</p>
                <span
                  className={`
                  inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold capitalize
                  ${visitaSeleccionada.status.toLowerCase() === "confirmada" && "bg-green-100 text-green-700"}
                  ${visitaSeleccionada.status.toLowerCase() === "pendiente" && "bg-yellow-100 text-yellow-700"}
                  ${visitaSeleccionada.status.toLowerCase() === "cancelada" && "bg-red-100 text-red-700"}
                `}
                >
                  {visitaSeleccionada.status}
                </span>
              </div>
              {/* Notas */}
              {visitaSeleccionada.notes && (
                <div className="sm:col-span-2">
                  <p className="font-medium text-gray-500">Notas</p>
                  <p className="text-gray-900">{visitaSeleccionada.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

