import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { TracerContext } from '../context'
import '../Style/style.css'
import Buttom from './Assets/Buttom'
import Checkbox, { RadioButton, SelectAnswer } from './Assets/Checkbox'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

import { Topnavbar } from './Assets/NavBar'
import { alpha, FormControl, FormControlLabel, styled, Switch } from '@mui/material'
import { pink } from '@mui/material/colors'
import { ToastContainer } from 'react-toastify'


const Form = ({data}) => {
  const ctx = useContext(TracerContext)
  
  
  
  useEffect(() => {
    ctx.setsurveys(data.contents)
    ctx.setshowactive({CreateSurvey:true})
    ctx.settitle(data.title)
    } , [data])
  const handleClick = () => {
    ctx.setsurveys([...ctx.surveys , {
      Question: '',
      type: 'MultipleChoice',
      Answer: ['Option 1'],
      required:false
    }])
    ctx.setedit(true)

  }
  

  
  
  


  return (
    <>
    <ToastContainer/>
    <Topnavbar data={data}/>
    <div style={(ctx.showdialog || ctx.showsend) ? {opacity: ".5"} : {opacity:"1"}} className='Form_Container'>
    
      
    
     {ctx.surveys.map((item , index) => <SurveyItem id={data._id}  index={index}/> )}
     <Buttom options={{onClick: () => {
      handleClick()
     }}} label={'New Question'}
      style={{marginTop: "50px" , fontSize:"17px"}}
      />
     

     

    </div>
    </>
  )
}

export default Form

export const SurveyItem = (props) => {
  const {index , data , id} = props
  const [gridstyle , setgrid] = useState('row')
  const [showedit , setshowedit] = useState(false)
  const ctx = useContext(TracerContext)
  const [required , setrequired] = useState(false)
  const [answer] = useState([])
  const ref = useRef()
  
  
  useEffect(() => {
    window.addEventListener("mousedown", disableedit)
    
   
    return () => window.removeEventListener('mousedown' , disableedit)
    
  } , [])
  const disableedit = (e) => {
    if(ref.current && !ref.current.contains(e.target)){
      setshowedit(false)
    }
  }
  
  
  
  const RedSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: pink[600],
      '&:hover': {
        backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: pink[600],
    },
  }));
  

  const handleClick = (e,type , index = 0) => {
    e.preventDefault()
    let prev = [...ctx.surveys]
    ctx.setedit(true)
   if(type  === 'options'){
    
    prev[index]['Answer'].push(`Option ${prev[index]['Answer'].length + 1}`)
    ctx.setsurveys(prev)
    } 
  } 
  const handleChange = (index , key) => event => {
    let update = [...ctx.surveys]
    ctx.setedit(true)
    if(key === 'Answer') {
      answer.push(event.target.value)
      update[index] = {...ctx.surveys[index] , [key]:answer}
      ctx.setsurveys(update)
      
    }
    else if (key === 'Question'){
      update[index] = {...ctx.surveys[index] , [key]: event.target.value}
      ctx.setsurveys(update)
    } 
    else if (key === 'gridstyle') {
      update[index] = {...ctx.surveys[index] , [key]: event.target.value}
      setgrid(event.target.value)
      ctx.setsurveys(update)
    }
    
    else {
      if(event.target.value === 'Shortanswer') {
        const answer = {
          Question: update[index]['Question'],
          type: event.target.value,
          Answer: ['Option 1']
        }
        update[index] = answer
        ctx.setsurveys(update)
      } else {
      update[index] = {...ctx.surveys[index] , [key]:event.target.value}
      ctx.setsurveys(update)
      }
    }
    
   
    
    

  }
  const handleDelete = (index) => {
    const survey = [...ctx.surveys]
    survey.splice(index , 1)
    ctx.setsurveys(survey)
    ctx.setedit(true)
  }

  const Selectlist = ({ans , index1}) => {
    const listref = useRef()
    
    return (
      <li ref={listref} contentEditable onBlur={() => {
        const surveys = [...ctx.surveys]
        surveys[index].Answer[index1] = listref.current.innerHTML
        ctx.setsurveys(surveys)
        ctx.setedit(true)
      }}>{ans}</li>

    )
  }
  
  
  
  return (
    <div key={index} ref={ref} onClick={() => setshowedit(true)} className='surveyitem__Container'>
        <div className='surveyitem_header'>
          <input type="text"  id="question" value={ctx.surveys[index].Question} onChange={handleChange(index , 'Question')}   placeholder='Question' />
          {showedit &&<> <select value={ctx.surveys[index]?.type} onChange={handleChange(index , 'type')} className='form-select form-select-sm' id="type">
           
            <option value='Checkbox'>Checkbox</option>
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="Shortanswer">Short Answer</option>
            <option value="Select">Dropdown</option>
          </select>
          <FontAwesomeIcon onClick={() => handleDelete(index)} icon={solid('trash')}/>
          </>
          }
        </div>
        <form className="answer__contianer">
          <div style={ctx.surveys[index].gridstyle === 'column' ? {gridTemplateColumns:'auto auto',gridColumnGap:'10px' , width:"45vw"} : {}} className='answer__item'>
          {ctx.surveys[index] && ctx.surveys[index].Answer.map((ans , index1) => (
            <>
            {ctx.surveys[index]['type'] === 'Checkbox' && <Checkbox id={id} index={index} index1={index1} width={ gridstyle === 'row' ? '40vw' : '20vw'} label={ans}/>}
              {  ctx.surveys[index]['type'] === 'MultipleChoice' && <RadioButton id={id} index1={index1} index={index} label={ans}/>}
              {ctx.surveys[index]['type'] === 'Shortanswer' && <input className='shortanswer' placeholder='Answer' type={'text'}/>}
              {ctx.surveys[index]['type'] === 'Select' && 
              <ul className='dropdown__Options'>
                <Selectlist ans={ans} index1={index1}/>
                </ul>}
            </>
          ) ) } 
          </div>
          {showedit &&
          <div className="actions">
          {ctx.surveys[index] && ctx.surveys[index].type !== 'Shortanswer' && <>
          
          <Buttom options={{onClick: (e) => handleClick(e,'options', index)}} style={{width:"100%"}} label={'Add options'}/>
          
          {ctx.surveys[index].type !== 'Select' && <select value={ctx.surveys[index].gridstyle} onChange={handleChange(index , 'gridstyle')} id='display_style' className='form-select form-select-sm' >
            <option value="row">Row</option>
            <option value="column">Column</option>
          </select>}
          </>
          } 
          <FormControl component="fieldset" variant="standard">
            <FormControlLabel
            control={<RedSwitch checked={ctx.surveys[index].required} onChange={(e) => {
              ctx.setedit(true)
              let survey = [...ctx.surveys]
              survey[index] = {...ctx.surveys[index] , required:e.target.checked}
              ctx.setsurveys(survey)
              setrequired(e.target.checked)}}/>}
            label={"Required"}
            />
          </FormControl>
          </div>
}

         
        </form>
        </div>
  )
}