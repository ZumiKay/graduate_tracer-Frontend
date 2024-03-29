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
import Cookies from 'js-cookie'

const NavBar = ({setclose, logoref }) => {
  
  const [open , setopen] = useState(false)
  const [showclose , setshowclose] = useState(false)
  
  const navref = useRef(null)
  const ctx = useContext(TracerContext)
  let navigate = useNavigate()
  
  useEffect(() => {
    closebtn()
    window.addEventListener('resize' , closebtn) 
   
    

    return (() => {
      window.removeEventListener('click' , handlenavref)
      window.removeEventListener("resize" , closebtn)
    })
   
  } , [])
  
  const handlenavref = (e) => {
    if(navref.current && logoref.current !== e.target && !navref.current.contains(e.target)) {
      setclose(true)
    }
  }
  const closebtn = () => {
    if(window.innerWidth < 500) {
      setshowclose(true) 
       window.addEventListener('click' , handlenavref)
    } else {
      setshowclose(false)
    }
  }
  const handleLogout = async () => {
    ctx.setisloading({...ctx.isloading , logout: true})
    await axios({
      method:"POST",
      url:env.API_URL + "/logout",
      data: {
        refreshToken: env.auth.refreshToken
      }
    }).then(() => {
      ctx.setisloading({...ctx.isloading , logout: false})
      Cookies.remove('auth')
      navigate("/" , {replace:true})
    })
    window.location.reload()
  }
  

  return (
    <>
    <div ref={navref} className='Nav_Container'>
      { !showclose && <header className='Nav_Header'>
        <img onClick={() => navigate('/' , {replace:true})} src={Assetimg.Logo} alt="Logo" />
      </header>}
      {showclose && <button className='close_nav' onClick={() => setclose(true)}>CLOSE</button>}
      {NavIcons.map(icon => (
       <div className='navLink_Container'>
       { icon.name !== 'CreateSurvey' ? <Link className='nav_Link' to={'/' + icon.route}>
        <img style={ctx.showactive[icon.name] ? {filter:'grayscale(1)'} : {filter:'grayscale(0)'}  } className='nav_icon' src={icon.url} alt={icon.name}/>
        </Link> : <div onClick={() => setopen(true)} className='nav_Link'>
        <img style={ctx.showactive[icon.name] ? {filter:'grayscale(1)'} : {filter:'grayscale(0)'}  } className='nav_icon' src={icon.url} alt={icon.name}/>
          </div>}
        <p onClick={() => {
          if(icon.name !== 'CreateSurvey') {
            navigate(`/${icon.route}` , {replace:true})

          } else {
            setopen(true)
            document.body.style.overflow = 'hidden'
          }
          }} className='title_Link'>{icon.name}</p>
        </div>
      ))}
      <hr />
      <div className='navLink_Container'>
        <div onClick={() => {
         handleLogout()
        }} className='nav_Link' to={'/'}>
        <img  className='nav_icon' src={Assetimg.Logout} alt={'Logout'}/>
        
        </div>
        <p onClick={() => handleLogout()} className='title_Link'>LogOut</p>
        </div>
  </div>
    {open && <Diaglog open={setopen}/>}
      </>
  ) 
}

export default NavBar

export const Topnavbar = ({data}) => {
  
  
  
  const topnavref = useRef()
  const location = useLocation()
  const ctx = useContext(TracerContext)

   const handleSave = () => {
    ctx.setisloading({...ctx.isloading , save:true})
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
      ctx.setisloading({...ctx.isloading , save:false})
      toast.success("Saved" , {
        position:"top-right",
        autoClose:1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
       })
    }).catch((err) => {
      console.log(err)
      ctx.setisloading({...ctx.isloading , save:false})
    })
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
        }} contentEditable={env.auth && env.auth.accessToken ? true : false} onBlur={() => {
           
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