import { useState } from "react";
import axios from "axios";
import LogoRobot from "../../../assets/images/robot.png";
import { BsSend } from "react-icons/bs";

export const ChatDomu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = { from: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:10101/ia/ingresar-inmueble", {
        descripcion: inputText,
      });

      const replyText =
        response.data?.data?.recomendaciones?.[0] || "Gracias por tu mensaje. Te responderemos pronto.";

      const botMessage = { from: "bot", text: replyText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        from: "bot",
        text: "Ocurrió un error al procesar tu solicitud.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInputText("");
  };

  return (
    <>
      {/* Botón flotante */}
      <div
        onClick={toggleChat}
        className="fixed bottom-5 right-5 z-50 flex items-center bg-white shadow-lg rounded-full pl-0 pr-6 py-4 cursor-pointer"
      >
        <div className="w-14 h-14 bg-[#2F8EAC] rounded-full flex items-center justify-center ml-0">
          <img
            src={LogoRobot}
            alt="Robot"
            className="w-10 h-10 object-contain"
            draggable="false"
          />
        </div>
        <span className="ml-4 text-[#2F8EAC] font-bold text-lg">Domu Te Asesora</span>
      </div>

      {/* Modal de chat */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-[700px] h-[80%] flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <span className="font-bold text-[#2F8EAC] text-lg">Domu Te Asesora</span>
              <button
                onClick={toggleChat}
                className="text-gray-500 hover:text-[#2F8EAC] text-xl"
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
                  className={`flex gap-2 ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.from === "bot" && (
                    <img src={LogoRobot} alt="Robot" className="w-10 h-10 rounded-full" />
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                      msg.from === "bot"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-[#2F8EAC] text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje con botón de enviar */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Escribe un mensaje"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2 rounded-md text-sm focus:outline-none bg-gray-200"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 flex items-center justify-center bg-[#2F8EAC] rounded-md hover:bg-[#246c84] transition"
                >
                  <BsSend className="text-white text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
