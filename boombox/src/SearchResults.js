import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import Tag from './Tag';
import './css/bootstrap.min.css';
import './SearchResults.css';

import UserDisplay from './UserDisplay';
import PlaylistDisplay from './PlaylistDisplay';
import { Button } from 'react-bootstrap';

class SearchResults extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            queryString: "",
            users: [],
            playlists: [],
            tags: [],
            pageNum: 0,
            nextUsers: [],
            nextTags: [],
            nextPlaylists: [],
            prevUsers: [],
            prevTags: [],
            prevPlaylists: []
        }
    }

    getResultingUsers() {
        const body = JSON.stringify({page: this.state.pageNum});
        const headers = {"Content-Type": "application/json"};
        fetch(`/searchUsers/${this.state.queryString}`, {
            method: 'POST',
            body: body,
            headers: headers
        })
        .then(res => res.json())
        .then(obj => {
            if(obj.status === 0)
                this.setState({users: obj.result});
        });
    }

    getResultingPlaylists() {
        const body = JSON.stringify({page: this.state.pageNum});
        const headers = {"Content-Type": "application/json"};
        fetch(`/searchPlaylists/${this.state.queryString}`, {
            method: 'POST',
            body: body,
            headers: headers
        })
        .then(res => res.json())
        .then(obj => {
            if(obj.status == 0)
                this.setState({playlists: obj.result});
        });
    }

    getResultingTags() {
        const body = JSON.stringify({page: this.state.pageNum});
        const headers = {"Content-Type": "application/json"};
        fetch(`/searchTags/${this.state.queryString}`, {
            method: 'POST',
            body: body,
            headers: headers
        })
        .then(res => res.json())
        .then(obj => {
            if(obj.status == 0)
                this.setState({tags: obj.result});
        });
    }

    getAdjacentEntires() {
        //previous page
        if(this.state.pageNum > 0){
            //users
            const body = JSON.stringify({page: this.state.pageNum - 1});
            const headers = {"Content-Type": "application/json"};
            fetch(`/searchUsers/${this.state.queryString}`, {
                method: 'POST',
                body: body,
                headers: headers
            })
            .then(res => res.json())
            .then(obj => {
                if(obj.status === 0)
                    this.setState({prevUsers: obj.result});
            });

            //playlists
            fetch(`/searchPlaylists/${this.state.queryString}`, {
                method: 'POST',
                body: body,
                headers: headers
            })
            .then(res => res.json())
            .then(obj => {
                if(obj.status === 0)
                    this.setState({prevPlaylists: obj.result});
            });

            //tags
            fetch(`/searchTags/${this.state.queryString}`, {
                method: 'POST',
                body: body,
                headers: headers
            })
            .then(res => res.json())
            .then(obj => {
                if(obj.status === 0)
                    this.setState({prevTags: obj.result});
            });
        }
        else {
            this.setState({
                prevTags: [],
                prevPlaylists: [],
                prevUsers: [],
            });
        }

        //next page
        const body = JSON.stringify({page: this.state.pageNum + 1});
            const headers = {"Content-Type": "application/json"};
            fetch(`/searchUsers/${this.state.queryString}`, {
                method: 'POST',
                body: body,
                headers: headers
            })
            .then(res => res.json())
            .then(obj => {
                if(obj.status === 0)
                    this.setState({nextUsers: obj.result});
            });

            //playlists
            fetch(`/searchPlaylists/${this.state.queryString}`, {
                method: 'POST',
                body: body,
                headers: headers
            })
            .then(res => res.json())
            .then(obj => {
                if(obj.status === 0)
                    this.setState({nextPlaylists: obj.result});
            });

            //tags
            fetch(`/searchTags/${this.state.queryString}`, {
                method: 'POST',
                body: body,
                headers: headers
            })
            .then(res => res.json())
            .then(obj => {
                if(obj.status === 0)
                    this.setState({nextTags: obj.result});
            });
    }

    handlePrevPage = () => {
        this.setState({
            pageNum: this.state.pageNum - 1,
            users: this.state.prevUsers,
            playlists: this.state.prevPlaylists,
            tags: this.state.prevTags
        }, this.getAdjacentEntires);
    }

    handleNextPage = () => {
        this.setState({
            pageNum: this.state.pageNum + 1,
            users: this.state.nextUsers,
            playlists: this.state.nextPlaylists,
            tags: this.state.nextTags
        }, this.getAdjacentEntires);
    }

    returnArrows(){
        var prevArrow = <Button disabled variant="dark">🡄</Button>
        var nextArrow = <Button disabled variant="dark">🡆</Button>

        if(this.state.pageNum > 0){
            prevArrow = <Button variant="dark" onClick = {this.handlePrevPage}>🡄</Button>
        }
        else {
            prevArrow = <Button disabled variant="dark">🡄</Button>
        }
        if(this.state.nextUsers.length !== 0 || this.state.nextPlaylists.length !== 0 || this.state.nextTags.length !== 0){
            nextArrow = <Button variant="dark" onClick = {this.handleNextPage}>🡆</Button>
        }
        else {
            nextArrow = <Button disabled variant="dark">🡆</Button>
        }
        return (
            <div>{prevArrow} {nextArrow}</div>
        )
    }

    componentDidMount() {
        const query = this.props.match.params[0];

        this.setState({queryString: query}, () => {
            this.getResultingUsers();
            this.getResultingPlaylists();
            this.getResultingTags();
            this.getAdjacentEntires();
        });
    }

    componentDidUpdate(prevprops){
        if(prevprops !== this.props){
            const query = this.props.match.params[0];

            this.setState({queryString: query, pageNum: 0}, () => {
                this.getResultingUsers();
                this.getResultingPlaylists();
                this.getResultingTags();
                this.getAdjacentEntires();
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
                        Search Results for "{this.state.queryString}" (page {this.state.pageNum + 1})
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

                    <center>
                        <div id = "search-pagination">
                            {this.returnArrows()}
                        </div>
                    </center>
                </div>
            </NavBarWrapper>
        );
    }
}

export default SearchResults;