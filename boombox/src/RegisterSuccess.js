import React from 'react';
import './RegisterSuccess.css';
import { Redirect } from "react-router-dom";

class RegisterSuccess extends React.Component {
    constructor(props) {
        super(props);
    }


    render(){
        return (
            <div className = "register-success">
                <div className = "success-container">
                <center>

                    <div className = "success-menu">
                    <div className = "boombox-success-title">
                     🎊 welcome to boombox! 🎊
                    </div>
                        
                        <div>
                        Make sure to log in <a className = "login-link" href='/login'>here</a> with your new account!
                        </div>
                    </div>
                </center>
                </div>
                <a className = "freepix-attribution" href='https://www.freepik.com/vectors/background'>Background vector created by pikisuperstar - www.freepik.com</a>
            </div>
        );
    }
  }
  
  export default RegisterSuccess;