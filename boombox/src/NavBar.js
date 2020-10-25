import React from 'react';
import menu_icon from './images/menu-24px.png';
//import search_icon from './images/search-24px.svg';
import settings_icon from './images/settings-24px.png';
import close_icon from './images/close-24px.png';
import home_icon from './images/home-24px.png';
import profile_icon from './images/account_circle-24px.png';
import add_icon from './images/add_box-24px.png';
import bookmark_icon from './images/bookmark-24px.png';
import logout_icon from './images/exit_to_app-24px.png';
import Cookie from 'universal-cookie';
import SettingsPane from './SettingsPane';
import './NavBar.css';
import Cookies from 'universal-cookie';

//TODO: add sliding animation
//reference: https://www.w3schools.com/howto/howto_js_animate.asp

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.iconSize = "30px";
        this.cookie = new Cookie();
        this.state = {
            pushMenuVisible: false
        }
    }

    openPushMenu = () => {
        var children = document.getElementById("wrapper").childNodes;
        console.log(children);
        var pushMenu = document.getElementById("push-menu");
        if (!this.state.pushMenuVisible) {
            for (var i = 0; i < children.length; i++) {
                children[i].style.marginLeft = pushMenu.offsetWidth + 2 + "px"; //SPECIFIC MEASUREMENT: associated to padding of tables
            }
            document.getElementById("menu-icon").style.display = "none";
            this.setState({pushMenuVisible: true});
        }
    }

    closePushMenu = () => {
        var children = document.getElementById("wrapper").childNodes;
        if (this.state.pushMenuVisible) {
            for (var i = 0; i < children.length; i++) {
                children[i].style.marginLeft = "0px";
            }
            document.getElementById("menu-icon").style.display = "block";
            this.setState({pushMenuVisible: false});
        }
    }

    openSettings = () => {
        document.getElementById("settings-pane").style.display = "block";
    }

    closeSettings = () => {
        document.getElementById("settings-pane").style.display = "none";
    }

    componentDidMount() {
        var pushMenu = document.getElementById("push-menu");
        //var navBar = document.getElementById("nav-bar");
        pushMenu.style.marginLeft = -pushMenu.offsetWidth - 2 + "px"; //SPECIFIC MEASUREMENT: associated to padding of tables
        //navBar.style.width = document.getElementById("root").offsetWidth + "px";
        console.log(this.cookie.get("username"));
    }

    render() {
        /*
        var pushMenu = document.getElementById("push-menu");
        var navBar = document.getElementById("nav-bar");
        var navBarWidth = document.getElementById("root").offsetWidth + "px";
        if (this.state.pushMenuVisible) {
            navBarWidth = document.getElementById("root").offsetWidth - pushMenu.offsetWidth + "px";
        }
        var navBarStyle = {"width": navBarWidth};
        */

        var menuIcon = <img id="menu-icon" src={menu_icon} alt="Menu" width={this.iconSize} height={this.iconSize} onClick={this.openPushMenu}/>;
        var settingsIcon = <img id="settings-icon" src={settings_icon} alt="Settings" width={this.iconSize} height={this.iconSize} onClick={this.openSettings} />;
        if (!this.cookie.get('username')) {
            menuIcon = null;
            settingsIcon = <div id="login-register-div">
                            <div id="login-link"><a href="/login">Login</a></div>
                            <div id="register-link"><a href="/register">Register</a></div>
                        </div>;
        }

	    return (
            <div id="nav-bar-main">
                <div id="push-menu">
                    <table id="push-menu-table">
                        <tbody>
                            <tr>
                                <td id="close-menu-cell"><img id="close-menu-icon" src={close_icon} alt="" width={this.iconSize} height="50px" onClick={this.closePushMenu} /></td>
                            </tr>
                            <tr>
                                <td><img src={home_icon} alt="" width={this.iconSize} height={this.iconSize} /> dashboard</td>
                            </tr>
                            <tr>
                                <td><img src={profile_icon} alt="" width={this.iconSize} height={this.iconSize} /> my profile</td>
                            </tr>
                            <tr>
                                <td><img src={add_icon} alt="" width={this.iconSize} height={this.iconSize} /> new playlist</td>
                            </tr>
                            <tr>
                                <td><a href="/my-bookmarks"><img src={bookmark_icon} alt="" width={this.iconSize} height={this.iconSize} /> bookmarks</a></td>
                            </tr>
                            <tr>
                                <td><img src={logout_icon} alt="" width={this.iconSize} height={this.iconSize} /> log out</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="nav-bar">
                    <table id="nav-bar-table">
                        <tbody>
                            <tr>
                                <td>{menuIcon}</td>
                                <td>boombox</td>
                                <td><input id="search-bar" placeholder="Search" type="text"></input></td>
                                <td>{settingsIcon}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="fixed-top">
                    <SettingsPane 
                        closeWindow={this.closeSettings}
                        profile_image={this.props.profile_image}
                    />
                    </div>
            </div>
        );
    }
}


/*
For side bar:
-Get all other elements on the page and keep note of them
-setInterval(animate the movement of everything)
    -move left when open
    -move right when close
    -make visible/hide the element
*/

export default NavBar;