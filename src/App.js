

import { Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import NavBar from "./Component/Assets/NavBar";
import Form, { SurveyItem } from "./Component/Form";
import Home from "./Component/Home";
import Authentication from "./Component/Authentication";
import { useState , useEffect } from "react";
import PrivateRoute from "./PrivateRoute";
import axios from "axios";
import { env } from "./environment";
import Report from "./Component/Report";

import Preview from "./Component/Preview";
import Usermanagement from "./Component/Usermanagement";





function App() {
  
  const [hide , sethide] = useState(false)
  const [hidenav , sethidenav] = useState(false)
  const [survey , setsurvey] = useState([])
  const auth = JSON.parse(localStorage.getItem('auth'))
  const location = useLocation()
  useEffect(() => {
    const path = location.pathname
    if(path.includes('/p')){
      sethide(false)
    } else {
      sethide(true)
    }
   getForm()
   
    
 
  } , [location.pathname])
  const getForm  = () => {
    axios({
      method:"get",
      url:env.API_URL + "/getform",
      headers: {
        "x-access-token" : auth?.accessToken, 
        
     }
    }).then((res) => {
      setsurvey(res.data.survey)
    }).catch(err => console.log(err))
  }
  return (
    <div className="App">
      
   {auth?.accessToken ?<>{hide ? <> <NavBar/>
    </> : <></>} </> : <></>}
     <Routes>
        <Route path="/" element={
        auth?.accessToken ? <PrivateRoute redirectPath={'/'} isAllowed={auth?.accessToken}>
        <Home survey={survey}/>
      </PrivateRoute> :
        <Authentication/> }/>
      {survey.map((item) => (
        <>
        <Route path={`/form/${item._id}`} element={
          <PrivateRoute  redirectPath={"/"} isAllowed={auth?.accessToken}>
          <Form data={item}/>
        </PrivateRoute>
        }/>
       
        </>
      ))}
      <Route exact path="/p/:id" element={<Preview data={survey}/>}/>
       <Route path="/report" element={
        <PrivateRoute redirectPath={"/"} isAllowed={auth?.accessToken}>
          <Report data={survey}/>
        </PrivateRoute>
       }/>
       <Route exact path="/users" element={
        <PrivateRoute redirectPath={"/"} isAllowed={auth?.accessToken}>
          <Usermanagement/>
        </PrivateRoute>
       }/>
       
      
      
    </Routes>
      
    </div>
  );

}

export default App;
