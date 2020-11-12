import { render } from '@testing-library/react';
import React from 'react';
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip';
import './PlaylistDisplay.css';
import default_playlist_img from './images/default-playlist-cover.png';

class PlaylistDisplay extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            //albumCover: this.props.albumCover,
            title: this.props.title,
            author: this.props.author,
            likes: this.props.likes,
            key: this.props.key,
            albumCover: null
        }
    }

    getImageSrc = () => {
        if (this.state.albumCover) {
            return `data:image/jpeg;base64,${this.state.albumCover}`;
        }
        return default_playlist_img;
    }

    componentDidMount() {
        console.log(this.props.title, this.props.image_url);
        fetch('/getImage', {
            method: 'POST',
            body: JSON.stringify({
                image_id: this.props.image_url,
                title: this.props.title
            }),
            headers: {"Content-Type": "application/json"},
        })
        .then(res => res.json()) 
        .then(data => {
            this.setState({albumCover: data.imageData});
        });
    }

    render(){
        const albumCover = this.state.albumCover;
        return(
            <div className = "playlist-display" key={this.state.key}>
                <a href={this.props.url}><img className = "playlist-cover" src = {this.getImageSrc()}/></a>
                <a href={this.props.url}><div className = "playlist-title"><EllipsisWithTooltip placement="bottom">{this.state.title}</EllipsisWithTooltip></div></a>
                <div className = "playlist-info">
                    by <a href={"/user/" + this.state.author}>{this.state.author}</a><br/>
                    {this.state.likes.length} likes
                </div>
            </div>
        );
    }
}

export default PlaylistDisplay;