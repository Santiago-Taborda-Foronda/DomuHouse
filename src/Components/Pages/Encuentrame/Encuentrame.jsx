import React from 'react'
import { Header } from '../../Layouts/Header/Header'

export const Encuentrame = () => {
  return (
    <>
    <Header />
    <div className='flex '>
      <div>
      <section className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-sm">
                    {/* Imagen con dirección encima */}
                    <div className="relative w-full h-52">
                        <img
                            src={Casa}
                            alt="Casa"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 w-full text-white text-sm px-4 py-2 flex items-center gap-1">
                            <span>Ur. La Portada Americana 23 #56</span>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="px-4 pt-2 pb-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Casa Lomas Del Norte</h2>

                        <div className="flex items-center text-gray-600 text-sm gap-4 mb-4">
                            <span className="flex items-center gap-1">
                                Cuartos: <strong>53</strong>
                            </span>
                            <span className="flex items-center gap-1">
                                Baños: <strong>53</strong>
                            </span>
                            <span className="flex items-center gap-1">
                                m²: <strong>53</strong>
                            </span>
                        </div>

                        <hr className="my-2" />

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
      </div>
      <div>

      </div>
    </div>
    </>
  )
}
