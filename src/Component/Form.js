import React, { useContext, useEffect } from 'react'
import { TracerContext } from '../context'
import '../Style/style.css'
const Form = () => {
  const ctx = useContext(TracerContext)
  useEffect(() => {
    ctx.setshowactive({CreateSurvey:true})
  } , [])
  return (
    <div className='Form_Container'>Form</div>
  )
}

export default Form