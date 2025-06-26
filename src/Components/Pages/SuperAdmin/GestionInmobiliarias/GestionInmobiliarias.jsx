"use client"

import { useState, useEffect } from "react"
import { Building2, Plus, Edit, Trash2, Eye, Search, Filter, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Header } from "../../../Layouts/Header/Header"
import { SidebarSuperAdmin } from "../../../Layouts/SidebarSuperAdmin/SidebarSuperAdmin"

// Datos simulados de inmobiliarias
const inmobiliariasData = [
  {
    id: 1,
    nombre: "Inmobiliaria Premium",
    administrador: "Carlos Rodríguez",
    email: "carlos@premium.com",
    telefono: "+57 300 123 4567",
    ciudad: "Bogotá",
    propiedades: 45,
    agentes: 8,
    estado: "activa",
    fechaRegistro: "2024-01-15",
    ultimoPago: "2024-03-01",
    plan: "Premium",
    ingresosMensuales: 2500000,
  },
  {
    id: 2,
    nombre: "Casas del Norte",
    administrador: "María González",
    email: "maria@casasnorte.com",
    telefono: "+57 301 987 6543",
    ciudad: "Medellín",
    propiedades: 32,
    agentes: 5,
    estado: "pendiente_pago",
    fechaRegistro: "2024-02-20",
    ultimoPago: "2024-02-01",
    plan: "Básico",
    ingresosMensuales: 1200000,
  },
  {
    id: 3,
    nombre: "Propiedades Elite",
    administrador: "Juan Martínez",
    email: "juan@elite.com",
    telefono: "+57 302 456 7890",
    ciudad: "Cali",
    propiedades: 67,
    agentes: 12,
    estado: "activa",
    fechaRegistro: "2023-11-10",
    ultimoPago: "2024-03-01",
    plan: "Enterprise",
    ingresosMensuales: 4200000,
  },
  {
    id: 4,
    nombre: "Bienes Raíces Sur",
    administrador: "Ana López",
    email: "ana@bienesur.com",
    telefono: "+57 303 789 0123",
    ciudad: "Barranquilla",
    propiedades: 28,
    agentes: 4,
    estado: "suspendida",
    fechaRegistro: "2024-01-05",
    ultimoPago: "2024-01-01",
    plan: "Básico",
    ingresosMensuales: 800000,
  },
]

