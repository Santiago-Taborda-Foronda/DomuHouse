import React from 'react'
import { Login } from './Components/Pages/Login/Login'
import { Route, Routes } from 'react-router'
import { Header } from './Components/Layouts/Header/Header'
import { Home } from './Components/Pages/Home/Home'
import { Tendencias } from './Components/Pages/Tendencias/Tendencias'
import { Encuentrame } from './Components/Pages/Encuentrame/Encuentrame'
import { Registrarse } from './Components/Pages/Home/Registrarse/Registrarse'
import { PropiedadSeleccionada } from './Components/Pages/PropiedadSeleccionada/PropiedadSeleccionada';
import { ContactAgent } from './Components/Pages/ContactAgent/ContactAgent';


export const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Tendencias' element={<Tendencias />} />
      <Route path='/Encuentrame' element={<Encuentrame />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Registrarse' element={<Registrarse />} />
      <Route path='/propiedad-seleccionada' element={<PropiedadSeleccionada />} />
      <Route path="/contact-agent" element={<ContactAgent />} />
      
    </Routes>
    </>
  )
}

