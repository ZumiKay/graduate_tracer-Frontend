
import React, { useState } from "react";

export const TracerContext = React.createContext()

export const Contexts = ({children}) => {
    const [showactive , setshowactive] = useState({})
    const [surveys , setsurveys] = useState([])
    const [open , setopen] = useState(false) 
    const [titleform , settitle] = useState('')
    const [showdialog  , setshowdialog] = useState(false)
    const [showsend , setsend] = useState(false)
    const [edit , setedit] = useState(false) 
    const [check , setcheck] = useState({})
    const [Useranswer , setanswer] = useState({})
    const [checkbox, setcheckbox] = useState({})
    const [j , setj] = useState(0)
    const auth =  JSON.parse(localStorage.getItem('auth'))
    const [isloading , setisloading] = useState({
        home: false ,
        user:false ,
        save:false , 
        send:false
    })

    
    return( <TracerContext.Provider
        value={{
            j,
            setj,
            showactive,
            setshowactive,
            surveys ,
            setsurveys,
            open ,
            setopen,
            titleform,
            settitle,
            showdialog,
            setshowdialog,
            showsend ,
            setsend ,
            edit ,
            setedit ,
            check ,
            setcheck,
            Useranswer ,
            setanswer ,
            checkbox ,
            setcheckbox ,
            isloading ,
            setisloading , 
            auth

            
           
        }}
        
        >
            {children}
        </TracerContext.Provider>)
}