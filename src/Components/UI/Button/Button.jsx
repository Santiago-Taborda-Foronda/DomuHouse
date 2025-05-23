import React from 'react'
import { useNavigate } from 'react-router'

export const Button = ({name, content, Route, className}) => {

  const navigate = useNavigate ()
  const handleClick = () =>{
    if(Route){
      navigate(Route)
    }
  }

  return (
    <>
    <button className={className} 
      onClick={handleClick}
      >
        {name}
    </button>
    </>
  )
}
