import React, { useState,useContext } from 'react';
import {Navigate} from 'react-router-dom'
import '../styles/LoginPage.css';
import { UserContext } from '../UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  const [errMsg,setErrMsg]=useState(null);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  async function handleLogin (ev) {
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Event: ',ev);
    ev.preventDefault();
    const response=await fetch('http://localhost:4000/user/login',
    {
      method:'POST',
      body:JSON.stringify({email,password}),
      headers:{'Content-Type':"application/json"},
      credentials:'include'
  });
    console.log(response);
    if(response.ok){
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        console.log("uinfo",userInfo);
        setRedirect(true);
      });
    }
    else if(response.status===404){
      setErrMsg("Email Not Registered")
    }
    else{
      setErrMsg("Password Incorrect") 
    }
  };

  if(redirect){
    return <Navigate to="/"/>
  }
  

  return (
    <div className="login-page">
      <h1>Login</h1>
      {errMsg&&
        <div className='loginError'>
          {errMsg}
        </div>
      }

      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
      </div>
   
      <div className="form-group">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
      </div>
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;