export const GestionInmobiliarias = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [inmobiliarias, setInmobiliarias] = useState(inmobiliariasData)
  const [filtroEstado, setFiltroEstado] = useState("todas")
  const [busqueda, setBusqueda] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("") // "view", "edit", "delete", "create"
  const [selectedInmobiliaria, setSelectedInmobiliaria] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para manejar toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para manejar logout
  const handleLogout = () => {
    console.log("Cerrando sesión...")
    setIsAuthenticated(false)
  }

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activa":
        return "bg-green-100 text-green-800"
      case "pendiente_pago":
        return "bg-yellow-100 text-yellow-800"
      case "suspendida":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Función para obtener icono del estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "activa":
        return <CheckCircle className="w-4 h-4" />
      case "pendiente_pago":
        return <AlertTriangle className="w-4 h-4" />
      case "suspendida":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  // Filtrar inmobiliarias
  const inmobiliariasFiltradas = inmobiliarias.filter((inmobiliaria) => {
    const matchEstado = filtroEstado === "todas" || inmobiliaria.estado === filtroEstado
    const matchBusqueda =
      inmobiliaria.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      inmobiliaria.administrador.toLowerCase().includes(busqueda.toLowerCase()) ||
      inmobiliaria.ciudad.toLowerCase().includes(busqueda.toLowerCase())
    return matchEstado && matchBusqueda
  })

  // Funciones para manejar modales
  const handleViewInmobiliaria = (inmobiliaria) => {
    setSelectedInmobiliaria(inmobiliaria)
    setModalType("view")
    setShowModal(true)
  }

  const handleEditInmobiliaria = (inmobiliaria) => {
    setSelectedInmobiliaria(inmobiliaria)
    setModalType("edit")
    setShowModal(true)
  }

  const handleDeleteInmobiliaria = (inmobiliaria) => {
    setSelectedInmobiliaria(inmobiliaria)
    setModalType("delete")
    setShowModal(true)
  }

  const handleCreateInmobiliaria = () => {
    setSelectedInmobiliaria(null)
    setModalType("create")
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedInmobiliaria(null)
    setModalType("")
  }

  // Función para cambiar estado de inmobiliaria
  const handleChangeEstado = async (id, nuevoEstado) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setInmobiliarias((prev) => prev.map((inmob) => (inmob.id === id ? { ...inmob, estado: nuevoEstado } : inmob)))
      closeModal()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex pt-16">
        {/* Sidebar fijo para desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <SidebarSuperAdmin
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Sidebar overlay para móviles */}
        <SidebarSuperAdmin
          isOpen={isSidebarOpen}
          toggleMenu={toggleSidebar}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          isFixedLayout={false}
        />

        {/* Overlay para cerrar sidebar en móviles */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-70 z-40 lg:hidden" onClick={toggleSidebar}></div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Inmobiliarias</h1>
                <p className="text-gray-600 text-sm mt-1">Administra todas las inmobiliarias de la plataforma</p>
              </div>
              <button
                onClick={handleCreateInmobiliaria}
                className="flex items-center gap-2 bg-[#2F8EAC] text-white px-4 py-2 rounded-xl hover:bg-[#1E5F73] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nueva Inmobiliaria
              </button>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Búsqueda */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, administrador o ciudad..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  />
                </div>

                {/* Filtro por estado */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  >
                    <option value="todas">Todas</option>
                    <option value="activa">Activas</option>
                    <option value="pendiente_pago">Pendiente Pago</option>
                    <option value="suspendida">Suspendidas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2F8EAC]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#2F8EAC]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inmobiliarias.filter((i) => i.estado === "activa").length}
                    </p>
                    <p className="text-sm text-gray-600">Activas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4BA3C7]/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-[#4BA3C7]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inmobiliarias.filter((i) => i.estado === "pendiente_pago").length}
                    </p>
                    <p className="text-sm text-gray-600">Pendientes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E5F73]/10 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-[#1E5F73]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inmobiliarias.filter((i) => i.estado === "suspendida").length}
                    </p>
                    <p className="text-sm text-gray-600">Suspendidas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2F8EAC]/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#2F8EAC]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{inmobiliarias.length}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de inmobiliarias */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Inmobiliarias ({inmobiliariasFiltradas.length})</h2>
              </div>

              {/* Vista móvil - Cards */}
              <div className="block lg:hidden">
                {inmobiliariasFiltradas.map((inmobiliaria) => (
                  <div key={inmobiliaria.id} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{inmobiliaria.nombre}</h3>
                        <p className="text-sm text-gray-600">{inmobiliaria.administrador}</p>
                        <p className="text-sm text-gray-500">{inmobiliaria.ciudad}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(inmobiliaria.estado)}`}
                      >
                        {getEstadoIcon(inmobiliaria.estado)}
                        {inmobiliaria.estado.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Propiedades:</span>
                        <span className="ml-1 font-medium">{inmobiliaria.propiedades}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Agentes:</span>
                        <span className="ml-1 font-medium">{inmobiliaria.agentes}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Plan:</span>
                        <span className="ml-1 font-medium">{inmobiliaria.plan}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ingresos:</span>
                        <span className="ml-1 font-medium">{formatearPrecio(inmobiliaria.ingresosMensuales)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewInmobiliaria(inmobiliaria)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button
                        onClick={() => handleEditInmobiliaria(inmobiliaria)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteInmobiliaria(inmobiliaria)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vista desktop - Tabla */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Inmobiliaria
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Propiedades
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ingresos
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {inmobiliariasFiltradas.map((inmobiliaria) => (
                      <tr key={inmobiliaria.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{inmobiliaria.nombre}</div>
                            <div className="text-sm text-gray-600">{inmobiliaria.administrador}</div>
                            <div className="text-xs text-gray-500">{inmobiliaria.ciudad}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(inmobiliaria.estado)}`}
                          >
                            {getEstadoIcon(inmobiliaria.estado)}
                            {inmobiliaria.estado.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{inmobiliaria.propiedades}</div>
                          <div className="text-xs text-gray-500">{inmobiliaria.agentes} agentes</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inmobiliaria.plan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatearPrecio(inmobiliaria.ingresosMensuales)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewInmobiliaria(inmobiliaria)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditInmobiliaria(inmobiliaria)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInmobiliaria(inmobiliaria)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para acciones */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {modalType === "view" && selectedInmobiliaria && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de Inmobiliaria</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                        <p className="text-gray-900">{selectedInmobiliaria.nombre}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Administrador:</label>
                        <p className="text-gray-900">{selectedInmobiliaria.administrador}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                        <p className="text-gray-900">{selectedInmobiliaria.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                        <p className="text-gray-900">{selectedInmobiliaria.telefono}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad:</label>
                        <p className="text-gray-900">{selectedInmobiliaria.ciudad}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan:</label>
                        <p className="text-gray-900">{selectedInmobiliaria.plan}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      {selectedInmobiliaria.estado === "activa" && (
                        <button
                          onClick={() => handleChangeEstado(selectedInmobiliaria.id, "suspendida")}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#1E5F73] transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? "Procesando..." : "Suspender"}
                        </button>
                      )}
                      {selectedInmobiliaria.estado === "suspendida" && (
                        <button
                          onClick={() => handleChangeEstado(selectedInmobiliaria.id, "activa")}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#1E5F73] transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? "Procesando..." : "Activar"}
                        </button>
                      )}
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </>
              )}

              {modalType === "delete" && selectedInmobiliaria && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Eliminar Inmobiliaria</h2>
                  <p className="text-gray-600 mb-6">
                    ¿Estás seguro de que deseas eliminar la inmobiliaria <strong>{selectedInmobiliaria.nombre}</strong>?
                    Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        setInmobiliarias((prev) => prev.filter((i) => i.id !== selectedInmobiliaria.id))
                        closeModal()
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
