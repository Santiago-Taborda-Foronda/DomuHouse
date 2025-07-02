"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Filter,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  X,
  Save,
  Users,
} from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"

// Datos simulados de agentes y sus visitas
const agentesData = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    email: "carlos@inmobiliaria.com",
    telefono: "+57 300 123 4567",
    foto: "/api/placeholder/40/40",
    visitasHoy: 3,
    visitasSemana: 8,
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@inmobiliaria.com",
    telefono: "+57 301 987 6543",
    foto: "/api/placeholder/40/40",
    visitasHoy: 2,
    visitasSemana: 12,
  },
  {
    id: 3,
    nombre: "Juan Rodríguez",
    email: "juan@inmobiliaria.com",
    telefono: "+57 302 456 7890",
    foto: "/api/placeholder/40/40",
    visitasHoy: 4,
    visitasSemana: 6,
  },
]

// Función para obtener fechas dinámicas
const obtenerFechaHoy = () => new Date().toISOString().split("T")[0]
const obtenerFechaManana = () => {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 1)
  return fecha.toISOString().split("T")[0]
}

const visitasData = [
  {
    id: 1,
    agenteId: 1,
    fecha: "2024-08-17",
    hora: "09:00",
    cliente: "Ana Martínez",
    telefono: "+57 310 111 2222",
    propiedad: "Apartamento Zona Rosa",
    direccion: "Cra 15 #85-32, Bogotá",
    tipo: "Apartamento",
    estado: "confirmada",
    precio: 850000000,
    duracion: 60,
    notas: "Cliente interesado en apartamentos de 2 habitaciones con vista panorámica",
  },
  {
    id: 2,
    agenteId: 1,
    fecha: "2024-08-17",
    hora: "14:30",
    cliente: "Roberto Silva",
    telefono: "+57 311 333 4444",
    propiedad: "Casa Campestre",
    direccion: "Km 5 Vía La Calera",
    tipo: "Casa",
    estado: "pendiente",
    precio: 1200000000,
    duracion: 90,
    notas: "Requiere confirmación de disponibilidad",
  },
  {
    id: 3,
    agenteId: 1,
    fecha: "2024-08-17",
    hora: "16:00",
    cliente: "Laura Gómez",
    telefono: "+57 312 555 6666",
    propiedad: "Oficina Centro",
    direccion: "Cra 7 #32-15, Centro",
    tipo: "Oficina",
    estado: "confirmada",
    precio: 450000000,
    duracion: 45,
    notas: "Busca oficina para startup tecnológica",
  },
  {
    id: 10,
    agenteId: 1,
    fecha: obtenerFechaHoy(),
    hora: "10:00",
    cliente: "Carlos Ruiz",
    telefono: "+57 319 111 2222",
    propiedad: "Apartamento Moderno",
    direccion: "Cra 50 #25-10, Medellín",
    tipo: "Apartamento",
    estado: "confirmada",
    precio: 900000000,
    duracion: 60,
    notas: "Primera visita, muy interesado",
  },
  {
    id: 11,
    agenteId: 2,
    fecha: obtenerFechaHoy(),
    hora: "14:00",
    cliente: "Diana Vargas",
    telefono: "+57 320 333 4444",
    propiedad: "Casa Familiar",
    direccion: "Calle 80 #15-25, Barranquilla",
    tipo: "Casa",
    estado: "pendiente",
    precio: 1800000000,
    duracion: 90,
    notas: "Familia con 3 hijos, buscan zona segura",
  },
  {
    id: 12,
    agenteId: 3,
    fecha: obtenerFechaHoy(),
    hora: "16:30",
    cliente: "Fernando López",
    telefono: "+57 321 555 6666",
    propiedad: "Oficina Ejecutiva",
    direccion: "Av. Las Vegas #30-40, Medellín",
    tipo: "Oficina",
    estado: "confirmada",
    precio: 600000000,
    duracion: 45,
    notas: "Ejecutivo senior, decisión rápida",
  },
]

