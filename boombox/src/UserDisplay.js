import React from 'react';
import './UserDisplay.css';
import default_icon from './images/account_circle-24px.svg';

class UserDisplay extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            //albumCover: this.props.albumCover,
            icon: null,
        }
    }

    getImageSrc = () => {
        if (this.state.icon) {
            return `data:image/jpeg;base64,${this.state.icon}`;
        }
        return default_icon;
    }

    componentDidMount() {
        console.log(this.props.username, this.props.icon_url);
        fetch('/getImage', {
            method: 'POST',
            body: JSON.stringify({
                image_id: this.props.icon_url,
            }),
            headers: {"Content-Type": "application/json"},
        })
        .then(res => res.json()) 
        .then(data => {
            this.setState({icon: data.imageData});
        });
    }

    render() {
        var url = "/user/" + this.props.username;

        return (
            <div className="user-display">
                <a href={url}>
                    <img src={this.getImageSrc()} className="user-picture" alt="" />
                    <div className="user-name" >{this.props.username}</div>
                </a>
            </div>
        );
    }
}

export default UserDisplay;