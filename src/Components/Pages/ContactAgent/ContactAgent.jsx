import React from 'react';
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
                  <UserIcon className="text-white w-10 h-10" />
                </div>
                <p className="text-lg font-semibold text-gray-800">Mariana Ocampo</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <PhoneCall className="w-5 h-5 text-[#2F8EAC]" />
                  <span>+57 3224456666</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-5 h-5 text-[#2F8EAC]" />
                  <span>mariana122@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Opciones alternativas + botón */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
              <p className="font-semibold text-gray-800">Opciones de contacto alternativo</p>
              <div className="flex items-center gap-3 text-gray-700">
                <MessageCircle className="w-5 h-5 text-[#2F8EAC]" />
                <span>WhatsApp</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-[#2F8EAC]" />
                <span>Llamada Directa</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-[#2F8EAC]" />
                <span>Agendar Visita</span>
              </div>

              <RateAgentModal />
            </div>
          </div>

          {/* Lado derecho - Formulario grande y alto */}
          <div className="w-full max-w-lg h-[540px] bg-white p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <p className="font-semibold text-gray-800 text-lg">Enviar Mensaje</p>
              <input
                type="text"
                placeholder="Asunto"
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2F8EAC]"
              />
              <textarea
                rows={8}
                placeholder="Mensaje"
                className="border border-gray-300 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2F8EAC]"
              ></textarea>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="w-1/2 border border-[#2F8EAC] text-[#2F8EAC] py-2 rounded-md hover:bg-[#e6f3f6] transition">
                Cancelar
              </button>
              <button className="w-1/2 bg-[#2F8EAC] text-white py-2 rounded-md hover:bg-[#287b93] transition">
                Enviar
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
