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
  const [filterdata , setfilterdata] = useState([])
  const [filter, setfilter] = useState(false)
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
  const handleFilter = (e) => {
    const value = e.target.value
    setfilter(true)
    let temp = data?.filter((i) => {
      if(value === '')
      {
        setfilter(false)
      } else if (i.title.toLowerCase().includes(value.toLowerCase()))
      {
        return i.title
      } 
      return ''
    })
    setfilterdata(temp)
   

  }
  return (
    <>
    <ToastContainer/>
    
    
    <div className='report__Container'>
      <div className="report_header">
        <h3>Report</h3>
        <TextField onChange={handleFilter} label={"Search"} className='search_report'/>
      </div>
      <div className='scroll_table'>
      <table className='table_Container'>
        <thead className='table_Head'>
          <th>SURVEYS</th>
          <th>RESPONSE</th>
          <th>CREATED AT</th>
          <th>ACTIONS</th>
        </thead>
        <tbody className='table_body'>
         
          {(filter ? filterdata : data).map((item) => (
            <>
            <tr className='title_row'>
            <td className='title'>{item.title}</td>
            
            <td>
              <Button onClick={() => {
                setreport({...showreport , [item.title]:true})
              }}>View</Button>
            </td>
            <td>{new Date(item.createdAt).toISOString().slice(0, 19)}</td>
            <td>
              <Button onClick={()=> handleDelete(item._id)}>Delete</Button>
            </td>
          </tr>
         
          </>
          ))}
          
        </tbody>
      </table>
      </div>
      
      {data.map(item => (
        showreport[item.title] && <Response showreport={showreport} close={setreport} data={item}/>
      ))}
      </div>
      </>
    
  )
}

export default Report