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


    loadVideoWithId = (videoId, autoplay=0) => {
        window.YT.ready(() => {
            console.log(videoId);
            if (videoId) {
                this.isVideoReady = false;
                const youtubePlayer = document.getElementById("youtube-player");
                if (youtubePlayer) {
                    console.log(youtubePlayer.tagName);
                    document.getElementById('youtube-player-wrapper').removeChild(youtubePlayer);
                }
                const newYoutubePlayer = document.createElement('div');
                newYoutubePlayer.setAttribute('id', 'youtube-player');
                document.getElementById('youtube-player-wrapper').appendChild(newYoutubePlayer);
                this.player = new window.YT.Player('youtube-player', {
                    videoId: videoId,
                    height: '45',
                    width: '80',
                    events: {
                        onReady: this.onPlayerReady,
                        onStateChange: this.onStateChange,
                        onError: this.onError,
                    },
                    playerVars: {autoplay: autoplay} //controls: 0
                });
            };
        });
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

    onStateChange = (event) => {
        /*
        if (event.data == -1) { //doesn't work
            console.log("Failed to load video");
            this.props.handleVideoEnd();
        }
        */
       console.log(event.data);
        if (event.data === window.YT.PlayerState.ENDED) { //0
            this.props.handleVideoEnd();
        }
        if (event.data == window.YT.PlayerState.PLAYING) { //1
            this.props.togglePlayButton(true);
        }
        if (event.data === window.YT.PlayerState.PAUSED) { //2
            this.props.togglePlayButton(false);
        }
    }

    onError = (event) => {
        console.log("Failed to load video");
        this.props.handleVideoEnd();
    }

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