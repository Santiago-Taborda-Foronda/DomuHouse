import React from 'react';
import LogoRobot from '../../../assets/images/robot.png'
import Casa from '../../../assets/images/casa.jpg'
import { Button } from '../../UI/Button/Button'
import "../../../App"

export const Main = () => {
    return (
        <>
            <div className="bg-[url('src/assets/images/casLujo2.jpg')] bg-cover bg-center h-[800px]  flex flex-col justify-center items-center text-white text-center">

                <h1 className="font-bold text-4xl mb-8">Encuentra Tu Lugar Ideal</h1>

                <div className="flex gap-4 mb-6">
                    <Button name="Venta" className="bg-[#2F8EAC] text-white rounded-2xl px-10 p-2" />
                    <Button name="Arriendo" className="bg-transparent border border-white text-white rounded-2xl px-10 p-2" />
                </div>

                <form className="flex bg-white rounded-full shadow-lg px-4 py-3 gap-4 items-center w-[90%] max-w-5xl">

                    <div className="flex flex-col w-40">
                        <label className="text-xs text-gray-500 text-left ml-2 mb-1">Tipo</label>
                        <select className="border-none bg-transparent focus:outline-none text-sm text-gray-800 px-2">
                            <option value="casa">Casa</option>
                            <option value="apartamento">Apartamento</option>
                            <option value="local">Local Comercial</option>
                        </select>
                    </div>

                    <div className="flex flex-col w-40">
                        <label className="text-xs text-gray-500 text-left ml-2 mb-1">Ubicación</label>
                        <input
                            type="text"
                            name="ubicacion"
                            placeholder="Norte"
                            className="border-none bg-transparent focus:outline-none text-sm text-gray-800 px-2"
                        />
                    </div>

                    <div className="flex flex-col w-48">
                        <label className="text-xs text-gray-500 text-left ml-2 mb-1">Palabra clave</label>
                        <input
                            type="text"
                            name="palabraClave"
                            placeholder="Búsqueda por palabra"
                            className="border-none bg-transparent focus:outline-none text-sm text-gray-800 px-2"
                        />
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-2 border border-[#2F8EAC] text-[#2F8EAC] rounded-full px-4 py-2 text-sm"
                    >
                        Búsqueda avanzada
                    </button>

                    <button
                        type="submit"
                        className="bg-[#2F8EAC] text-white rounded-full px-6 py-2 text-sm"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            <section className="flex items-stretch w-full text-white relative">
                {/* Sección azul con el fondo en forma de flecha */}
                <div className="flex items-center gap-6 pl-10 pr-16 py-10 bg-[#2F8EAC] clip-polygon w-[75%]">
                    <img src={LogoRobot} alt="Robot" className="w-16 h-16" />
                    <div>
                        <h2 className="text-2xl font-bold mb-1">¿Tienes alguna duda?</h2>
                        <p className="text-lg">Pregúntame y te guío paso a paso</p>
                    </div>
                </div>

                {/* Botón a la derecha en fondo gris */}
                <div className="flex items-center justify-center bg-[#E9E9E9] w-[25%]">
                    <Button
                        name="Pregúntanos aquí"
                        className="bg-transparent border border-[#2F8EAC] text-[#2F8EAC] rounded-2xl px-6 py-2"
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

                <section className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-sm">

                    <div className="px-4 pt-2 pb-4">
                        {/* Dirección */}
                        <div className="relative w-full h-48">
                            <img src={Casa} alt="Casa" className="w-full h-48" />

                            <div className="absolute bottom-2 left-2 text-white text-sm px-2 py-1 rounded flex items-center gap-1">
                               
                                <span>Ur. La Portada Americana 23 #56</span>
                            </div>
                        </div>


                        {/* Título */}
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Casa Lomas Del Norte</h2>

                        {/* Info general */}
                        <div className="flex items-center text-gray-600 text-sm gap-4 mb-4">
                            <span className="flex items-center gap-1">
                                53
                            </span>
                            <span className="flex items-center gap-1">
                                53
                            </span>
                            <span className="flex items-center gap-1">
                                53 m²
                            </span>
                        </div>

                        <hr className="my-2" />

                        {/* Agente y precio */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <img

                                    alt="Jane Doe"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-800">Jane Doe</span>
                            </div>
                            <span className="text-base font-semibold text-gray-900">$7250,00</span>
                        </div>
                    </div>
                </section>
                <Button
                    name="➡ Ver Más"
                    className="bg-[#2F8EAC] border border-[#2F8EAC] text-white rounded-3xl px-6 py-2 flex items-center gap-2"
                />
            </section>
        </>
    )
}
