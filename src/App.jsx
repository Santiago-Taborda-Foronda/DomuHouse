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
import {CrearInmobiliarias} from './Components/Pages/Inmobiliarias/CrearInmobiliarias'
import { RegistrarseAdministrador } from './Components/Pages/Administrador/RegistrarseAdministrador/RegistrarseAdministrador'
import { RecoverPassword } from './Components/Pages/RecoverPassword/RecoverPassword'
import { ShowInmobiliarias } from './Components/Pages/ShowInmobiliarias/ShowInmobiliarias'
import { InmobiliariaSeleccionada } from './Components/Pages/InmobiliariaSeleccionada/InmobiliariaSeleccionada'
import  MiInmobiliaria from './Components/Pages/MiInmobiliaria/MiInmobiliaria'
import AgregarPropiedad from './Components/Pages/AgregarPropiedad/AgregarPropiedad'
import { Privacidad } from './Components/Pages/PrivacidadYTerminos/Privacidad'
import { Terminos } from './Components/Pages/PrivacidadYTerminos/Terminos'
import { Perfil } from './Components/Pages/Perfil/Perfil'
import  UpdateProperty  from './Components/Pages/UpdateProperty/UpdateProperty'


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
      <Route path='/CrearInmobiliarias' element={<CrearInmobiliarias />} />
      <Route path='/registrarseAdministrador' element={<RegistrarseAdministrador />} />
      <Route path="/contact-agent" element={<ContactAgent />} />
      <Route path="/recuperar-password" element={<RecoverPassword />} />
      <Route path="/inmobiliarias" element={<ShowInmobiliarias />} />
      <Route path="/inmobiliaria-seleccionada" element={<InmobiliariaSeleccionada />} />
      <Route path="/MiInmobiliaria" element={<MiInmobiliaria />} />
      <Route path="/agregar-propiedad" element={<AgregarPropiedad />} />
      {/* <Route path="/actualizar-inmobiliaria" element={<ActualizarInmobiliaria />} /> */}
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/Perfil" element={<Perfil />} />
      <Route path="/editar-propiedad/:id" element={<UpdateProperty />} />
    </Routes>
    </>
  )
}
