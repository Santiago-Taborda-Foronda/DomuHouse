import React from 'react';
import  LogoRobot from '../../../assets/images/robot.png'
import { Button } from '../../UI/Button/Button';

export const Main = () => {
    return (
        <>
            <div className="bg-[url('src/assets/images/casaLujo4.jpg')] bg-cover bg-center h-[500px] flex flex-col justify-center items-center text-white text-center">

                <h1 className="font-bold text-4xl mb-8">Encuentra Tu Lugar Ideal</h1>

                <div className="flex gap-4 mb-6">
                    <Button name="Venta" className="bg-sky-500 text-white rounded-2xl px-10 p-2" />
                    <Button name="Arriendo" className="bg-transparent border border-white text-white rounded-2xl px-10 p-2" />
                </div>

                <form className="flex bg-white rounded-2xl shadow-lg p-4 gap-4 items-center w-[90%] max-w-5xl">

                    <select className="border border-gray-300 rounded-2xl p-2 text-gray-700">
                        <option value="">Tipo de Inmueble</option>
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="local">Local Comercial</option>
                    </select>

                    <input
                        type="text"
                        name="ubicacion"
                        placeholder="Ubicación"
                        className="border border-gray-300 rounded-2xl p-2 text-gray-700"
                    />

                    <input
                        type="text"
                        name="palabraClave"
                        placeholder="Palabra clave"
                        className="border border-gray-300 rounded-2xl p-2 text-gray-700"
                    />

                    <Button
                        name="Búsqueda avanzada"
                        className="bg-white border border-sky-500 text-sky-500 rounded-2xl px-4 py-2 flex items-center gap-2"
                    />

                    <Button
                        name="Buscar"
                        className="bg-sky-500 text-white rounded-2xl px-6 py-2"
                    />

                </form>

            </div>

            <section className="flex items-center bg-[#2F8EAC] rounded-2xl overflow-hidden text-white relative">
            
                <div className="flex items-center gap-6 p-8 flex-1">
                    <img src={LogoRobot} alt="Robot" className="w-16 h-16" />

                    <div>
                        <h2 className="text-3xl font-bold mb-2">¿Tienes alguna duda?</h2>
                        <p className="text-lg">Pregúntame y te guío paso a paso</p>
                    </div>
                </div>

                <div className="w-10 h-full bg-[#2F8EAC] transform rotate-45 origin-left"></div>

                <div className="flex items-center bg-white rounded-2xl overflow-hidden mx-6 px-4 py-2 text-[#3187A5]">
                    <input
                        type="text"
                        name="preguntanosAqui"
                        placeholder="Pregúntanos aquí"
                        className="p-2 text-gray-700 outline-none"
                    />
                </div>
            </section>


        </>
    )
}
