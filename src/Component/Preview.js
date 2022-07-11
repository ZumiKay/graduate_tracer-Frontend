
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import axios from 'axios'
import React, { useState , useEffect } from 'react'
import { useContext } from 'react'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { TracerContext } from '../context'
import { env } from '../environment'
import '../Style/style.css'
import Checkbox, { RadioButton, Yearpicker } from './Assets/Checkbox'
import { Topnavbar } from './Assets/NavBar'
import publicIp from 'react-public-ip'


const Preview = ({data}) => {
  const ctx = useContext(TracerContext)
  const {id} = useParams()
  const [surdata , setdata] = useState({})
  const [errmess , setmess] = useState('')
  const [val , setval] = useState('')
  const [submitted , setsubmited] = useState(false)
  
  useEffect(() => {
   initail()
   getip()
    
   
    
  } , [data])
  const initail = () => {
    let sur = data.filter(({_id}) => _id === id)
    console.log(sur)
    console.log(ctx.Useranswer)
    if(sur.length > 0) {
      sur.map(i => setdata(i))
    } 
  }
  
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
const handleSubmit = (e) => {
  e.preventDefault()
  let requireindex1 = 0
  let requireindex = 0
  let checboxcount = 0
  let count1 = {
    other: []
  }
  
  ctx.Useranswer.Response.map((item , index1) => {
    
    if(item.required) {
       if (item.type === 'Checkbox'){
        count1[`checkbox${index1}`] = []
        requireindex1 += 1
        item.response.map((ans,index) => {
          if(ans[`ans${index}`].isChecked) {
            
           count1[`checkbox${index1}`]?.push(ans[`ans${index}`])
          } else {
            
            count1[`checkbox${index1}`]?.filter((i) => i === ans[`ans${index}`])
            
          }
      } )}
    
      if (item.type !== 'Checkbox') {
        requireindex += 1 
        if(item.response !== '') {
          count1['other']?.push(item.response)
        } else {
         if(count1.other?.length > 0) {
          count1['other']?.filter((i) => i === item.response)
         }
        }
      }
       
      
      if(item.type === 'Checkbox') {
        if(count1[`checkbox${index1}`].length > 0) {
          checboxcount += 1
        }
      }
      
    } 
    
  })
  
  
  if(count1.other?.length !== requireindex || checboxcount !== requireindex1) {
    setmess("Please Fill Required Questions")
  } else{
    
    axios({
      method:"POST",
      url:env.API_URL + "/createAnswer",
      data: ctx.Useranswer
    }).then(() => {
      setsubmited(true)
    })
  }
    
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
    
    {surdata.contents?.map((item , index) => {
      if(!item.belongTo) {
        return <RealSurvey index={index} data={item}/>
      } else {
        let ans = {}
        ctx.Useranswer.Response?.map((i) => {
          if(i.response === item.belongTo.ans){
           ans = item
          }
        })
        if(JSON.stringify(ans) !== "{}"){
          console.log(ans)
          return <RealSurvey index={index} data={item}/>
        } else {
          return null
        }
      }
    })}
    
   
   
    {<h1 style={{color:"red"}}>{errmess}</h1>}
    {JSON.stringify(surdata) !== '{}' && <Button type="submit" onClick={(e) => handleSubmit(e)} style={{color:"black",width:"100px" ,backgroundColor:"lightsteelblue"}} variant='contained'>Submit</Button>}
    
    </>}
      {JSON.stringify(surdata) === '{}' && <h3>URL NOT EXIST</h3>}
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
  <div className='Real_Survey'>
    {data.required && <p style={{color:"#C33F3F"}}>Required</p>}
    <h4 className='survey_question'>{data.Question} </h4>
    
    <div style={data?.gridstyle === 'column' ? {display:"grid" , gridTemplateColumns:"auto auto" , columnGap:"10px"} : {}} className="answer_box">
      {(data.type === 'Checkbox' || data.type === 'MultipleChoice' || data.type === 'Shortanswer' || data.type === 'YearPicker' ) ?  data.Answer.map((ans , index1) => (
        <>
        {data.type === 'Checkbox' && <Checkbox index={index} index1={index1} label={ans}/>}
        {data.type === 'MultipleChoice' && <RadioButton index={index} index1={index1} checked={check} setcheck={setcheck} label={ans}/>}
        {data.type === 'Shortanswer' && <TextField onChange={handleSelect} type="text" label="ShorAnswer" fullWidth/>}
        {data.type === 'YearPicker' && <Yearpicker index={index}/>}

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
  </div>
)
}