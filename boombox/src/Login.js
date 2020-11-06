import React from 'react';
import './Login.css';
import { Redirect } from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false
        }
    }

	loginUser = (e) => {
        e.preventDefault();
		const body = JSON.stringify({
			'email': document.getElementById("login-email").value,
			'password': document.getElementById("login-password").value
		});
        const headers = {"Content-Type": "application/json"};
		fetch('/loginUser', {
			method: 'POST',
			body: body,
			headers: headers
		}).then(res => res.json())
        .then(obj => {
            console.log(obj);
            console.log(obj.status);
            if(obj.status != 0){
                this.errorUpdate(obj.status);
            }
            else {
                this.setState({ redirect: true });
                this.handleRedirect();
            }
        });
    }

    handleRedirect(){
        if(this.state.redirect)
            return <Redirect to="/" />
    }
    
    errorUpdate(num) {
        const errorDiv = document.getElementById('error-response');
        var errorMsg = "Unknown Error";
        if(num === 1){
            errorMsg = "Incorrect email/password.";
        }
        else if(num === 2){
            errorMsg = "User already logged in.";
        }
        errorDiv.innerHTML = 'ERROR: ' + errorMsg;
        console.log('ERROR: ' + errorMsg);
    }

    render() {
        return (
            <div className = "loginScreen">
                {this.handleRedirect()}
                <div className = "login-container">
                  <center>

                    <div className = "boombox-header">
                        Boombox
                    </div>

                    <div className = "boombox-subtitle">
                        putting personality back into playlists
                    </div>

                    <div className = "login-menu">
                    <div className = "boombox-login-title">
                        Log In
                    </div>

                        <form className = "login-form" id="loginForm"> 
                            <div id = "error-response"></div>
                          <div className = "form-group">
                              <input type = "email" name="email" className = "form-control" id = "login-email" placeholder = "E-mail" />
                          </div>

                          <div className = "form-group">
                              <input type = "password" name="password" className = "form-control" id = "login-password" placeholder = "Password" />
                          </div>

                          <button type = "submit" className = "btn btn-primary" role="button" onClick={this.loginUser}>Log In</button>
                        </form>
                        
                        <div>
                        Not a user? Register <a className = "register-link" href='/register'>here.</a>
                        </div>
                    </div>
                  </center>
                </div>
                  <a className = "freepix-attribution" href='https://www.freepik.com/vectors/background'>Background vector created by pikisuperstar - www.freepik.com</a>
            </div>
        );
    }
  }
  
  export default Login;