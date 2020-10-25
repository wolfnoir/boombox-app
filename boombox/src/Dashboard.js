import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import PlaylistDisplay from './PlaylistDisplay';
import './css/bootstrap.min.css';
import './Dashboard.css';
import bookmark_icon from './images/bookmark-24px.svg';

/*--------------------------------------------------*/
/* TEMPORARY STATIC IMAGE IMPORTS                   */
/*--------------------------------------------------*/
import horse_img from './images/horse.png';
import mountain_img from "./images/mountain.jpg";
import church_img from "./images/disco-church.png";
import noir2_img from "./images/noir2.png";
import leafy_img from "./images/leafy.jpg";
import noir_img from "./images/noir.jpg";
/*--------------------------------------------------*/

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPlaylists: [],
            recommendedPlaylists: []
        }
    }

    getNewPlaylists = () => {
        fetch('/getNewPlaylists')
        .then(res => res.json())
        .then(obj => {
            this.setState({newPlaylists: obj.playlists})
        });

        for (var i = 0; i < this.state.newPlaylists.length; i++) {
            this.state.newPlaylists[i].image = require(this.state.newPlaylists[i].image_url);
            this.state.newPlaylists[i].key = "newPlaylist" + i;
        }
    }

    getRecommendedPlaylists = () => {
        fetch('/getRecommendedPlaylists')
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            this.setState({recommendedPlaylists: obj.playlists})
        });

        for (var i = 0; i < this.state.recommendedPlaylists.length; i++) {
            this.state.recommendedPlaylists[i].image = require(this.state.recommendedPlaylists[i].image_url);
            this.state.recommendedPlaylists[i].key = "recommendedPlaylist" + i;
        }
    }

    componentDidMount() {
        this.getNewPlaylists();
        this.getRecommendedPlaylists();
    }

    render() {
         /*--------------------------------------------------*/
        /* TEMPORARY STATIC IMAGE IMPORTS                   */
        /*--------------------------------------------------*/
        var staticImages1 = [
            horse_img, mountain_img, church_img, noir2_img
        ]

        var staticImages2 = [
            leafy_img, noir_img
        ]
        /*--------------------------------------------------*/

        var listofNewPlaylistDisplays = this.state.newPlaylists.map((playlist, i) => {
            //need to figure out how to load image
            //albumCover={playlist.image} 
            return (
                <PlaylistDisplay
                    albumCover={staticImages1[i]} 
                    title={playlist.name}
                    author={playlist.author}
                    likes={playlist.num_likes} 
                    url={playlist.url}
                    key={playlist.key}
                />
            )
        });

        var listofRecommendedPlaylistDisplays = this.state.recommendedPlaylists.map((playlist, i) => {
            //need to figure out how to load image
            //albumCover={playlist.image} 
            return (
                <PlaylistDisplay
                    albumCover={staticImages2[i]} 
                    title={playlist.name}
                    author={playlist.author}
                    likes={playlist.num_likes} 
                    url={playlist.url}
                    key={playlist.key}
                />
            )
        });
        
        
        return (
            <NavBarWrapper>
                <div className="container" id="dashboard-pane">
                    <div className="row" id="row1">
                        <div className="col">
                            new playlists
                        </div>
                    </div>
                    <div className="row" id="row2">
                        <div className="col">
                            {listofNewPlaylistDisplays}
                        </div>
                    </div>
                    <div className="row" id="row3">
                        <div className="col">
                            recommended playlists
                        </div>
                    </div>
                    <div className="row" id="row4">
                        <div className="col">
                            {listofRecommendedPlaylistDisplays}
                        </div>
                    </div>
                </div>
            </NavBarWrapper>
        )
    }
}

export default Dashboard;