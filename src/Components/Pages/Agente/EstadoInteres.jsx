"use client"

import { useState } from "react"
import { Search, Edit, Check, X, TrendingUp, Users } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"
import { Header } from "../../Layouts/Header/Header"

export default function EstadoInteres() {
  const [activeSection, setActiveSection] = useState("Estado De Interés")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [selectedClient, setSelectedClient] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const toggleAgentSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: "Luis Torres",
      propiedad: "Casa 01",
      estadoInteres: "Interesado",
      telefono: "+57 300 123 4567",
      email: "luis23@gmail.com",
      ultimaActualizacion: "2024-03-15",
    },
    {
      id: 2,
      nombre: "Juan Ruiz",
      propiedad: "Casa 02",
      estadoInteres: "En negociación",
      telefono: "+57 301 234 5678",
      email: "juan22@gmail.com",
      ultimaActualizacion: "2024-03-18",
    },
    {
      id: 3,
      nombre: "Andrés Ríos",
      propiedad: "Casa 03",
      estadoInteres: "No interesado",
      telefono: "+57 302 345 6789",
      email: "andres@gmail.com",
      ultimaActualizacion: "2024-03-20",
    },
    {
      id: 4,
      nombre: "María González",
      propiedad: "Apartamento 01",
      estadoInteres: "Interesado",
      telefono: "+57 303 456 7890",
      email: "maria.gonzalez@email.com",
      ultimaActualizacion: "2024-03-12",
    },
    {
      id: 5,
      nombre: "Carlos Mendoza",
      propiedad: "Local Comercial 01",
      estadoInteres: "Comprado",
      telefono: "+57 304 567 8901",
      email: "carlos.mendoza@email.com",
      ultimaActualizacion: "2024-03-10",
    },
  ])

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.propiedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.estadoInteres.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "Todos" || cliente.estadoInteres === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleEditStatus = (cliente) => {
    setSelectedClient(cliente)
    setNewStatus(cliente.estadoInteres)
    setSubmitSuccess(false)
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      alert("Por favor selecciona un estado de interés")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulación de actualización
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updateData = {
        clienteId: selectedClient.id,
        clienteNombre: selectedClient.nombre,
        propiedad: selectedClient.propiedad,
        estadoAnterior: selectedClient.estadoInteres,
        estadoNuevo: newStatus,
        fechaActualizacion: new Date().toISOString(),
      }

      console.log("Estado actualizado:", updateData)

      // Actualizar el estado en la lista local
      const updatedClientes = clientes.map((c) => {
        if (c.id === selectedClient.id) {
          return { ...c, estadoInteres: newStatus, ultimaActualizacion: new Date().toISOString().split("T")[0] }
        }
        return c
      })

      setClientes(updatedClientes)
      setSubmitSuccess(true)

      // Limpiar después de 2 segundos
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedClient(null)
      }, 2000)
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      alert("Error al actualizar el estado. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedClient(null)
    setNewStatus("")
    setSubmitSuccess(false)
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Interesado":
        return "bg-blue-100 text-[#2F8EAC]"
      case "En negociación":
        return "bg-yellow-100 text-yellow-800"
      case "No interesado":
        return "bg-red-100 text-red-800"
      case "Comprado":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const estadosInteres = ["Interesado", "En negociación", "No interesado", "Comprado", "Pendiente"]

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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Estado de Interés</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestiona el estado de interés de tus clientes ({filteredClientes.length} clientes)
                </p>
              </div>
            </div>

            {/* Panel de búsqueda y filtros */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">Búsqueda y filtros</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
                  <div className="relative">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Interés</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  >
                    <option value="Todos">Todos los estados</option>
                    {estadosInteres.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{clientes.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Clientes</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-[#2F8EAC]">
                  {clientes.filter((c) => c.estadoInteres === "Interesado").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Interesados</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {clientes.filter((c) => c.estadoInteres === "En negociación").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">En Negociación</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {clientes.filter((c) => c.estadoInteres === "Comprado").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Comprados</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {clientes.filter((c) => c.estadoInteres === "No interesado").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">No Interesados</p>
              </div>
            </div>

            {/* Tabla de clientes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Lista de Clientes</h3>
                <p className="text-sm text-gray-500">Gestiona el estado de interés de tus clientes</p>
              </div>

              {filteredClientes.length === 0 ? (
                <div className="p-8 sm:p-12 text-center text-gray-500">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
                  <p className="text-gray-500">
                    {clientes.length === 0
                      ? "Aún no tienes clientes registrados."
                      : "No hay clientes que coincidan con los filtros seleccionados."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Vista de tarjetas para móvil y tablet */}
                  <div className="block lg:hidden">
                    {filteredClientes.map((cliente) => (
                      <div key={cliente.id} className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">{cliente.nombre}</p>
                                <p className="text-xs text-gray-500">{cliente.propiedad}</p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Última actualización: {cliente.ultimaActualizacion}
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cliente.estadoInteres)}`}
                                >
                                  {cliente.estadoInteres}
                                </span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <button
                                onClick={() => handleEditStatus(cliente)}
                                className="p-1.5 sm:p-2 text-[#2F8EAC] hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar estado"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
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
                            Propiedad
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Estado de Interés
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Última Actualización
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
                                  <TrendingUp className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{cliente.nombre}</div>
                                  <div className="text-xs text-gray-500">{cliente.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{cliente.propiedad}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(cliente.estadoInteres)}`}
                              >
                                {cliente.estadoInteres}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">{cliente.ultimaActualizacion}</div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleEditStatus(cliente)}
                                className="p-2 text-[#2F8EAC] hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar estado"
                              >
                                <Edit className="w-4 h-4" />
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

        {/* Modal de actualización de estado - Responsive */}
        {selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancel()
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Actualizar Estado</h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitSuccess && (
                  <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      ¡Estado actualizado exitosamente!
                    </div>
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cliente:</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-semibold">{selectedClient.nombre}</span>
                        <span className="text-gray-500 text-sm">{selectedClient.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Propiedad:</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="text-gray-700">{selectedClient.propiedad}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado Actual:</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedClient.estadoInteres)}`}
                      >
                        {selectedClient.estadoInteres}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo Estado de Interés:</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    >
                      {estadosInteres.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpdateStatus}
                      disabled={isSubmitting}
                      className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                        isSubmitting
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {isSubmitting ? "Actualizando..." : "Actualizar"}
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
