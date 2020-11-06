import React from 'react';
import settings_icon from './images/settings-24px.svg';
import close_icon from './images/close-24px.svg';
import home_icon from './images/home-24px.svg';
import profile_icon from './images/account_circle-24px.svg';
import add_icon from './images/add_box-24px.svg';
import bookmark_icon from './images/bookmark-24px.svg';
import logout_icon from './images/exit_to_app-24px.svg';
import Cookie from 'universal-cookie';
import SettingsPane from './SettingsPane';
import './NavBar.css';
import { Redirect } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';


//TODO: add sliding animation
//reference: https://www.w3schools.com/howto/howto_js_animate.asp

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.iconSize = "30px";
        this.cookie = new Cookie();
        this.state = {
            inputVal: "",
            redirect: false,
            redirect_link: ""
        }
    }

    openSettings = () => {
        document.getElementById("settings-pane-fixed-top").style.display = "block";
        document.getElementById("settings-pane").style.display = "block";
    }

    closeSettings = () => {
        document.getElementById("settings-pane-fixed-top").style.display = "none";
        document.getElementById("settings-pane").style.display = "none";
    }

    logoutUser = () => {
        fetch('/logoutUser', {
			method: 'POST'
		}).then(res => {
            window.location.href= "/";
        });
    }

    createPlaylist = () => {
        fetch('/createPlaylist', {
			method: 'POST'
        }).then(res => res.json())
        .then(obj => {
            if(obj.status == 0){
                this.setState({
                    redirect: true,
                    redirect_link: "/playlist/" + obj.playlist_id + "/edit"
                });
                this.handleRedirect();
            }
        });
    }

    handleRedirect = () => {
        if(this.state.redirect)
            return <Redirect to={this.state.redirect_link} />
    }

    componentDidMount() {
        {this.closeSettings()}
    }

    updateInput = (event) => {
        this.setState({inputVal: event.target.value});
        console.log(this.state.inputVal);
    }

    showMenu (event) {
        event.preventDefault();
    }

    handleSearch = () => {
        if (this.state.inputVal !== "" && this.state.inputVal){
            this.setState({redirect: true, redirect_link: "/search/" + this.state.inputVal});
            this.handleRedirect();
        }
    }
    

    render() {
        var showProfile = <a href={this.cookie.get('username') ? "/user/" + this.cookie.get('username') : "/"}><img src={profile_icon} alt="" width={this.iconSize} height={this.iconSize} className = "menu-item invert-color" /> my profile</a>;
        var myBookmarks = <a href="/my-bookmarks"><img src={bookmark_icon} alt="" width={this.iconSize} height={this.iconSize} className = "menu-item invert-color" /> bookmarks</a>;
        var logoutButton = <div id="logout-click" onClick={this.logoutUser}><img id="logout-icon" src={logout_icon} alt="" width={this.iconSize} height={this.iconSize} className = "menu-item invert-color" /> log out</div>;
        var settingsIcon = <img id="settings-icon" src={settings_icon} alt="Settings" width={this.iconSize} height={this.iconSize} onClick={this.openSettings} className="invert-color" />;
        if (!this.cookie.get('username')) {
            settingsIcon = <div id="login-register-div">
                            <div id="login-link"><a href="/login">login</a></div>
                            <div id="register-link"><a href="/register">register</a></div>
                        </div>;
            showProfile = null;
            myBookmarks = null;
            logoutButton = <a href="/login"><img id="logout-icon" src={logout_icon} alt="" width={this.iconSize} height={this.iconSize} className = "menu-item invert-color" /> login</a>;
        }
        return (
            <div>
                {this.handleRedirect()}
                <Menu width={ 250 }>
                    <a href="/"><img src={home_icon} alt="" width={this.iconSize} height={this.iconSize} className = "menu-item invert-color"/> dashboard</a>
                    {showProfile}
                    <div id="create-playlist" onClick={this.createPlaylist}><img src={add_icon} alt="" width={this.iconSize} height={this.iconSize} className = "menu-item invert-color"/> new playlist</div>
                    {myBookmarks}
                    {logoutButton}
                </Menu>
                <Navbar bg = "dark" variant = "dark" fixed="top" id = "nav-bar">
                    <Nav className = 'mr-auto'>
                        <div>
                            <a onClick={ this.showMenu } className="menu-item--small" id = "push-menu-icon" href=""></a>
                        </div>
                    </Nav>

                    <Nav className = 'mr-auto'>
                        <Navbar.Brand href="/" id = "boombox-header">boombox</Navbar.Brand>
                    </Nav>
                    <Nav>
                    <Form inline id = "nav-search-bar">
                        <FormControl type="text" placeholder="search" className="mr-sm-2" onChange={this.updateInput} id = "search-input"/>

                        <Button variant="outline-info" onClick = {this.handleSearch}>search</Button>
                        <div>{settingsIcon}</div>
                    </Form>
                    </Nav>
                </Navbar>

                    <div className="fixed-top" id="settings-pane-fixed-top">
                     <SettingsPane 
                        closeWindow={this.closeSettings}
                        profile_image={this.props.profile_image}/>
                    </div>
            </div>
        );
    }
}

export default NavBar;