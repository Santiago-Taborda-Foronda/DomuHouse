import React, { useState } from "react";

export const CrearInmobiliarias = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 md:px-20">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Registrar Inmobiliaria</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Información General */}
        <div className="flex-1">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Información General</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Nombre de la inmobiliaria" className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm" />
            <input type="text" placeholder="NIT o registro legal" className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm" />
            <input type="text" placeholder="Persona Encargada" className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm" />
            <div className="flex gap-4">
              <input type="text" placeholder="Dirección" className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm" />
              <input type="text" placeholder="Ciudad y Departamento" className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm" />
            </div>
            <div className="flex gap-4">
              <input type="text" placeholder="Teléfono de Contacto" className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm" />
              <input type="email" placeholder="Correo electrónico" className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm" />
            </div>
            <textarea placeholder="Descripción" className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm h-28"></textarea>
          </div>
        </div>

        {/* Multimedia y Mapa */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-medium text-gray-700 mb-4">Multimedia</h2>
            <label className="w-full h-36 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
              <input type="file" multiple onChange={handleImageUpload} className="hidden" />
              <div className="text-center">
                <img src="/assets/images/upload-icon.png" alt="Upload" className="mx-auto mb-2 w-10" />
                <p className="text-gray-600 text-sm">+ Subir imágenes</p>
              </div>
            </label>
            <div className="mt-4 space-y-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-700 mb-4">Ubicación en el Mapa</h2>
            <div className="w-full h-40">
              <img
                src="/assets/images/map-preview.png"
                alt="Mapa"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button className="px-6 py-2 rounded-full border border-[#2F8EAC] text-[#2F8EAC] hover:bg-[#2F8EAC] hover:text-white transition">Cancelar</button>
        <button className="px-6 py-2 rounded-full bg-[#2F8EAC] text-white hover:bg-[#256c84] transition">Siguiente</button>
      </div>
    </div>
  )
}

 
