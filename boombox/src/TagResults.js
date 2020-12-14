import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import './css/bootstrap.min.css';
import './TagResults.css';

import PlaylistDisplay from './PlaylistDisplay';
import { Button } from 'react-bootstrap';

class TagResults extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            tag: "",
            playlists: [],
            pageNum: 0,
            nextPage: [],
            prevPage: [],
        }
    }

    getResultingPlaylists() {
        const body = JSON.stringify({page: this.state.pageNum});
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

    getAdjacentPlaylists(){
        //previous page
        if(this.state.pageNum > 0){
            const body = JSON.stringify({page: this.state.pageNum - 1});
            const headers = {"Content-Type": "application/json"};
            fetch(`/getTagResults/${this.state.tag}`, {
                method: 'POST',
                body: body,
                headers: headers
            })
            .then(res => res.json())
            .then(obj => {
                this.setState({prevPage: obj.result});
            });
        }
        else {
            this.setState({prevPage: []});
        }

        //next page
        const body = JSON.stringify({page: this.state.pageNum + 1});
        const headers = {"Content-Type": "application/json"};
        fetch(`/getTagResults/${this.state.tag}`, {
            method: 'POST',
            body: body,
            headers: headers
        })
        .then(res => res.json())
        .then(obj => {
            this.setState({nextPage: obj.result}, console.log(this.state.nextPage));
        });
    }

    handlePrevPage = () => {
        this.setState({
            pageNum: this.state.pageNum - 1,
            playlists: this.state.prevPage,
        },
        this.getAdjacentPlaylists);
    }

    handleNextPage = () => {
        this.setState({
            pageNum: this.state.pageNum + 1,
            playlists: this.state.nextPage,
        },
        this.getAdjacentPlaylists);
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
        if(this.state.nextPage.length !== 0){
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
        const{ tag } = this.props.match.params;
        this.setState({tag: tag}, () => {
            this.getResultingPlaylists();
            this.getAdjacentPlaylists();
        });
    }

    render(){
        console.log(this.state);
        var playlistsList = this.state.playlists.map((playlist, i) => {
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
        });

        return(
            <NavBarWrapper>
                <div className = "tag-results">
                    <div className="tag-result-label">
                        Tag Search: {this.state.tag} (page {this.state.pageNum + 1})
                    </div>
                    
                    {
                        playlistsList.length > 0 ?
                        <div className = "playlists-results">
                            {playlistsList}
                        </div>
                        : 
                        <div className = "playlists-results">
                            <div className = "search-result-label">No playlists found!</div>
                        </div>
                    }

                    <center>
                        <div id = "tag-pagination">
                            {this.returnArrows()}
                        </div>
                    </center>
                </div>
            </NavBarWrapper>
        );
    }
}

export default TagResults;