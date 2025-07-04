"use client"
import logoDomuHouse from "../../../assets/images/Logo-DomuHouse.png"
import LogoLogin from "../../../assets/images/imagen-login.png"
import { Button } from "../../UI/Button/Button"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export const RecoverPassword = () => {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("https://domuhouse.onrender.com/api/password/recuperar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al enviar el correo")
      }

      setIsSubmitted(true)
      console.log("✅ Correo enviado:", data.message)

      // Navegar automáticamente a la interfaz de token después de 2 segundos
      setTimeout(() => {
        navigate("/reset-password-token", { state: { email } })
      }, 2000)
    } catch (error) {
      console.error("❌ Error:", error.message)
      alert("No se pudo enviar el correo: " + error.message)
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
              <h2 className="text-2xl font-semibold text-center">¡Correo Enviado!</h2>
              <p className="text-gray-600 text-center">
                Hemos enviado las instrucciones para restablecer tu contraseña a:
              </p>
              <p className="text-sky-500 font-medium">{email}</p>
              <p className="text-sm text-gray-500 text-center">
                Revisa tu bandeja de entrada y sigue las instrucciones del correo. Si no lo encuentras, revisa tu
                carpeta de spam.
              </p>
              <p className="text-sm text-sky-600 text-center font-medium">
                Serás redirigido automáticamente en unos segundos...
              </p>
            </div>

            {/* <div className="flex flex-col space-y-3 w-full">
              <Button
                name="Intentar con otro correo"
                className="bg-gray-200 text-gray-700 p-3 w-full rounded-2xl hover:bg-gray-300"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
              />

              <Link to="/Login" className="text-center">
                <Button
                  name="Volver al Login"
                  className="bg-sky-500 text-white p-3 w-full rounded-2xl hover:bg-sky-600"
                />
              </Link>
            </div> */}
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
            <Link to="/registrarse" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={24} />
            </Link>
            <h2 className="text-2xl">Recuperar Contraseña</h2>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <Mail className="text-sky-500" size={48} />
            <p className="text-gray-600 text-center">
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
            </p>
          </div>

          <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit}>
            <label htmlFor="email" className="text-sm font-medium">
              Correo Electrónico
            </label>
            <input
              className="p-3 border-gray-400 hover:border-gray-600 focus:outline-none focus:border-sky-500 border-2 rounded-lg w-full"
              placeholder="✉ Ingrese su correo electrónico"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
            />

            <Button
              name={isLoading ? "Enviando..." : "Enviar Instrucciones"}
              className={`${isLoading ? "bg-gray-400" : "bg-sky-500 hover:bg-sky-600"} text-white p-3 w-full rounded-2xl`}
              disabled={isLoading}
            />
          </form>

          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-gray-600">¿Recordaste tu contraseña?</span>
            <Link to="/Login" className="text-sm text-sky-500 underline hover:text-sky-700">
              Volver al Login
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
