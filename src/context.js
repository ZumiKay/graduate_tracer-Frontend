
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

    
    return( <TracerContext.Provider
        value={{
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
            setcheckbox

            
           
        }}
        
        >
            {children}
        </TracerContext.Provider>)
}