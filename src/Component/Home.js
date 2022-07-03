import React, { useContext, useEffect } from 'react'
import { TracerContext } from '../context'
import '../Style/style.css'
import { Link } from 'react-router-dom'
const Home = ({survey}) => {
  const ctx = useContext(TracerContext)
  useEffect(() => {
    ctx.setshowactive({'Home':true})
    ctx.settitle('')

  } , [])
  return (
    <div style={ctx.showdialog ? {opacity: ".5"} : {opacity:"1"}} className='Home__Container'>
        <h1 className='Home__Header'>Welcome To Graduate Tracer Survey System</h1>
        <section className="Summary__Section">
        <div style={{cursor:"none"}} className="Summary__Container">
          <h1 className='Summary__header'>{survey.length}</h1>
          <p>Survey Created</p>
        </div>
       
        </section>
        <hr className='Line' />
        <div className='AllForm_Container'>
          <h1>All Surveys</h1>
          <div className='Box_Container'>
            {survey.map((item) => (
              <Link className='Form__Box' to={`/form/${item._id}`}>
              
               <h1 className='Form__Title'> {item.title} </h1>
               <p>Date Created: </p>
             
             </Link>

            ))}
         
         
          </div>
        </div>

    </div>
  )
}

export default Home