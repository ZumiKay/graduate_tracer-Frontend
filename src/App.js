import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './Component/Assets/NavBar';
import Form from './Component/Form';
import Home from './Component/Home';
import Authentication from './Component/Authentication';
import { useState, useEffect, useContext, useRef } from 'react';
import PrivateRoute from './PrivateRoute';
import axios from 'axios';
import { env } from './environment';
import Report from './Component/Report';
import Preview from './Component/Preview';
import Usermanagement from './Component/Usermanagement';
import { Assetimg } from './Component/Assets/Image/Images';
import { TracerContext } from './context';

function App() {
    const [hide, sethide] = useState(false);
    const [hidenav, sethidenav] = useState(false);
    const logoref = useRef(null)
    const [hidelogo, sethidelogo] = useState(false);
    const [survey, setsurvey] = useState([]);
    const location = useLocation();
    const ctx = useContext(TracerContext);
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/p')) {
            sethide(false);
        } else {
            sethide(true);
        }

        window.addEventListener('resize', resizewidth);
       
        return () => {
            window.removeEventListener('resize', resizewidth);
            
        };
    }, [location.pathname]);
    useEffect(() => {
        if(env.auth) {
        getForm();
        resizewidth();}
    }, []);
    
    const resizewidth = () => {
        if (window.innerWidth < 500) {
            sethidenav(true);
            sethidelogo(true);
        } else {
            sethidenav(false);
            sethidelogo(false);
        }
    };
    const getForm = () => {
        ctx.setisloading({ ...ctx.isloading, home: true });
        axios({
            method: 'get',
            url: env.API_URL + '/getform',
            headers: {
                'x-access-token': env.auth.accessToken
            }
        })
            .then((res) => {
                ctx.setisloading({ ...ctx.isloading, home: false });
                setsurvey(res.data.survey);
            })
            .catch((err) => console.log(err));
    };
    return (
        <div className="App">
            {env.auth?.accessToken ? (
                <>
                    {hide ? (
                        <>
                            {' '}
                            {(!hidenav) && (
                                <>
                                    <NavBar logoref={logoref} setclose={sethidenav} />
                                </>
                            )}
                            {hidelogo && <img ref={logoref}  onClick={() => {
                                sethidenav(false)}} className="Logo_nav" src={Assetimg.Logo} alt="logo" />}
                        </>
                    ) : (
                        <></>
                    )}{' '}
                </>
            ) : (
                <></>
            )}
            <Routes>
                <Route
                    path="/"
                    element={
                        env.auth.accessToken ? (
                            <PrivateRoute redirectPath={'/'} isAllowed={env.auth.accessToken}>
                                <Home survey={survey} />
                            </PrivateRoute>
                        ) : (
                            <Authentication />
                        )
                    }
                />
                {survey.map((item) => (
                    <>
                        <Route
                            path={`/form/${item._id}`}
                            element={
                                <PrivateRoute redirectPath={'/'} isAllowed={env.auth.accessToken}>
                                    <Form data={item} />
                                </PrivateRoute>
                            }
                        />
                    </>
                ))}
                <Route exact path="/p/:id" element={<Preview data={survey} />} />
                <Route
                    path="/report"
                    element={
                        <PrivateRoute redirectPath={'/'} isAllowed={env.auth.accessToken}>
                            <Report data={survey} />
                        </PrivateRoute>
                    }
                />
                <Route
                    exact
                    path="/users"
                    element={
                        <PrivateRoute redirectPath={'/'} isAllowed={env.auth.accessToken}>
                            <Usermanagement />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
