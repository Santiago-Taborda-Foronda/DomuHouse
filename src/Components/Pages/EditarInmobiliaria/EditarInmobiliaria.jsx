"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../../Layouts/Header/Header"
import { ArrowLeft, Save, Trash2, Upload, AlertTriangle } from "lucide-react"
import { useParams } from "react-router-dom"

export const EditarInmobiliaria = () => {
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados del formulario
  const [name, setName] = useState("")
  const [nit, setNit] = useState("")
  const [responsible, setResponsible] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [department, setDepartment] = useState("")
  const [newImages, setNewImages] = useState([])

  const { id: idFromParams } = useParams()
  const [id] = useState(idFromParams)

  // Estados de control
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("No se proporcionó ID de inmobiliaria")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log("🔍 Cargando inmobiliaria ID:", id)

        const response = await fetch(`http://localhost:10101/api/inmobiliarias/${id}`)

        console.log("📊 Response status:", response.status)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log("📦 Datos recibidos:", result)

        if (!result.success) {
          throw new Error(result.message || "Error del servidor")
        }

        const data = result.data
        setInitialData(data)

        // Llenar formulario
        setName(data.name_realestate || "")
        setNit(data.nit || "")
        setResponsible(data.encargado_nombre || "")
        setAddress(data.address || "")
        setCity(data.city || "")
        setPhone(data.phone || "")
        setEmail(data.email || "")
        setDepartment(data.department || "")
        setDescription(data.description || "")
        setImages(data.images || [])

        console.log("✅ Datos cargados correctamente")
      } catch (err) {
        console.error("❌ Error al cargar:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  // Detectar cambios
  useEffect(() => {
    if (!initialData) return

    const hasFormChanges =
      name !== (initialData.name_realestate || "") ||
      nit !== (initialData.nit || "") ||
      address !== (initialData.address || "") ||
      city !== (initialData.city || "") ||
      phone !== (initialData.phone || "") ||
      email !== (initialData.email || "") ||
      department !== (initialData.department || "") ||
      description !== (initialData.description || "")

    const hasImageChanges = newImages.length > 0 || images.length !== (initialData.images?.length || 0)

    setHasChanges(hasFormChanges || hasImageChanges)
  }, [name, nit, address, city, phone, email, department, description, images, newImages, initialData])

  const handleSave = async () => {
    if (!initialData) return

    setIsLoading(true)
    setError(null)

    try {
      const dataToSend = {
        name_realestate: name,
        nit,
        phone,
        email,
        department,
        city,
        address,
        description,
        person_id: initialData.person_id,
      }

      console.log("💾 Guardando datos:", dataToSend)

      const response = await fetch(`http://localhost:10101/api/inmobiliarias/realestate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar")
      }

      const result = await response.json()
      console.log("✅ Guardado exitoso:", result)

      // Actualizar datos iniciales
      setInitialData({
        ...initialData,
        name_realestate: name,
        nit,
        phone,
        email,
        department,
        city,
        address,
        description,
      })

      setHasChanges(false)
      setNewImages([])

      // Mostrar mensaje de éxito
      alert("¡Datos guardados correctamente!")
    } catch (err) {
      console.error("❌ Error al guardar:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`http://localhost:10101/api/inmobiliarias/delete/realestate/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al eliminar")
      }

      alert("Inmobiliaria eliminada exitosamente")
      navigate("/")
    } catch (err) {
      console.error("❌ Error al eliminar:", err)
      alert(`Error al eliminar: ${err.message}`)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map((file) => URL.createObjectURL(file))
    setNewImages([...newImages, ...imageUrls])
  }

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages(newImages.filter((_, i) => i !== index))
    } else {
      setImages(images.filter((_, i) => i !== index))
    }
  }

  // Pantalla de error
  if (error && !initialData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar datos</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-100 rounded p-3 mb-4 text-sm text-left">
              <p>
                <strong>ID:</strong> {id}
              </p>
              <p>
                <strong>URL:</strong> /api/inmobiliarias/{id}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#2F8EAC] text-white rounded-md hover:bg-[#256c84]"
              >
                Reintentar
              </button>
              <button
                onClick={() => navigate("/mi-inmobiliaria/dashboard")}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Pantalla de carga
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#2F8EAC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando inmobiliaria...</p>
            <p className="text-sm text-gray-400">ID: {id}</p>
          </div>
        </div>
      </>
    )
  }

  const fullAddress = `${address}, ${city}`

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4 md:mx-20">
            <div className="flex justify-between items-center">
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 md:px-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/mi-inmobiliaria/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Volver</span>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Configuración de Inmobiliaria</h1>
                <p className="text-sm text-gray-500">
                  ID: {id} | Encargado: {responsible}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Cambios sin guardar
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || isLoading}
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm ${
                  hasChanges && !isLoading
                    ? "bg-[#2F8EAC] text-white hover:bg-[#256c84]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-10 md:px-20">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Formulario */}
            <div className="flex-1">
              <h2 className="text-xl font-medium text-gray-700 mb-4">Información General</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre de la inmobiliaria"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="NIT"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Persona Encargada"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm bg-gray-50"
                  value={responsible}
                  disabled
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Dirección"
                    className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Ciudad"
                    className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Departamento"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Teléfono"
                    className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <textarea
                  placeholder="Descripción"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm h-28 focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Zona de peligro */}
              <div className="mt-10 p-6 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">Zona de Peligro</h3>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  Eliminar la inmobiliaria borrará todos los datos asociados. Esta acción no se puede deshacer.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Eliminar Inmobiliaria
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-red-800">¿Estás completamente seguro?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} />
                            Sí, eliminar
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Multimedia y Mapa */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Multimedia */}
              <div>
                <h2 className="text-xl font-medium text-gray-700 mb-4">Multimedia</h2>

                {/* Imágenes existentes */}
                {images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg?height=128&width=200"}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeImage(index, false)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nuevas imágenes */}
                {newImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Nuevas imágenes</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {newImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Nueva imagen ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeImage(index, true)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload */}
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#2F8EAC]">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Subir imágenes</p>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Mapa */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubicación</h2>
                <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  {fullAddress && fullAddress !== ", " ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      loading="lazy"
                      title="Ubicación"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <p className="text-sm">Ingresa dirección y ciudad para mostrar el mapa</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{fullAddress || "Dirección no disponible"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
