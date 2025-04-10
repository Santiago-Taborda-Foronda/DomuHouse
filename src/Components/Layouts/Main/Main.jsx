import React from 'react';
import LogoRobot from '../../../assets/images/robot.png'
import Casa from '../../../assets/images/casa.jpg'
import { Button } from '../../UI/Button/Button';

export const Main = () => {
    return (
        <>
            <div className="bg-[url('src/assets/images/casLujo2.jpg')] bg-cover bg-center h-[800px]  flex flex-col justify-center items-center text-white text-center">

                <h1 className="font-bold text-4xl mb-8">Encuentra Tu Lugar Ideal</h1>

                <div className="flex gap-4 mb-6">
                    <Button name="Venta" className="bg-[#2F8EAC] text-white rounded-2xl px-10 p-2" />
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
                        className="bg-white border border-[#2F8EAC] text-[#2F8EAC] rounded-2xl px-4 py-2 flex items-center gap-2"
                    />

                    <Button
                        name="Buscar"
                        className="bg-[#2F8EAC] text-white rounded-2xl px-6 py-2"
                    />

                </form>

            </div>

            <section className="flex items-center bg-[#2F8EAC] overflow-hidden text-white relative">
                <div className="flex items-center gap-15 p-10 flex-1">
                    <img src={LogoRobot} alt="Robot" className="w-20 h-20" />

                    <div className='text-4xl '>
                        <h2 className="font-bold mb-2">¿Tienes alguna duda?</h2>
                        <p className="">Pregúntame y te guío paso a paso</p>
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

            <section className='flex flex-col items-center gap-4 m-15'>
                <h3 className='text-2xl text-[#2F8EAC]'>Propiedades Destacadas</h3>
                <h2 className='text-4xl font-bold'>Recomendaciones Para Ti</h2>

                <div className='flex gap-5'>
                    <Button
                        name="Ver Todo"
                        className="bg-[#2F8EAC] border border-[#2F8EAC] text-white rounded-3xl px-6 py-2 flex items-center gap-2"
                    />

                    <Button
                        name="Apartamento"
                        className="bg-[#F4F4F4]  text-black rounded-3xl px-6 py-2"
                    />

                    <Button
                        name="Villa"
                        className="bg-[#F4F4F4]  text-black rounded-3xl px-6 py-2"
                    />

                    <Button
                        name="Casa"
                        className="bg-[#F4F4F4] text-black rounded-3xl px-6 py-2"
                    />
                </div>
                {/* <div className='flex flex-col items-start rounded-2xl '>
                    <div >
                    <img src={Casa} alt="Casa" className='w-70 h-70' />
                    <h2>Casa Lomas Del Norte</h2>
                </div>

                </div>
                 */}

                <section className='bg-white rounded-2xl shadow-md '>
                    <img src={Casa} alt="Casa" className='w-full h-48' />

                    <div className='flex items-center px-4 pt-4'>
                        <span className='text-white text-sm flex items-center gap-2'>Ur. La Portada Americana</span>
                    </div>

                    <div className='px-4 pt-2 pb-4'>
                        <h2 className=' text-xl mb-2'>Casa Lomas Del Norte</h2>

                        <div className='flex items-center text-gray-600 text-sm gap-4 mb-4'>
                            <span className="flex items-center gap-1">53</span>
                            <span className="flex items-center gap-1">53</span>
                            <span className="flex items-center gap-1">53</span>
                        </div>

                        <hr className='my-2'/>
                        <div className='flex items-center justify-between mt-4'>
                            <div className='flex items-center gap-2'>
                                <img src="" alt="" className='w-8 h-8 rounded-full' />
                                <span>Mariana</span>
                            </div>
                            <span>$7.250.000</span>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}
