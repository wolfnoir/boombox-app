import React from 'react'
import './css/bootstrap.min.css';
import './SettingsPane.css';
import back_icon from './images/keyboard_backspace-24px.png'
import profile_icon from './images/account_circle-24px.svg';

class SettingsPane extends React.Component {
    constructor(props) {
        super(props);
        //this.props.closeWindow.bind(this);
    }

    getProfileImage = () => {
        if (this.props.profile_image) {
            return <img id="profile-image" src={this.props.profile_image} width="256px" height="256px" alt=""/>
        }
        return <img id="profile-image" src={profile_icon} width="256px" height="256px" style={{filter: 'invert(1)'}} alt=""/>
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
                                    <p><button id="change-icon-button" className="btn btn-primary" type="button">Change Icon</button></p>
                                    <p>Image must be under 500KB and must be a PNG, JPEG, or GIF.</p>
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
                                    <input type="text" id="current-password-entry" placeholder="Current Password" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2>New Password</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input type="text" id="new-password-entry" placeholder="New Password" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2>Confirm New Password</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                <input type="text" id="confirm-password-entry" placeholder="Confirm New Password" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                <button id="change-password-button" className="btn btn-primary" type="button">Set New Password</button>
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