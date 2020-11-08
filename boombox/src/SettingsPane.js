import React from 'react'
import './css/bootstrap.min.css';
import './SettingsPane.css';
import back_icon from './images/keyboard_backspace-24px.png'
import profile_icon from './images/account_circle-24px.svg';
import Cookie from 'universal-cookie';

class SettingsPane extends React.Component {
    constructor(props) {
        super(props);
        //this.props.closeWindow.bind(this);
        this.cookie = new Cookie();
        this.state = {
            profile_image_data: null
        }
    }

    getProfileImage = () => {
        if (this.state.profile_image_data) {
            return <img id="profile-image" src={`data:image/jpeg;base64,${this.state.profile_image_data}`} width="256px" height="256px" alt=""/>
        }
        return <img id="profile-image" src={profile_icon} width="256px" height="256px" className="invert-color" alt=""/>
    }

    send_add_media_request = (e) => {
        // console.log("hi");
        // var formData = new FormData(document.getElementById("change-icon-button"));
        // const response = fetch("/testImage", {
        //     method: 'POST',
        //     body: formData,
            
        // }).then(
        //     function(result) {
        //         if (result.status == "OK"){
        //             console.log("Upload Success");
        //         }
        //         else {
        //             console.log("Upload failed - Error: " + result.error);
        //         }
        //     }
        // );

        const formData = new FormData();
        const fileInput = document.getElementById("fileInput");
        if(fileInput.value == ""){
            e.preventDefault();
            alert("Please select a file.");
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
        if (!fileInput.value) {
            alert("Please select a file.");
            return;
        }

        //should probably add image validation in this file

        const file = fileInput.files[0];        
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
    
    editPassword = (e) => {
        e.preventDefault();
        const currentPassword =  document.getElementById('current-password-entry');
        const newPassword =  document.getElementById('new-password-entry');
        const confirmPassword =  document.getElementById('confirm-password-entry');
        if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
            alert('please fill out all fields');
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
            console.log(obj);
            //need to make response better
            if (obj.status == 0) {
                alert('password successfully changed');
                currentPassword.value = null;
                newPassword.value = null;
                confirmPassword.value = null;
            }
            else if (obj.status == 3) {
                alert('incorrect password');
            }
            else if (obj.status == 4) {
                alert('new password fields did not match');
            }
            else {
                alert('somehow it broke');
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
            console.log("was here");
            console.log(data);
            this.setState({profile_image_data: data.iconData});
        });
    }

    componentDidMount() {
        this.getProfileImageData();
    }

    render() {
        return (
            <div className="container-fluid" id="settings-pane">
                <div className="row" id="row1">
                    <div className="col-auto">

                        <img id="back-icon" src={back_icon} width="30px" heigh="30px" alt="" onClick={this.props.closeWindow} />
                    </div>
                    <div className="col">
                        <h1>Settings</h1>
                    </div>
                </div>
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
                                    {/* <button id="change-icon-button" className="btn btn-primary" type="button" >Change Icon</button> */}
                                    <form id ="upload-profile-img-form">
                                        <p><input type = "file" id = "fileInput" accept=".png, .jpeg, .jpg, .gif" /></p>
                                        <p>Image must be under 500KB and must be a PNG, JPEG, or GIF.</p>
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
                                    <input type="text" id="username-entry" placeholder="Username" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <button id="change-username-button" className="btn btn-primary" type="button">Change Username</button>
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
                                    <textarea id="user-bio-entry" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <button id="save-bio-button" className="btn btn-primary" type="button">Save Bio</button>
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
                                    <input id="email-entry" type="text" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <button id="change-email-button" className="btn btn-primary" type="button">Change Email</button>
                                </div>
                            </div>
                        </div>

                        <div id="change-password-section">
                            <div className="row">
                                <div className="col">
                                    Change Password
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2>Current Password</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input type="password" id="current-password-entry" placeholder="Current Password" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2>New Password</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input type="password" id="new-password-entry" placeholder="New Password" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2>Confirm New Password</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                <input type="password" id="confirm-password-entry" placeholder="Confirm New Password" />
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
            </div>          
        )
    }
}

export default SettingsPane;