import { useState } from "react"
import { Eye, Edit, Trash2, Menu, Search, Plus } from "lucide-react"
import AgentSideBar from "./Components/AgentSideBar"

export default function MisPropiedades() {
  const [activeSection, setActiveSection] = useState("Mis Propiedades")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")

  const properties = [
    {
      id: 1,
      name: "Casa 01",
      status: "Publicado",
      date: "2024-03-20",
      type: "Casa",
      image: "/placeholder.svg?height=80&width=120",
      price: "$250,000",
      location: "Zona Norte",
    },
    {
      id: 2,
      name: "Casa 02",
      status: "Pendiente",
      date: "2024-03-20",
      type: "Casa",
      image: "/placeholder.svg?height=80&width=120",
      price: "$180,000",
      location: "Centro",
    },
    {
      id: 3,
      name: "Casa 03",
      status: "Publicado",
      date: "2024-03-03",
      type: "Casa",
      image: "/placeholder.svg?height=80&width=120",
      price: "$320,000",
      location: "Zona Sur",
    },
    {
      id: 4,
      name: "Casa 04",
      status: "Pendiente",
      date: "2024-03-21",
      type: "Casa",
      image: "/placeholder.svg?height=80&width=120",
      price: "$195,000",
      location: "Zona Este",
    },
  ]

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "Todos" || property.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    return status === "Publicado" ? "bg-blue-100 text-blue-800" : "bg-blue-50 text-blue-950"
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
          <h1 className="text-lg font-semibold text-gray-800">Mis Propiedades</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Mis Propiedades</h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar propiedades..."
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
                  <option value="Publicado">Publicado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>

                <button className="px-4 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#256b82] transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nueva Propiedad</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                <p className="text-sm text-gray-600">Total Propiedades</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-sky-600">
                  {properties.filter((p) => p.status === "Publicado").length}
                </p>
                <p className="text-sm text-gray-600">Publicadas</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-sky-500">
                  {properties.filter((p) => p.status === "Pendiente").length}
                </p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-[#2F8EAC]">
                  {Math.round((properties.filter((p) => p.status === "Publicado").length / properties.length) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Tasa Publicación</p>
              </div>
            </div>
          </div>

          {/* Properties Table/Cards */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {filteredProperties.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No se encontraron propiedades</div>
              ) : (
                filteredProperties.map((property) => (
                  <div key={property.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.name}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 truncate">{property.name}</h3>
                            <p className="text-xs text-gray-500">
                              {property.type} • {property.location}
                            </p>
                            <p className="text-sm font-semibold text-[#2F8EAC] mt-1">{property.price}</p>
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}
                          >
                            {property.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600">{property.date}</p>
                          <div className="flex items-center space-x-2">
                            <button className="text-[#2F8EAC] hover:text-[#256b82] p-1">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 p-1">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron propiedades
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <img
                              src={property.image || "/placeholder.svg"}
                              alt={property.name}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{property.name}</p>
                              <p className="text-xs text-gray-500">{property.type} • {property.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2F8EAC]">{property.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-[#2F8EAC] hover:text-[#256b82] p-1">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 p-1">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800 p-1">
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
    </div>
  )
}
