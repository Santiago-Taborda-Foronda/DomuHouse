import React from 'react';
import { useLocation } from 'react-router-dom';

export const PropiedadSeleccionada = () => {
  const { state } = useLocation();
  const property = state?.property;

  if (!property) return <div className="p-10 text-center">No se encontraron datos de la propiedad.</div>;

  return (
    <div className="px-6 md:px-20 py-10">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        <div className="w-full lg:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>
          <div className="text-gray-600 mb-2">{property.address}</div>
          <div className="text-xl font-semibold text-teal-600 mb-4">${property.price} /mes</div>

          <div className="flex gap-4 text-sm text-gray-700 mb-6">
            <span>🛏 {property.rooms} cuartos</span>
            <span>🛁 {property.bathrooms} baños</span>
            <span>📐 {property.area} m²</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <img className="rounded-xl" src="https://source.unsplash.com/featured/?house" alt="" />
            <img className="rounded-xl" src="https://source.unsplash.com/featured/?interior" alt="" />
            <img className="rounded-xl" src="https://source.unsplash.com/featured/?bathroom" alt="" />
          </div>

          <h3 className="text-xl font-semibold mb-2">Descripción</h3>
          <p className="text-gray-700 mb-6">
            Esta propiedad es ideal para familias que buscan confort, ubicación privilegiada y diseño moderno...
          </p>

          <h3 className="text-xl font-semibold mb-2">Descripción General</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div><strong>{property.area}</strong> m²</div>
            <div><strong>{property.rooms}</strong> Habitaciones</div>
            <div><strong>{property.bathrooms}</strong> Baños</div>
            <div><strong>Casa</strong> Tipo</div>
            <div><strong>2</strong> Niveles</div>
            <div><strong>1</strong> Garaje</div>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-2">Mapa</h3>
          <iframe
            className="w-full h-64 rounded-xl"
            src="https://maps.google.com/maps?q=Lake%20Tahoe&t=&z=13&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
          />
        </div>

        {/* Agente y propiedades destacadas */}
        <div className="w-full lg:w-1/3 space-y-10">
          <div className="bg-white shadow-md p-6 rounded-xl border">
            <h4 className="text-lg font-semibold mb-2">Contactar Agente</h4>
            <div className="mb-2 text-gray-700 font-medium">{property.agentName}</div>
            <div className="text-sm text-gray-600">📞 +57 3214566546</div>
            <div className="text-sm text-gray-600 mb-4">✉️ mariana12@gmail.com</div>
            <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition">
              Contactar
            </button>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Propiedades Destacadas</h4>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 mb-4">
                <img className="w-20 h-20 object-cover rounded-lg" src="https://source.unsplash.com/featured/?house" alt="" />
                <div>
                  <h5 className="text-sm font-semibold">Casa Lomas Del Norte</h5>
                  <div className="text-xs text-gray-500">3🛏 2🛁 120m²</div>
                  <div className="text-sm font-medium text-teal-600">$7,250.00</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
