import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import './css/bootstrap.min.css';
import './TagResults.css';

/*--------------------------------------------------*/
/* TEMPORARY STATIC IMAGE IMPORTS                   */
/*--------------------------------------------------*/
import wolf_img from './images/watermelon-wolf.jpg';
import horse_img from './images/horse.png';
import leafy_img from "./images/leafy.jpg";
import PlaylistDisplay from './PlaylistDisplay';
/*--------------------------------------------------*/

class TagResults extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            tag: "",
            playlists: [],
        }
    }

    getResultingPlaylists() {
        fetch(`/getTagResults/${this.state.tag}`)
        .then(res => res.json())
        .then(obj => {
            this.setState({playlists: obj.result});
        });
    }

    componentDidMount() {
        const{ tag } = this.props.match.params;
        this.setState({tag: tag}, () => {
            this.getResultingPlaylists();
        });
    }

    render(){
        /*--------------------------------------------------*/
        /* TEMPORARY STATIC IMAGE IMPORTS                   */
        /*--------------------------------------------------*/
        var staticImages = [
            wolf_img, leafy_img, horse_img
        ]
        /*--------------------------------------------------*/

        var playlistsList = this.state.playlists? this.state.playlists.map((playlist, i) => {
            return (
                <PlaylistDisplay
                    albumCover={staticImages[i]} 
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
        }) : null;

        return(
            <NavBarWrapper>
                <div className = "tag-results">
                    <div className="tag-result-label">
                        {this.state.tag}
                    </div>
                    
                    <div className = "playlists-results">
                        {playlistsList}
                    </div>
                </div>
            </NavBarWrapper>
        );
    }
}

export default TagResults;