
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import axios from 'axios'
import React, { useState , useEffect } from 'react'
import { useContext } from 'react'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { TracerContext } from '../context'
import { env } from '../environment'
import '../Style/style.css'
import Checkbox, { RadioButton } from './Assets/Checkbox'
import { Topnavbar } from './Assets/NavBar'
import publicIp from 'react-public-ip'


const Preview = ({data}) => {
  const ctx = useContext(TracerContext)
  const {id} = useParams()
  const [surdata , setdata] = useState({})
  const [errmess , setmess] = useState('')
  const [submitted , setsubmited] = useState(false)
  
  useEffect(() => {
  
   getip()
  
   data.filter(({_id}) => _id === id).map(i => setdata(i))
   
    
  } , [data])
  
  const getip = async () => {
    let ip = await publicIp.v4() || ""
    let formdata = []
    
    data.filter(({_id}) => _id === id).forEach(({contents}) => {
      contents.forEach((item , index) => {
        let ansobj = item.Answer.map(((ans , index) => {
          return {[`ans${index}`] : {
            value: ans ,
            isChecked:false
          }}
        }))
        formdata.push({
          Question: item.Question,
          type: item.type ,
          response: item.type === 'Checkbox' ? ansobj : '',
          required: item.required 
        })
        
     
       
        
      })
    })
    ctx.setanswer({
      formid:id,
      userIP: ip ,
      Response: formdata
     })
     
    
}
const handleSubmit = () => {
  let count = 0
  let requireindex = 0
  ctx.Useranswer.Response.map((item) => {
    if(item.required) {
      requireindex += 1 
      if (item.type === 'Checkbox'){
        item.response.some((ans,index) => {
          if(ans[`ans${index}`].isChecked) {
            return count += 1
          } else {
            if(count > 0) {
            return count -= 1
            }
          }
        })
        
      } 
      else {
        if(item.response !== '') {
          count += 1
        } else {
          if(count > 0) {
            count -= 1
          }
        }
      }
       
      
     
      
    } 
  })
  if(count < requireindex) {
    setmess("Please Fill Required Questions")
  } else if (count === requireindex) {
    axios({
      method:"POST",
      url:env.API_URL + "/createAnswer",
      data: ctx.Useranswer
    }).then(() => {
      setsubmited(true)
    })}
    
  }
  const SubmitUI = () => {

    return (
      <div className='submit__Container'>
        <h1>Your Response Have Been Saved</h1>
        <h3>Thank You For Your Time</h3>
      </div>
    )
  }
  
  
  return (
    <>
    
    <Topnavbar data={surdata}/>
    <div className='Preview__Container'>
    {submitted ? <SubmitUI/> : 
    <>
    {surdata.contents?.map((item , index) => <RealSurvey index={index} data={item}/>)}
    {<h1 style={{color:"red"}}>{errmess}</h1>}
    <Button onClick={() => handleSubmit()} style={{color:"black",width:"100px" ,backgroundColor:"lightsteelblue"}} variant='contained'>Submit</Button>
    </>}
      <p>Graduate Tracer Survey by Zumi and Norack</p>
      <p>R2022</p>
    </div>
    </>
  )
} 

export default Preview



export const RealSurvey = ({data , index}) => {
  const [check , setcheck] = useState({})
  const ctx = useContext(TracerContext)
  useMemo(() => {
    let obj = {}
    
    data.Answer.map((item) => obj[item] = false)
    setcheck(obj)
    

    
  } , [data])
  const handleUnChecked = () => {
    let allRadio = document.getElementsByName(`radio${index}`)
    let answer = {...ctx.Useranswer}
    allRadio.forEach(value => value.checked = false)
    ctx.setcheck({...ctx.check , [index]:false})
    answer.Response[index].response = ""
    ctx.setanswer(answer)
  }
  const handleSelect = (e) => {
    let answer = {...ctx.Useranswer}
    answer.Response[index].response = e.target.value
    ctx.setanswer(answer)
  }
  
  
return (
  <form className='Real_Survey'>
    {data.required && <p style={{color:"#C33F3F"}}>Required</p>}
    <h4 className='survey_question'>{data.Question} </h4>
    
    <div className="answer_box">
      {(data.type === 'Checkbox' || data.type === 'MultipleChoice' || data.type === 'Shortanswer' ) ?  data.Answer.map((ans , index1) => (
        <>
        {data.type === 'Checkbox' && <Checkbox index={index} index1={index1} label={ans}/>}
        {data.type === 'MultipleChoice' && <RadioButton index={index} index1={index1} checked={check} setcheck={setcheck} label={ans}/>}
        {data.type === 'Shortanswer' && <TextField onChange={handleSelect} type="text" label="ShorAnswer" fullWidth/>}
        

        </>
      )) : 
      <FormControl  sx={{ m: 1, minWidth: 200 }}>
        <InputLabel>Answer</InputLabel>
        <Select onChange={handleSelect} autoWidth label={"Answer"}>
     { data.Answer.map((ans) => (

         <MenuItem value={ans}>{ans}</MenuItem>
          
      ))}
      
      </Select>
      </FormControl>
      }
      
      
      
    
    </div>
    {data.type === 'MultipleChoice' && ctx.check[index] ? <Button onClick={() => handleUnChecked()}>Cancel Selection</Button> : ''}
  </form>
)
}