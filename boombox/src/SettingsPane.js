import React from 'react'
import './css/bootstrap.min.css';
import './SettingsPane.css';
import back_icon from './images/keyboard_backspace-24px.svg'
import settings_icon from './images/settings-24px.svg';
import profile_icon from './images/account_circle-24px.svg';
import Modal from 'react-bootstrap/Modal'
import Cookie from 'universal-cookie';

class SettingsPane extends React.Component {
    constructor(props) {
        super(props);
        //this.props.closeWindow.bind(this);
        this.cookie = new Cookie();
        this.state = {
            data: null,
            profile_image_data: null,
            show: false,
            username: "",
            bio: "",
            bioCount: 0,
            email: "",
        }
    }

    getProfileImage = () => {
        if (this.state.profile_image_data) {
            return <img id="profile-image" src={`data:image/jpeg;base64,${this.state.profile_image_data}`} width="200px" height="200px" alt=""/>
        }
        return <img id="profile-image" src={profile_icon} width="256px" height="256px" className="invert-color" alt=""/>
    }

    getUserSettings(){
        var user = this.cookie.get('username');
        if(!user){
            alert("ERROR: User cookie does not exist!");
            return;
        }
        else {
            fetch(`/getUserSettings/${user}`)
            .then(res => res.json())
            .then(obj => {
                if (obj.status === 0) {
                    this.setState({
                        data: obj.result,
                        username: obj.result.username,
                        bio: obj.result.bio,
                        email: obj.result.email,
                        bioCount: obj.result.bio.length
                    });
                }
                else {
                    this.setState({data: null}); //do stuff for showing not found
                }
            });
        }
    }

    send_add_media_request = (e) => {
        const formData = new FormData();
        const fileInput = document.getElementById("fileInput");
        var error = document.getElementById("settings-error");
        var confirm = document.getElementById("settings-confirm");
        if(fileInput.value === ""){
            e.preventDefault();
            //alert("Please select a file.");
            error.innerHTML = "Please select a file.";
            confirm.innerHTML = "";
            return;
        }

        const file = fileInput.files[0];        
        formData.append('file', file);
        console.log('formData', JSON.stringify(Object.fromEntries(formData.entries())));
        fetch('/testImage', { /*this line throws it into an error. "SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data." why?*/
            method: 'POST',
            body: formData
        })
        .then(res => res.json()) 
        .then( data => {
            console.log(data)
        })
        .catch(error => {
            console.error(error)
        });
    }

    editUserIcon = (e) => {
        
        e.preventDefault();
        const formData = new FormData();
        const fileInput = document.getElementById("fileInput");
        var error = document.getElementById("settings-error");
        var confirm = document.getElementById("settings-confirm");
        if (!fileInput.value) {
            //alert("Please select a file.");
            error.innerHTML = "Please select a file.";
            confirm.innerHTML = "";
            return;
        }

        const file = fileInput.files[0];    
        const imageExts = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!imageExts.includes(file.type)) {
            alert("not an image");
            return;
        }
        if (file.size > 2000000) {
            alert("file too big");
            return;
        }

