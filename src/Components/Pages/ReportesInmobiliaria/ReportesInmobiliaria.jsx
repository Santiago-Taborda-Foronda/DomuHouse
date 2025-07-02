"use client"

import { useState } from "react"
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Award,
  BarChart3,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Building2,
  UserCheck,
  Phone,
  Mail,
  Eye,
  Edit,
  X,
  Save,
  Star,
} from "lucide-react"
import { SidebarInmobiliaria } from "../../../Components/Layouts/SidebarInmobiliaria/SidebarInmobiliaria.jsx"
import { Header } from "../../../Components/Layouts/Header/Header.jsx"

// Datos simulados para los reportes
const reportesData = {
  resumenGeneral: {
    ventasTotales: 2450000000,
    ventasMesAnterior: 2100000000,
    clientesNuevos: 187,
    clientesMesAnterior: 165,
    propiedadesVendidas: 34,
    propiedadesMesAnterior: 29,
    comisionesTotales: 245000000,
    comisionesMesAnterior: 210000000,
  },

  topAgentes: [
    {
      id: 1,
      nombre: "María González",
      email: "maria.gonzalez@inmobiliaria.com",
      telefono: "+57 300 123 4567",
      ventas: 8,
      comisiones: 45000000,
      crecimiento: 15.2,
      especialidad: "Propiedades de Lujo",
      clientesAtendidos: 24,
      rating: 4.8,
      fechaIngreso: "2023-01-15",
      ventasUltimoMes: 3,
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      email: "carlos.rodriguez@inmobiliaria.com",
      telefono: "+57 301 987 6543",
      ventas: 7,
      comisiones: 38500000,
      crecimiento: 8.7,
      especialidad: "Propiedades Comerciales",
      clientesAtendidos: 19,
      rating: 4.6,
      fechaIngreso: "2022-08-20",
      ventasUltimoMes: 2,
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      email: "ana.martinez@inmobiliaria.com",
      telefono: "+57 302 456 7890",
      ventas: 6,
      comisiones: 32000000,
      crecimiento: 12.3,
      especialidad: "Propiedades Residenciales",
      clientesAtendidos: 18,
      rating: 4.7,
      fechaIngreso: "2023-03-10",
      ventasUltimoMes: 2,
    },
    {
      id: 4,
      nombre: "Luis Herrera",
      email: "luis.herrera@inmobiliaria.com",
      telefono: "+57 303 789 0123",
      ventas: 5,
      comisiones: 28000000,
      crecimiento: -2.1,
      especialidad: "Propiedades Rurales",
      clientesAtendidos: 15,
      rating: 4.3,
      fechaIngreso: "2022-11-05",
      ventasUltimoMes: 1,
    },
    {
      id: 5,
      nombre: "Patricia Silva",
      email: "patricia.silva@inmobiliaria.com",
      telefono: "+57 304 012 3456",
      ventas: 4,
      comisiones: 22000000,
      crecimiento: 18.9,
      especialidad: "Apartamentos",
      clientesAtendidos: 12,
      rating: 4.5,
      fechaIngreso: "2023-05-22",
      ventasUltimoMes: 2,
    },
  ],

  ventasPorMes: [
    { mes: "Ene", ventas: 1800000000, propiedades: 25 },
    { mes: "Feb", ventas: 2100000000, propiedades: 28 },
    { mes: "Mar", ventas: 2300000000, propiedades: 31 },
    { mes: "Abr", ventas: 2050000000, propiedades: 27 },
    { mes: "May", ventas: 2400000000, propiedades: 33 },
    { mes: "Jun", ventas: 2200000000, propiedades: 29 },
    { mes: "Jul", ventas: 2600000000, propiedades: 35 },
    { mes: "Ago", ventas: 2450000000, propiedades: 34 },
  ],

  tiposPropiedades: [
    { tipo: "Casas", porcentaje: 45, ventas: 1102500000 },
    { tipo: "Apartamentos", porcentaje: 35, ventas: 857500000 },
    { tipo: "Oficinas", porcentaje: 12, ventas: 294000000 },
    { tipo: "Locales", porcentaje: 8, ventas: 196000000 },
  ],

  crecimientoClientela: [
    { mes: "Ene", nuevos: 145, contactos: 320, conversiones: 45.3 },
    { mes: "Feb", nuevos: 132, contactos: 298, conversiones: 44.3 },
    { mes: "Mar", nuevos: 178, contactos: 367, conversiones: 48.5 },
    { mes: "Abr", nuevos: 156, contactos: 334, conversiones: 46.7 },
    { mes: "May", nuevos: 189, contactos: 401, conversiones: 47.1 },
    { mes: "Jun", nuevos: 167, contactos: 356, conversiones: 46.9 },
    { mes: "Jul", nuevos: 195, contactos: 423, conversiones: 46.1 },
    { mes: "Ago", nuevos: 187, contactos: 398, conversiones: 47.0 },
  ],
}

