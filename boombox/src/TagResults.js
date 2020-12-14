import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import './css/bootstrap.min.css';
import './TagResults.css';

import PlaylistDisplay from './PlaylistDisplay';

class TagResults extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            tag: "",
            playlists: [],
            currentPage: 0,
        }
    }

    getResultingPlaylists() {
        const body = JSON.stringify({page: this.state.currentPage});
        const headers = {"Content-Type": "application/json"};
        fetch(`/getTagResults/${this.state.tag}`, {
            method: 'POST',
            body: body,
            headers: headers
        })
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
        var playlistsList = this.state.playlists? this.state.playlists.reverse().map((playlist, i) => {
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
        }) : null;

        return(
            <NavBarWrapper>
                <div className = "tag-results">
                    <div className="tag-result-label">
                        Tag Search: {this.state.tag}
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