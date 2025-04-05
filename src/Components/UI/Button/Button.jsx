import React from 'react'

export const Button = ({name,style, className}) => {
  return (
    <>
    <button className={className}>
        {name}
    </button>
    </>
  )
}
