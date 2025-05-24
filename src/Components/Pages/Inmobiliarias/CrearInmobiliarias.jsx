import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Layouts/Header/Header";

export const CrearInmobiliarias = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nit, setNit] = useState("");
  const [responsible, setResponsible] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const fullAddress = `${address}, ${city}`;

  const handleCancel = () => {
    navigate("/")
  }

  const handleNext = () => {
    // Redirigir a la interfaz de registro
    navigate("/registrarseAdministrador")
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white px-6 py-10 md:px-20">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Registrar Inmobiliaria</h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Información General */}
          <div className="flex-1">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Información General</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la inmobiliaria"
                className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="NIT o registro legal"
                className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
              />
              <input
                type="text"
                placeholder="Persona Encargada"
                className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Dirección"
                  className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Ciudad y Departamento"
                  className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Teléfono de Contacto"
                  className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="w-1/2 border border-gray-200 rounded-md px-4 py-2 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <textarea
                placeholder="Descripción"
                className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm h-28"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Multimedia y Mapa */}
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-medium text-gray-700 mb-4">Multimedia</h2>
              <label className="w-full h-36 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                <div className="text-center">
                  <img src="/assets/images/upload-icon.png" alt="" className="mx-auto mb-2 w-10" />
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

            {/* Mapa */}
            <div className="bg-white p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Mapa</h2>
              <div className="w-16 h-0.5 bg-gray-200 mb-6"></div>
              <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  className="w-full h-full"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  loading="lazy"
                  title="Ubicación de la propiedad"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-full border border-[#2F8EAC] text-[#2F8EAC] hover:bg-[#2F8EAC] hover:text-white transition">
            Cancelar
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-full bg-[#2F8EAC] text-white hover:bg-[#256c84] transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};
