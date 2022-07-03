import { Button } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { TracerContext } from '../context'
import { env } from '../environment'
import '../Style/style.css'

const Usermanagement = () => {
    const ctx = useContext(TracerContext)
    const [users , setuser] = useState([])
    useEffect(() => {
        ctx.setshowactive({"Users": true})
        getUser()
    } , [])
   const getUser = () => {
    axios({
        method:"GET",
        url:env.API_URL + "/getstudent",
        headers:{
            "x-access-token": env.auth.accessToken
        }
    }).then(res => {
        setuser(res.data.student)
    })
   
   } 
   const handleDelete = (id) => {
    axios({
        method:"delete" ,
        url: env.API_URL + "/deletestudent",
        data:{
            id: id
        },
        headers:{
            "x-access-token": env.auth.accessToken
        }
    }).then(() => window.location.reload())
}
  return (
    <div className='user_Container'>
        <h1>List of Users</h1>
        <table className='user_table'>
            <thead className='usertable_header'>
                <th>Email</th>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Actions</th>
            </thead>
            <tbody className='usertable_body'>
                {users.map((user) => (
                     <tr>
                     <td>{user.Email}</td>
                     <td>{user.Firstname}</td>
                     <td>{user.Lastname}</td>
                     <td>
                         <Button onClick={() => handleDelete(user._id)}>Delete</Button>
                     </td>
                 </tr>
                ))}
                
               
            </tbody>
        </table>
    </div>
  )
}

export default Usermanagement