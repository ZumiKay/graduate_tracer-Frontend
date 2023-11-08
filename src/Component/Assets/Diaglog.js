import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {solid} from '@fortawesome/fontawesome-svg-core/import.macro' 
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, LinearProgress, MenuItem, Select, TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TracerContext } from '../../context'
import { env } from '../../environment'
import emailjs from '@emailjs/browser';
import "../../Style/style.css"
import { toast } from 'react-toastify'
const Diaglog = ({open}) => {
   const ctx = useContext(TracerContext)
   const [formtitle , setform] = useState('')
   const [err , seterr] = useState('')
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
            content: []
         },
         headers : {
            "x-access-token" : env.auth.accessToken
         }
      }).then((res) => {
        ctx.setopen(false)
        handleClose()
      //   navigate(`/form/${res.data.data._id}` ,  {replace:true})
        window.location.href = `/form/${res.data.data._id}`
      }).catch(error => {
         toast.error(error.response.data.message , {autoClose: 2000})
      }) 
   } else {
         seterr('Please Enter the Title')
      }
   }
   const handleClose = () => {
      open(false)
      ctx.setshowdialog(false)
   }
  return (
   <div className="Dialog__Wrapper">
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
        <Button onClick={() => handleClose()}>Cancel</Button>
        </div>
    </form>
    </div>
  )
}

export default Diaglog



export const FormDiaglog = (props) => {
   const {data} = props 
   const ctx = useContext(TracerContext)
   const [select, setselect] = useState('')
   const [usr , setusr] = useState([])
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
      getstudent()
      setselect('email')
   } , [])
   const getstudent = () => {
      axios({
         method:"GET",
         url:env.API_URL + "/getstudent" ,
         headers: {"x-access-token" : env.auth.accessToken}
      }).then(res => setusr(res.data.student))
   }
   
   const handleChange =(type , e) => {
     
      if(type === 'reciever'){
         console.log("Change")
        setdata({...emaildata , [type]:usr.filter(({name}) => name === e.target.value).map(i => i.email)})
      } else {
         setdata({...emaildata , [type]:e.target.value})
      }

   }
   const handleSend = async() => {
     
      ctx.setisloading({...ctx.isloading , send:true})
      if(emaildata.reciever === '' || emaildata.subject === '' || emaildata.message === ''){
         ctx.setisloading({...ctx.isloading , send:false})
         seterr("Please Fill All Info")
      } else {
         seterr('')
         await emaildata.reciever?.forEach(i => {
            i.map(j => 
               emailjs.send(env.service_id , env.template_id , {
                  recieveremail: j ,
                  subject: emaildata.subject ,
                  message: emaildata.message ,
                  Link: `${env.web_url}/p/${data._id}`
               } , env.public_key)
               
               
               )
           
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
         <FormControl fullWidth>
            <InputLabel>Group Students</InputLabel>
            <Select id='reciever' onChange={(e) => handleChange('reciever', e)} label='studentgroup'>
              {usr.map(i => <MenuItem value={i.name}>{i.name}</MenuItem>)}
            </Select>
         </FormControl>
         <TextField id='subject' onChange={(e) => handleChange('subject' , e)} type={'text'} label={"Subject"} fullWidth/>
         <TextField id="message" onChange={(e) => handleChange('message' , e)} type={'text'} label={"Message"} multiline fullWidth/>
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

export const AddStudents = ({open , setOpen , data}) => {
   const ctx = useContext(TracerContext)
   const [studentdata , setdata] = useState({
      name: data ? data.name : '',
      email: data ? data.email : '',
   })
   const [err , errmes] = useState('')
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleChange = (type) => e => {
       if(type === 'name') {
         setdata({...studentdata , name:e.target.value})
       } else {
         setdata({...studentdata , email:e.target.value.replace(/ /g, "").split(',')})
       }
    }
    const handleSubmit = () => {
      if(!data) {
         if(studentdata.name !== '' && studentdata.email !== '') {
            ctx.setisloading({...ctx.isloading , user: true})
            axios({
               method:"POST" ,
               url: env.API_URL + "/register",
               data:studentdata , 
               headers:{"x-access-token" : env.auth.accessToken}
            }).then(() => {
               ctx.setisloading({...ctx.isloading , user: false})
               toast.success("Group Added" , {
                  autoClose: 2000,
                  pauseOnHover:true,
                  onClose: () => window.location.reload()
               })
            }).catch((err) => {
               ctx.setisloading({...ctx.isloading , user: false})
               toast.error(err.response.data.message , {autoClose:2000})
            })
   
         } else {
            errmes("Please fill All Field")
         }

      } else {
         ctx.setisloading({...ctx.isloading , user: true})
         axios({
            method:"PUT" ,
            url:env.API_URL + "/updatestudent",
            data: {
               id:data._id ,
               user:studentdata 
            } ,
            headers:{"x-access-token" : env.auth.accessToken}
         }).then(() => {
            ctx.setisloading({...ctx.isloading , user: false})
            toast.success("Updated Successful" , {
               autoClose:2000,
               pauseOnHover:true,
               onClose:() => window.location.reload()
            })
         }).catch((err) => {
            ctx.setisloading({...ctx.isloading , user: false})
            console.log(err)
         })

      }
      
      
    }

   return (
      <div>
         <Dialog
         open={open}
         onClose={handleClose}

         >
            <DialogTitle>
                  Add Students Email
               </DialogTitle>
               
            <DialogContent>
               <p style={{color:"red"}}>{err}</p>
               
               <DialogContentText>
                  GroupName
               </DialogContentText>
               <TextField value={studentdata.name} onChange={handleChange('name')} type={'text'} label={"Name"}/>
               <DialogContentText>
                  Emails (Sperate by Comma (a,b,c,...))
               </DialogContentText>
               <textarea onChange={handleChange('email')} value={studentdata.email.toString()} style={{width: '500px'}}/>
               
              
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Close</Button>
               <Button onClick={() => handleSubmit()}>ADD</Button>
            </DialogActions>


         </Dialog>

      </div>
   )
}