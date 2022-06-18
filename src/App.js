
import { Routes, Route } from "react-router-dom";
import './App.css';
import NavBar, { Topnavbar } from "./Component/Assets/NavBar";
import Form from "./Component/Form";
import Home from "./Component/Home";

function App() {
  return (
    <div className="App">
    <NavBar/>
    <Topnavbar/>
     <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/create-form" element={<Form/>}/>
      </Routes>
    </div>
  );
}

export default App;
