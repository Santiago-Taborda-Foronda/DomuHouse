"use client"

import { useState, useEffect } from "react"
import { UserCheck, Plus, Edit, Trash2, Eye, Search, Filter, Building2 } from "lucide-react"
import { Header } from "../../../Layouts/Header/Header"
import { SidebarSuperAdmin } from "../../../Layouts/SidebarSuperAdmin/SidebarSuperAdmin"

// Datos simulados de administradores
const administradoresData = [
  {
    id: 1,
    nombre: "Carlos Rodríguez",
    email: "carlos@premium.com",
    telefono: "+57 300 123 4567",
    inmobiliaria: "Inmobiliaria Premium",
    inmobiliariaId: 1,
    fechaRegistro: "2024-01-15",
    ultimoAcceso: "2024-03-15 14:30",
    estado: "activo",
    propiedadesGestionadas: 45,
    agentesACargo: 8,
    ventasUltimoMes: 12,
  },
  {
    id: 2,
    nombre: "María González",
    email: "maria@casasnorte.com",
    telefono: "+57 301 987 6543",
    inmobiliaria: "Casas del Norte",
    inmobiliariaId: 2,
    fechaRegistro: "2024-02-20",
    ultimoAcceso: "2024-03-14 09:15",
    estado: "activo",
    propiedadesGestionadas: 32,
    agentesACargo: 5,
    ventasUltimoMes: 8,
  },
  {
    id: 3,
    nombre: "Juan Martínez",
    email: "juan@elite.com",
    telefono: "+57 302 456 7890",
    inmobiliaria: "Propiedades Elite",
    inmobiliariaId: 3,
    fechaRegistro: "2023-11-10",
    ultimoAcceso: "2024-03-15 16:45",
    estado: "activo",
    propiedadesGestionadas: 67,
    agentesACargo: 12,
    ventasUltimoMes: 18,
  },
  {
    id: 4,
    nombre: "Ana López",
    email: "ana@bienesur.com",
    telefono: "+57 303 789 0123",
    inmobiliaria: "Bienes Raíces Sur",
    inmobiliariaId: 4,
    fechaRegistro: "2024-01-05",
    ultimoAcceso: "2024-02-28 11:20",
    estado: "inactivo",
    propiedadesGestionadas: 28,
    agentesACargo: 4,
    ventasUltimoMes: 3,
  },
]

