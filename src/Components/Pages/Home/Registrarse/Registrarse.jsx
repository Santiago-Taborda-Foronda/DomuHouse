import React from 'react'
import  logoDomuHouse from '../../../../assets/images/Logo-DomuHouse.png'
import  LogoLogin from '../../../../assets/images/imagen-login.png'
import { Button } from '../../../UI/Button/Button'
import { Header } from '../../../Layouts/Header/Header'
import { Link } from 'react-router'
import { useState } from 'react'
import { Eye, EyeOff } from "lucide-react";

export const Registrarse = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCredentials({
            ...credentials,[name] : value
        })
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const handelSubmit = (e) =>{
        e.preventDefault();

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

    <section className='flex  items-center  gap-20  w-full'>
        <div className='flex flex-col items-center shadow-lg border-1 border-gray-100 p-10 rounded-3xl min-w-160 space-y-5'>
            <p className='text-2xl'>Registrarse</p>
            <form className='flex flex-col space-y-3 w-full'>
                <label htmlFor="">Nombre</label>
                <input className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' placeholder='Ingrese su Nombre'></input>
                <label htmlFor="">Apellidos</label>
                <input className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' placeholder='Ingrese sus Apellidos'></input>
                <label htmlFor="">Correo</label>
                <input 
                className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' 
                placeholder='✉ Ingrese su correo' 
                type='emai'
                id='email'
                name='email'
                value={credentials.email}
                onChange={handleInputChange}
                required
                >
                </input>
                <label htmlFor="">Contraseña</label>
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
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                        onClick={togglePasswordVisibility}
                        >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>                
            </form>

            <div className='flex justify-around items-start mt-2' >    
                <Link to="/recuperar-password" className='text-sm text-sky-500 underline hover:text-sky-700'>
                    ¿Olvidaste tu contraseña?     
                </Link>    
            </div>

            <Button name = 'Crear Cuenta' className='bg-sky-500 text-white p-3 w-full rounded-2xl' />
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
