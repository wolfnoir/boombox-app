import React from 'react';
import './UserDisplay.css';

class UserDisplay extends React.Component {
    render() {
        return (
            <div className="UserDisplay">
                <img src={this.props.picture} className="UserDisplay-picture" alt="" />
                <div className="UserDisplay-name" >{this.props.username}</div>
            </div>
        );
    }
}

export default UserDisplay;