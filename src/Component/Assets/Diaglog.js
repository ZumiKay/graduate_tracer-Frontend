import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {solid} from '@fortawesome/fontawesome-svg-core/import.macro' 
import { Box, Button, LinearProgress, TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TracerContext } from '../../context'
import { env } from '../../environment'
import emailjs from '@emailjs/browser';
import "../../Style/style.css"
const Diaglog = ({open}) => {
   const ctx = useContext(TracerContext)
   const [formtitle , setform] = useState('')
   const [err , seterr] = useState('')
   const auth = JSON.parse(localStorage.getItem("auth"))
   let navigate = useNavigate()
   useEffect(() => {
      ctx.setsurveys([])
      ctx.setshowdialog(true)
   }, [])
   const handleCreate = (e) => {
      e.preventDefault()
      if(formtitle !== '') {
      axios({
         method:"POST",
         url:env.API_URL + "/createForm",
         data: {title : formtitle , 
            content: [
              
            ]
         },
         headers : {
            "x-access-token" : auth.accessToken 
         }
      }).then((res) => {
         ctx.setopen(false)
        navigate(`/form/${res.data.data._id}` ,  {replace:true})
        window.location.reload()

      }).catch(error => {
         seterr(error.response.data.message)
      }) 
   } else {
         seterr('Please Enter the Title')
      }
   }
  return (
    <form className='Dialog__Container'>
      <header className='Dialog__header'>
         <h1>Create New Survey</h1>
      </header>
      <div className='Dialog__Body' >
         <h5 style={{color:'red'}}>{err}</h5>
        <TextField onChange={(e) => setform(e.target.value)} label="Title" autoFocus/>
       </div>
    <div className='button__Container'>
        
        <Button onClick={handleCreate} type="submit" variant='contained'>Create</Button> 
        <Button onClick={() =>{window.location.reload()}}>Cancel</Button>
        </div>
    </form>
  )
}

export default Diaglog



export const FormDiaglog = (props) => {
   const {data} = props 
   const ctx = useContext(TracerContext)
   const [select, setselect] = useState('')
   const [emaildata , setdata] = useState({
    reciever: '' ,
    subject: '' , 
    message: ""
   })
   const [errmess , seterr] = useState('')
   const handleClick = (key) => {
      setselect(key)
   }
   useEffect(() => {
      setselect('email')
   } , [])
   
   const handleChange = (e) => {
      if(e.target.id === 'reciever'){
         setdata({...emaildata , [e.target.id]:e.target.value.replace(/ /g, "").split(',')})
      } else {
         setdata({...emaildata , [e.target.id]:e.target.value})
      }

   }
   const handleSend = async () => {
      ctx.setisloading({...ctx.isloading , send:true})
      if(emaildata.reciever === '' || emaildata.subject === '' || emaildata.message === ''){
         ctx.setisloading({...ctx.isloading , send:false})
         seterr("Please Fill All Info")
      } else {
         seterr('')
         await emaildata.reciever?.forEach(i => {
            emailjs.send(env.service_id , env.template_id , {
               recieveremail: i ,
               subject: emaildata.subject ,
               message: emaildata.message ,
               Link: `${env.web_url}/p/${data._id}`
            } , env.public_key)
         })
         ctx.setisloading({...ctx.isloading , send:false})
         seterr("Email Sent") 
      }
   }
   return (
   <div className='Form_DialogContainer'>
      {ctx.isloading.send && <Box sx={{width:"100%"}}>
         <LinearProgress/>
      </Box>}
      <h4>Send Form</h4>
      <p style={{color:"red"}}>{errmess}</p>
      <div className='nav_bar'>
         <span>Send Via</span>
         <FontAwesomeIcon onClick={() => handleClick('email')} className={select === 'email' ? 'iconactive' : 'icon'} icon={solid('mail-bulk')}/>
         <FontAwesomeIcon onClick={() => handleClick('link')} className={select === 'link' ? 'iconactive' : 'icon'}  icon={solid('link')}/>
      </div>
      {select === 'email' ?
      <div className='email__container'>
         <h5>Email</h5>
         <div>
         <TextField id='reciever' onChange={handleChange} type={'text'} label={"To"} fullWidth/>
         <TextField id='subject' onChange={handleChange} type={'text'} label={"Subject"} fullWidth/>
         <TextField id="message" onChange={handleChange} type={'text'} label={"Message"} multiline fullWidth/>
         </div>
      </div> 
      : 
      <TextField style={{marginTop:"20px"}} label={'Link'} value={`${env.web_url}/p/${data._id}`} fullWidth multiline/>
      }
      <div className='Form_action'>
         <Button onClick={() => ctx.setsend(false)}>Cancel</Button>
         {select === 'email' ? <Button onClick={() => handleSend()} variant='contained'>SEND</Button> : ''}
         
      </div>

   
   
   </div>)

}