import { Box, Button, LinearProgress } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { env } from '../environment'
import '../Style/style.css'
import TableView from './TableView'
const Response = ({data , close , showreport}) => {
    const [useranswer , setanswer] = useState([])
    const [tabledata , setdata] = useState([])
    const [showtable , setshowtable] = useState(false)
    const [loading , setloading] = useState(true)
    useEffect(() => {
        getAnswer()
    } , [data])
    const getAnswer = () => {
        axios({
            method:"get" ,
            url:env.API_URL + "/getanswer/" + data._id,
            headers:{"x-access-token": env.auth.accessToken}
        }).then((res) => {
            setloading(false)
            setdata(res.data.answer)
            let obj = []
            data.contents.forEach((item) => {
               obj.push(
                {
                    
                    Question: item.Question ,
                    type: item.type,
                    Ans: res.data.answer.map(ans => {
                    return ans.Responses !== [] && ans.Responses.filter(({Question}) => Question === item.Question).map(i => {
                        return i.response
                    })
                    })
                }
               )
            })
            setanswer(obj)
        }).catch((err) => setloading(true))
    }
  return (
    <div className='response__Container'>
        <h1>{data.title}</h1>
        {loading && <Box sx={{width:'100%'}}>
            <LinearProgress/>
        </Box>}
        <div className='response_btn'>
        {showtable ? <Button onClick={() => setshowtable(false)}>Back</Button> : <Button variant="contained" onClick={() => setshowtable(true)}>Table View</Button>}
        <Button variant='contained' onClick={() => close({...showreport , [data.title]:false})}>Close</Button>
        </div>
        {!showtable ?  data.contents.map((item) => (
             <Responseitem data={item} answer={useranswer}/>
        
        )   ) : (<TableView data={data} answers={tabledata}/>)}
       
        
    </div>
  )
}

export default Response


const Responseitem = ({data , answer}) => {
    const [user , setuser] = useState([])
    const [shoranswer , setshort] = useState([])
    const [year , setyear] = useState([])
    const [checkbox , setcheckbox] = useState([])
    useEffect(() => {
       initail()
    } , [answer])
    const initail = () => {
        let count = {}
        let Answer = []
        let year = []
        let check = []
        let check1 = []
        let ans = answer.filter(({Question}) => Question === data.Question)
        ans.forEach((i) => {
            i.Ans.map(i => i.map(j => check.push(j)))
            data.Answer.forEach((item , index) => {
                if(data.type !== 'Checkbox' && data.type !== 'Shortanswer' && data.type !== 'YearPicker') {
                    if(i.Ans.toString().includes(item)) {
                       count[item] = i.Ans.filter((i) => i.toString() === item).length
                    }
                }
                else if (data.type === 'Shortanswer') {
                    i.Ans.map(i => Answer.push(i))
                }
                else if (data.type === 'YearPicker') {
                    i.Ans.map(i  => year.push(i))
                }
                
                else {
                   check1.push(((check?.map(i => i.filter((j) => j[`ans${index}`]?.isChecked === true))).filter(k => k.length !== 0)).length)
                }

            })
        })
        
        setuser(count)
        setshort(Answer)
        setyear(year)
        setcheckbox(check1)
    }

    return (
        <div className="responseitem__Container">
           
            
            <h3>{data.Question}</h3>
            <ul className='ans_container'>

            {(data.type === 'Checkbox' || data.type === 'MultipleChoice' || data.type === 'Select') ? data.Answer.map((ans , index) => (
                <>
                {data.type !== 'Checkbox' ? <li>{ans}<span 
                style={{
                    fontSize:"20px",
                    color:"blue"
                }}
                
                > ({user[ans] ? user[ans] : 0 } response) </span></li> : <li>{ans} <span style={{color:"blue" ,    fontSize:"20px", }}> ({checkbox[index]} Response)</span></li>}
                
                
                </>
            )) : shoranswer.map((item) => 
               {if (item.toString() !== '') {
                return (
                <li>{item}</li>)
                } else {
                    return ''
                }} 
            )}
            {data.type === 'YearPicker' && year.map((item) => {
                if(item.toString() !== '') {
                    return (
                        <li>{item}</li>
                    )
                } else {
                    return ''
                }
            })
            }
            
            </ul>
           
        </div>
    )
}