// Modal para ver detalles de la visita
const VisitDetailsModal = ({ visita, agente, isOpen, onClose }) => {
  if (!isOpen || !visita) return null

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "confirmada":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "pendiente":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "cancelada":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-slate-700 bg-slate-50 border-slate-200"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Detalles de la Visita</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado y hora */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#2F8EAC]" />
              <div>
                <div className="text-2xl font-bold text-[#2F8EAC]">{visita.hora}</div>
                <div className="text-sm text-slate-600">{visita.duracion} minutos</div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${obtenerColorEstado(visita.estado)}`}>
              {visita.estado.charAt(0).toUpperCase() + visita.estado.slice(1)}
            </span>
          </div>

          {/* Información del cliente */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#2F8EAC]" />
              Información del Cliente
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Nombre:</span> {visita.cliente}
              </div>
              <div>
                <span className="font-medium">Teléfono:</span> {visita.telefono}
              </div>
            </div>
          </div>

          {/* Información de la propiedad */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2F8EAC]" />
              Información de la Propiedad
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Propiedad:</span> {visita.propiedad}
              </div>
              <div>
                <span className="font-medium">Dirección:</span> {visita.direccion}
              </div>
              <div>
                <span className="font-medium">Tipo:</span> {visita.tipo}
              </div>
              <div>
                <span className="font-medium">Precio:</span>{" "}
                <span className="text-[#2F8EAC] font-bold">{formatearPrecio(visita.precio)}</span>
              </div>
            </div>
          </div>

          {/* Información del agente */}
          <div className="bg-teal-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2F8EAC]" />
              Agente Asignado
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Nombre:</span> {agente?.nombre}
              </div>
              <div>
                <span className="font-medium">Email:</span> {agente?.email}
              </div>
              <div>
                <span className="font-medium">Teléfono:</span> {agente?.telefono}
              </div>
            </div>
          </div>

          {/* Notas */}
          {visita.notas && (
            <div className="bg-amber-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Notas</h3>
              <p className="text-slate-700">{visita.notas}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Modal para editar visita
const VisitEditModal = ({ visita, agente, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    telefono: "",
    propiedad: "",
    direccion: "",
    tipo: "",
    estado: "",
    precio: "",
    duracion: "",
    notas: "",
    fecha: "",
    hora: "",
  })

  useEffect(() => {
    if (visita) {
      setFormData({
        cliente: visita.cliente || "",
        telefono: visita.telefono || "",
        propiedad: visita.propiedad || "",
        direccion: visita.direccion || "",
        tipo: visita.tipo || "",
        estado: visita.estado || "",
        precio: visita.precio || "",
        duracion: visita.duracion || "",
        notas: visita.notas || "",
        fecha: visita.fecha || "",
        hora: visita.hora || "",
      })
    }
  }, [visita])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...visita,
      ...formData,
      precio: Number.parseInt(formData.precio),
      duracion: Number.parseInt(formData.duracion),
    })
    onClose()
  }

  if (!isOpen || !visita) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Editar Visita</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cliente</label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Propiedad</label>
            <input
              type="text"
              value={formData.propiedad}
              onChange={(e) => setFormData({ ...formData, propiedad: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              >
                <option value="">Seleccionar</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Oficina">Oficina</option>
                <option value="Local">Local</option>
                <option value="Bodega">Bodega</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              >
                <option value="confirmada">Confirmada</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duración (min)</label>
              <input
                type="number"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hora</label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Precio</label>
            <input
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a95] transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const AgendaAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split("T")[0])
  const [agenteSeleccionado, setAgenteSeleccionado] = useState("todos")
  const [estadoFiltro, setEstadoFiltro] = useState("todos")
  const [busqueda, setBusqueda] = useState("")

  // Estados para los modales
  const [selectedVisita, setSelectedVisita] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [visitas, setVisitas] = useState(visitasData)

  // Función para alternar sidebar móvil
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para manejar logout
  const handleLogout = () => {
    console.log("Cerrando sesión...")
    setIsAuthenticated(false)
  }

  // Función para ver detalles de visita
  const verVisita = (id) => {
    const visita = visitas.find((v) => v.id === id)
    if (visita) {
      setSelectedVisita(visita)
      setIsDetailsModalOpen(true)
    }
  }

  // Función para editar visita
  const editarVisita = (id) => {
    const visita = visitas.find((v) => v.id === id)
    if (visita) {
      setSelectedVisita(visita)
      setIsEditModalOpen(true)
    }
  }

  // Función para guardar cambios de la visita
  const handleSaveVisita = (updatedVisita) => {
    setVisitas((prev) => prev.map((visita) => (visita.id === updatedVisita.id ? updatedVisita : visita)))
    console.log("Visita actualizada:", updatedVisita)
  }

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  // Filtrar visitas según criterios
  const visitasFiltradas = visitas.filter((visita) => {
    const cumpleFecha = visita.fecha === fechaSeleccionada
    const cumpleAgente = agenteSeleccionado === "todos" || visita.agenteId === Number.parseInt(agenteSeleccionado)
    const cumpleEstado = estadoFiltro === "todos" || visita.estado === estadoFiltro
    const cumpleBusqueda =
      busqueda === "" ||
      visita.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      visita.propiedad.toLowerCase().includes(busqueda.toLowerCase())

    return cumpleFecha && cumpleAgente && cumpleEstado && cumpleBusqueda
  })

  // Obtener agente por ID
  const obtenerAgente = (agenteId) => {
    return agentesData.find((agente) => agente.id === agenteId)
  }

  // Obtener color según estado
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "confirmada":
        return "text-emerald-600 bg-emerald-50 border border-emerald-200"
      case "pendiente":
        return "text-amber-600 bg-amber-50 border border-amber-200"
      case "cancelada":
        return "text-red-600 bg-red-50 border border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border border-slate-200"
    }
  }

  // Obtener ícono según estado
  const obtenerIconoEstado = (estado) => {
    switch (estado) {
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

  // Estadísticas del día
  const estadisticasDia = {
    totalVisitas: visitasFiltradas.length,
    confirmadas: visitasFiltradas.filter((v) => v.estado === "confirmada").length,
    pendientes: visitasFiltradas.filter((v) => v.estado === "pendiente").length,
    canceladas: visitasFiltradas.filter((v) => v.estado === "cancelada").length,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header hasSidebar={true} toggleSidebar={toggleSidebar} />

      {/* Layout principal con sidebar */}
      <div className="flex pt-16">
        {/* Sidebar fijo para desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-slate-200 overflow-y-auto z-30">
          <SidebarInmobiliaria
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Sidebar overlay para móviles */}
        <div className="lg:hidden">
          <SidebarInmobiliaria
            isOpen={isSidebarOpen}
            toggleMenu={toggleSidebar}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={false}
          />
        </div>

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-3 sm:p-6">
            {/* Header de la página */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Agenda de Visitas</h1>
              <p className="text-slate-600 text-sm mt-1">
                Gestiona y supervisa todas las visitas programadas de tus agentes ({visitasFiltradas.length} visitas)
              </p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-800">Filtros de búsqueda</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Selector de fecha */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                  />
                </div>

                {/* Selector de agente */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Agente</label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                    value={agenteSeleccionado}
                    onChange={(e) => setAgenteSeleccionado(e.target.value)}
                  >
                    <option value="todos">Todos los agentes</option>
                    {agentesData.map((agente) => (
                      <option key={agente.id} value={agente.id}>
                        {agente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por estado */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {/* Búsqueda */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cliente o propiedad..."
                      className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors text-sm sm:text-base"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas del día */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">{estadisticasDia.totalVisitas}</div>
                    <p className="text-xs sm:text-sm text-slate-600">Total Visitas</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600">{estadisticasDia.confirmadas}</div>
                    <p className="text-xs sm:text-sm text-slate-600">Confirmadas</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-amber-600">{estadisticasDia.pendientes}</div>
                    <p className="text-xs sm:text-sm text-slate-600">Pendientes</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{estadisticasDia.canceladas}</div>
                    <p className="text-xs sm:text-sm text-slate-600">Canceladas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de visitas */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="p-4 sm:p-6 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                  Visitas para{" "}
                  {new Date(fechaSeleccionada).toLocaleDateString("es-ES", {
                    weekday: window.innerWidth < 640 ? "short" : "long",
                    year: "numeric",
                    month: window.innerWidth < 640 ? "short" : "long",
                    day: "numeric",
                  })}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">Gestiona y edita la información de las visitas</p>
              </div>

              <div className="divide-y divide-slate-100">
                {visitasFiltradas.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center">
                    <Calendar className="w-10 sm:w-12 h-10 sm:h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm sm:text-base">
                      No hay visitas programadas para los filtros seleccionados
                    </p>
                  </div>
                ) : (
                  visitasFiltradas
                    .sort((a, b) => a.hora.localeCompare(b.hora))
                    .map((visita) => {
                      const agente = obtenerAgente(visita.agenteId)
                      return (
                        <div key={visita.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
                              {/* Hora */}
                              <div className="text-center sm:text-left flex-shrink-0">
                                <div className="text-base sm:text-lg font-bold text-[#2F8EAC]">{visita.hora}</div>
                                <div className="text-xs text-slate-500">{visita.duracion}min</div>
                              </div>

                              {/* Información principal */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                                    {visita.cliente}
                                  </h3>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(visita.estado)} self-start sm:self-auto`}
                                  >
                                    {obtenerIconoEstado(visita.estado)}
                                    {visita.estado.charAt(0).toUpperCase() + visita.estado.slice(1)}
                                  </span>
                                </div>

                                <div className="text-xs sm:text-sm text-slate-600 mb-2 space-y-1 sm:space-y-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                                      <span className="truncate">
                                        {visita.propiedad} - {visita.direccion}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                                      <span>{visita.telefono}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-600">
                                      Agente: <span className="font-medium">{agente?.nombre}</span>
                                    </span>
                                  </div>
                                  <div className="text-[#2F8EAC] font-semibold">{formatearPrecio(visita.precio)}</div>
                                </div>
                              </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => verVisita(visita.id)}
                                className="p-2 text-[#2F8EAC] hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => editarVisita(visita.id)}
                                className="p-2 text-[#267a95] hover:bg-teal-50 rounded-lg transition-colors"
                                title="Editar visita"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modales */}
      <VisitDetailsModal
        visita={selectedVisita}
        agente={selectedVisita ? obtenerAgente(selectedVisita.agenteId) : null}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedVisita(null)
        }}
      />

      <VisitEditModal
        visita={selectedVisita}
        agente={selectedVisita ? obtenerAgente(selectedVisita.agenteId) : null}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedVisita(null)
        }}
        onSave={handleSaveVisita}
      />
    </div>
  )
}
