import { Button, TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { TracerContext } from '../context'
import { env } from '../environment'
import '../Style/style.css'
import { NavIcons } from './Assets/Image/Images'
import Response from './Response'
const Report = ({data}) => {
  const ctx = useContext(TracerContext)
  const [showreport , setreport] = useState({})
  useEffect(() => {
    let obj = {}
    ctx.setshowactive({[NavIcons[2].name]:true})
    data.forEach((item) => {
      obj[item.title] = false
    })
    setreport(obj)
  } , [data])
  const handleDelete = async (title) => {
    await axios({
      method:"delete",
      url:env.API_URL + `/deleteform` ,
      headers:{"x-access-token" : env.auth.accessToken},
      data:{
        id:title
      }
    }).then((res) => {
      window.location.reload()
    })
   
  }
  return (
    <>
    <ToastContainer/>
    <div className='report__Container'>
      <div className="report_header">
        <h3>Report</h3>
        <TextField label={"Search"}/>
      </div>
      
      <table className='table_Container'>
        <thead className='table_Head'>
          <th>SURVEYS</th>
          <th>RESPONSE</th>
          <th>CREATED AT</th>
          <th>ACTIONS</th>
        </thead>
        <tbody className='table_body'>
          {data.map((item) => (
            <>
            <tr>
            <td>{item.title}</td>
            
            <td>
              <Button onClick={() => {
                setreport({...showreport , [item.title]:true})
              }}>View</Button>
            </td>
            <td>{item.createdAt}</td>
            <td>
              <Button onClick={()=> handleDelete(item._id)}>Delete</Button>
            </td>
          </tr>
         
          </>
          ))}
          
        </tbody>
      </table>
      
      {data.map(item => (
        showreport[item.title] && <Response showreport={showreport} close={setreport} data={item}/>
      ))}
      </div>
      </>
    
  )
}

export default Report