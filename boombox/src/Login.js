import React from 'react';
import './Login.css';


function Login() {
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

                    <form className = "login-form"> 
                      <div className = "form-group">
                          <input type = "email" className = "form-control" id = "login-email" placeholder = "E-mail" />
                      </div>

                      <div className = "form-group">
                          <input type = "password" className = "form-control" id = "login-password" placeholder = "Password" />
                      </div>

                      <button type = "submit" className = "btn btn-primary">Log In</button>
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
  
  export default Login;