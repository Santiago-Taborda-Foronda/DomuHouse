import React from 'react'
import  LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'

export const Login = () => {
  return (
    <>
    <header className='flex items-center'>
        <img 
            src={LogoDomuHouse} 
            alt=""  
            className='w-30' 
        />
        <h1 className='text-sky-500 ml-5'>DOMU<span className='text-black'>HOUSE</span></h1>
    </header>

    <section className='flex justify-center items-center'>
        <div className='flex flex-col items-center shadow-2xl p-10'>
            <p className='text-2xl'>Login</p>
            <form className='flex flex-col space-y-3'>
                <input placeholder='✉ Ingrese su correo'></input>
                <input placeholder='🔒Ingrese su contraseña'></input>
            </form>
        </div>
        <div>
        <img 
            src={LogoDomuHouse} 
            alt=""  
            className='w-30' 
        />
        </div>
    </section>
    
    </>
  )
}
