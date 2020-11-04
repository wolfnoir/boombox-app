import React from 'react';
import './Register.css';
import { Redirect } from "react-router-dom";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            email: '',
            username: '',
            pwd: '',
            confirmPwd: ''
        }
    }

    registerUser = (e) => {
        e.preventDefault();

        if(this.state.email === "" || this.state.username === "" || this.state.pwd === "" || this.state.confirmPwd === ""){
            this.errorUpdate(3);
            return;
        }
        
        if(this.state.pwd === this.state.confirmPwd){
            const body = JSON.stringify({
                'email': document.getElementById("register-email").value,
                'username': document.getElementById("register-username").value,
                'password': document.getElementById("register-password").value
            });
            const headers = {"Content-Type": "application/json"};
            fetch('/registerUser', {
                method: 'POST',
                body: body,
                headers: headers
            }).then(res => res.json())
            .then(obj => {
                console.log(obj);
                if(obj.status !== 0){
                    this.errorUpdate(obj.status);
                }
                else {
                    this.setState({ redirect: true });
                    this.handleRedirect();
                }
            });
            return;
        }
        else {
            this.errorUpdate(2);
            return;
        }
    }

    handleRedirect(){
        if(this.state.redirect)
            return <Redirect to="/registersuccess" />
    }

    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
          });
    }

    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
          });
    }

    handlePasswordChange = (e) => {
        this.setState({
            pwd: e.target.value,
          });
    }

    handlePasswordConfirm = (e) => {
        this.setState({
            confirmPwd: e.target.value,
          });
    }
    
    errorUpdate(num) {
        const errorDiv = document.getElementById('error-response');
        var errorMsg = "Unknown Error";
        if(num === 1){
            errorMsg = "Email/Username already exists!";
        }
        else if (num === 2){
            errorMsg = "Passwords don't match!";
        }
        else if (num === 3){
            errorMsg = "Please fill out all fields.";
        }
        errorDiv.innerHTML = 'ERROR: ' + errorMsg;
        console.log('ERROR: ' + errorMsg);
    }

    render(){
        return (
            <div className = "registerScreen">
                {this.handleRedirect()}
                <div className = "register-container">
                <center>

                    <div className = "boombox-header">
                        Boombox
                    </div>

                    <div className = "boombox-subtitle">
                        putting personality back into playlists
                    </div>

                    <div className = "register-menu">
                    <div className = "boombox-register-title">
                        Register
                    </div>

                        <form className = "registration-form"> 
                            <div id = "error-response"></div>
                        <div className = "form-group">
                            <input type = "email" className = "form-control" id = "register-email" placeholder = "E-mail" onChange = {this.handleEmailChange} />
                        </div>

                        <div className = "form-group">
                            <input type = "username" className = "form-control" id = "register-username" placeholder = "Username" onChange = {this.handleUsernameChange}/>
                        </div>

                        <div className = "form-group">
                            <input type = "password" className = "form-control" id = "register-password" placeholder = "Password" onChange = {this.handlePasswordChange} />
                        </div>

                        <div className = "form-group">
                            <input type = "password" className = "form-control" id = "register-confirm-password" placeholder = "Confirm Password" onChange = {this.handlePasswordConfirm}/>
                            <span id = 'password-message'></span>
                        </div>

                        <button type = "submit" id = "submit" className = "btn btn-primary" role="button" onClick={this.registerUser}>Register</button>
                        </form>
                        
                        <div>
                        Already a user? Log in <a className = "login-link" href='/login'>here.</a>
                        </div>
                    </div>
                </center>
                </div>
                <a className = "freepix-attribution" href='https://www.freepik.com/vectors/background'>Background vector created by pikisuperstar - www.freepik.com</a>
            </div>
        );
    }
  }
  
  export default Register;