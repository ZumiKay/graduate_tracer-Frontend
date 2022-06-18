import React, { useState } from "react";

export const TracerContext = React.createContext()

export const Contexts = ({children}) => {
    const [showactive , setshowactive] = useState({})
    
    
    
    
    
    
    
    return( <TracerContext.Provider
        value={{
            showactive,
            setshowactive
        }}
        
        >
            {children}
        </TracerContext.Provider>)
}