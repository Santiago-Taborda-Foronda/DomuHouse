import React from 'react'
import { Button } from '../../UI/Button/Button'

export const Main = () => {
    return (
        <>
            <div className="relative bg-[url('src/assets/images/casaLujo.jpg')]  bg-cover bg-center h-[600px] ">
         
                <h1 className='flex justify-center items-center font-bold text-4xl'>Encuentra Tu Lugar Ideal</h1>

                <form className='flex bg-white rounded-2xl'>

                    <div className=''>
                        <Button name='Venta' className='bg-sky-500 text-white rounded-2xl p-3 '>Venta</Button>
                        <Button name='Arriendo' className='bg-sky-500 text-white rounded-2xl p-3 '>Arriendo </Button>
                    </div>

                    <select  className=''>
                        <option value="">Tipo de Inmueble</option>
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="local">Local Comercial</option>
                    </select>

                    <input type="text" name="ubicacion" placeholder="Ubicación" />

                    <input type="number" name="habitaciones" placeholder="Número de habitaciones" min="1" />

                    <Button name='Buscar' className='bg-sky-500 text-white rounded-2xl p-3 '>Buscar </Button>

                </form>

            </div>
        </>
    )
}
