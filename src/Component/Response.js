import { Button } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { env } from '../environment'
import '../Style/style.css'
const Response = ({data , close , showreport}) => {
    const [useranswer , setanswer] = useState([])
    useEffect(() => {
        getAnswer()
    } , [data])
    const getAnswer = () => {
        axios({
            method:"get" ,
            url:env.API_URL + "/getanswer/" + data._id,
            headers:{"x-access-token": env.auth.accessToken}
        }).then((res) => {
            let obj = []
            data.contents.forEach((item) => {
               obj.push(
                {
                    Question: item.Question ,
                    Ans: res.data.answer.map(ans => {
                    return ans.Responses !== [] && ans.Responses.filter(({Question}) => Question === item.Question).map(i => {
                        return i.response
                    })
                    })
                }
               )
            })
            setanswer(obj)
        })
    }
  return (
    <div className='response__Container'>
        <h1>{data.title}</h1>
        <Button variant='contained' onClick={() => close({...showreport , [data.title]:false})}>Close</Button>
        {data.contents.map((item) => (
             <Responseitem data={item} answer={useranswer}/>

        ))}
       
        
    </div>
  )
}

export default Response


const Responseitem = ({data , answer}) => {
    const [user , setuser] = useState([])
    const [shoranswer , setshort] = useState([])
    const [checkbox , setcheckbox] = useState([])
    useEffect(() => {
       initail()
    } , [answer])
    const initail = () => {
        let count = {}
        let Answer = []
        let check = []
        let check1 = []
        let ans = answer.filter(({Question}) => Question === data.Question)
        ans.forEach((i) => {
            i.Ans.map(i => i.map(j => check.push(j)))
            data.Answer.forEach((item , index) => {
                if(data.type !== 'Checkbox' && data.type !== 'Shortanswer') {
                    if(i.Ans.toString().includes(item)) {
                       count[item] = i.Ans.filter((i) => i.toString() === item).length
                    }
                }
                else if (data.type === 'Shortanswer') {
                    i.Ans.map(i => Answer.push(i))
                } else {
                   check1.push(((check.map(i => i.filter((j) => j[`ans${index}`]?.isChecked === true))).filter(k => k.length !== 0)).length)
                }

            })
        })
        setuser(count)
        setshort(Answer)
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
            
            </ul>
           
        </div>
    )
}