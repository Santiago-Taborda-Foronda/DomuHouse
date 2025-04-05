import React from 'react'
import  LogoDomuHouse from '../../../assets/images/Logo-DomuHouse.png'
import { Navbar } from '../Navbar/Navbar'
import { ItemsNavbar } from '../../UI/ItemsNavbar/ItemsNavbar'
import { Button } from '../../UI/Button/Button'

export const Header = () => {
  return (
    <header className='flex items-center'>
      <div>
        <img 
          src={LogoDomuHouse} 
          alt="LogoDomuHouse"
          className='w-23' 
        />
      </div>
      <div className='flex justify-between w-full items-center'>
        <Navbar >
        <ul className='flex space-x-3 ml-3 '>
          <ItemsNavbar content='Inicio'/>
          <ItemsNavbar content='Tendencias'/>
          <ItemsNavbar content='Encuentrame'/>
        </ul>
      </Navbar>

      <div className='space-x-2 mr-4'>
      <Button name = 'Regístrate' className='bg-sky-500 p-3 w-30 rounded-2xl'/>
      <Button name = 'Iniciar' className= 'bg-sky-500 p-3 w-30 rounded-2xl'/>
      </div>
      </div>
      
    </header>
  )
}
