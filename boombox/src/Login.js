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
                    AAAAAAAAAAAAAAA <br/>
                    <button class="btn btn-primary btn-lg hoverable">Log In</button>
                    
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