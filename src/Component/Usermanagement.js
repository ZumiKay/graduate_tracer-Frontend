import { Button } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { TracerContext } from '../context'
import { env } from '../environment'
import '../Style/style.css'
import { AddStudents } from './Assets/Diaglog'
import { LoadingLogo } from './Home'

const Usermanagement = () => {
    const [edit , setedit] = useState(false)
    const [open , setOpen] = useState(false)
    const [val , setval] = useState(null)
    const ctx = useContext(TracerContext)
    const [users , setuser] = useState([])
    useEffect(() => {
        ctx.setshowactive({"Users": true})
        getUser()
    } , [])
   const getUser = () => {
    ctx.setisloading({...ctx.isloading , user:true})
    axios({
        method:"GET",
        url:env.API_URL + "/getstudent",
        headers:{
            "x-access-token": env.auth.accessToken
        }
    }).then(res => {
        ctx.setisloading({...ctx.isloading , user:false})
        setuser(res.data.student)
    })
   
   } 
   const handleDelete = (id) => {
    ctx.setisloading({...ctx.isloading , user:true})
    axios({
        method:"delete" ,
        url: env.API_URL + "/deletestudent",
        data:{
            id: id
        },
        headers:{
            "x-access-token": env.auth.accessToken
        }
    }).then(() => {
        
        window.location.reload()})
}
const handleEdit = (data) => {
    setedit(true)
    setval(data)
}
  return (
    <>
    <ToastContainer/>
    {open && <AddStudents open={open} setOpen={setOpen}/>}
    {edit && <AddStudents open={edit} setOpen={setedit} data={val}/>}
    {ctx.isloading.user && <LoadingLogo/>}
    <div style={ctx.isloading.user ? {opacity:".5"} : {opacity:"1"}} className='user_Container'>
        <h1>List of Users</h1>
        <Button className='add-btn' onClick={() => setOpen(true)} variant='contained'>Add Students</Button>
        <table className='user_table'>
            <thead className='usertable_header'>
                <th>GroupName</th>
                <th>Email</th>
                <th>Action</th>
                
            </thead>
            <tbody className='usertable_body'>
                {users?.map(usr => {
                    return <tr>
                        <th>{usr.name}</th>
                        <th>{usr.email?.map(i => <p>{i}</p>)}</th>
                        <th>
                            <Button onClick={() => handleDelete(usr._id)}>Delete</Button>
                            <Button onClick={() => handleEdit(usr)}>Edit</Button>
                        </th>
                    </tr>
                })}
                
                
               
            </tbody>
        </table>
    </div>
    </>
  )
}

export default Usermanagement