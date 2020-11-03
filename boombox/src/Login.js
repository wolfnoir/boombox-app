import React from 'react';
import './Login.css';


class Login extends React.Component {
	loginUser = () => {
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
		});
	}

    render() {
        return (
            <div className = "loginScreen">
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
                          <div className = "form-group">
                              <input type = "email" name="email" className = "form-control" id = "login-email" placeholder = "E-mail" />
                          </div>

                          <div className = "form-group">
                              <input type = "password" name="password" className = "form-control" id = "login-password" placeholder = "Password" />
                          </div>

                          <a type = "submit" className = "btn btn-primary" role="button" onClick={this.loginUser}>Log In</a>
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