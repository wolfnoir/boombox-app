import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import PlaylistDisplay from './PlaylistDisplay';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './css/bootstrap.min.css';
import './Dashboard.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPlaylists: [],
            recommendedPlaylists: [],
            responsive: {
                superLargeDesktop: {
                // the naming can be any, depends on you.
                breakpoint: { max: 4000, min: 3000 },
                items: 5
                },
                desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 3
                },
                tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2
                },
                mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1
                }
            },
        }
    }

    getNewPlaylists = () => {
        fetch('/getNewPlaylists', {
            method: 'POST'
        })
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            if (obj.status === 0) {
                this.setState({newPlaylists: obj.playlists});
            }
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
            this.setState({recommendedPlaylists: obj.playlists});
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
        var listofNewPlaylistDisplays = this.state.newPlaylists.map((playlist, i) => {
            //need to figure out how to load image
            //albumCover={playlist.image} 
            if(!playlist.isPrivate){
                return (
                    <PlaylistDisplay
                        title={playlist.name}
                        author={playlist.author}
                        likes={playlist.likes} 
                        url={playlist.url}
                        image_url={playlist.image_url}
                        key={playlist.key}
                        id = {playlist._id}
                        isPrivate = {playlist.isPrivate}
                    />
                )
            }
        });

        var listofRecommendedPlaylistDisplays = this.state.recommendedPlaylists.map((playlist, i) => {
            //need to figure out how to load image
            //albumCover={playlist.image} 
            if(!playlist.isPrivate){
                return (
                    <PlaylistDisplay
                        title={playlist.name}
                        author={playlist.author}
                        likes={playlist.likes} 
                        url={playlist.url}
                        image_url={playlist.image_url}
                        key={playlist.key}
                        id = {playlist._id}
                        isPrivate = {playlist.isPrivate}
                    />
                )
            }
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
                            <Carousel responsive={this.state.responsive} infinite="true" centerMode="true">{listofNewPlaylistDisplays}</Carousel>
                        </div>
                    </div>
                    <div className="row" id="row3">
                        <div className="col">
                            recommended playlists
                        </div>
                    </div>
                    <div className="row" id="row4">
                        <div className="col">
                            <Carousel responsive={this.state.responsive} infinite="true" centerMode="true">{listofRecommendedPlaylistDisplays}</Carousel>
                        </div>
                    </div>
                </div>
            </NavBarWrapper>
        )
    }
}

export default Dashboard;