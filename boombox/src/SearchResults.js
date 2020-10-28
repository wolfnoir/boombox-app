import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import Tag from './Tag';
import './css/bootstrap.min.css';
import './SearchResults.css';

/*--------------------------------------------------*/
/* TEMPORARY STATIC IMAGE IMPORTS                   */
/*--------------------------------------------------*/
import wolf_img from './images/watermelon-wolf.jpg';
import horse_img from './images/horse.png';
import leafy_img from "./images/leafy.jpg";
import UserDisplay from './UserDisplay';
import PlaylistDisplay from './PlaylistDisplay';
/*--------------------------------------------------*/

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
        fetch(`/getSearchResults/${this.state.queryString}`)
        .then(res => res.json())
        .then(obj => {
            this.setState({users: obj.users});
        });
    }

    getResultingPlaylists() {
        fetch(`/getSearchResults/${this.state.queryString}`)
        .then(res => res.json())
        .then(obj => {
            this.setState({playlists: obj.playlists});
        });
    }

    getResultingTags() {
        fetch(`/getSearchResults/${this.state.queryString}`)
        .then(res => res.json())
        .then(obj => {
            this.setState({tags: obj.tags});
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

    render(){
        /*--------------------------------------------------*/
        /* TEMPORARY STATIC IMAGE IMPORTS                   */
        /*--------------------------------------------------*/
        var staticImages = [
            wolf_img, leafy_img, horse_img
        ]
        /*--------------------------------------------------*/

        var usersList = this.state.users.map((user, i) => {
            return (
                <UserDisplay 
                    //picture = {user.image}
                    picture = {staticImages[i % 3]}
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
                    albumCover={staticImages[i]} 
                    title={playlist.name}
                    author={playlist.author}
                    likes={playlist.num_likes} 
                    url={playlist.url}
                    key={playlist.key}
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
                                <td className="user-results">
                                    <div className="search-result-label">Users</div> <br />
                                    {usersList}
                                </td>

                                <td className="tag-results">
                                    <div className="search-result-label">Tags</div> <br />
                                    {tagsList}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className = "playlists-results">
                        <div className = "search-result-label">Playlists</div> <br />
                        {playlistsList}
                    </div>
                </div>
            </NavBarWrapper>
        );
    }
}

export default SearchResults;