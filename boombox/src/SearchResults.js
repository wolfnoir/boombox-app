import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import Tag from './Tag';
import './css/bootstrap.min.css';
import './SearchResults.css';

import UserDisplay from './UserDisplay';
import PlaylistDisplay from './PlaylistDisplay';

class SearchResults extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            queryString: "",
            users: [],
            playlists: [],
            tags: [],
        }
    }

    getResultingUsers() {
        fetch(`/searchUsers/${this.state.queryString}`)
        .then(res => res.json())
        .then(obj => {
            if(obj.status === 0)
                this.setState({users: obj.result});
        });
    }

    getResultingPlaylists() {
        fetch(`/searchPlaylists/${this.state.queryString}`)
        .then(res => res.json())
        .then(obj => {
            if(obj.status == 0)
                this.setState({playlists: obj.result});
        });
    }

    getResultingTags() {
        fetch(`/searchTags/${this.state.queryString}`)
        .then(res => res.json())
        .then(obj => {
            if(obj.status == 0)
                this.setState({tags: obj.result});
        });
    }

    componentDidMount() {
        const{ query } = this.props.match.params;
        this.setState({queryString: query}, () => {
            this.getResultingUsers();
            this.getResultingPlaylists();
            this.getResultingTags();
        });
    }

    componentDidUpdate(prevprops){
        if(prevprops !== this.props){
            const{ query } = this.props.match.params;

            this.setState({queryString: query}, () => {
                this.getResultingUsers();
                this.getResultingPlaylists();
                this.getResultingTags();
            });
        }
    }

    render(){

        var usersList = this.state.users.map((user, i) => {
            return (
                <UserDisplay 
                    //picture = {user.image}
                    icon_url = {user.icon_url}
                    username = {user.username}
                />
            )
        });

        var tagsList = this.state.tags.map((tag, i) => {
            return (
                <Tag 
                    number={i}
                    content={tag}
                />
            )
        });

        var playlistsList = this.state.playlists.map((playlist, i) => {
            return (
                <PlaylistDisplay
                    title={playlist.name}
                    author={playlist.author}
                    likes={playlist.likes} 
                    url={playlist.url}
                    image_url={playlist.image_url}
                    key={playlist._id}
                    id = {playlist._id}
                    isPrivate = {playlist.isPrivate}
                />
            )
        });

        return(
            <NavBarWrapper>
                <div className = "search-results">
                    <div className="search-result-label">
                        Search Results for "{this.state.queryString}"
                    </div>
                    
                    <table>
                        <tbody>
                            <tr>
                                {
                                    usersList.length > 0 ?
                                    <td className="user-results">
                                        <div className="search-result-label">Users</div> <br />
                                        {usersList}
                                    </td>
                                    : null
                                }
                                
                                {
                                    tagsList.length > 0 ?
                                    <td className="tag-results">
                                        <div className="search-result-label">Tags</div> <br />
                                        {tagsList}
                                    </td>
                                    : null
                                }
                            </tr>
                        </tbody>
                    </table>

                    {
                        playlistsList.length > 0 ?
                        <div className = "playlists-results">
                            <div className = "search-result-label">Playlists</div> <br />
                            {playlistsList}
                        </div>
                        : 
                        <div className = "playlists-results">
                            <div className = "search-result-label">No playlists found!</div>
                        </div>
                    }
                    
                </div>
            </NavBarWrapper>
        );
    }
}

export default SearchResults;