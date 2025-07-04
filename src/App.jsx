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
import { ResetPasswordToken } from './Components/Pages/ResetPasswordToken/ResetPasswordToken'
import { ShowInmobiliarias } from './Components/Pages/ShowInmobiliarias/ShowInmobiliarias'
import { InmobiliariaSeleccionada } from './Components/Pages/InmobiliariaSeleccionada/InmobiliariaSeleccionada'
import  MiInmobiliaria from './Components/Pages/MiInmobiliaria/MiInmobiliaria'
import AgregarPropiedad from './Components/Pages/AgregarPropiedad/AgregarPropiedad'
import { Privacidad } from './Components/Pages/PrivacidadYTerminos/Privacidad'
import { Terminos } from './Components/Pages/PrivacidadYTerminos/Terminos'
import AgentDashboard from './Components/Pages/Agente/AgentDashboard'
import MisPropiedades from './Components/Pages/Agente/MisPropiedades'
import { Perfil } from './Components/Pages/Perfil/Perfil'
import CrearPropiedad from './Components/Pages/Agente/CrearPropiedad'
import VisitasAgendadas from './Components/Pages/Agente/VisitasAgendadas'
import ProgramarVisita from './Components/Pages/Agente/ProgramarVisita'
import ContactarCliente from './Components/Pages/Agente/ContactarCliente'
import EstadoInteres from './Components/Pages/Agente/EstadoInteres'
import  UpdateProperty  from './Components/Pages/UpdateProperty/UpdateProperty'
import { GestionAgents } from './Components/Pages/GestionAgents/GestionAgents'
import  TokenGenerationPage  from './Components/Pages/TokenGenerationPage/TokenGenerationPage'
import { DashboardAdmin } from './Components/Pages/DashboardAdmin/DashboardAdmin'
import { Contract } from './Components/Pages/contract/contract'
import { VentasAlquileresAdmin } from './Components/Pages/VentasAlquileresAdmin/VentasAlquileresAdmin'
import { ClientesAdmin } from './Components/Pages/ClientesAdmin/ClientesAdmin'
import { AgendaAdmin } from './Components/Pages/AgendaAdmin/AgendaAdmin'
// import { ReportesInmobiliaria } from "./Components/Pages/ReportesInmobiliaria/ReportesInmobiliaria";
import { GenerarTokenAgente } from './Components/Pages/GenerarTokenAgente/GenerarTokenAgente'
import { MetodosPagoPage } from './Components/Pages/MetodosPagoPage/MetodosPagoPage'

// Importar componentes del Super Admin
import { DashboardSuperAdmin } from "./Components/Pages/SuperAdmin/DashboardSuperAdmin/DashboardSuperAdmin"
import { AnalyticsGlobales } from "./Components/Pages/SuperAdmin/AnalyticsGlobales/AnalyticsGlobales"
import { GestionInmobiliarias } from "./Components/Pages/SuperAdmin/GestionInmobiliarias/GestionInmobiliarias"
import { GestionAdministradores } from "./Components/Pages/SuperAdmin/GestionAdministradores/GestionAdministradores"
import { EditarInmobiliaria } from './Components/Pages/EditarInmobiliaria/EditarInmobiliaria'
import { ReportesInmobiliaria } from './Components/Pages/ReportesInmobiliaria/ReportesInmobiliaria'

// import { ConfiguracionSistema } from "./Components/Pages/SuperAdmin/ConfiguracionSistema/ConfiguracionSistema"
// import { FacturacionSuscripciones } from "./Components/Pages/SuperAdmin/FacturacionSuscripciones/FacturacionSuscripciones"


export const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Tendencias' element={<Tendencias />} />
      <Route path='/Encuentrame' element={<Encuentrame />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Registrarse' element={<Registrarse />} />
      <Route path="/propiedad/:id" element={<PropiedadSeleccionada />} />
      <Route path='/propiedad-seleccionada' element={<PropiedadSeleccionada />} />
      <Route path='/CrearInmobiliarias' element={<CrearInmobiliarias />} />
      <Route path='/registrarseAdministrador' element={<RegistrarseAdministrador />} />
      <Route path="/contact-agent" element={<ContactAgent />} />
      <Route path="/recuperar-password" element={<RecoverPassword />} />
      <Route path="/reset-password-token" element={<ResetPasswordToken />} />
      <Route path="/inmobiliarias" element={<ShowInmobiliarias />} />
      <Route path="/inmobiliaria-seleccionada" element={<InmobiliariaSeleccionada />} />
      <Route path="/mi-inmobiliaria/propiedades" element={<MiInmobiliaria />} />
      <Route path="/agregar-propiedad" element={<AgregarPropiedad />} />
      {/* <Route path="/actualizar-inmobiliaria" element={<ActualizarInmobiliaria />} /> */}
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/metodos-pago" element={<MetodosPagoPage />} />
      <Route path="/Perfil" element={<Perfil />} />
      <Route path="/editar-propiedad/:id" element={<UpdateProperty />} />
      <Route path="/mi-inmobiliaria/gestion-agentes" element={<GestionAgents />} />
      <Route path="/invitar-agente" element={<GenerarTokenAgente />} />
      <Route path="/mi-inmobiliaria/dashboard" element={<DashboardAdmin />} />
      <Route path="/mi-inmobiliaria/contratos" element={<Contract />} />
      <Route path="/mi-inmobiliaria/ventas-alquileres" element={<VentasAlquileresAdmin />} />
      <Route path="/mi-inmobiliaria/clientes" element={<ClientesAdmin />} />
      <Route path="/mi-inmobiliaria/agenda" element={<AgendaAdmin />} />
      <Route path="/mi-inmobiliaria/reportes" element={<ReportesInmobiliaria />} />
      <Route path="/mi-inmobiliaria/configuracion" element={<EditarInmobiliaria />} />
      {/* Rutas del Agente  */}
        <Route path="/AgentDashboard" element={<AgentDashboard />} />
        <Route path="MisPropiedades" element={<MisPropiedades />} />
        <Route path="CrearPropiedad" element={<CrearPropiedad />} />
        <Route path="VisitasAgendadas" element={<VisitasAgendadas />} />
        <Route path="ProgramarVisita" element={<ProgramarVisita />} />
        <Route path="ContactarCliente" element={<ContactarCliente />} />
        <Route path="EstadoInteres" element={<EstadoInteres />} />


         {/* Rutas del Super Admin */}
        <Route path="/super-admin/dashboard" element={<DashboardSuperAdmin />} />
        <Route path="/super-admin/analytics" element={<AnalyticsGlobales />} />
        <Route path="/super-admin/inmobiliarias" element={<GestionInmobiliarias />} />
        <Route path="/super-admin/administradores" element={<GestionAdministradores />} />
        {/* 
        
        <Route path="/super-admin/configuracion" element={<ConfiguracionSistema />} />
        <Route path="/super-admin/facturacion" element={<FacturacionSuscripciones />} /> */}
    
    </Routes>

    
    </>
  )
}
