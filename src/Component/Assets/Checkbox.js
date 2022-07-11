import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../Style/style.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';
import { Box, Button, FormControl, InputLabel, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { TracerContext } from '../../context';
import { env } from '../../environment';
import { useLocation } from 'react-router';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';



const Checkbox = (props) => {
    const ctx = useContext(TracerContext)
    const {label , width , index , index1 , id} = props
    const ref = useRef()
    const location = useLocation()
    const [ansset , setans] = useState([])
    const handleDelete = () => {
        const surveys = [...ctx.surveys]
        
        surveys[index].Answer.splice(index1 , 1)
        ctx.setsurveys(surveys)
    }
    const handleChange = () => {
        const surveys = [...ctx.surveys]
        surveys[index].Answer[index1] = ref.current.innerHTML
        ctx.setsurveys(surveys)
        ctx.setedit(true)

    }
    const handleValue = e => {
        let answer = {...ctx.Useranswer}
        answer.Response[index].response[index1] = {...ctx.Useranswer.Response[index].response[index1] , [`ans${index1}`]: { value : e.target.value , isChecked:e.target.checked}}
        ctx.setanswer(answer)
    }
    return (<div className='checkbox__Asset'>
        {env.auth && env.auth.accessToken && !location.pathname.includes('/p') && <FontAwesomeIcon onClick={() => {
            ctx.setedit(true)
            handleDelete()}} icon={solid('multiply')}/>}
        <p ref={ref} style={{width:width}} contentEditable={env.auth?.accessToken && !location.pathname.includes('/p') ? true : false} onBlur={() => handleChange()}  className='title'>{label}</p>
        <label className='Checkbox__Container'>
        
        <input name={`checkbox${index}`} onChange={handleValue}  type="checkbox" value={label} />
        <span className='checkmark'></span>
        </label>
       

    </div> 
    )
}

export default Checkbox


export const RadioButton = (props) => {
    const {label , index , index1} = props
    const ctx = useContext(TracerContext)
    const [value , setvalue] = useState('')
    const [check , setcheck] = useState({})
    const ref = useRef()
    const location = useLocation()
  
    const handleChange = e => {
        let answer ={ ...ctx.Useranswer} 
        answer.Response[index].response = e.target.value 
        ctx.setanswer(answer)
        setvalue(e.target.value)
       
    }
    const handleDelete = () => {
        const surveys = [...ctx.surveys]
        surveys.map((i , index2) => {
            if(i.belongTo) {
                if(i.belongTo.qindex === index && i.belongTo.ans === label) {
                    surveys.splice(index2 , 1)
                }
            }
        })
        surveys[index].Answer.splice(index1 , 1)
        ctx.setsurveys(surveys)
    }
    const handleBlur = () => {
        const surveys = [...ctx.surveys]
       
        surveys[index].Answer[index1] = ref.current.innerHTML
        ctx.setsurveys(surveys)
        ctx.setedit(true)
       
    }
    const handleRadio = (e) => {
       
       ctx.setcheck({...ctx.check , [index]:true})
      
       
    }
    const handleExtend = (e) => {
        e.preventDefault()
        const sur = [...ctx.surveys]
        sur.splice(index + 1 , 0 , {
            Question: '',
            type: 'MultipleChoice',
            Answer: ['Option1'],
            required:false,
            belongTo: {
                qindex: index,
                ans: label 
            }
        })
        ctx.setsurveys(sur)

    }
    return (
        <div onClick={() => console.log(check)}  onChange={handleChange} className="radio__Wrapper">
           {env.auth && env.auth.accessToken  && !location.pathname.includes('/p') &&  
           <div style={{display:"flex" , flexDirection:"row-reverse" , alignItems:"center"}}>
            <FontAwesomeIcon onClick={() =>{
            ctx.setedit(true)
            handleDelete()}} icon={solid('multiply')}/>
            {!ctx.surveys[index].belongTo && <Button onClick={handleExtend}>Extend</Button>}
            </div>

            
            }
            <p ref={ref} contentEditable={env.auth?.accessToken && !location.pathname.includes('/p') ? true : false} onBlur={() => handleBlur()} className="radio__label">{label}</p>
            <label className='radio__Container'>
                <input className='radio' onChange={handleRadio} value={label} type="radio" name={`radio${index}`}/>
                <span className='checkmark'></span>
            </label>
            
        </div>
    )

}
export const SelectAnswer = (props) => {
    const {label} = props
    const [option , setoption] = useState('')
    const handleChange = (e) => {
        setoption(e.target.value)
        
    }
    return (
        <Box sx={{m:1,minWidth: 200}}>
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
        <Select
        onChange={handleChange}
        value={option}
        label={label}
        >
            <MenuItem value={'option0'}>Options</MenuItem>
            <MenuItem value={'option1'}>Option 1</MenuItem>
        </Select>
        </FormControl>
        </Box>
       
    )
}
export const Shortanswer = (props) => {
    const {label} = props
    return (
        <Box  sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }} component='form' autoComplete='on'>
        <TextField variant="outlined"  label={label}/>
        </Box>
    )
}

export const Yearpicker = ({index}) => {
    const ctx = useContext(TracerContext)
    const [date , setdate] = useState(null)
    
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
         <DatePicker
          views={['year']}
          label="Please Select Year"
          value={date}
          onChange={(newValue) => {
            setdate(newValue)
            let answer ={ ...ctx.Useranswer}
            let string = newValue.getFullYear().toString()
            answer.Response[index].response = string
            ctx.setanswer(answer)
            
          }}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
        </LocalizationProvider>
    )
}