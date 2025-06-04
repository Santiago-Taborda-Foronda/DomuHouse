import { useState } from "react"
import { Eye, Edit, Trash2, Menu, Search, Calendar, Clock, User, X, Check, AlertTriangle } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"

export default function VisitasAgendadas() {
  const [activeSection, setActiveSection] = useState("Visitas Agendadas")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [visits, setVisits] = useState([
    {
      id: 1,
      cliente: "Luis Torres",
      propiedad: "Casa 01",
      fecha: "2024-03-20",
      hora: "10:00 AM",
      estado: "Pendiente",
      telefono: "+57 300 123 4567",
      email: "luis.torres@email.com",
      direccion: "Calle 123 #45-67, Armenia",
      notas: "",
    },
    {
      id: 2,
      cliente: "Juan Ruiz",
      propiedad: "Casa 02",
      fecha: "2024-03-21",
      hora: "2:00 PM",
      estado: "Cancelada",
      telefono: "+57 301 234 5678",
      email: "juan.ruiz@email.com",
      direccion: "Carrera 45 #12-34, Armenia",
      notas: "",
    },
    {
      id: 3,
      cliente: "Andrés Ríos",
      propiedad: "Casa 03",
      fecha: "2024-03-20",
      hora: "4:00 PM",
      estado: "Confirmada",
      telefono: "+57 302 345 6789",
      email: "andres.rios@email.com",
      direccion: "Avenida 68 #23-45, Armenia",
      notas: "",
    },
  ])

  const [editForm, setEditForm] = useState({
    cliente: "",
    propiedad: "",
    fecha: "",
    hora: "",
    estado: "",
    telefono: "",
    email: "",
    direccion: "",
    notas: "",
  })

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.propiedad.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "Todos" || visit.estado === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmada":
        return "bg-blue-100 text-[#2F8EAC]"
      case "Pendiente":
        return "bg-blue-100 text-blue-800"
      case "Cancelada":
        return "bg-sky-100 text-sky-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleConfirmVisit = (visit) => {
    setSelectedVisit(visit)
    setShowConfirmModal(true)
  }

  const handleEditVisit = (visit) => {
    setSelectedVisit(visit)
    setEditForm({
      cliente: visit.cliente,
      propiedad: visit.propiedad,
      fecha: visit.fecha,
      hora: visit.hora,
      estado: visit.estado,
      telefono: visit.telefono,
      email: visit.email,
      direccion: visit.direccion,
      notas: visit.notas || "",
    })
    setShowEditModal(true)
    setSubmitSuccess(false)
  }

  const handleDeleteVisit = (visit) => {
    setSelectedVisit(visit)
    setShowDeleteModal(true)
  }

  const handleSaveConfirmation = () => {
    // Aquí iría la lógica para confirmar la visita
    console.log("Confirmando visita:", selectedVisit)
    setShowConfirmModal(false)
    setSelectedVisit(null)
  }

  const handleSaveEdit = async () => {
    setIsSubmitting(true)
    try {
      // Simulación de actualización
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedVisits = visits.map((v) => {
        if (v.id === selectedVisit.id) {
          return {
            ...v,
            cliente: editForm.cliente,
            propiedad: editForm.propiedad,
            fecha: editForm.fecha,
            hora: editForm.hora,
            estado: editForm.estado,
            telefono: editForm.telefono,
            email: editForm.email,
            direccion: editForm.direccion,
            notas: editForm.notas,
          }
        }
        return v
      })

      setVisits(updatedVisits)
      setSubmitSuccess(true)

      setTimeout(() => {
        setShowEditModal(false)
        setSelectedVisit(null)
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error al actualizar visita:", error)
      alert("Error al actualizar la visita")
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    setIsSubmitting(true)
    try {
      // Simulación de eliminación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setVisits(visits.filter((v) => v.id !== selectedVisit.id))
      setShowDeleteModal(false)
      setSelectedVisit(null)
    } catch (error) {
      console.error("Error al eliminar visita:", error)
      alert("Error al eliminar la visita")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const closeModals = () => {
    setShowConfirmModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedVisit(null)
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
          <h1 className="text-lg font-semibold text-gray-800">Visitas Agendadas</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Visitas Agendadas</h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar visitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-gray-900">{visits.length}</p>
                <p className="text-sm text-gray-600">Total Visitas</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-sky-600">
                  {visits.filter((v) => v.estado === "Pendiente").length}
                </p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-sky-500">
                  {visits.filter((v) => v.estado === "Confirmada").length}
                </p>
                <p className="text-sm text-gray-600">Confirmadas</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-[#2F8EAC]">
                  {visits.filter((v) => v.fecha === "2024-03-20").length}
                </p>
                <p className="text-sm text-gray-600">Hoy</p>
              </div>
            </div>
          </div>

          {/* Visits Table/Cards */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {filteredVisits.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No se encontraron visitas</div>
              ) : (
                filteredVisits.map((visit) => (
                  <div key={visit.id} className="p-4 border-b last:border-b-0">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{visit.cliente}</h3>
                          <p className="text-xs text-gray-500">{visit.propiedad}</p>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(visit.estado)}`}
                        >
                          {visit.estado}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {visit.fecha}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {visit.hora}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleConfirmVisit(visit)}
                            className="text-[#2F8EAC] hover:text-[#256b82] p-1"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditVisit(visit)}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVisit(visit)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVisits.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron visitas
                      </td>
                    </tr>
                  ) : (
                    filteredVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{visit.cliente}</p>
                              <p className="text-xs text-gray-500">{visit.telefono}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{visit.propiedad}</p>
                            <p className="text-xs text-gray-500">{visit.direccion}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm text-gray-900">{visit.fecha}</p>
                            <p className="text-xs text-gray-500">{visit.hora}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(visit.estado)}`}
                          >
                            {visit.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleConfirmVisit(visit)}
                              className="text-[#2F8EAC] hover:text-[#256b82] p-1"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditVisit(visit)}
                              className="text-gray-600 hover:text-gray-800 p-1"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteVisit(visit)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View/Confirm Visit Modal */}
      {showConfirmModal && selectedVisit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModals()
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Detalles de la Visita</h3>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    value={selectedVisit.cliente}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad</label>
                  <input
                    type="text"
                    value={selectedVisit.propiedad}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={selectedVisit.fecha}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input
                      type="time"
                      value="10:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedVisit.estado)}`}
                  >
                    {selectedVisit.estado}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                  <textarea
                    rows={3}
                    placeholder="Agregar notas sobre la visita..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveConfirmation}
                  className="flex-1 bg-[#2F8EAC] text-white py-2 px-4 rounded-lg hover:bg-[#256b82] transition-colors"
                >
                  Confirmar Visita
                </button>
                <button
                  onClick={closeModals}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Visit Modal */}
      {showEditModal && selectedVisit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModals()
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Editar Visita</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                  ¡Visita actualizada exitosamente!
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente:</label>
                    <input
                      type="text"
                      name="cliente"
                      value={editForm.cliente}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad:</label>
                    <input
                      type="text"
                      name="propiedad"
                      value={editForm.propiedad}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                    <input
                      type="text"
                      name="telefono"
                      value={editForm.telefono}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección:</label>
                  <input
                    type="text"
                    name="direccion"
                    value={editForm.direccion}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha:</label>
                    <input
                      type="date"
                      name="fecha"
                      value={editForm.fecha}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora:</label>
                    <input
                      type="text"
                      name="hora"
                      value={editForm.hora}
                      onChange={handleEditFormChange}
                      placeholder="10:00 AM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                    <select
                      name="estado"
                      value={editForm.estado}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas:</label>
                  <textarea
                    name="notas"
                    value={editForm.notas}
                    onChange={handleEditFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeModals}
                    disabled={isSubmitting}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#2F8EAC] text-white hover:bg-[#256b82]"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVisit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModals()
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Confirmar Eliminación
                </h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  ¿Estás seguro de que deseas eliminar la visita de <strong>{selectedVisit.cliente}</strong> para la
                  propiedad <strong>{selectedVisit.propiedad}</strong>?
                </p>
                <p className="text-sm text-red-600">Esta acción no se puede deshacer.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModals}
                  disabled={isSubmitting}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {isSubmitting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
