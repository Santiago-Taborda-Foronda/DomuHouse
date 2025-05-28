import React from 'react'
import logoDomuHouse from '../../../../assets/images/Logo-DomuHouse.png'
import LogoLogin from '../../../../assets/images/imagen-login.png'
import { Button } from '../../../UI/Button/Button'
import { Header } from '../../../Layouts/Header/Header'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { Eye, EyeOff } from "lucide-react";

export const Registrarse = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone:"",
        email: "",
        password: ""
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData, [name]: value
        })
        // Limpiar mensajes cuando el usuario empiece a escribir
        if (error) setError('')
        if (success) setSuccess('')
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setError('')
        setSuccess('')

        // Validaciones básicas del frontend
        if (!formData.first_name.trim()) {
            setError('El nombre es requerido')
            setIsLoading(false)
            return
        }
        
        if (!formData.last_name.trim()) {
            setError('Los apellidos son requeridos')
            setIsLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setIsLoading(false)
            return
        }

        try {
            // Aquí es donde tu backend developer agregará la lógica de registro
            const response = await fetch("http://localhost:10101/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (response.ok) {
                // Registro exitoso
                
                // Opción 1: Redirigir al login con mensaje de éxito
                setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...')
                setTimeout(() => {
                    navigate('/Login', { 
                        state: { 
                            message: 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.' 
                        }
                    })
                }, 2000)

                // Opción 2: Auto-login después del registro (descomenta si prefieres esta opción)
                /*
                if (data.token) {
                    localStorage.setItem('authToken', data.token)
                    localStorage.setItem('userData', JSON.stringify({
                        id: data.user.id,
                        name: `${formData.nombre} ${formData.apellidos}`,
                        email: data.user.email,
                        avatar: data.user.avatar || null
                    }))

                    // Disparar evento para que el Header se actualice
                    window.dispatchEvent(new Event('storage'))

                    // Redirigir al home
                    navigate('/')
                }
                */
                
            } else {
                // Mostrar error del servidor
                setError(data.message || 'Error al crear la cuenta')
            }

        } catch (error) {
            console.error('Error durante el registro:', error)
            setError('Error de conexión. Por favor, intenta de nuevo.')
        } finally {
            setIsLoading(false)
        }
}

    return (
        <>
            <div className='flex flex-col justify-around px-20 pr-30 w-full space-y-10 items-start'>
                <header className='flex items-center justify-start'>
                    <img 
                        src={logoDomuHouse} 
                        alt=""  
                        className='w-30' 
                    />
                    <h1 className='text-sky-500 ml-5'>DOMU<span className='text-black'>HOUSE</span></h1>
                </header>

                <section className='flex items-center gap-20 w-full'>
                    <div className='flex flex-col items-center shadow-lg border-1 border-gray-100 p-10 rounded-3xl min-w-160 space-y-5'>
                        <p className='text-2xl'>Registrarse</p>
                        
                        {/* Mostrar errores si los hay */}
                        {error && (
                            <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Mostrar mensaje de éxito */}
                        {success && (
                            <div className="w-full p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className='flex flex-col space-y-3 w-full'>
                            <label htmlFor="nombre">Nombre</label>
                            <input 
                                className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' 
                                placeholder='Ingrese su Nombre'
                                type='text'
                                id='nombre'
                                name='first_name'
                                value={formData.first_name}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                            
                            <label htmlFor="apellidos">Apellidos</label>
                            <input 
                                className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' 
                                placeholder='Ingrese sus Apellidos'
                                type='text'
                                id='apellidos'
                                name='last_name'
                                value={formData.last_name}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                            
                            <label htmlFor="email">Correo</label>
                            <input 
                                className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' 
                                placeholder='✉ Ingrese su correo' 
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                            
                            <label htmlFor="password">Contraseña</label>
                            <div className='relative'>
                                <input 
                                    className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' 
                                    placeholder='🔒Ingrese su contraseña' 
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isLoading}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                                    onClick={togglePasswordVisibility}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>                
                        </form>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`bg-sky-500 text-white p-3 w-full rounded-2xl transition-colors ${
                                isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-sky-600 active:bg-sky-700'
                            }`}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>

                        <span>Ya tienes cuenta?
                            <Link to="/Login" className='ml-4 text-sm text-sky-500 underline hover:text-sky-700'>
                                Ingresar     
                            </Link>  
                        </span>
                    </div>

                    <div>
                        <img 
                            src={LogoLogin} 
                            alt=""  
                            className='w-150' 
                        />
                    </div>
                </section>
            </div>
        </>
    )
}