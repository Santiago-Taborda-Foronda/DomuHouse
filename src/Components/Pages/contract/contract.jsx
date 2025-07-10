"use client"
import { useState, useEffect } from "react"
import { FileText, Calendar, Eye, Edit, Trash2, Plus, Search, Upload, X } from "lucide-react"
import { Header } from "../../Layouts/Header/Header"
import { SidebarInmobiliaria } from "../../Layouts/SidebarInmobiliaria/SidebarInmobiliaria"

const API_BASE_URL = "http://localhost:10101/api/contracts"

export const Contract = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [filtroActivo, setFiltroActivo] = useState("Activos")
  const [contratos, setContratos] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Modales y selección
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedContrato, setSelectedContrato] = useState(null)

  // Estado inicial del formulario
  const initialFormState = {
    contract_name: "",
    contract_type: "Arrendamiento",
    status: "Activo",
    expiry_date: "",
    description: "",
  }

  // Formulario (nuevo o editar)
  const [newContrato, setNewContrato] = useState(initialFormState)
  const [selectedFiles, setSelectedFiles] = useState([])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const handleLogout = () => setIsAuthenticated(false)

  // Carga inicial de contratos
  useEffect(() => {
    fetchContratos()
  }, [])

  const fetchContratos = async () => {
    try {
      console.log("Cargando contratos...")
      const response = await fetch(API_BASE_URL)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rows = await response.json()
      console.log("Datos recibidos del servidor:", rows)

      // Agrupar archivos bajo cada contrato
      const grouped = []
      rows.forEach((r) => {
        const exist = grouped.find((c) => c.contract_id === r.contract_id)
        if (exist) {
          if (r.file_id) {
            exist.archivos.push({
              file_id: r.file_id,
              file_name: r.file_name,
              file_url: r.file_url,
            })
          }
        } else {
          grouped.push({
            contract_id: r.contract_id,
            person_id: r.person_id,
            property_id: r.property_id,
            contract_name: r.contract_name,
            contract_type: r.contract_type,
            status: r.status,
            expiry_date: r.expiry_date,
            description: r.description,
            archivos: r.file_id
              ? [
                  {
                    file_id: r.file_id,
                    file_name: r.file_name,
                    file_url: r.file_url,
                  },
                ]
              : [],
          })
        }
      })

      console.log("Contratos procesados:", grouped)
      // Debug: Ver qué URLs tenemos
      grouped.forEach((contrato) => {
        if (contrato.archivos && contrato.archivos.length > 0) {
          console.log(`Contrato ${contrato.contract_name} - Archivos:`, contrato.archivos)
          contrato.archivos.forEach((archivo) => {
            console.log(`- Archivo: ${archivo.file_name}, URL: ${archivo.file_url}`)
          })
        }
      })
      setContratos(grouped)
    } catch (error) {
      console.error("Error al cargar contratos:", error)
    }
  }

  const contratosFiltrados = contratos.filter((c) => {
    const okEstado =
      filtroActivo === "Todos" ||
      (filtroActivo === "Activos" && c.status === "Activo") ||
      (filtroActivo === "Finalizados" && c.status === "Finalizado")

    const okSearch =
      !searchTerm ||
      c.contract_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contract_type.toLowerCase().includes(searchTerm.toLowerCase())

    return okEstado && okSearch
  })

  // Badge
  const getBadgeEstado = (estado) =>
    estado === "Activo" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Finalizado
      </span>
    )

  // Handlers
  const handleView = (c) => {
    setSelectedContrato(c)
    setIsViewModalOpen(true)
  }

  const handleEdit = (c) => {
    setSelectedContrato(c)
    setNewContrato({
      contract_name: c.contract_name || "",
      contract_type: c.contract_type || "Arrendamiento",
      status: c.status || "Activo",
      expiry_date: c.expiry_date || "",
      description: c.description || "",
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (c) => {
    setSelectedContrato(c)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedContrato) return

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedContrato.contract_id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchContratos()
        setIsDeleteDialogOpen(false)
        setSelectedContrato(null)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // Form
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setNewContrato((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])
    }
  }

  const removeSelectedFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleSaveNewContrato = async () => {
    try {
      if (!newContrato.contract_name.trim()) {
        alert("Por favor ingresa el nombre del contrato")
        return
      }

      if (!newContrato.expiry_date) {
        alert("Por favor selecciona la fecha de vencimiento")
        return
      }

      console.log("Guardando contrato:", newContrato)
      const form = new FormData()

      // Agregar person_id por defecto (usar un ID que existe en tu base de datos)
      form.append("person_id", "2") // Usar el ID 2 que veo en tu base de datos

      // Agregar los campos del formulario
      Object.entries(newContrato).forEach(([k, v]) => form.append(k, v))
      selectedFiles.forEach((f) => form.append("files", f))

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        body: form,
      })

      if (response.ok) {
        await fetchContratos()
        setNewContrato(initialFormState)
        setSelectedFiles([])
        setIsUploadModalOpen(false)
        alert("Contrato guardado exitosamente")
      } else {
        const errorText = await response.text()
        alert(`Error al guardar: ${errorText}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const handleUpdateContrato = async () => {
    if (!selectedContrato) return

    try {
      const form = new FormData()

      // Agregar person_id por defecto
      form.append("person_id", "2")

      Object.entries(newContrato).forEach(([k, v]) => form.append(k, v))
      selectedFiles.forEach((f) => form.append("files", f))

      const response = await fetch(`${API_BASE_URL}/${selectedContrato.contract_id}`, {
        method: "PUT",
        body: form,
      })

      if (response.ok) {
        await fetchContratos()
        setNewContrato(initialFormState)
        setSelectedFiles([])
        setIsEditModalOpen(false)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const closeAllModals = () => {
    setIsUploadModalOpen(false)
    setIsViewModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteDialogOpen(false)
    setSelectedContrato(null)
    setSelectedFiles([])
    setNewContrato(initialFormState)
  }

  // Agregar este useEffect después del useEffect existente
  useEffect(() => {
    // Actualizar selectedContrato si existe y los contratos han cambiado
    if (selectedContrato && contratos.length > 0) {
      const updatedContrato = contratos.find((c) => c.contract_id === selectedContrato.contract_id)
      if (updatedContrato) {
        setSelectedContrato(updatedContrato)
      }
    }
  }, [contratos])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header hasSidebar={true} toggleSidebar={toggleSidebar} />

      {/* Layout principal con sidebar responsive */}
      <div className="flex pt-16">
        {/* Sidebar fijo para desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <SidebarInmobiliaria
            isOpen={true}
            toggleMenu={() => {}}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            isFixedLayout={true}
          />
        </div>

        {/* Sidebar overlay para móviles */}
        <SidebarInmobiliaria
          isOpen={isSidebarOpen}
          toggleMenu={toggleSidebar}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          isFixedLayout={false}
        />

        {/* Contenido principal con margen responsivo */}
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contratos y Reservas</h1>
                <p className="text-gray-600 text-sm mt-1">Gestiona todos tus contratos y reservas</p>
              </div>
              {/* Botón Subir Archivos */}
              <button
                className="flex items-center justify-center gap-2 bg-[#2F8EAC] text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-[#267a96] transition-colors font-medium w-full sm:w-auto"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Plus className="w-5 h-5" />
                <span className="sm:inline">Nuevo Contrato</span>
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar contratos..."
                  className="pl-10 pr-4 py-2 w-full rounded-xl border border-gray-300 focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Contenedor principal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tabs de filtrado */}
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex space-x-6 sm:space-x-8 px-4 sm:px-6 min-w-max sm:min-w-0">
                  {["Activos", "Finalizados", "Todos"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFiltroActivo(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        filtroActivo === tab
                          ? "border-[#2F8EAC] text-[#2F8EAC]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tabla de contratos - Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contrato
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha de Vencimiento
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Funciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contratosFiltrados.map((contrato) => (
                      <tr key={contrato.contract_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{contrato.contract_name}</div>
                              <div className="text-sm text-gray-500">{contrato.contract_type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getBadgeEstado(contrato.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            {contrato.expiry_date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button
                              className="text-[#2F8EAC] hover:text-[#267a96] transition-colors"
                              title="Ver"
                              onClick={() => handleView(contrato)}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              className="text-[#2F8EAC] hover:text-[#267a96] transition-colors"
                              title="Editar"
                              onClick={() => handleEdit(contrato)}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Eliminar"
                              onClick={() => handleDelete(contrato)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de tarjetas para móviles */}
              <div className="sm:hidden">
                {contratosFiltrados.map((contrato) => (
                  <div
                    key={contrato.contract_id}
                    className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center flex-1">
                        <FileText className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{contrato.contract_name}</div>
                          <div className="text-sm text-gray-500">{contrato.contract_type}</div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-3">{getBadgeEstado(contrato.status)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs sm:text-sm">{contrato.expiry_date}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-[#2F8EAC] hover:text-[#267a96] transition-colors p-1"
                          title="Ver"
                          onClick={() => handleView(contrato)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="text-[#2F8EAC] hover:text-[#267a96] transition-colors p-1"
                          title="Editar"
                          onClick={() => handleEdit(contrato)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Eliminar"
                          onClick={() => handleDelete(contrato)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensaje cuando no hay contratos */}
              {contratosFiltrados.length === 0 && (
                <div className="text-center py-12 px-4">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay contratos {filtroActivo.toLowerCase()}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {filtroActivo === "Activos"
                      ? "No tienes contratos activos en este momento."
                      : filtroActivo === "Finalizados"
                        ? "No hay contratos finalizados para mostrar."
                        : "No hay contratos que coincidan con tu búsqueda."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal para subir archivos */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Nuevo Contrato</h2>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Contrato <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contract_name"
                    value={newContrato.contract_name}
                    onChange={handleFormChange}
                    placeholder="Nombre del cliente o contrato"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      name="contract_type"
                      value={newContrato.contract_type}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                    >
                      <option value="Arrendamiento">Arrendamiento</option>
                      <option value="Venta">Venta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      name="status"
                      value={newContrato.status}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Vencimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={newContrato.expiry_date}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="description"
                    value={newContrato.description}
                    onChange={handleFormChange}
                    placeholder="Detalles del contrato"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Archivos</label>
                  <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg py-4 px-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Seleccionar archivos</span>
                    <input type="file" className="hidden" multiple onChange={handleFileChange} />
                  </label>
                  {/* Lista de archivos seleccionados */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNewContrato}
                  className="flex-1 px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a96] transition-colors font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver contrato */}
      {isViewModalOpen && selectedContrato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detalles del Contrato</h2>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedContrato.contract_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedContrato.contract_type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                    <div className="mt-1">{getBadgeEstado(selectedContrato.status)}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha de Vencimiento</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedContrato.expiry_date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedContrato.description || "Sin descripción"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Archivos</h3>
                  {selectedContrato.archivos && selectedContrato.archivos.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {selectedContrato.archivos.map((archivo, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{archivo.file_name}</span>
                          </div>
                          {/* Removed the "Ver" button */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">No hay archivos adjuntos</p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={closeAllModals}
                  className="w-full px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a96] transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar contrato */}
      {isEditModalOpen && selectedContrato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Editar Contrato</h2>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Contrato</label>
                  <input
                    type="text"
                    name="contract_name"
                    value={newContrato.contract_name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      name="contract_type"
                      value={newContrato.contract_type}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                    >
                      <option value="Arrendamiento">Arrendamiento</option>
                      <option value="Venta">Venta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      name="status"
                      value={newContrato.status}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={newContrato.expiry_date}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="description"
                    value={newContrato.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2F8EAC] focus:ring-2 focus:ring-[#2F8EAC] focus:ring-opacity-20 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Archivos Actuales</label>
                  {selectedContrato.archivos && selectedContrato.archivos.length > 0 ? (
                    <div className="space-y-2">
                      {selectedContrato.archivos.map((archivo, index) => (
                        <div key={index} className="flex items-center bg-gray-50 rounded-lg p-2">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{archivo.file_name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay archivos adjuntos</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Añadir Archivos</label>
                  <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg py-4 px-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Seleccionar archivos</span>
                    <input type="file" className="hidden" multiple onChange={handleFileChange} />
                  </label>
                  {/* Lista de archivos seleccionados */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateContrato}
                  className="flex-1 px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#267a96] transition-colors font-medium"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {isDeleteDialogOpen && selectedContrato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 text-center mb-2">¿Estás seguro?</h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Esta acción no se puede deshacer. Esto eliminará permanentemente el contrato
                <span className="font-medium text-gray-900"> "{selectedContrato.contract_name}"</span> y todos sus datos
                asociados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}