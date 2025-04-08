import React from 'react'

export const Button = ({name,style, content, Route, className}) => {
  return (
    <>
    <button className={className} 
      to={Route}
      
      >
        {name}
    </button>
    </>
  )
}
