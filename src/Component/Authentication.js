import axios from 'axios';
import React, { useContext, useState } from 'react';

import { TracerContext } from '../context';
import { env } from '../environment';
import '../Style/style.css';
import { Assetimg } from './Assets/Image/Images';

const Authentication = () => {
    const ctx = useContext(TracerContext);
    const [userdata, setuserdata] = useState({
        email: '',
        password: ''
    });
    const [err, seterr] = useState('');
    const handleChange = (e) => {
        setuserdata({ ...userdata, [e.target.id]: e.target.value });
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        ctx.setisloading({...ctx.isloading , login: true})
        await axios({
            method: 'POST',
            url: env.API_URL + '/login',
            data: userdata
        })
            .then((res) => {
                ctx.setisloading({...ctx.isloading , login: false})
                localStorage.setItem('auth', JSON.stringify(res.data));
                if(res.status === 200) {
                  window.location.reload()
                }
            })
            .catch((err) => {
              ctx.setisloading({...ctx.isloading , login: false})
              seterr(err.response.data.message);
            });
    };
    return (
        <>
            <div className="Login__Container">
              
                <form onSubmit={handleLogin} className="Login_Form">
                <img src={Assetimg.Logo} alt={'Logo'} />
                <h1 className="Title">Graduate Tracer System </h1>
                    {err !== '' &&<h3> {err}</h3>}
                    <input onChange={handleChange} id="email" type="email" placeholder="Email" required />
                    <input onChange={handleChange} id="password" type="password" placeholder="Password" required />
                    
                    {ctx.isloading.login ?  <button className='login_btn loading' onClick={(e) => e.preventDefault() }>Please Wait</button> :  <button className='login_btn' type='submit'>Login</button>}
                </form>
            </div>
        </>
    );
};

export default Authentication;
