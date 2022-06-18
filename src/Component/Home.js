import React, { useContext, useEffect } from 'react'
import { TracerContext } from '../context'
import '../Style/style.css'
const Home = () => {
  const ctx = useContext(TracerContext)
  useEffect(() => {
    ctx.setshowactive({'Home':true})
    

  } , [])
  return (
    <div className='Home__Container'>
        <h1>Welcome To Graduate Tracer Survey System</h1>
        {/* <div className="Summary__Container">
          <h1>10</h1>
          <p>Forms Created</p>
        </div>
        <div className="Summary__Container">
          <h1>10</h1>
          <p>Forms Drafted</p>
        </div> */}

    </div>
  )
}

export default Home