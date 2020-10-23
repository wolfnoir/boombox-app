import React from 'react';
import menu_icon from './menu-24px.png';
import search_icon from './search-24px.svg';
import settings_icon from './settings-24px.png';
import close_icon from './close-24px.png';
import home_icon from './home-24px.png';
import profile_icon from './account_circle-24px.png';
import add_icon from './add_box-24px.png';
import bookmark_icon from './bookmark-24px.png';
import logout_icon from './exit_to_app-24px.png';
import './NavBar.css';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pushMenuVisible: false
        }
    }

    togglePushMenu = () => {
        console.log("hi");
        console.log(document.getElementById('wrapper').childNodes);
        var children = document.getElementById('wrapper').childNodes;
        /*
        for (var i = 0; i < children.length; i++) {
            children[i].style.marginLeft = "100px";
            console.log(children[i].style.left);
        }
        */
       var i;
       var pushMenu = document.getElementById("push-menu");
        if (!this.state.pushMenuVisible) {
            for (i = 0; i < children.length; i++) {
                children[i].style.marginLeft = pushMenu.offsetWidth + "px";
            }
            this.setState({pushMenuVisible: true});
        }
        else {
            for (i = 0; i < children.length; i++) {
                children[i].style.marginLeft = "0px";
            }
            this.setState({pushMenuVisible: false});
        }
    }

    componentDidMount() {
        console.log(document.getElementById("push-menu").offsetWidth);
        var pushMenu = document.getElementById("push-menu");
        var navBar = document.getElementById("nav-bar");
        pushMenu.style.marginLeft = -pushMenu.offsetWidth + "px";
        navBar.style.width = document.getElementById("root").offsetWidth - pushMenu.offsetWidth;
    }

    render() {
	    return (
            <div>
                <div id="push-menu">
                    <table id="push-menu-table">
                        <tbody>
                            <tr height="60px">
                                <td><img src={close_icon} alt="" width="48px" height="48px" /></td>
                            </tr>
                            <tr>
                                <td><img src={home_icon} alt="" width="48px" height="48px" />dashboard</td>
                            </tr>
                            <tr>
                                <td><img src={profile_icon} alt="" width="48px" height="48px" />my profile</td>
                            </tr>
                            <tr>
                                <td><img src={add_icon} alt="" width="48px" height="48px" />new playlist</td>
                            </tr>
                            <tr>
                                <td><img src={bookmark_icon} alt="" width="48px" height="48px" />bookmarks</td>
                            </tr>
                            <tr>
                                <td><img src={logout_icon} alt="" width="48px" height="48px" />log out</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="nav-bar">
                    <table id="nav-bar-table">
                        <tbody>
                            <tr>
                                <td><img id="menu-icon" src={menu_icon} alt="Menu" width="48px" height="48px" onClick={this.togglePushMenu}/></td>
                                <td>boombox</td>
                                <td><img id="search-icon" src={search_icon} alt="Search" width="48px" height="48px" /></td>
                                <td><img id="settings-icon" src={settings_icon} alt="Settings" width="48px" height="48px" /></td>
                            </tr>
                        </tbody>
                    </table>
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