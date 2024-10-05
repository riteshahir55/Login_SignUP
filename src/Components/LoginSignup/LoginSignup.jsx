import React, { useState } from 'react'
import axios from 'axios';
import './LoginSignup.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({}); // storing validation errors

    const validateFields = () => {
        const newErrors = {};
       
        if(action === "Sign Up"){
            if(!name){
            newErrors.name = "Name is required";
        } else if(!/^[A-Za-z\s]+$/.test(name)) {
            newErrors.name = "Name can only contain letters and spaces";
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


    const handleSubmit = async() => {

        //validate fields before submit
        if(!validateFields()){
            return;
        }
        if(action === "Sign Up"){
            try{
                const response = await axios.post('http://localhost:8080/api/users/signup', {
                    name, email, password
                });
                alert(response.data);
            } catch(error){
                console.error('Error during the sign up: ', error);
                alert("An error occured during sign up.")
            }
        } else{
            try{
                const response = await axios.post('http://localhost:8080/api/users/login', {
                    email, password
                });
                alert(response.data);
            } catch(error){
                console.error('Error during login:', error);
                alert('An error occured during login.');
            }
        }
    };

  return (
    <div className='container'>
        <div className='header'>
            <div className='text'>{action}</div>  
            <div className='underline'></div>  
        </div>

        <div className='inputs'>
            {action === "Login"?<div></div>:<div className='input'>
                <img src={user_icon} alt=""/>
                <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>}
            
            {/* input div for email */}
            <div className='input'>
                <img src={email_icon} alt=""/>
                <input type="email" placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            {/* input div for password */}
            <div className='input'>
                <img src={password_icon} alt=""/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className='submit-container'>
                <div className='submit' onClick={handleSubmit}>{action}</div>
            </div>
        </div>

        {action === "Sign Up" ? (
                <div className="toggle-message">
                    Already have an account? <span onClick={() => setAction("Login")}>Login</span>
                </div>
            ) : (
                <div className="toggle-message">
                    Create new account? <span onClick={() => setAction("Sign Up")}>Sign Up</span>
                </div>
            )}
    </div>
  )
};


export default LoginSignup;
