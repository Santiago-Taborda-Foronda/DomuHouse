"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../../Layouts/Header/Header"
import { ArrowLeft, Save, Trash2, Upload, AlertTriangle } from "lucide-react"

export const EditarInmobiliaria = () => {
  const navigate = useNavigate()

  // Datos iniciales simulados (en tu caso vendrían de la API)
  const [initialData] = useState({
    name: "Inmobiliaria Premium Real Estate Solutions",
    nit: "900.123.456-7",
    responsible: "María González",
    address: "Calle 123 #45-67",
    city: "Bogotá, Colombia",
    phone: "+57 301 234 5678",
    email: "contacto@premiumrealestate.com",
    description:
      "Somos una inmobiliaria especializada en propiedades premium con más de 15 años de experiencia en el mercado. Ofrecemos servicios integrales de compra, venta y alquiler de propiedades residenciales y comerciales.",
    images: [],
  })

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
  const [newImages, setNewImages] = useState([])

  // Estados de control
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    setName(initialData.name)
    setNit(initialData.nit)
    setResponsible(initialData.responsible)
    setAddress(initialData.address)
    setCity(initialData.city)
    setPhone(initialData.phone)
    setEmail(initialData.email)
    setDescription(initialData.description)
    setImages(initialData.images)
  }, [initialData])

  // Detectar cambios
  useEffect(() => {
    const currentData = { name, nit, responsible, address, city, phone, email, description }
    const hasFormChanges =
      JSON.stringify(currentData) !==
      JSON.stringify({
        name: initialData.name,
        nit: initialData.nit,
        responsible: initialData.responsible,
        address: initialData.address,
        city: initialData.city,
        phone: initialData.phone,
        email: initialData.email,
        description: initialData.description,
      })

    setHasChanges(hasFormChanges || newImages.length > 0 || images.length !== initialData.images.length)
  }, [name, nit, responsible, address, city, phone, email, description, images, newImages, initialData])

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

  const fullAddress = `${address}, ${city}`

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("¿Estás seguro de que quieres cancelar? Se perderán todos los cambios no guardados.")) {
        navigate("/mi-inmobiliaria/dashboard")
      }
    } else {
      navigate("/mi-inmobiliaria/dashboard")
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const updatedData = {
        name,
        nit,
        responsible,
        address,
        city,
        phone,
        email,
        description,
        images: [...images, ...newImages],
      }

      console.log("Datos actualizados:", updatedData)
      alert("Datos actualizados exitosamente")
      setHasChanges(false)
      setNewImages([])
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error al actualizar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Inmobiliaria eliminada")
      alert("Inmobiliaria eliminada exitosamente")
      navigate("/")
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert("Error al eliminar la inmobiliaria")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Header de la página */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 md:px-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Volver</span>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Configuración de Inmobiliaria</h1>
                <p className="text-sm text-gray-500">Edita los datos de tu inmobiliaria</p>
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
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm transition-all ${
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
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-10 md:px-20">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Información General */}
            <div className="flex-1">
              <h2 className="text-xl font-medium text-gray-700 mb-4">Información General</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre de la inmobiliaria"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="NIT o registro legal"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Persona Encargada"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                />

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Dirección"
                    className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Ciudad y Departamento"
                    className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Teléfono de Contacto"
                    className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <textarea
                  placeholder="Descripción"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm h-28 focus:ring-2 focus:ring-[#2F8EAC] focus:border-[#2F8EAC] transition-colors resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Zona de peligro */}
              <div className="mt-10 p-6 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">Zona de Peligro</h3>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  Eliminar la inmobiliaria borrará todos los datos asociados incluyendo propiedades, agentes y
                  contratos. Esta acción no se puede deshacer.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Eliminar Inmobiliaria
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-red-800">
                      ¿Estás completamente seguro? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
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
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
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
              <div>
                <h2 className="text-xl font-medium text-gray-700 mb-4">Multimedia</h2>

                {/* Subir nuevas imágenes */}
                <label className="w-full h-36 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 text-sm">+ Subir nuevas imágenes</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                </label>

                {/* Imágenes actuales */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeImage(index, false)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
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
                  <div className="mt-4">
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
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mapa */}
              <div className="bg-white p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Mapa</h2>
                <div className="w-16 h-0.5 bg-gray-200 mb-6"></div>
                <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    className="w-full h-full"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    loading="lazy"
                    title="Ubicación de la inmobiliaria"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{fullAddress}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between mt-10">
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-full border border-[#2F8EAC] text-[#2F8EAC] hover:bg-[#2F8EAC] hover:text-white transition"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={!hasChanges || isLoading}
              className={`px-6 py-2 rounded-full transition flex items-center gap-2 ${
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
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
