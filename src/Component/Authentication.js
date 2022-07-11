import { Button } from '@mui/material'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TracerContext } from '../context'
import { env } from '../environment'
import '../Style/style.css'
import Buttom from './Assets/Buttom'
import { Assetimg } from './Assets/Image/Images'
import { LoadingLogo } from './Home'

const Authentication = () => {
  const ctx = useContext(TracerContext)
  const [userdata , setuserdata] = useState({
    email:"",
    password: ""
  })
  const [err , seterr] = useState('')
  const handleChange = (e) => {
    setuserdata({...userdata , [e.target.id]:e.target.value})
  }
  const handleLogin = async (e) => {
    e.preventDefault()
   
    await axios({
      method:"POST",
      url:env.API_URL + "/login",
      data: userdata
    }).then((res) => {
     
      localStorage.setItem('auth' , JSON.stringify(res.data))
      window.location.reload()
      
    }).catch(err => {
      
      seterr(err.response.data.message)
    })
    
    
    
    
  }
  return (
    <>
    
    <div className='Login__Container'>
      <img src={Assetimg.Logo} alt={"Logo"}/>
        <h1 className='Title'>Graduate Tracer System </h1>
        <form style={ctx.isloading.login ?{opacity:".5"}: {opacity:"1"}} className='Login_Form'>
            <h3> {err}</h3>
            <input onChange={handleChange} id="email" type="email" placeholder='Email' required />
            <input onChange={handleChange} id="password" type="password" placeholder='Password' required/>
            <Buttom options={{onClick: handleLogin}} style={{marginTop:"20px" , color:"white" , backgroundColor:"black"}} label="Login"/>
        </form>
      
    </div>
    </>
  )
}

export default Authentication