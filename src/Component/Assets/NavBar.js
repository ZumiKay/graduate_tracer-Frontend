import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../Style/style.css'
import { Assetimg, NavIcons } from './Image/Images'
import { Link, useLocation } from 'react-router-dom' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular, solid} from '@fortawesome/fontawesome-svg-core/import.macro' 
import Notification from './Notification'
import { TracerContext } from '../../context'

const NavBar = () => {
  const [showdetail , setshowdetail] = useState({})
  const ctx = useContext(TracerContext)
  

  return (
    <div className='Nav_Container'>
      <header className='Nav_Header'>
        <img onClick={() => console.log(ctx.showactive['Home'])} src={Assetimg.Logo} alt="Logo" />
      </header>
      {NavIcons.map(icon => (
       <div>
        <Link onMouseOver={() => setshowdetail({...showdetail , [icon.name]: true})} onMouseLeave={() => setshowdetail({...showdetail , [icon.name]: false})} className='nav_Link' to={'/' + icon.route}>
        <img style={ctx.showactive[icon.name] ? {filter:'grayscale(1)'} : {filter:'grayscale(0)'}  } className='nav_icon' src={icon.url} alt={icon.name}/>
        </Link>
       {showdetail[icon.name] ?  <span className='hover_detail'> <p> {icon.name} </p> </span> : ''}
        
    </div>
       
      ))}
      <div className='nav_Link'>
      <img className='nav_icon' src={Assetimg.Logout} alt={'Logout'}/>
      </div>
        
     
     
     
      
    </div>
  ) 
}

export default NavBar

export const Topnavbar = () => {
  const [icon , seticon] = useState(false)
  const [showNotifi , setshownotifi] = useState(false)
  const [showtitle , setshowtitle] = useState(false)
  const topnavref = useRef()
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname.replace('/' , '')
    if(path === 'create-form') {
      setshowtitle(true)
    } else {
      setshowtitle(false)
    }
    
    window.addEventListener('mousedown' , close)

    return () => window.removeEventListener('mousedown' , close)
   } , [location.pathname])
  const close = (e) => {
    if(topnavref.current && !topnavref.current.contains(e.target)){
      setshownotifi(false)
    }
  }
  return (
    <div ref={topnavref} className="topnav_Container">
      <div className='title__header'>
        {showtitle ? <h1>Untitle Form</h1> : <h1>Graduate Tracer</h1>}
      </div>
      <div onClick={() => setshownotifi(!showNotifi)} onMouseOver={() => seticon(true)} onMouseLeave={() => seticon(false)} className='notifi__Container'>
      <FontAwesomeIcon className='bell_Icon' icon={icon ? solid('bell') : regular('bell')} size="2x"/>
      <span className='notifi__Num'> </span>
      {showNotifi ? <span className='top_arow'></span> : ''}
     </div>
     {showNotifi ? <Notification/> : ''}
    </div>
    
  )
}