import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../Style/style.css'
import { Assetimg, NavIcons } from './Image/Images'
import { Link, useLocation, useNavigate } from 'react-router-dom' 
import { TracerContext } from '../../context'
import axios from 'axios'
import { env } from '../../environment'
import Diaglog, { FormDiaglog } from './Diaglog'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'

const NavBar = ({setclose}) => {
  const [showdetail , setshowdetail] = useState({})
  const [open , setopen] = useState(false)
  const [showclose , setshowclose] = useState(false)
  const ctx = useContext(TracerContext)
  let navigate = useNavigate()
  
  useEffect(() => {
    closebtn()
    window.addEventListener('resize' , closebtn) 


    return (() => {
      window.removeEventListener("resize" , closebtn)
    })
   
  } , [])
  
  const closebtn = () => {
    if(window.innerWidth < 500) {
      setshowclose(true) 
    } else {
      setshowclose(false)
    }
  }
  const handleLogout = async () => {
    await axios({
      method:"GET",
      url:env.API_URL + "/logout"
    }).then(() => {
      localStorage.removeItem('auth')
      navigate("/" , {replace:true})
    })
    window.location.reload()
  }
  

  return (
    <div className='Nav_Container'>
      <header className='Nav_Header'>
        <img onClick={() => console.log(ctx.showactive['Home'])} src={Assetimg.Logo} alt="Logo" />
      </header>
      {showclose && <Button onClick={() => setclose(true)}>Close</Button>}
      {NavIcons.map(icon => (
       <div>
        {icon.name === 'CreateSurvey' ? 
        <p onClick={() => setopen(true)} className='create_Link' onMouseOver={() => setshowdetail({...showdetail , [icon.name]: true})} onMouseLeave={() => setshowdetail({...showdetail , [icon.name]: false})}>
        <img style={ctx.showactive[icon.name] ? {filter:'grayscale(1)'} : {filter:'grayscale(0)'}  } className='nav_icon' src={icon.url} alt={icon.name}/>
        </p> :
        <>
        <Link onClick={() => {
          if(icon.name === 'CreateSurvey') {
            ctx.setshowdialog(true)
            
          }
        }} onMouseOver={() => setshowdetail({...showdetail , [icon.name]: true})} onMouseLeave={() => setshowdetail({...showdetail , [icon.name]: false})} className='nav_Link' to={'/' + icon.route}>
        <img style={ctx.showactive[icon.name] ? {filter:'grayscale(1)'} : {filter:'grayscale(0)'}  } className='nav_icon' src={icon.url} alt={icon.name}/>
        </Link></>
       
      }
      {showdetail[icon.name] ?  <span style={ icon.name === "CreateSurvey" ? {top:"220px"} : {}} className='hover_detail'> <p> {icon.name} </p> </span> : ''}
      
    </div>
       
      ))}
      <hr />
      <div onClick={() => handleLogout()}  className='nav_Link'>
      <img className='nav_icon' src={Assetimg.Logout} alt={'Logout'}/>
      </div>
      {open && <Diaglog open={setopen}/>}
      
      
     
     
     
      
    </div>
  ) 
}

export default NavBar

export const Topnavbar = ({data}) => {
  
  
  
  const topnavref = useRef()
  const location = useLocation()
  const ctx = useContext(TracerContext)

  useEffect(() => {
    
   
    
  
   } , [data, location.pathname])
   const handleSave = () => {
    ctx.setedit(false)
    axios({
      method:"PUT" ,
      url:env.API_URL + "/updateform",
      headers:{
        "x-access-token": env.auth.accessToken
      },
      data: {
        id: data._id,
        title: data.title,
        content: ctx.surveys
      }
    }).then(() => {
      toast.info("Saved" , {
        position:"top-right",
        autoClose:1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
       })
    }).catch((err) => console.log(err))
   }
   const handlenewTap = (url) => {
      const newTab = window.open(url , '_blank', 'noopener,noreferrer')
      if(newTab) newTab.opener = null
   }
  
  
  return (
    <div className="topnav_Container">
      
      <div className='title__header'>
        <h1 ref={topnavref} onKeyDown={(e) => {
           if (!e) {
            e = window.event;
        }
        var keyCode = e.which || e.keyCode
           
    
        if (keyCode === 13 && !e.shiftKey) {
            console.log('Just enter');
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            
        }
        }} contentEditable={true} onBlur={() => {
           
          axios({
            method:"PUT",
            url:env.API_URL + "/updateform",
            headers: {
              "x-access-token": env.auth.accessToken
            },
            data: {
              id: data._id,
              title: topnavref.current.innerHTML ,
              content: data.contents

            }
          })

        }}>{data.title}</h1>
      </div>
      
      <div className='send_Container'>
        {env.auth && env.auth.accessToken && !location.pathname.includes('/p') &&
        <>
      {ctx.edit && <Button className='top-btn' onClick={()=> handleSave()} variant="contained">Save </Button>}
      <Button className='top-btn' onClick={()=> handlenewTap(`/p/${data._id}`)} variant='contained' > Preview </Button>
        <Button className='top-btn' onClick={() => ctx.setsend(true)} style={{backgroundColor:"lightsteelblue" , color:"black"}} variant='contained'>SEND</Button>
      
      
        {ctx.showsend &&
        <FormDiaglog data={data}/>}
        </>
}
      </div>


     
    </div>
    
  )
}