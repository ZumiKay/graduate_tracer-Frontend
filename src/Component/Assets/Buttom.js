import React from 'react'
import '../../Style/style.css'
const Buttom = (props) => {
  const style ={
    ...props.style
  }
  return (
    <button style={style} className='custom__button' {...props.options}> {props.label} </button>
  )
}
 
export default Buttom