export const GestionAdministradores = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [administradores, setAdministradores] = useState(administradoresData)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState(null)
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

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800"
      case "inactivo":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filtrar administradores
  const administradoresFiltrados = administradores.filter((admin) => {
    const matchEstado = filtroEstado === "todos" || admin.estado === filtroEstado
    const matchBusqueda =
      admin.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      admin.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      admin.inmobiliaria.toLowerCase().includes(busqueda.toLowerCase())
    return matchEstado && matchBusqueda
  })

  // Funciones para manejar modales
  const handleViewAdmin = (admin) => {
    setSelectedAdmin(admin)
    setModalType("view")
    setShowModal(true)
  }

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin)
    setModalType("edit")
    setShowModal(true)
  }

  const handleDeleteAdmin = (admin) => {
    setSelectedAdmin(admin)
    setModalType("delete")
    setShowModal(true)
  }

  const handleCreateAdmin = () => {
    setSelectedAdmin(null)
    setModalType("create")
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAdmin(null)
    setModalType("")
  }

  // Función para cambiar estado de administrador
  const handleChangeEstado = async (id, nuevoEstado) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAdministradores((prev) => prev.map((admin) => (admin.id === id ? { ...admin, estado: nuevoEstado } : admin)))
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Administradores</h1>
                <p className="text-gray-600 text-sm mt-1">Administra todos los administradores de inmobiliarias</p>
              </div>
              <button
                onClick={handleCreateAdmin}
                className="flex items-center gap-2 bg-[#2F8EAC] text-white px-4 py-2 rounded-xl hover:bg-[#1E5F73] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo Administrador
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
                    placeholder="Buscar por nombre, email o inmobiliaria..."
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
                    <option value="todos">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2F8EAC]/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-[#2F8EAC]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {administradores.filter((a) => a.estado === "activo").length}
                    </p>
                    <p className="text-sm text-gray-600">Activos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E5F73]/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-[#1E5F73]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {administradores.filter((a) => a.estado === "inactivo").length}
                    </p>
                    <p className="text-sm text-gray-600">Inactivos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4BA3C7]/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#4BA3C7]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {administradores.reduce((sum, a) => sum + a.propiedadesGestionadas, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Propiedades</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2F8EAC]/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-[#2F8EAC]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{administradores.length}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de administradores */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Administradores ({administradoresFiltrados.length})
                </h2>
              </div>

              {/* Vista móvil - Cards */}
              <div className="block lg:hidden">
                {administradoresFiltrados.map((admin) => (
                  <div key={admin.id} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{admin.nombre}</h3>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                        <p className="text-sm text-gray-500">{admin.inmobiliaria}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(admin.estado)}`}
                      >
                        {admin.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Propiedades:</span>
                        <span className="ml-1 font-medium">{admin.propiedadesGestionadas}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Agentes:</span>
                        <span className="ml-1 font-medium">{admin.agentesACargo}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ventas mes:</span>
                        <span className="ml-1 font-medium">{admin.ventasUltimoMes}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Último acceso:</span>
                        <span className="ml-1 font-medium text-xs">{admin.ultimoAcceso.split(" ")[0]}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewAdmin(admin)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin)}
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
                        Administrador
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Inmobiliaria
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Gestión
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Último Acceso
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {administradoresFiltrados.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{admin.nombre}</div>
                            <div className="text-sm text-gray-600">{admin.email}</div>
                            <div className="text-xs text-gray-500">{admin.telefono}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{admin.inmobiliaria}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(admin.estado)}`}
                          >
                            {admin.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{admin.propiedadesGestionadas} propiedades</div>
                          <div className="text-xs text-gray-500">
                            {admin.agentesACargo} agentes • {admin.ventasUltimoMes} ventas
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.ultimoAcceso}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewAdmin(admin)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditAdmin(admin)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin)}
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
              {modalType === "view" && selectedAdmin && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles del Administrador</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                        <p className="text-gray-900">{selectedAdmin.nombre}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                        <p className="text-gray-900">{selectedAdmin.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                        <p className="text-gray-900">{selectedAdmin.telefono}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inmobiliaria:</label>
                        <p className="text-gray-900">{selectedAdmin.inmobiliaria}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Registro:</label>
                        <p className="text-gray-900">{selectedAdmin.fechaRegistro}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Último Acceso:</label>
                        <p className="text-gray-900">{selectedAdmin.ultimoAcceso}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{selectedAdmin.propiedadesGestionadas}</p>
                        <p className="text-sm text-gray-600">Propiedades</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedAdmin.agentesACargo}</p>
                        <p className="text-sm text-gray-600">Agentes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedAdmin.ventasUltimoMes}</p>
                        <p className="text-sm text-gray-600">Ventas este mes</p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      {selectedAdmin.estado === "activo" && (
                        <button
                          onClick={() => handleChangeEstado(selectedAdmin.id, "inactivo")}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-[#D92B2B] text-white rounded-lg hover:bg-[#B32121] transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? "Procesando..." : "Desactivar"}
                        </button>
                      )}
                      {selectedAdmin.estado === "inactivo" && (
                        <button
                          onClick={() => handleChangeEstado(selectedAdmin.id, "activo")}
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

              {modalType === "delete" && selectedAdmin && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Eliminar Administrador</h2>
                  <p className="text-gray-600 mb-6">
                    ¿Estás seguro de que deseas eliminar al administrador <strong>{selectedAdmin.nombre}</strong>? Esta
                    acción no se puede deshacer y afectará la gestión de <strong>{selectedAdmin.inmobiliaria}</strong>.
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
                        setAdministradores((prev) => prev.filter((a) => a.id !== selectedAdmin.id))
                        closeModal()
                      }}
                      className="flex-1 px-4 py-2 bg-[#D92B2B] text-white rounded-lg hover:bg-[#B32121] transition-colors"
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