// Modal para ver detalles del agente
const AgentDetailsModal = ({ agente, isOpen, onClose }) => {
  if (!isOpen || !agente) return null

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? "text-amber-400 fill-current" : "text-slate-300"}`}
      />
    ))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Detalles del Agente</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información personal */}
          <div className="bg-gradient-to-r from-[#2F8EAC]/10 to-[#4ECDC4]/10 rounded-xl p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2F8EAC] to-[#4ECDC4] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {agente.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{agente.nombre}</h3>
                <p className="text-[#2F8EAC] font-medium">{agente.especialidad}</p>
                <div className="flex items-center gap-1 mt-1">{renderStars(agente.rating)}</div>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#2F8EAC]" />
              Información de Contacto
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{agente.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{agente.telefono}</span>
              </div>
            </div>
          </div>

          {/* Métricas de rendimiento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#2F8EAC]">{agente.ventas}</div>
              <p className="text-sm text-slate-600">Ventas Totales</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#4ECDC4]">{agente.clientesAtendidos}</div>
              <p className="text-sm text-slate-600">Clientes Atendidos</p>
            </div>
          </div>

          {/* Información financiera */}
          <div className="bg-emerald-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Información Financiera
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Comisiones Totales:</span>
                <span className="font-bold text-emerald-600">{formatearPrecio(agente.comisiones)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Crecimiento:</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    agente.crecimiento >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {agente.crecimiento >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(agente.crecimiento)}%
                </span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-amber-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Información Adicional</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Fecha de Ingreso:</span>
                <span className="font-medium text-slate-900">
                  {new Date(agente.fechaIngreso).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ventas Último Mes:</span>
                <span className="font-medium text-slate-900">{agente.ventasUltimoMes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal para editar agente
const AgentEditModal = ({ agente, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    especialidad: "",
    rating: 0,
  })

  useState(() => {
    if (agente) {
      setFormData({
        nombre: agente.nombre || "",
        email: agente.email || "",
        telefono: agente.telefono || "",
        especialidad: agente.especialidad || "",
        rating: agente.rating || 0,
      })
    }
  }, [agente])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...agente,
      ...formData,
      rating: Number.parseFloat(formData.rating),
    })
    onClose()
  }

  if (!isOpen || !agente) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Editar Agente</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Especialidad</label>
            <select
              value={formData.especialidad}
              onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
              required
            >
              <option value="">Seleccionar especialidad</option>
              <option value="Propiedades de Lujo">Propiedades de Lujo</option>
              <option value="Propiedades Comerciales">Propiedades Comerciales</option>
              <option value="Propiedades Residenciales">Propiedades Residenciales</option>
              <option value="Propiedades Rurales">Propiedades Rurales</option>
              <option value="Apartamentos">Apartamentos</option>
            </select>
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

export const ReportesInmobiliaria = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [filtroTiempo, setFiltroTiempo] = useState("mensual")
  const [tipoReporte, setTipoReporte] = useState("ventas")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Estados para los modales
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [agentes, setAgentes] = useState(reportesData.topAgentes)

  // Función para manejar el toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para manejar logout
  const handleLogout = () => {
    console.log("Cerrando sesión...")
    setIsAuthenticated(false)
  }

  // Función para ver detalles del agente
  const verAgente = (id) => {
    const agent = agentes.find((a) => a.id === id)
    if (agent) {
      setSelectedAgent(agent)
      setIsDetailsModalOpen(true)
    }
  }

  // Función para editar agente
  const editarAgente = (id) => {
    const agent = agentes.find((a) => a.id === id)
    if (agent) {
      setSelectedAgent(agent)
      setIsEditModalOpen(true)
    }
  }

  // Función para guardar cambios del agente
  const handleSaveAgent = (updatedAgent) => {
    setAgentes((prev) => prev.map((agent) => (agent.id === updatedAgent.id ? updatedAgent : agent)))
    console.log("Agente actualizado:", updatedAgent)
  }

  // Función para exportar datos
  const handleExport = () => {
    console.log("Exportando datos...")
    // Aquí iría la lógica de exportación
    alert("Funcionalidad de exportación implementada")
  }

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio)
  }

  // Función para calcular porcentaje de crecimiento
  const calcularCrecimiento = (actual, anterior) => {
    return (((actual - anterior) / anterior) * 100).toFixed(1)
  }

  const { resumenGeneral } = reportesData

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header hasSidebar={true} toggleSidebar={toggleSidebar} />

      {/* Layout principal */}
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

        {/* Contenido principal con margen adaptativo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          {/* Header de la página */}
          <div className="bg-white shadow-sm border-b border-slate-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Reportes y Estadísticas</h1>
                  <p className="text-sm text-slate-600 mt-1">Análisis completo del rendimiento de tu inmobiliaria</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] text-sm"
                    value={filtroTiempo}
                    onChange={(e) => setFiltroTiempo(e.target.value)}
                  >
                    <option value="semanal">Últimos 7 días</option>
                    <option value="mensual">Último mes</option>
                    <option value="trimestral">Último trimestre</option>
                    <option value="anual">Último año</option>
                  </select>

                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2F8EAC] text-white rounded-xl hover:bg-[#267a95] transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Tabs de navegación */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-fit">
                {[
                  { id: "ventas", label: "Ventas" },
                  { id: "agentes", label: "Agentes" },
                  { id: "clientes", label: "Clientes" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTipoReporte(tab.id)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tipoReporte === tab.id
                        ? "bg-white text-[#2F8EAC] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tarjetas de métricas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Ventas Totales */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#2F8EAC]/20 rounded-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F8EAC]" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      +{calcularCrecimiento(resumenGeneral.ventasTotales, resumenGeneral.ventasMesAnterior)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
                    {formatearPrecio(resumenGeneral.ventasTotales)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Ventas Totales</p>
                </div>
              </div>

              {/* Propiedades Vendidas */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#4ECDC4]/20 rounded-lg">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ECDC4]" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      +{calcularCrecimiento(resumenGeneral.propiedadesVendidas, resumenGeneral.propiedadesMesAnterior)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
                    {resumenGeneral.propiedadesVendidas}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Propiedades Vendidas</p>
                </div>
              </div>

              {/* Clientes Nuevos */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#7DD3C0]/20 rounded-lg">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#7DD3C0]" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      +{calcularCrecimiento(resumenGeneral.clientesNuevos, resumenGeneral.clientesMesAnterior)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
                    {resumenGeneral.clientesNuevos}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Clientes Nuevos</p>
                </div>
              </div>

              {/* Comisiones */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#1e5f73]/20 rounded-lg">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e5f73]" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      +{calcularCrecimiento(resumenGeneral.comisionesTotales, resumenGeneral.comisionesMesAnterior)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
                    {formatearPrecio(resumenGeneral.comisionesTotales)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Comisiones Generadas</p>
                </div>
              </div>
            </div>

            {/* Contenido principal según el tab seleccionado */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Gráfico principal */}
              <div className="xl:col-span-2">
                {tipoReporte === "ventas" ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Evolución de Ventas</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Ventas mensuales y propiedades vendidas</p>
                      </div>
                      <BarChart3 className="w-5 h-5 text-[#2F8EAC]" />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {reportesData.ventasPorMes.slice(-6).map((item, index) => {
                        const maxVentas = Math.max(...reportesData.ventasPorMes.map((v) => v.ventas))
                        return (
                          <div key={index} className="flex items-center gap-2 sm:gap-4">
                            <div className="w-6 sm:w-8 text-xs sm:text-sm font-medium text-slate-600">{item.mes}</div>
                            <div className="flex-1 bg-slate-100 rounded-full h-6 sm:h-8 relative">
                              <div
                                className="bg-gradient-to-r from-[#2F8EAC] to-[#4ECDC4] h-6 sm:h-8 rounded-full flex items-center justify-between px-2 sm:px-3"
                                style={{ width: `${(item.ventas / maxVentas) * 100}%` }}
                              >
                                <span className="text-xs font-medium text-white truncate">
                                  {formatearPrecio(item.ventas)}
                                </span>
                                <span className="text-xs font-medium text-white">{item.propiedades}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : tipoReporte === "clientes" ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Crecimiento de Clientela</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Nuevos clientes y tasa de conversión</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-[#2F8EAC]" />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {reportesData.crecimientoClientela.slice(-6).map((item, index) => {
                        const maxClientes = Math.max(...reportesData.crecimientoClientela.map((c) => c.nuevos))
                        return (
                          <div key={index} className="flex items-center gap-2 sm:gap-4">
                            <div className="w-6 sm:w-8 text-xs sm:text-sm font-medium text-slate-600">{item.mes}</div>
                            <div className="flex-1 bg-slate-100 rounded-full h-6 sm:h-8 relative">
                              <div
                                className="bg-gradient-to-r from-[#2F8EAC] to-[#4ECDC4] h-6 sm:h-8 rounded-full flex items-center justify-between px-2 sm:px-3"
                                style={{ width: `${(item.nuevos / maxClientes) * 100}%` }}
                              >
                                <span className="text-xs font-medium text-white">{item.nuevos}</span>
                                <span className="text-xs font-medium text-white">{item.conversiones}%</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Rendimiento de Agentes</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Top 5 agentes por ventas y comisiones</p>
                      </div>
                      <Award className="w-5 h-5 text-[#2F8EAC]" />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {agentes.map((agente, index) => (
                        <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#2F8EAC] to-[#4ECDC4] text-white rounded-full text-xs sm:text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                              <span className="font-medium text-slate-900 text-sm sm:text-base truncate">
                                {agente.nombre}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm text-slate-600">{agente.ventas} ventas</span>
                                <div
                                  className={`flex items-center gap-1 ${
                                    agente.crecimiento >= 0 ? "text-emerald-600" : "text-red-600"
                                  }`}
                                >
                                  {agente.crecimiento >= 0 ? (
                                    <ArrowUpRight className="w-3 h-3" />
                                  ) : (
                                    <ArrowDownRight className="w-3 h-3" />
                                  )}
                                  <span className="text-xs font-medium">{Math.abs(agente.crecimiento)}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs sm:text-sm text-slate-600">
                                {formatearPrecio(agente.comisiones)} en comisiones
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => verAgente(agente.id)}
                                  className="p-1.5 text-[#2F8EAC] hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => editarAgente(agente.id)}
                                  className="p-1.5 text-[#267a95] hover:bg-teal-50 rounded-lg transition-colors"
                                  title="Editar agente"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel lateral */}
              <div className="space-y-4 sm:space-y-6">
                {/* Distribución por tipo de propiedad */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Tipos de Propiedades</h3>
                    <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F8EAC]" />
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {reportesData.tiposPropiedades.map((tipo, index) => {
                      const colores = ["bg-[#2F8EAC]", "bg-[#4ECDC4]", "bg-[#7DD3C0]", "bg-[#1e5f73]"]
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-slate-700">{tipo.tipo}</span>
                            <span className="text-xs sm:text-sm text-slate-600">{tipo.porcentaje}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`${colores[index]} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${tipo.porcentaje}%` }}
                            />
                          </div>
                          <div className="text-xs text-slate-500">{formatearPrecio(tipo.ventas)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Métricas rápidas */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
                  <h3 className="font-semibold text-slate-800 mb-4 text-sm sm:text-base">Métricas del Periodo</h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-[#2F8EAC]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#2F8EAC]" />
                        <span className="text-xs sm:text-sm text-slate-700">Llamadas realizadas</span>
                      </div>
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">1,245</span>
                    </div>

                    <div className="flex items-center justify-between p-2 sm:p-3 bg-[#4ECDC4]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#4ECDC4]" />
                        <span className="text-xs sm:text-sm text-slate-700">Emails enviados</span>
                      </div>
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">3,567</span>
                    </div>

                    <div className="flex items-center justify-between p-2 sm:p-3 bg-[#7DD3C0]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#7DD3C0]" />
                        <span className="text-xs sm:text-sm text-slate-700">Citas programadas</span>
                      </div>
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">89</span>
                    </div>

                    <div className="flex items-center justify-between p-2 sm:p-3 bg-[#1e5f73]/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 text-[#1e5f73]" />
                        <span className="text-xs sm:text-sm text-slate-700">Tasa de cierre</span>
                      </div>
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">23.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modales */}
      <AgentDetailsModal
        agente={selectedAgent}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedAgent(null)
        }}
      />

      <AgentEditModal
        agente={selectedAgent}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedAgent(null)
        }}
        onSave={handleSaveAgent}
      />
    </div>
  )
}
