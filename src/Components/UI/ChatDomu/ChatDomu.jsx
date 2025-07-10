import { useState, useEffect } from "react";
import axios from "axios";
import LogoRobot from "../../../assets/images/robot.png";
import { BsSend } from "react-icons/bs";

export const ChatDomu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = {
        from: "bot",
        text: "¡Hola! Soy Domu, tu asistente inmobiliario. Por favor, proporcióname los siguientes detalles de la propiedad:\n\n- Tipo de vivienda (casa, apartamento, etc.)\n- Número de baños\n- Número de habitaciones\n- Metros cuadrados\n- Ubicación (norte, sur, este, oeste)\n- Ciudad\n- Antigüedad de la propiedad\n\nCon esta información podré darte mejores recomendaciones."
      };
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatResponse = (responseData) => {
    // Si es una pregunta no relacionada con inmuebles
    if (responseData.tendenciaMercado?.tendencia === "error") {
      return (
        <div className="text-gray-800">
          {responseData.tendenciaMercado.factoresInfluyentes[0]}
        </div>
      );
    }

    const { estimacion, caracteristicasDetectadas, recomendaciones, tendenciaMercado } = responseData;
    
    return (
      <div className="space-y-4">
        {/* Encabezado */}
        <div className="text-[#2F8EAC] font-bold text-lg border-b border-[#2F8EAC] pb-2">
          🔍 Análisis de tu propiedad
        </div>
        
        {/* Características detectadas */}
        <div>
          <div className="font-semibold text-[#2F8EAC]">🏠 Características detectadas:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tipo: <span className="font-medium">{caracteristicasDetectadas.tipoPropiedad}</span></li>
            <li>Habitaciones: <span className="font-medium">{caracteristicasDetectadas.habitaciones}</span></li>
            <li>Baños: <span className="font-medium">{caracteristicasDetectadas.banos}</span></li>
            <li>Metros cuadrados: <span className="font-medium">{caracteristicasDetectadas.metrosCuadrados}</span></li>
            <li>Ubicación: <span className="font-medium">{caracteristicasDetectadas.ubicacion}</span></li>
            <li>Antigüedad: <span className="font-medium">{caracteristicasDetectadas.antiguedad} años</span></li>
            <li>Garaje: <span className="font-medium">{caracteristicasDetectadas.garaje ? 'Sí' : 'No'}</span></li>
            <li>Piscina: <span className="font-medium">{caracteristicasDetectadas.piscina ? 'Sí' : 'No'}</span></li>
          </ul>
        </div>
        
        {/* Estimación de precio */}
        <div>
          <div className="font-semibold text-[#2F8EAC]">💰 Estimación de valor:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Precio estimado: <span className="font-medium">${estimacion.precioEstimado.toLocaleString()} {estimacion.moneda}</span></li>
            <li>Rango: <span className="font-medium">${estimacion.rangoMinimo.toLocaleString()} - ${estimacion.rangoMaximo.toLocaleString()}</span></li>
            <li>Confianza de estimación: <span className="font-medium">{estimacion.confianzaPrediccion * 100}%</span></li>
          </ul>
        </div>
        
        {/* Tendencia de mercado */}
        <div>
          <div className="font-semibold text-[#2F8EAC]">📈 Tendencia del mercado:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tendencia: <span className="font-medium">{tendenciaMercado.tendencia}</span></li>
            <li>Demanda: <span className="font-medium">{tendenciaMercado.demanda}</span></li>
            <li className="italic">{tendenciaMercado.prediccionCortoPlaza}</li>
          </ul>
        </div>
        
        {/* Recomendaciones */}
        <div>
          <div className="font-semibold text-[#2F8EAC]">💡 Recomendaciones para mejorar tu propiedad:</div>
          <ol className="list-decimal pl-5 space-y-2">
            {recomendaciones.map((rec, index) => (
              <li key={index} className="text-justify">{rec}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = { from: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    try {
      const response = await axios.post("http://localhost:10101/ia/ingresar-inmueble", {
        descripcion: inputText,
      });

      if (response.data.status === "success") {
        const formattedResponse = formatResponse(response.data.data);
        const botMessage = { from: "bot", content: formattedResponse };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const errorMessage = {
        from: "bot",
        text: "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente o proporciona la información en otro formato.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <div
        onClick={toggleChat}
        className="fixed bottom-5 right-5 z-50 flex items-center bg-white shadow-lg rounded-full px-5 py-3 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <div className="w-12 h-12 bg-[#2F8EAC] rounded-full flex items-center justify-center">
          <img
            src={LogoRobot}
            alt="Robot"
            className="w-7 h-7 object-contain"
            draggable="false"
          />
        </div>
        <span className="ml-3 text-[#2F8EAC] font-bold text-lg">Domu Te Asesora</span>
      </div>

      {/* Modal de chat */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-[700px] h-[80%] flex flex-col relative pointer-events-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#2F8EAC] text-white rounded-t-lg">
              <span className="font-bold text-lg">Domu Te Asesora</span>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 text-xl"
                aria-label="Cerrar chat"
              >
                ×
              </button>
            </div>

            {/* Cuerpo del chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.from === "bot" && (
                    <img src={LogoRobot} alt="Robot" className="w-10 h-10 rounded-full mt-1" />
                  )}
                  <div
                    className={`px-4 py-3 rounded-lg max-w-[80%] ${
                      msg.from === "bot"
                        ? "bg-gray-100 text-gray-800 border border-gray-200"
                        : "bg-[#2F8EAC] text-white"
                    }`}
                  >
                    {msg.content || msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje con botón de enviar */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2 rounded-md text-sm focus:outline-none border border-gray-300 focus:border-[#2F8EAC] transition"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 flex items-center justify-center bg-[#2F8EAC] rounded-md hover:bg-[#246c84] transition text-white"
                >
                  <BsSend className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};