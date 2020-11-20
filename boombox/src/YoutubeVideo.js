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


    loadVideoWithId = (videoId) => {
        console.log(videoId);
        if (videoId) {
            this.isVideoReady = false;
            var youtubePlayer = document.getElementById("youtube-player");
            if (youtubePlayer) {
                console.log(youtubePlayer.tagName);
                document.getElementById('youtube-player-wrapper').removeChild(youtubePlayer);
            }
            youtubePlayer = document.createElement('div');
            youtubePlayer.setAttribute('id', 'youtube-player');
            document.getElementById('youtube-player-wrapper').appendChild(youtubePlayer);

            this.player = new window.YT.Player('youtube-player', {
                videoId: this.props.id,
                height: '45',
                width: '80',
                events: {
                    onReady: this.onPlayerReady,
                },
                playerVars: {controls: 0}
            });
        }
    };

    loadVideo = () => {
        this.loadVideoWithId(this.props.id);
    }

    getPlayer() {
        return this.player;
    }

    onPlayerReady = (event) => {
        //event.target.playVideo();
        this.isVideoReady = true;
    };

    playVideo = () => {
        if (this.player && this.isVideoReady) {
            this.player.playVideo();
        }
    }

    pauseVideo = () => {
        if (this.player && this.isVideoReady) {
            this.player.pauseVideo();
        }
    }

    getIsVideoReady() {
        return this.isVideoReady;
    }

    render() {
        return (
            <div id="youtube-player-wrapper">
                <div id="youtube-player"></div>
            </div>
        );
    };
}

export default YouTubeVideo;