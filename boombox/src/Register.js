import React from 'react';
import './Register.css';


function Register() {
    return (
        <div className = "registerScreen">
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
                      <div className = "form-group">
                          <input type = "email" className = "form-control" id = "register-email" placeholder = "E-mail" />
                      </div>

                      <div className = "form-group">
                          <input type = "username" className = "form-control" id = "register-username" placeholder = "Username" />
                      </div>

                      <div className = "form-group">
                          <input type = "password" className = "form-control" id = "register-password" placeholder = "Password" />
                      </div>

                      <div className = "form-group">
                          <input type = "password" className = "form-control" id = "register-confirm-password" placeholder = "Confirm Password" />
                      </div>

                      <button type = "submit" className = "btn btn-primary">Register</button>
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
  
  export default Register;