//import PropTypes from 'prop-types';
import React from 'react';
import './YoutubeVideo.css';

class YouTubeVideo extends React.PureComponent {

    componentDidMount = () => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

            window.onYouTubeIframeAPIReady = this.loadVideo;

            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } 
        else {
            this.loadVideo();
        }
    };

    loadVideo = () => {
        this.player = new window.YT.Player('youtube-player', {
            videoId: this.props.id,
            height: '45',
            width: '80',
            events: {
                //onReady: this.onPlayerReady,
            },
        });
    };

    getPlayer() {
        return this.player;
    }

    onPlayerReady = (event) => {
        event.target.playVideo();
    };

    playVideo = () => {
        this.player.playVideo();
    }

    pauseVideo = () => {
        this.player.pauseVideo();
    }

    render() {
        return (
            <div className="youtube-player-wrapper">
                <div id="youtube-player"></div>
            </div>
        );
    };
}

export default YouTubeVideo;