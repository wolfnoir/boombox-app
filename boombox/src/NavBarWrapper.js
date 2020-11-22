import React from 'react';
import './NavBar';
import NavBar from './NavBar';
import './NavBarWrapper.css';

class NavBarWrapper extends React.Component {
    // componentDidMount() {
    //     document.getElementById("page-content").style.marginTop = 
    //     (-document.getElementById("push-menu").offsetHeight + document.getElementById("nav-bar").offsetHeight)+ "px";
    // }

    render() {
        return (
            <div id="wrapper">
                <NavBar afterSettingsUpdate={this.props.afterSettingsUpdate} />
                <div id="page-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default NavBarWrapper;