import React from 'react'
import  logoDomuHouse from '../../../../assets/images/Logo-DomuHouse.png'
import  LogoLogin from '../../../../assets/images/imagen-login.png'
import { Button } from '../../../UI/Button/Button'
import { Header } from '../../../Layouts/Header/Header'

export const Registrarse = () => {
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
        <div className='flex flex-col items-center shadow-lg border-1 border-gray-100 p-10 rounded-3xl min-w-110 space-y-5'>
            <p className='text-2xl'>Registrarse</p>
            <form className='flex flex-col space-y-3 w-full'>
                <label htmlFor="">Nombre</label>
                <input className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' placeholder='Ingrese su Nombre'></input>
                <label htmlFor="">Apellidos</label>
                <input className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' placeholder='🔒Ingrese sus Apellidos'></input>
                <label htmlFor="">Correo</label>
                <input className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' placeholder='✉ Ingrese su Correo'></input>
                <label htmlFor="">Contraseña</label>
                <input className='p-3 border-gray-400 hover:border-gray-600 focus:outline-none border-2 rounded-lg w-full' placeholder='🔒Ingrese su Contraseña'></input>
            </form>

            <div className='flex justify-around items-start gap-8 mt-4' >
                <label className='flex items-center gap-2 mt4 text-sm'>
                    <input 
                        type='checkbox'
                        className='appearance-none w-4 h-4 border-2 border-sky-500 rounded-full checked:bg-sky-500 focus:outline-none'
                    />
                    <span>Recordar contraseña</span>    
                </label>
                    
                <a href="###" className='text-sm text-sky-500 underline hover:text-sky-700'>
                    Olvidaste tu contraseña?     
                </a>    
            </div>

            <Button name = 'Entrar' className='bg-sky-500 text-white p-3 w-full rounded-2xl' />
            <span>Aun no tienes una cuenta? <a href="###" className='text-sm text-sky-500 underline hover:text-sky-700'>Registrate</a></span>
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
