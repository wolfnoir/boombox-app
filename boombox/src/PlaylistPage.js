import React from 'react';
import { useParams } from 'react-router';
import NavBarWrapper from './NavBarWrapper';
import './css/bootstrap.min.css';
import './PlaylistPage.css';
import like_img from './images/favorite_border-24px.svg';
import bookmark_img from './images/bookmark-24px.svg';
import link_img from './images/link-24px.svg';

/*-----------------------------------------*/
/* STATIC IMPORT                           */
/*-----------------------------------------*/
import horse_img from './images/horse.png';
/*-----------------------------------------*/

function PlaylistPage() {
    let { playlistId } = useParams();
    console.log(playlistId);
    return <PlaylistPageDisplay playlistId={playlistId}/>
}

class PlaylistPageDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        fetch(`/getPlaylistData/${this.props.playlistId}`)
        .then(res => res.json())
        .then(obj => {
            this.setState({data: obj});
            console.log(this.state.data);

        });
        console.log(this.state.data);
    }

    render() {
        var filler = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        return (
            <NavBarWrapper>
                <div className="container" id="playlist-page-container">
                    <div className="row" id="row1">
                        <div className="col" id="playlist-cover-container">
                            <img src={horse_img} id="playlist-cover" width="250px" height="250px"/>
                        </div>
                        <div className="col">
                            <div className="row" id="title-row">
                                <div className="col">
                                    <h1>{this.state.data.name}</h1>
                                    <div id="icons-div">
                                        <img src={like_img} height="30px" width="30px" />
                                        <img src={bookmark_img} height="30px" width="30px" />
                                        <img src={link_img} height="30px" width="30px" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    Last modified by <a href={"username/" + this.state.data.author}>{this.state.data.author}</a> on {new Date(this.state.data.last_modified).toDateString()} 
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    {this.state.data.num_likes} Likes
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <br/><p>{this.state.data.description}</p>
                                </div>
                            </div>
                            <div className="row" id="tags-row">
                                <div className="col">
                                    <div style={{"marginRight": "10px", "display": "inline-block"}}><h2>tags:</h2></div>
                                    {this.state.data.tags ? this.state.data.tags.map((tag, i) => <button type="button" className="btn btn-primary tag-button" key={"tag"+i}>{tag}</button>) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row" id="row2">
                        <div className="col songs-container">
                            <div className="row" id="songs-header-row">
                            <div className="col songs-col-0"> </div>
                                <div className="col songs-col-1">
                                    <h2>SONGS - ARTIST</h2>
                                </div>
                                <div className="col songs-col2">
                                    <h2>ALBUM</h2>
                                </div>
                                <div className="col songs-col3">
                                    <h2>LENGTH</h2>
                                </div>
                            </div>
                            <div className="row" id="songs-data-container-row">
                                    <div className="col songs-data-container">
                                        {
                                            this.state.data.songs ?
                                            this.state.data.songs.map((song, i) => (
                                                <div key={"song"+i}>
                                                    <div className="row">
                                                        <div className="col songs-col0">
                                                        {"> " + i + "."}
                                                        </div>
                                                        <div className="col songs-col1">
                                                            <b>{song.name}</b> - {song.artist}
                                                        </div>
                                                        <div className="col songs-col2">
                                                            {song.album ? song.album : "N/A"}
                                                        </div>
                                                        <div className="col songs-col3">
                                                            {song.length ? Math.floor(song.length / 60) + ":" + song.length % 60 : "N/A"}
                                                        </div>
                                                    </div>
                                                    {
                                                        song.notes ?
                                                        <div className="row song-notes-row">
                                                            <div className="col">
                                                                {song.notes}
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                            ))
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                    </div>

                    {

                    this.state.data.comments_enabled ?

                    <div className="row" id="row3">
                        <div className="col" id="playlist-comments-container">
                            <div className="row">
                                <div className="col">
                                    <h1>Comments</h1>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <textarea /> 
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button type="button" className="btn btn-primary">Submit</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    {
                                        this.state.data.comments ?
                                        this.state.data.comments.map((comment, i) => (
                                            <div className="row comment-row" key={"comment"+i}>
                                                <div className="col">
                                                    <div className="row">
                                                        <div className="col comment-user-col">
                                                            {comment.username}
                                                        </div>
                                                        <div className="col comment-time-col">
                                                            {new Date(comment.time).toDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col comment-content-col">
                                                            {comment.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    : null

                    }
                </div>
            </NavBarWrapper>
        );
    }
}

export default PlaylistPage;