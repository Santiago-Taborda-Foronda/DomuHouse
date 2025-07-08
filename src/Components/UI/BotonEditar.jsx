import { useNavigate } from "react-router-dom"

export const BotonEditar = ({ id }) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/mi-inmobiliaria/editar/${id}`)}
      className="border border-[#2F8EAC] text-[#2F8EAC] px-4 py-2 rounded-full hover:bg-[#2F8EAC] hover:text-white transition"
    >
      ✏️ Editar Datos
    </button>
  )
}
    