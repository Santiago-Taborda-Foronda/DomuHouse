// ============================================
// 🔥 FRONTEND - ResetPasswordToken.jsx
// ============================================

"use client"
import logoDomuHouse from "../../../assets/images/Logo-DomuHouse.png"
import LogoLogin from "../../../assets/images/imagen-login.png"
import { Button } from "../../UI/Button/Button"
import { Link, useLocation, useNavigate } from "react-router"
import { useState } from "react"
import { ArrowLeft, Key, CheckCircle } from "lucide-react"

export const ResetPasswordToken = () => {
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ""

  const handleTokenChange = (e) => {
    setToken(e.target.value)
  }

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      // 🔥 CORREGIDO: Solo enviar token y nuevaPassword (sin correo)
      const response = await fetch("https://imagen-domuhouse-express.onrender.com/api/password/cambiar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token.trim(), // Eliminar espacios en blanco
          nuevaPassword: newPassword,
          // ❌ NO enviar correo - el backend lo obtiene del token
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al restablecer la contraseña")
      }

      setIsSubmitted(true)
      console.log("✅ Contraseña restablecida:", data.message)

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/Login")
      }, 3000)
    } catch (error) {
      console.error("❌ Error:", error.message)
      alert("No se pudo restablecer la contraseña: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col justify-around px-20 pr-30 w-full space-y-10 items-start">
        <header className="flex items-center justify-start">
          <img src={logoDomuHouse || "/placeholder.svg"} alt="" className="w-30" />
          <h1 className="text-sky-500 ml-5">
            DOMU<span className="text-black">HOUSE</span>
          </h1>
        </header>

        <section className="flex items-center gap-20 w-full">
          <div className="flex flex-col items-center shadow-lg border-1 border-gray-100 p-10 rounded-3xl min-w-160 space-y-5">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="text-green-500" size={64} />
              <h2 className="text-2xl font-semibold text-center">¡Contraseña Restablecida!</h2>
              <p className="text-gray-600 text-center">Tu contraseña ha sido restablecida exitosamente.</p>
              <p className="text-sm text-gray-500 text-center">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <p className="text-sm text-sky-600 text-center font-medium">
                Serás redirigido al login automáticamente...
              </p>
            </div>

            <div className="flex flex-col space-y-3 w-full">
              <Link to="/Login" className="text-center">
                <Button name="Ir al Login" className="bg-sky-500 text-white p-3 w-full rounded-2xl hover:bg-sky-600" />
              </Link>
            </div>
          </div>

          <div>
            <img src={LogoLogin || "/placeholder.svg"} alt="" className="w-150" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-around px-20 pr-30 w-full space-y-10 items-start">
      <header className="flex items-center justify-start">
        <img src={logoDomuHouse || "/placeholder.svg"} alt="" className="w-30" />
        <h1 className="text-sky-500 ml-5">
          DOMU<span className="text-black">HOUSE</span>
        </h1>
      </header>

      <section className="flex items-center gap-20 w-full">
        <div className="flex flex-col items-center shadow-lg border-1 border-gray-100 p-10 rounded-3xl min-w-160 space-y-5">
          <div className="flex items-center space-x-3 w-full">
            <Link to="/recover-password" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={24} />
            </Link>
            <h2 className="text-2xl">Restablecer Contraseña</h2>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <Key className="text-sky-500" size={48} />
            <p className="text-gray-600 text-center">
              Ingresa el código que recibiste en tu correo y tu nueva contraseña.
            </p>
            {email && (
              <p className="text-sm text-gray-500">
                Código enviado a: <span className="text-sky-500 font-medium">{email}</span>
              </p>
            )}
          </div>

          <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="token" className="text-sm font-medium">
                Código de Verificación
              </label>
              <input
                className="p-3 border-gray-400 hover:border-gray-600 focus:outline-none focus:border-sky-500 border-2 rounded-lg w-full mt-1"
                placeholder="🔑 Pega aquí el código completo del correo"
                type="text"
                id="token"
                name="token"
                value={token}
                onChange={handleTokenChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Copia y pega el código completo que recibiste en tu correo electrónico
              </p>
            </div>

            <div>
              <label htmlFor="newPassword" className="text-sm font-medium">
                Nueva Contraseña
              </label>
              <input
                className="p-3 border-gray-400 hover:border-gray-600 focus:outline-none focus:border-sky-500 border-2 rounded-lg w-full mt-1"
                placeholder="🔒 Ingrese su nueva contraseña"
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Nueva Contraseña
              </label>
              <input
                className="p-3 border-gray-400 hover:border-gray-600 focus:outline-none focus:border-sky-500 border-2 rounded-lg w-full mt-1"
                placeholder="🔒 Confirme su nueva contraseña"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                minLength={6}
              />
            </div>

            <Button
              name={isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
              className={`${isLoading ? "bg-gray-400" : "bg-sky-500 hover:bg-sky-600"} text-white p-3 w-full rounded-2xl`}
              disabled={isLoading}
            />
          </form>

          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-gray-600">¿No recibiste el código?</span>
            <Link to="/recover-password" className="text-sm text-sky-500 underline hover:text-sky-700">
              Enviar nuevamente
            </Link>
          </div>
        </div>

        <div>
          <img src={LogoLogin || "/placeholder.svg"} alt="" className="w-150" />
        </div>
      </section>
    </div>
  )
}