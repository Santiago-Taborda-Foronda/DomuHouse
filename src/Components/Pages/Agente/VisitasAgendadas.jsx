"use client"

import { useState, useEffect } from "react"
import { Eye, Edit, Trash2, Search, Calendar, Clock, User, X, Check, AlertTriangle, Loader2 } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"
import { Header } from "../../Layouts/Header/Header"

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
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ----------------------- AGENT ID ------------------------------ */
  const [agentId, setAgentId] = useState(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("agentId") : null
    if (stored) setAgentId(stored)
    /* Si manejas JWT, obtén el id aquí y llama setAgentId(decodedId) */
  }, [])

  const toggleAgentSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

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

  // Fetch de visitas desde el backend
  useEffect(() => {
    if (!agentId) return

    async function fetchVisits() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`https://domuhouse.onrender.com/api/agents/${agentId}/visits`)

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()

        // Transformar la respuesta del backend al formato que espera el frontend
        const formattedVisits =
          data.visits?.map((v) => ({
            id: v.visitId,
            cliente: v.clientName,
            propiedad: v.propertyTitle,
            fecha: v.visitDate.split("T")[0], // "2025-07-03"
            hora: v.visitTime, // "14:00:00"
            estado: v.visitStatus,
            telefono: v.clientPhone || "",
            email: v.clientEmail || "", // Agregar si está disponible en el backend
            direccion: v.propertyAddress || "",
            notas: v.notes || "", // Agregar si está disponible en el backend
          })) || []

        setVisits(formattedVisits)
      } catch (error) {
        console.error("Error al cargar visitas:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [agentId])

  /* FUNCIONES PARA CAMBIAR ESTADO, ACTUALIZAR Y ELIMINAR VISITA */
  async function changeVisitStatus(visitId, newStatus) {
    try {
      const response = await fetch(`https://domuhouse.onrender.com/api/visits/${visitId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // "Pendiente", "Confirmada" o "Cancelada"
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Estado actualizado:", data)
      return data
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      throw error
    }
  }

  async function editVisit(visitId, updatedData) {
    try {
      const response = await fetch(`https://domuhouse.onrender.com/api/visits/${visitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Visita actualizada:", data)
      return data
    } catch (error) {
      console.error("Error al editar visita:", error)
      throw error
    }
  }

  async function deleteVisit(visitId) {
    try {
      const response = await fetch(`https://domuhouse.onrender.com/api/visits/${visitId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Visita eliminada:", data)
      return data
    } catch (error) {
      console.error("Error al eliminar visita:", error)
      throw error
    }
  }

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

  // Handler actualizado para confirmar visita usando changeVisitStatus
  const handleSaveConfirmation = async () => {
    if (!selectedVisit) return

    setIsSubmitting(true)
    try {
      // Usar la función changeVisitStatus
      await changeVisitStatus(selectedVisit.id, "Confirmada")

      // Actualizar el estado local
      setVisits(visits.map((v) => (v.id === selectedVisit.id ? { ...v, estado: "Confirmada" } : v)))

      setShowConfirmModal(false)
      setSelectedVisit(null)
    } catch (error) {
      console.error("Error al confirmar visita:", error)
      alert("Error al confirmar la visita: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler actualizado para editar visita usando editVisit
  const handleSaveEdit = async () => {
    if (!selectedVisit) return

    setIsSubmitting(true)
    try {
      // Preparar los datos para enviar al backend
      const updatedData = {
        clientName: editForm.cliente,
        propertyTitle: editForm.propiedad,
        visitDate: editForm.fecha,
        visitTime: editForm.hora,
        visitStatus: editForm.estado,
        clientPhone: editForm.telefono,
        clientEmail: editForm.email,
        propertyAddress: editForm.direccion,
        notes: editForm.notas,
      }

      // Usar la función editVisit
      await editVisit(selectedVisit.id, updatedData)

      // Actualizar el estado local
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
      alert("Error al actualizar la visita: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler actualizado para eliminar visita usando deleteVisit
  const confirmDelete = async () => {
    if (!selectedVisit) return

    setIsSubmitting(true)
    try {
      // Usar la función deleteVisit
      await deleteVisit(selectedVisit.id)

      // Actualizar el estado local
      setVisits(visits.filter((v) => v.id !== selectedVisit.id))
      setShowDeleteModal(false)
      setSelectedVisit(null)
    } catch (error) {
      console.error("Error al eliminar visita:", error)
      alert("Error al eliminar la visita: " + error.message)
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

  // Función para recargar las visitas
  const refreshVisits = async () => {
    if (!agentId) return

    try {
      setLoading(true)
      const res = await fetch(`https://domuhouse.onrender.com/api/agents/${agentId}/visits`)

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()

      const formattedVisits =
        data.visits?.map((v) => ({
          id: v.visitId,
          cliente: v.clientName,
          propiedad: v.propertyTitle,
          fecha: v.visitDate.split("T")[0],
          hora: v.visitTime,
          estado: v.visitStatus,
          telefono: v.clientPhone || "",
          email: v.clientEmail || "",
          direccion: v.propertyAddress || "",
          notas: v.notes || "",
        })) || []

      setVisits(formattedVisits)
      setError(null)
    } catch (error) {
      console.error("Error al recargar visitas:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para cambiar estado rápidamente desde la tabla
  /*
  const handleQuickStatusChange = async (visit, newStatus) => {
    try {
      await changeVisitStatus(visit.id, newStatus)

      // Actualizar el estado local
      setVisits(visits.map((v) => (v.id === visit.id ? { ...v, estado: newStatus } : v)))
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      alert("Error al cambiar el estado: " + error.message)
    }
  }
  */

  // Mostrar loading
  if (loading) {
    return (
      <>
        <Header toggleAgentSidebar={toggleAgentSidebar} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#2F8EAC] mx-auto mb-4" />
            <p className="text-gray-600">Cargando visitas...</p>
          </div>
        </div>
      </>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <>
        <Header toggleAgentSidebar={toggleAgentSidebar} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar visitas</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshVisits}
              className="bg-[#2F8EAC] text-white px-4 py-2 rounded-lg hover:bg-[#267a95] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </>
    )
  }

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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Visitas Agendadas</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestiona y controla todas las visitas programadas ({filteredVisits.length} visitas)
                </p>
              </div>
              <button
                onClick={refreshVisits}
                className="bg-[#2F8EAC] text-white px-4 py-2 rounded-lg hover:bg-[#267a95] transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Actualizar
              </button>
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar visitas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  >
                    <option value="Todos">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{visits.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Visitas</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-[#2F8EAC]">
                  {visits.filter((v) => v.estado === "Pendiente").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Pendientes</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {visits.filter((v) => v.estado === "Confirmada").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Confirmadas</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-cyan-500">
                  {
                    visits.filter((v) => {
                      const today = new Date().toISOString().split("T")[0]
                      return v.fecha === today
                    }).length
                  }
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Hoy</p>
              </div>
            </div>

            {/* Tabla de visitas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Lista de Visitas</h3>
                <p className="text-sm text-gray-500">Gestiona y controla todas las visitas programadas</p>
              </div>

              {filteredVisits.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay visitas programadas</h3>
                  <p className="text-gray-500 mb-4">
                    {visits.length === 0
                      ? "Aún no tienes visitas agendadas."
                      : "No se encontraron visitas con los filtros seleccionados."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Vista de tarjetas para móvil y tablet */}
                  <div className="block lg:hidden">
                    {filteredVisits.map((visit) => (
                      <div key={visit.id} className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">{visit.cliente}</p>
                                <p className="text-xs text-gray-500">{visit.propiedad}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    {visit.fecha}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Clock className="w-3 h-3" />
                                    {visit.hora}
                                  </div>
                                </div>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.estado)}`}
                                >
                                  {visit.estado}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 mt-3">
                              <button
                                onClick={() => handleConfirmVisit(visit)}
                                className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleEditVisit(visit)}
                                className="p-1.5 sm:p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Editar visita"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteVisit(visit)}
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar visita"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
                            Fecha y Hora
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredVisits.map((visit) => (
                          <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{visit.cliente}</div>
                                  <div className="text-xs text-gray-500">{visit.telefono}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{visit.propiedad}</div>
                                <div className="text-xs text-gray-500">{visit.direccion}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                <div className="flex items-center gap-1 mb-1">
                                  <Calendar className="w-3 h-3" />
                                  {visit.fecha}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {visit.hora}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.estado)}`}
                              >
                                {visit.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleConfirmVisit(visit)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditVisit(visit)}
                                  className="p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Editar visita"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteVisit(visit)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar visita"
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
                </>
              )}
            </div>
          </div>
        </main>

        {/* Modal de Ver/Confirmar Visita */}
        {showConfirmModal && selectedVisit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModals()
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Detalles de la Visita</h3>
                  <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                    <input
                      type="text"
                      value={selectedVisit.cliente}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Propiedad</label>
                    <input
                      type="text"
                      value={selectedVisit.propiedad}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                      <input
                        type="date"
                        value={selectedVisit.fecha}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                      <input
                        type="text"
                        value={selectedVisit.hora}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedVisit.estado)}`}
                    >
                      {selectedVisit.estado}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="text"
                      value={selectedVisit.telefono}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={selectedVisit.direccion}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                    <textarea
                      rows={3}
                      value={selectedVisit.notas}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleSaveConfirmation}
                    disabled={isSubmitting || selectedVisit.estado === "Confirmada"}
                    className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting || selectedVisit.estado === "Confirmada"
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirmando...
                      </>
                    ) : selectedVisit.estado === "Confirmada" ? (
                      <>
                        <Check className="w-4 h-4" />
                        Ya Confirmada
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Confirmar Visita
                      </>
                    )}
                  </button>
                  <button
                    onClick={closeModals}
                    className="w-full sm:flex-1 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Editar Visita */}
        {showEditModal && selectedVisit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModals()
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Editar Visita</h2>
                  <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitSuccess && (
                  <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                    ¡Visita actualizada exitosamente!
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cliente:</label>
                      <input
                        type="text"
                        name="cliente"
                        value={editForm.cliente}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Propiedad:</label>
                      <input
                        type="text"
                        name="propiedad"
                        value={editForm.propiedad}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono:</label>
                      <input
                        type="text"
                        name="telefono"
                        value={editForm.telefono}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección:</label>
                    <input
                      type="text"
                      name="direccion"
                      value={editForm.direccion}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha:</label>
                      <input
                        type="date"
                        name="fecha"
                        value={editForm.fecha}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora:</label>
                      <input
                        type="time"
                        name="hora"
                        value={editForm.hora}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado:</label>
                      <select
                        name="estado"
                        value={editForm.estado}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas:</label>
                    <textarea
                      name="notas"
                      value={editForm.notas}
                      onChange={handleEditFormChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={closeModals}
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSubmitting}
                      className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                        isSubmitting
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        {showDeleteModal && selectedVisit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-75 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModals()
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Confirmar Eliminación
                  </h2>
                  <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-600 mb-4">
                    ¿Estás seguro de que deseas eliminar la visita de <strong>{selectedVisit.cliente}</strong> para la
                    propiedad <strong>{selectedVisit.propiedad}</strong>?
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-600">Esta acción no se puede deshacer.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModals}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isSubmitting}
                    className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}