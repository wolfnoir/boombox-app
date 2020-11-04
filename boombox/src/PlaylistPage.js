import React from 'react';
import { useParams } from 'react-router';
import { Redirect } from "react-router-dom";
import NavBarWrapper from './NavBarWrapper';
import Tag from './Tag';
import Cookie from 'universal-cookie';

import './css/bootstrap.min.css';
import './PlaylistPage.css';
import like_img from './images/favorite_border-24px.svg';
import bookmark_img from './images/bookmark-24px.svg';
import link_img from './images/link-24px.svg';
import edit_img from './images/create-24px.svg';
import arrow_right_img from './images/keyboard_arrow_right-24px.svg';
import arrow_down_img from './images/keyboard_arrow_down-24px.svg';
import pause_img from './images/pause_circle_outline-24px.svg';
import play_img from './images/play_circle_outline-24px.svg';
import skip_next_img from './images/skip_next-24px.svg';
import skip_previous_img from './images/skip_previous-24px.svg'; 
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip';


/*-----------------------------------------*/
/* STATIC IMPORT                           */
/*-----------------------------------------*/
import horse_img from './images/horse.png';
import { NavItem } from 'react-bootstrap';
/*-----------------------------------------*/

function PlaylistPage() {
    let { playlistId } = useParams();
    console.log(playlistId);
    return <PlaylistPageDisplay playlistId={playlistId}/>
}

class ArrowDownComponent extends React.Component {
    render() {
        return <img className="song-arrow" id={"song-arrow-" + this.props.i} src={arrow_down_img} height="30px" width="30px" alt=">" onClick={this.props.handleSongArrowClick}/>
    }
}

class ArrowRightComponent extends React.Component {
    render() {
        return <img className="song-arrow" id={"song-arrow-" + this.props.i} src={arrow_right_img} height="30px" width="30px" alt=">" onClick={this.props.handleSongArrowClick}/>
    }
}

class ArrowDownRightComponent extends React.Component {
    render() {
        if (this.props.open) {
            console.log("show down");
            return <ArrowDownComponent i={this.props.i} handleSongArrowClick={this.props.handleSongArrowClick}/>;
        }
        console.log("show right");
        return <ArrowRightComponent i={this.props.i} handleSongArrowClick={this.props.handleSongArrowClick}/>};
}

class PlaylistPageDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.cookie = new Cookie();
        this.state = {
            data: {},
            song_notes_open: [],
            //current_song: null, //correct one
            current_song: 2, //temporary for showing
            is_song_playing: false,
        }
    }

    componentDidMount() {
        fetch(`/getPlaylistData/${this.props.playlistId}`)
        .then(res => res.json())
        .then(obj => {
            if (obj.status == 0) {
                this.setState({data: obj.result});
                for (var i = 0; i < this.state.data.songs.length; i++) {
                    this.state.song_notes_open.push(false);
                }
            }
            else {
                this.setState({data: null}); //need to change the component to have a not found page
            }
        });
        console.log(this.state.loggedIn);
        //this.getCurrentUserData(user)
    }

    handleSongArrowClick = (i) => {
        const songNote = document.getElementById("song-note-"+i);
        if (songNote) {
            this.state.song_notes_open[i] = !this.state.song_notes_open[i];
            console.log(this.state.song_notes_open[i]);
            if (this.state.song_notes_open[i]) {
                songNote.style.display = "block";
             }
            else {
                songNote.style.display = "none";
            }
        }
    }

    render() {
        var filler_work_break = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        var filler = "aaaaaa aaaaaaa aaaa aaaaaa aaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa aaaaa aaaaa aaaaaaa aaaaaa aaaaa";
        
        console.log(this.cookie.get('username'));
        console.log(this.state.data.author);
        var editButton = <a href= {"/playlist/" + this.props.playlistId + "/edit"}><img src={edit_img} height="30px" width="30px" /></a>
        if(this.state.data.author !== this.cookie.get('username')){
            editButton = null;
        }

        if(this.state.data == null) {
            return <Redirect to="/error" />
        }
        else{
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
                                            {editButton}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Last modified by <a href={"/user/" + this.state.data.author}>{this.state.data.author}</a> on {new Date(this.state.data.last_modified).toDateString()} 
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        {this.state.data.likes.length} Likes
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
                                        {this.state.data.tags ? this.state.data.tags.map((tag, i) => <Tag number = {i} content = {tag}/>) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" id="row2">
                            <div className="col songs-container">
                                <div className="row" id="songs-header-row">
                                <div className="col songs-col0"> </div>
                                    <div className="col songs-col1">
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
                                                                {/* should decide based on state? */}
                                                                
                                                            <img className="song-arrow" id={"song-arrow-" + i} 
                                                                src={
                                                                    this.state.song_notes_open[i] ?
                                                                    arrow_down_img
                                                                    : arrow_right_img
                                                                } 
                                                                height="30px" width="30px" alt=">" onClick={() => {this.handleSongArrowClick(i)}}/>
                                                            
                                                                {/*
                                                                {
                                                                    this.state.song_notes_open[i] ?
                                                                    <img className="song-arrow" id={"song-arrow-" + i} 
                                                                src={arrow_down_img} 
                                                                height="30px" width="30px" alt=">" onClick={() => {this.handleSongArrowClick(i)}}/>
                                                                    :
                                                                    <img className="song-arrow" id={"song-arrow-" + i} 
                                                                src={arrow_right_img} 
                                                                height="30px" width="30px" alt=">" onClick={() => {this.handleSongArrowClick(i)}}/>
                                                                }
                                                            */}
                                                            {/*
                                                                {this.state.song_notes_open[i] ? <ArrowDownComponent i={i} handleSongArrowClick={() => this.handleSongArrowClick(i)}/> : <ArrowRightComponent i={i} handleSongArrowClick={() => this.handleSongArrowClick(i)}/>}
                                                            */}    
                                                                {/* the changing from right to down doesn't work */}
                                                                {/*
                                                                {
                                                                    song.notes ?
                                                                    <ArrowDownRightComponent open={this.state.song_notes_open[i]} i={i} handleSongArrowClick={() => this.handleSongArrowClick(i)} />
                                                                    : <ArrowDownRightComponent open={this.state.song_notes_open[i]} i={i} handleSongArrowClick={() => this.handleSongArrowClick(i)} />
                                                                }
                                                            */}
                                                                <b>{(i+1) + "."}</b>
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
                                                            <div className="row song-notes-row" id={"song-note-"+i}>
                                                                <div className="col">
                                                                    <p>{song.notes}</p>
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
                                        <textarea id="comment-entry" placeholder="Add New Comment" /> 
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <button type="button" className="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                                <div className="row" id="displayed-comments-row">
                                    <div className="col">
                                        {
                                            this.state.data.comments ?
                                            this.state.data.comments.map((comment, i) => (
                                                <div className="row comment-row" key={"comment"+i}>
                                                    <div className="col">
                                                        <div className="row">
                                                            <div className="col comment-user-col">
                                                            <a href={"/user/" + comment.username}>{comment.username}</a>
                                                            </div>
                                                            <div className="col comment-time-col">
                                                                {new Date(comment.time).toDateString() + " " + new Date(comment.time).toLocaleTimeString()}
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

                        {/* added a fixed element here for the play track part */}
                        <div className="container fixed-bottom" id="play-track-container">
                            <div className="row">
                                <div className="col-md-auto" id="play-track-left-col">
                                    <img id="prev-song-img" className="invert-color" src={skip_previous_img} height="60px" width="60px" />
                                    <img id="play-pause-img" className="invert-color" src={play_img} height="60px" width="60px" /> {/* need to add the switch to pause, same issue as note arrow*/}
                                    <img id="next-song-img" className="invert-color" src={skip_next_img} height="60px" width="60px" />
                                </div>
                                <div className="col" id="play-track-right-col">
                                    <div className="row">
                                        <div className="col">
                                            <EllipsisWithTooltip placement="top"><h2>{this.state.data.name} by {this.state.data.author}</h2></EllipsisWithTooltip>
                                            </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            {
                                                this.state.current_song !== null && this.state.data.songs &&  this.state.data.songs[this.state.current_song] ?
                                                <EllipsisWithTooltip placement="top">{this.state.current_song + 1}. {this.state.data.songs[this.state.current_song].name} - {this.state.data.songs[this.state.current_song].artist}</EllipsisWithTooltip>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </NavBarWrapper>
            );
        }
    }
}

export default PlaylistPage;