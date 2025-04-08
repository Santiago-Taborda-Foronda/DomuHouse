import React from 'react'
import { Login } from './Components/Pages/Login/Login'
import { Route, Routes } from 'react-router'
import { Header } from './Components/Layouts/Header/Header'
import { Home } from './Components/Pages/Home/Home'
import { Tendencias } from './Components/Pages/Tendencias/Tendencias'
import { Encuentrame } from './Components/Pages/Encuentrame/Encuentrame'

export const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Tendencias' element={<Tendencias />} />
      <Route path='/Encuentrame' element={<Encuentrame />} />
      
      
    </Routes>
    </>
  )
}