        formData.append('file', file);
        fetch('/editUserIcon', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json()) 
        .then( data => {
            console.log("was here");
            console.log(data);
            this.setState({profile_image_data: data.iconData});
        });
    }

    changeUsername = (e) => {
        e.preventDefault();
        //need to check if username already taken
        const username =  this.state.username;
        var error = document.getElementById("settings-error");
        var confirm = document.getElementById("settings-confirm");
        if (!username || username.value === "") {
            //alert('Please provide a valid username.');
            error.innerHTML = "Please provide a valid username.";
            confirm.innerHTML = "";
            return;
        }
        const body = JSON.stringify({
            'newUsername': username
        });
        const headers = {"Content-Type": "application/json"};
		fetch('/editUserSettings', {
			method: 'POST',
			body: body,
			headers: headers
		}).then(res => res.json())
        .then(obj => {
            //need to make response better
            if (obj.status === 0) {
                //alert('Username changed!');
                error.innerHTML = "";
                confirm.innerHTML = "Username changed!";
                if (this.props.afterSettingsUpdate) {
                    this.props.afterSettingsUpdate({username: username.value});
                }
            }
            else if (obj.status === 5) {
                //alert('Username already taken!');
                error.innerHTML = "Username already taken!";
                confirm.innerHTML = "";
            }
            else if (obj.status === 2) {
                //alert('Username already taken!');
                error.innerHTML = "Email already in use!";
                confirm.innerHTML = "";
            }
            else {
                //alert('somehow it broke');
                error.innerHTML = "ERROR: Whoops, something went wrong! Try again later.";
                confirm.innerHTML = "";
            }
        });
    }

    changeEmail = (e) => {
        e.preventDefault();
        const email =  this.state.email;
        var error = document.getElementById("settings-error");
        var confirm = document.getElementById("settings-confirm");
        if (!email || !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value)) {
            //alert('Please provide a valid email.');
            error.innerHTML = "Please provide a valid email.";
            confirm.innerHTML = "";
            return;
        }
        const body = JSON.stringify({
            'newEmail': email
		});
        const headers = {"Content-Type": "application/json"};
		fetch('/editUserSettings', {
			method: 'POST',
			body: body,
			headers: headers
		}).then(res => res.json())
        .then(obj => {
            //need to make response better
            if (obj.status === 0) {
                //alert('E-mail changed!');
                error.innerHTML = "";
                confirm.innerHTML = "E-mail changed!";
            }
            else if (obj.status === 2) {
                //alert('E-mail already in use!');
                error.innerHTML = "E-mail already in use!";
                confirm.innerHTML = "";
            }
            else {
                //alert('somehow it broke');
                error.innerHTML = "ERROR: Whoops, something went wrong! Try again later.";
                confirm.innerHTML = "";
            }
        });
    }

    changeBio = (e) => {
        e.preventDefault();
        const bio = this.state.bio;
        var error = document.getElementById("settings-error");
        var confirm = document.getElementById("settings-confirm");
        if(!bio){
            bio = "";
        }
        const body = JSON.stringify({
            'newBio': bio
        });
        const headers = {"Content-Type": "application/json"};
		fetch('/editUserSettings', {
			method: 'POST',
			body: body,
			headers: headers
		}).then(res => res.json())
        .then(obj => {
            //need to make response better
            if (obj.status === 0) {
                //alert('Bio successfully changed!');
                error.innerHTML = "";
                confirm.innerHTML = "Bio successfully changed!";
                if (this.props.afterSettingsUpdate) {
                    this.props.afterSettingsUpdate({bio: bio});
                }
            }
            else {
                //alert('somehow it broke');
                error.innerHTML = "ERROR: Whoops, something went wrong! Try again later.";
                confirm.innerHTML = "";
            }
        });
    }
    
    editPassword = (e) => {
        e.preventDefault();
        const currentPassword =  document.getElementById('current-password-entry');
        const newPassword =  document.getElementById('new-password-entry');
        const confirmPassword =  document.getElementById('confirm-password-entry');
        var error = document.getElementById("settings-error");
        var confirm = document.getElementById("settings-confirm");
        if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
            //alert('please fill out all fields');
            error.innerHTML = "Please fill out all fields!";
            confirm.innerHTML = "";
            return;
        }
		const body = JSON.stringify({
            'currentPassword': currentPassword.value,
            'newPassword': newPassword.value,
            'newPasswordConfirm': confirmPassword.value
		});
        const headers = {"Content-Type": "application/json"};
		fetch('/editUserSettings', {
			method: 'POST',
			body: body,
			headers: headers
		}).then(res => res.json())
        .then(obj => {
            //need to make response better
            if (obj.status === 0) {
                //alert('password successfully changed');
                error.innerHTML = "";
                confirm.innerHTML = "Password successfully changed!";
                currentPassword.value = null;
                newPassword.value = null;
                confirmPassword.value = null;
            }
            else if (obj.status === 3) {
                //alert('incorrect password');
                error.innerHTML = "Incorrect password.";
                confirm.innerHTML = "";
            }
            else if (obj.status === 4) {
                //alert('new password fields did not match');
                error.innerHTML = "New password fields did not match. Please try again.";
                confirm.innerHTML = "";
            }
            else {
                //alert('somehow it broke');
                error.innerHTML = "ERROR: Whoops, something went wrong! Try again later.";
                confirm.innerHTML = "";
            }
        });
    }
      
    getProfileImageData = () => {
        const username = this.cookie.get('username');
        const body = JSON.stringify({username: username});
        const headers = {"Content-Type": "application/json"};
        fetch('/getUserIcon', {
            method: 'POST',
            body: body,
            headers: headers
        })
        .then(res => res.json()) 
        .then(data => {
            this.setState({profile_image_data: data.iconData});
        });
    }

    componentDidMount() {
        this.getProfileImageData();
        this.getUserSettings();
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handleEmailChange = (event) => {
        this.setState({ email: event.target.value });
    }

    handleBioChange = (event) => {
        this.setState({ bio: event.target.value, bioCount: event.target.value.length });
    }

    handleShow = () => {
        this.getUserSettings();

        this.setState({ show: true });      
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    render () {
        return (
            <div>
                <img src={settings_icon} height="30px" width="30px" id = "settings-icon" alt="Settings" onClick={this.handleShow} className="invert-color" />

                <Modal id = "settings-pane" dialogClassName = "navbar-settings-modal" show={this.state.show} onHide={this.handleClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    keyboard={false}>
                        <img id="back-icon" src={back_icon} width="30px" heigh="30px" alt="" onClick={this.handleClose} className="invert-color" />
                        <div className = "settings-modal-header">
                            settings
                        </div>

                        <center><div id = "settings-error"></div>
                        <div id = "settings-confirm"></div></center>

                        <div className="row" id="row2">
                    <div className="col-6" id="left-col">
                        <div id="change-icon-section">
                            <div className="row">
                                <h1>User Icon</h1>
                            </div>
                            <div className="row" id="user-icon-row">
                                <div className="col">
                                    {this.getProfileImage()}
                                </div>
                                <div className="col" id="user-icon-right-side">
                                    <form id ="upload-profile-img-form">
                                        <p><input type = "file" id = "fileInput" accept=".png, .jpeg, .jpg, .gif" /></p>
                                        <p>Image must be under 2MB and must be a PNG, JPEG, or GIF.</p>
                                        <button type="submit" id="change-icon-button" className="btn btn-primary" onClick = {this.editUserIcon}>Change Icon</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div id="change-username-section">
                            <div className="row">
                                <div className="col">
                                    <h1>Change Username</h1>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input type="text" id="username-entry" placeholder="Username" maxLength = "32" onChange = {this.handleUsernameChange} value = {this.state.username}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <button id="change-username-button" className="btn btn-primary" type="button" onClick = {this.changeUsername}>Change Username</button>
                                </div>
                            </div>
                        </div>

                        <div id="user-bio-section">
                            <div className="row">
                                <div className="col">
                                    <h1>User Bio</h1>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <textarea id="user-bio-entry" maxLength = "500" onChange = {this.handleBioChange} onKeyDown = {this.handleBioChange} value = {this.state.bio}/>
                                    <span id = "user-bio-char-count">{this.state.bioCount}</span><span id = "user-bio-char-max">/500</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <button id="save-bio-button" className="btn btn-primary" type="button" onClick = {this.changeBio}>Save Bio</button>
                                </div>
                            </div>
                        </div>   
                    </div>
                    <div className="col-6" id="right-col">
                        <div id="change-email-section">
                            <div className="row">
                                <div className="col">
                                    <h1>Change Email</h1>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input id="email-entry" type="text" onChange = {this.handleEmailChange} maxLength = "100" value = {this.state.email}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <button id="change-email-button" className="btn btn-primary" type="button" onClick = {this.changeEmail}>Change Email</button>
                                </div>
                            </div>
                        </div>

                        <div id="change-password-section">
                            <div className="row">
                                <div className="col">
                                    <b>Change Password</b>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2>Current Password</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input type="password" id="current-password-entry" maxLength = "100" placeholder="Current Password" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2>New Password</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input type="password" id="new-password-entry" maxLength = "100" placeholder="New Password" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2>Confirm New Password</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                <input type="password" id="confirm-password-entry" maxLength = "100" placeholder="Confirm New Password" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                <button id="change-password-button" className="btn btn-primary" type="button" onClick={this.editPassword}>Set New Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Modal>
            </div>
        )
    }
}

export default SettingsPane;