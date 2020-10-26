import React from 'react';
import './UserDisplay.css';

class UserDisplay extends React.Component {
    render() {
        var url = "/user/" + this.props.username;

        return (
            <div className="user-display">
                <a href={url}>
                    <img src={this.props.picture} className="user-picture" alt="" />
                    <div className="user-name" >{this.props.username}</div>
                </a>
            </div>
        );
    }
}

export default UserDisplay;