import { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  X,
  Check,
  AlertTriangle,
  Building2,
} from "lucide-react";
import AgentSideBar from "./Components/AgentSideBar";
import { Header } from "../../Layouts/Header/Header";
import { useNavigate } from "react-router-dom";

export default function MisPropiedades() {
  /* -------------------------------------------------- */
  /*  Estados y hooks                                   */
  /* -------------------------------------------------- */
  let navigate = useNavigate();

  /*‒‒‒ Navegación y UI ‒‒‒*/
  let [activeSection, setActiveSection] = useState("Mis Propiedades");
  let [sidebarOpen, setSidebarOpen] = useState(false);

  /*‒‒‒ Filtros ‒‒‒*/
  let [searchTerm, setSearchTerm] = useState("");
  let [filterStatus, setFilterStatus] = useState("Todos");

  /*‒‒‒ Propiedades y estado de red ‒‒‒*/
  let [properties, setProperties] = useState([]);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");

  /*‒‒‒ Modales ‒‒‒*/
  let [selectedProperty, setSelectedProperty] = useState(null);
  let [showViewModal, setShowViewModal] = useState(false);
  let [showEditModal, setShowEditModal] = useState(false);
  let [showDeleteModal, setShowDeleteModal] = useState(false);

  /*‒‒‒ Formulario de edición / eliminación ‒‒‒*/
  let [editForm, setEditForm] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    status: "",
    type: "",
    area: "",
    rooms: "",
    bathrooms: "",
  });
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [submitSuccess, setSubmitSuccess] = useState(false);

  /* -------------------------------------------------- */
  /*  Hook: Cargar propiedades del agente logueado      */
  /* -------------------------------------------------- */
  useEffect(() => {
    /* 1. Obtener datos del usuario almacenado después del login
          Asegúrate de que tu login haga:
          localStorage.setItem("user", JSON.stringify({ id, name_person, ... }));
    */
    let storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      setError("No se encontró la información del usuario. Inicia sesión de nuevo.");
      setLoading(false);
      return;
    }

    let user = JSON.parse(storedUser);
    let agentId = user?.person_id ?? user?.id; 

    if (!agentId) {
      setError("No se encontró el ID del agente. Inicia sesión de nuevo.");
      setLoading(false);
      return;
    }


    /* 3. Petición al backend */
    let fetchProperties = async () => {
      try {
        let res = await fetch(
          `http://localhost:10101/api/agents/${agentId}/properties`,
          {
            headers: {
              "Content-Type": "application/json",
              // Incluye tu token si el endpoint está protegido
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if (!res.ok) {
          let payload = {};
          try {
            payload = await res.json();
          } catch {
            /* ignore */
          }
          throw new Error(
            payload.error || payload.message || "Error en el servidor"
          );
        }

        let data = await res.json();

        /* 4. Mapeo al formato de la UI */
        let mapped = data.properties.map((p) => ({
          id: p.propertyId,
          name: p.property_title || p.address,
          status: p.status,
          date: p.publish_date
            ? p.publish_date.split("T")[0]
            : new Date().toISOString().split("T")[0],
          type: p.propertyType,
          image: p.image?.[0] || "/placeholder.svg?height=80&width=120",
          price: `$${Number(p.price).toLocaleString("es-CO")}`,
          location: p.address,
          description: p.description,
          area: p.built_area || "N/A",
          rooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          agent: user.name_person,
          phone: user.phone || "",
        }));

        setProperties(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);


  /* -------------------------------------------------- */
  /*  Funciones auxiliares                              */
  /* -------------------------------------------------- */
  let toggleAgentSidebar = () => setSidebarOpen(!sidebarOpen);

  let getStatusColor = (status) =>
    status === "Publicado"
      ? "bg-blue-100 text-blue-800"
      : "bg-blue-50 text-blue-950";

  /*‒‒‒ Buscar / Filtrar ‒‒‒*/
  let filteredProperties = properties.filter((p) => {
    let matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = filterStatus === "Todos" || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  /*‒‒‒ Navegar a nueva propiedad ‒‒‒*/
  let handleNewProperty = () => navigate("/CrearPropiedad");

  /*‒‒‒ Ver / Editar / Eliminar ‒‒‒*/
  let handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowViewModal(true);
  };

  let handleEditProperty = (property) => {
    setSelectedProperty(property);
    setEditForm({
      name: property.name,
      price: property.price,
      location: property.location,
      description: property.description,
      status: property.status,
      type: property.type,
      area: property.area,
      rooms: property.rooms.toString(),
      bathrooms: property.bathrooms.toString(),
    });
    setShowEditModal(true);
    setSubmitSuccess(false);
  };

  let handleDeleteProperty = (property) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  let confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      /* Aquí pondrías tu llamada real para eliminar */
      await new Promise((r) => setTimeout(r, 1000));
      setProperties(properties.filter((p) => p.id !== selectedProperty.id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la propiedad");
    } finally {
      setIsSubmitting(false);
    }
  };

  let handleSaveEdit = async () => {
    setIsSubmitting(true);
    try {
      /* Aquí pondrías tu llamada real para editar */
      await new Promise((r) => setTimeout(r, 1500));
      let updated = properties.map((p) =>
        p.id === selectedProperty.id
          ? {
            ...p,
            ...editForm,
            rooms: Number.parseInt(editForm.rooms),
            bathrooms: Number.parseInt(editForm.bathrooms),
          }
          : p
      );
      setProperties(updated);
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la propiedad");
    } finally {
      setIsSubmitting(false);
    }
  };

  let handleEditFormChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  let closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedProperty(null);
    setSubmitSuccess(false);
  };

  /* -------------------------------------------------- */
  /*  Render                                            */
  /* -------------------------------------------------- */
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Cargando propiedades…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">{error}</p>
        </div>
      </>
    );
  }

  /* ----- UI completa ----- */
  return (
    <>
      <Header toggleAgentSidebar={toggleAgentSidebar} />
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar fijo en desktop */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
          <AgentSideBar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sidebarOpen={true}
            setSidebarOpen={() => { }}
            toggleSidebar={() => { }}
          />
        </div>

        {/* Sidebar móvil */}
        <AgentSideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toggleSidebar={toggleAgentSidebar}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="lg:ml-72 pt-16">
          <div className="p-4 sm:p-6">
            {/* Header de la página */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Mis Propiedades
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Administra y gestiona todas tus propiedades (
                  {filteredProperties.length} propiedades)
                </p>
              </div>
              <button
                onClick={handleNewProperty}
                className="flex items-center gap-2 bg-[#2F8EAC] text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nueva Propiedad
              </button>
            </div>

            {/* Panel de filtros */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">
                  Filtros de búsqueda
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Búsqueda
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar propiedades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  >
                    <option value="Todos">Todos los estados</option>
                    <option value="Publicado">Publicado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {properties.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Propiedades
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-[#2F8EAC]">
                  {
                    properties.filter((p) => p.status === "Publicado").length
                  }
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Publicadas</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-blue-800">
                  {
                    properties.filter((p) => p.status === "Pendiente").length
                  }
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Pendientes</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-sky-600">
                  {properties.length > 0
                    ? Math.round(
                      (properties.filter((p) => p.status === "Publicado")
                        .length /
                        properties.length) *
                      100
                    )
                    : 0}
                  %
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Tasa Publicación
                </p>
              </div>
            </div>

            {/* Tabla / Tarjetas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  Lista de Propiedades
                </h3>
                <p className="text-sm text-gray-500">
                  Gestiona y edita tus propiedades
                </p>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay propiedades
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {properties.length === 0
                      ? "Aún no has agregado ninguna propiedad."
                      : "No se encontraron propiedades con los filtros seleccionados."}
                  </p>
                  {properties.length === 0 && (
                    <button
                      onClick={handleNewProperty}
                      className="bg-[#2F8EAC] text-white px-6 py-3 rounded-xl hover:bg-[#267a95] transition-colors font-medium"
                    >
                      Agregar Primera Propiedad
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Tarjetas móvil */}
                  <div className="block lg:hidden">
                    {filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-12 h-10 sm:w-16 sm:h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={
                                property.image ||
                                "/placeholder.svg?height=80&width=120"
                              }
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {property.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {property.type} • {property.location}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {property.date}
                                </p>
                                <p className="text-sm font-semibold text-[#2F8EAC] mt-1">
                                  {property.price}
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                    property.status
                                  )}`}
                                >
                                  {property.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 mt-3">
                              <button
                                onClick={() => handleViewProperty(property)}
                                className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProperty(property)}
                                className="p-1.5 sm:p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property)}
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tabla desktop */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Propiedad
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Precio
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredProperties.map((property) => (
                          <tr
                            key={property.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  <img
                                    src={
                                      property.image ||
                                      "/placeholder.svg?height=80&width=120"
                                    }
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {property.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {property.type} • {property.location}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                  property.status
                                )}`}
                              >
                                {property.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                {property.date}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-[#2F8EAC]">
                                {property.price}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewProperty(property)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditProperty(property)}
                                  className="p-2 text-sky-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(property)}
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
                </>
              )}
            </div>
          </div>
        </main>

        {/* -------- Modales (Ver / Editar / Eliminar) -------- */}
        {showViewModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModals();
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Detalles de la Propiedad
                  </h2>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-full sm:w-32 h-24 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={
                          selectedProperty.image ||
                          "/placeholder.svg?height=80&width=120"
                        }
                        alt={selectedProperty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedProperty.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {selectedProperty.type} • {selectedProperty.location}
                      </p>
                      <p className="text-xl font-bold text-[#2F8EAC] mt-2">
                        {selectedProperty.price}
                      </p>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(
                          selectedProperty.status
                        )}`}
                      >
                        {selectedProperty.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Área:
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedProperty.area}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Habitaciones:
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedProperty.rooms}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Baños:
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedProperty.bathrooms}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de publicación:
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedProperty.date}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción:
                    </label>
                    <p className="text-gray-900">{selectedProperty.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agente:
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedProperty.agent}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono:
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedProperty.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------- Modal Editar -------- */}
        {showEditModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModals();
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Editar Propiedad
                  </h2>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                    ¡Propiedad actualizada exitosamente!
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre:
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio:
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ubicación:
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo:
                      </label>
                      <select
                        name="type"
                        value={editForm.type}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      >
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Local">Local</option>
                        <option value="Oficina">Oficina</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Área:
                      </label>
                      <input
                        type="text"
                        name="area"
                        value={editForm.area}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Habitaciones:
                      </label>
                      <input
                        type="number"
                        name="rooms"
                        value={editForm.rooms}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Baños:
                      </label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={editForm.bathrooms}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado:
                    </label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    >
                      <option value="Publicado">Publicado</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción:
                    </label>
                    <textarea
                      name="description"
                      value={editForm.description}
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
                      className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isSubmitting
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-[#2F8EAC] text-white hover:bg-[#267a95]"
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

        {/* -------- Modal Eliminar -------- */}
        {showDeleteModal && selectedProperty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModals();
            }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Confirmar Eliminación
                  </h2>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-600 mb-4">
                    ¿Estás seguro de que deseas eliminar la propiedad{" "}
                    <strong>{selectedProperty.name}</strong>?
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-600">
                      Esta acción no se puede deshacer.
                    </p>
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
                    className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isSubmitting
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
    </>
  );
}
