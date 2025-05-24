import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../../Layouts/Header/Header';
import {
  Mail,
  Phone,
  UserIcon,
  Calendar,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { RateAgentModal } from '../RateAgentModal/RateAgentModal';

export const ContactAgent = () => {
  const { state } = useLocation();
  const agent = state?.agent;
  const property = state?.property;

  // Datos por defecto en caso de que no se pasen datos del agente
  const defaultAgent = {
    name: "Mariana Ocampo",
    phone: "+57 3224456666",
    email: "mariana122@gmail.com",
    initials: "MO",
    whatsapp: "+57 3224456666"
  };

  // Usar los datos del agente pasados o los datos por defecto
  const currentAgent = agent || defaultAgent;

  return (
    <>
      <Header />
      <main className="px-4 md:px-16 py-10 bg-white max-h-screen">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-gray-800">
          Contactar Agente
        </h1>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-14">
          {/* Lado izquierdo */}
          <div className="flex flex-col w-full max-w-sm space-y-6 translate-x-[-10px]">
            {/* Tarjeta del agente */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#2F8EAC] flex items-center justify-center">
                  {currentAgent.initials ? (
                    <span className="text-white text-xl font-semibold">
                      {currentAgent.initials}
                    </span>
                  ) : (
                    <UserIcon className="text-white w-10 h-10" />
                  )}
                </div>
                <p className="text-lg font-semibold text-gray-800">{currentAgent.name}</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <PhoneCall className="w-5 h-5 text-[#2F8EAC]" />
                  <span>{currentAgent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-5 h-5 text-[#2F8EAC]" />
                  <span>{currentAgent.email}</span>
                </div>
              </div>
            </div>

            {/* Opciones alternativas + botón */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
              <p className="font-semibold text-gray-800">Opciones de contacto alternativo</p>
              <a 
                href={`https://wa.me/${currentAgent.whatsapp?.replace(/[^+\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-[#2F8EAC] transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#2F8EAC]" />
                <span>WhatsApp</span>
              </a>
              <a 
                href={`tel:${currentAgent.phone}`}
                className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-[#2F8EAC] transition-colors"
              >
                <Phone className="w-5 h-5 text-[#2F8EAC]" />
                <span>Llamada Directa</span>
              </a>
              <div className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-[#2F8EAC] transition-colors">
                <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                <span>Agendar Visita</span>
              </div>

              <RateAgentModal agentName={currentAgent.name} />
            </div>
          </div>

          {/* Lado derecho - Formulario grande y alto */}
          <div className="w-full max-w-lg h-[540px] bg-white p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-semibold text-gray-800 text-lg mb-2">
                  Enviar Mensaje a {currentAgent.name}
                </p>
                {property && (
                  <p className="text-sm text-gray-600 mb-4">
                    Referente a: {property.title} - {property.address}
                  </p>
                )}
              </div>
              <input
                type="text"
                placeholder="Asunto"
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2F8EAC]"
              />
              <textarea
                rows={8}
                placeholder="Escribe tu mensaje aquí..."
                className="border border-gray-300 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2F8EAC]"
              ></textarea>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="w-1/2 border border-[#2F8EAC] text-[#2F8EAC] py-2 rounded-md hover:bg-[#e6f3f6] transition">
                Cancelar
              </button>
              <button className="w-1/2 bg-[#2F8EAC] text-white py-2 rounded-md hover:bg-[#287b93] transition">
                Enviar Mensaje
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional de la propiedad si está disponible */}
        {property && (
          <div className="max-w-4xl mx-auto mt-12 bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de la propiedad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-xl font-bold text-[#2F8EAC]">${property.price}</div>
                <div className="text-xs text-gray-500">Precio</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-xl font-bold text-[#2F8EAC]">{property.rooms}</div>
                <div className="text-xs text-gray-500">Habitaciones</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-xl font-bold text-[#2F8EAC]">{property.bathrooms}</div>
                <div className="text-xs text-gray-500">Baños</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-xl font-bold text-[#2F8EAC]">{property.area} m²</div>
                <div className="text-xs text-gray-500">Área</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};