import { render } from '@testing-library/react';
import React from 'react';
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip';
import './PlaylistDisplay.css';

class PlaylistDisplay extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            albumCover: this.props.albumCover,
            title: this.props.title,
            author: this.props.author,
            likes: this.props.likes,
            key: this.props.key
        }
    }

    render(){
        const albumCover = this.state.albumCover;
        return(
            <div className = "playlist-display" key={this.state.key}>
                <img className = "playlist-cover" src = {albumCover}/>
                <div className = "playlist-title"><EllipsisWithTooltip placement="bottom">{this.state.title}</EllipsisWithTooltip></div>
                <div className = "playlist-info">
                    by {this.state.author} <br/>
                    {this.state.likes} likes
                </div>
            </div>
        );
    }
}

export default PlaylistDisplay;