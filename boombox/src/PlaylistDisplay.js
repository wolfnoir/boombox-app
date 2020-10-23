import { render } from '@testing-library/react';
import React from 'react';
import './PlaylistDisplay.css';

class PlaylistDisplay extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            albumCover: this.props.albumCover,
            title: this.props.title,
            author: this.props.author,
            likes: this.props.likes
        }
    }

    render(){
        const albumCover = this.state.albumCover;
        return(
            <div id = "playlist-display">
                <img className = "playlist-cover" src = {albumCover}/>
                {/* <img src= {this.state.albumCover} className = "playlist-cover"/> */}
                <div className = "playlist-title">{this.state.title}</div>
                <div className = "playlist-info">
                    by {this.state.author} <br/>
                    {this.state.likes} likes
                </div>
            </div>
        );
    }
}

export default PlaylistDisplay;