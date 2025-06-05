import React from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from "lucide-react";
import logoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import LogoLogin from '../../../assets/images/imagen-login.png'
import { Button } from '../../UI/Button/Button'
import { Header } from '../../Layouts/Header/Header'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

 const URL = "http://localhost:10101/login"

export const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCredentials({
            ...credentials,[name] : value
        })
        // Limpiar error cuando el usuario empiece a escribir
        if (error) setError('')
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

   const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    console.log('Respuesta del backend:', data);

    if (response.ok && data.token) {
      const user = {
        id: data.user.id,
        first_name: data.user.first_name,
        email: data.user.email,
        avatar: data.user.avatar ?? null,
      };

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(user));

      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } else {
      setError(data.message || 'Error al iniciar sesión');
    }

  } catch (error) {
    console.error('Error durante el login:', error);
    setError('Error de conexión. Por favor, intenta de nuevo.');
  } finally {
    setIsLoading(false);
  }
};


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
                    <div className='flex flex-col items-center shadow-lg border-1 border-gray-100 p-10 rounded-3xl min-w-110 space-y-5'>
                        <p className='text-2xl'>Login</p>
                        
                        {/* Mostrar errores si los hay */}
                        {error && (
                            <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className='flex flex-col space-y-3 w-full'>
                            <input 
                                className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' 
                                placeholder='✉ Ingrese su correo' 
                                type='email'
                                id='email'
                                name='email'
                                value={credentials.email}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                            
                            <div className='relative'>
                                <input 
                                    className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' 
                                    placeholder='🔒Ingrese su contraseña' 
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    name='password'
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isLoading}
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

                             <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-sky-500 text-white p-3 w-full rounded-2xl transition-colors ${
                                isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-sky-600 active:bg-sky-700'
                            }`}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
                        </button>
                        </form>

                        <div className='flex items-start mt-2'>
                            <Link to="/recuperar-password" className='text-sm text-sky-500 underline hover:text-sky-700'>
                                ¿Olvidaste tu contraseña?     
                            </Link>     
                        </div>

                       

                        <span>Aun no tienes una cuenta? 
                            <Link to="/Registrarse" className='ml-4 text-sm text-sky-500 underline hover:text-sky-700'>
                                Registrate     
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