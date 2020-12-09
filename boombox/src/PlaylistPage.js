import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { Redirect } from "react-router-dom";
import NavBarWrapper from './NavBarWrapper';
import YoutubeVideo from './YoutubeVideo';
import Tag from './Tag';
import ReactTooltip from 'react-tooltip';
import Cookie from 'universal-cookie';

import './css/bootstrap.min.css';
import './PlaylistPage.css';
import like_img from './images/favorite_border-24px.svg';
import liked_img from './images/favorite-24px.svg';
import bookmarked_img from './images/bookmark-24px.svg';
import bookmark_img from './images/bookmark_border-black-24dp.svg';
import default_playlist_img from './images/default-playlist-cover.png';
import link_img from './images/link-24px.svg';
import edit_img from './images/create-24px.svg';
import delete_img from './images/close-24px.svg';
import arrow_right_img from './images/keyboard_arrow_right-24px.svg';
import arrow_down_img from './images/keyboard_arrow_down-24px.svg';
import pause_img from './images/pause_circle_outline-24px.svg';
import play_img from './images/play_circle_outline-24px.svg';
import skip_next_img from './images/skip_next-24px.svg';
import skip_next_grey_img from './images/skip_next-grey-24px.png';
import skip_previous_img from './images/skip_previous-24px.svg'; 
import skip_previous_grey_img from './images/skip_previous-grey-24px.png';
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip';

function PlaylistPage() {
    let { playlistId } = useParams();
    console.log(playlistId);
    return <PlaylistPageDisplay playlistId={playlistId}/>
}

class PlaylistPageDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.cookie = new Cookie();
        this.state = {
            data: {},
            song_notes_open: [],
            current_song: null, //correct one
            currentYoutubeVideoId: null,
            //current_song: 2, //temporary for showing
            is_song_playing: false,
            imageData: null,
            charCount: 0,
            likeCount: 0,
            comments: []
        }

        this.likePlaylist = this.likePlaylist.bind(this);
        this.videoRef = React.createRef();
    }

    getPlaylistImage() {
        if (this.state.imageData) {
            return (
                <img src={`data:image/jpeg;base64,${this.state.imageData}`} id={"playlist-cover " + this.state.data._id} width="250px" height="250px"/>
            )
        }
        return (
            <img src={default_playlist_img} id={"playlist-cover " + this.state.data._id} width="250px" height="250px"/>
        );
    }

    componentDidMount() {
        const body = JSON.stringify({
            'username': this.cookie.get('username'),
        });
        const headers = {"Content-Type": "application/json"};
        fetch(`/getPlaylistData/${this.props.playlistId}`, {
            method: 'POST',
            body: body,
            headers: headers
        })
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            if (obj.status === 0) {
                var commentArray = obj.result.comments.slice();
                commentArray.reverse();
                this.setState({
                    data: obj.result,
                    likeCount: obj.result.likes.length,
                    comments: commentArray
                });
                for (var i = 0; i < this.state.data.songs.length; i++) {
                    this.state.song_notes_open.push(false);
                }
                if (this.state.data.songs.length > 0) {
                    this.selectSong(0);
                }
            }
            else {
                this.setState({data: null}); //need to change the component to have a not found page
            }
        });
        fetch('/getPlaylistCover', {
            method: 'POST',
            body: JSON.stringify({
                playlistId: this.props.playlistId,
            }),
            headers: {"Content-Type": "application/json"},
        })
        .then(res => res.json()) 
        .then(data => {
            console.log(data);
            this.setState({imageData: data.imageData});
        });
        document.onkeypress = this.keyPressed;
    }

    getArrow(i) {
        if (this.state.song_notes_open[i]) {
            return arrow_down_img;
        }
        return arrow_right_img;
    }

    handleSongArrowClick = (i, e) => {
        e.stopPropagation();
        const songNote = document.getElementById("song-note-"+i);
        if (songNote) {
            const songNotesOpen = this.state.song_notes_open;
            songNotesOpen[i] = !songNotesOpen[i];
            this.setState({song_notes_open: songNotesOpen});

            //this.state.song_notes_open[i] = !this.state.song_notes_open[i];
            console.log(this.state.song_notes_open[i]);
            if (this.state.song_notes_open[i]) {
                songNote.style.display = "block";
             }
            else {
                songNote.style.display = "none";
            }
        }
    }

    getLikeImage() {
        if(this.state.data.liked)
            return liked_img;

        return like_img;
    }

    getBookmarkImage() {
        if(this.state.data.bookmarked)
            return bookmarked_img;

        return bookmark_img;
    }

    getPreviousButtonImage() {
        if (this.state.data.songs && this.state.current_song > 0) {
            return skip_previous_img;
        }
        return skip_previous_grey_img;
    }

    getNextButtonImage() {
        if (this.state.data.songs && this.state.current_song < this.state.data.songs.length - 1) {
            return skip_next_img;
        }
        return skip_next_grey_img;
    }

    getPlayButtonImage() {
        if (this.state.is_song_playing) {
            return pause_img;
        }
        return play_img;
    }

    selectSong = (i, autoplay=0) => {
        if (this.state.data) {
            this.state.is_song_playing = false;
            this.videoRef.current.pauseVideo();
            this.setState({current_song: i, currentYoutubeVideoId: this.state.data.songs[i].url});
            this.videoRef.current.loadVideoWithId(this.state.data.songs[i].url, autoplay);
        }
    }

    handlePlayButton = () => {
        if (!this.videoRef.current.getIsVideoReady()) {
            return;
        }
        if (this.state.is_song_playing) {
            this.videoRef.current.pauseVideo();
            this.setState({is_song_playing: false});
        }
        else {
            this.videoRef.current.playVideo();
            this.setState({is_song_playing: true});
        }
    }

    togglePlayButton = (is_song_playing) => {
        this.setState({is_song_playing: is_song_playing});
    }

    handlePrevButton = () => {
        if (this.state.data && this.state.data.songs.length > 1 && this.state.current_song > 0) {
            this.selectSong(this.state.current_song - 1, 1);
        }
    }

    handleNextButton = () => {
        if (this.state.data && this.state.data.songs.length > 1 && this.state.current_song < this.state.data.songs.length - 1) {
            this.selectSong(this.state.current_song + 1, 1);
        }
    }

    handleVideoEnd = () => {
        if (this.state.data && this.state.current_song < this.state.data.songs.length - 1) {
            this.selectSong(this.state.current_song + 1, 1);
        }
    }

    likePlaylist() {
        var user = this.cookie.get('username');
        if (!user){
            alert("Please log in to like this playlist!");
        }
        else {
            const body = JSON.stringify({
                'playlistId': this.props.playlistId,
                'username': this.cookie.get('username'),
            });
            const headers = {"Content-Type": "application/json"};
            fetch('/updateLikes', {
                method: 'POST',
                body: body,
                headers: headers
            }).then(res => res.json())
            .then(obj => {
                console.log(obj);
                if (obj.status === 0) {
                    console.log('Playlist liked!');
                }
                else {
                    console.log('Unauthorized');
                }
    
                var data = {...this.state.data};
                data.liked = !data.liked;
                this.setState({data});
                if(data.liked){
                    this.setState({
                        likeCount: this.state.likeCount + 1
                    })
                }
                else {
                    this.setState({
                        likeCount: this.state.likeCount - 1
                    })
                }
            });
        }
    }

    bookmarkPlaylist = () => {
        var user = this.cookie.get('username');
        if (!user){
            alert("Please log in to bookmark this playlist!");
        }
        else {
            const body = JSON.stringify({
                'playlistId': this.props.playlistId,
                'username': this.cookie.get('username'),
            });
            const headers = {"Content-Type": "application/json"};
            fetch('/updateBookmarks', {
                method: 'POST',
                body: body,
                headers: headers
            }).then(res => res.json())
            .then(obj => {
                console.log(obj);
                if (obj.status === 0) {
                    console.log('Playlist bookmarked!');
                }
                else {
                    console.log('Unauthorized');
                }
    
                var data = {...this.state.data};
                data.bookmarked = !data.bookmarked;
                this.setState({data});
            });
        }
    }

    copyLink(){
        var currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL)
        .then(() => { alert(`Link copied!`) })
        .catch((error) => { alert(`Copy failed! ${error}`) })
    }

    submitComment = () => {
        var textbox = document.getElementById("comment-entry");
        var comment = textbox.value;
        const date = Date.now();
        var user = this.cookie.get('username');
        if (!user){
            alert("Please log in to comment!");
        }
        else if (comment === "" || comment === null) {
            alert("Please write something");
        }
        else {
            const body = JSON.stringify({
                'playlistId': this.props.playlistId,
                'username': user,
                'content': comment,
                'date': date
            });
            const headers = {"Content-Type": "application/json"};
            fetch('/addComment', {
                method: 'POST',
                body: body,
                headers: headers
            }).then(res => res.json())
            .then(obj => {
                console.log(obj);
                if (obj.status === 0) {
                    console.log('Added comment');
                    //update state here
                    var userId = obj.user_id;
                    var dataCopy = JSON.parse(JSON.stringify(this.state.data)); //creates a copy of the playlist
                    var currentComment = {
                        content: comment,
                        date: date,
                        user_id: userId,
                        username: user
                    }
                    dataCopy.comments.push(currentComment);
                    var commentReverse = dataCopy.comments.slice();
                    commentReverse.reverse();
                    this.setState({
                        data: dataCopy,
                        comments: commentReverse
                    });
                    textbox.value = "";
                    this.setState({charCount: 0});
                }
                else {
                    console.log('Unauthorized');
                }
            });
        }
    }

    deleteComment = (i) => {
        var user = this.cookie.get('username');
        if (!user){
            alert("Please log in to delete this comment!");
        }
        else if (user !== this.state.data.author && user !== this.state.comments[i].username) {
            alert("You are not authorized to delete this comment!");
        }
        else {
            var newComments = this.state.comments.slice();
            newComments.splice(i, 1);
            newComments.reverse();
            console.log(newComments);
            const body = JSON.stringify({
                'playlistId': this.props.playlistId,
                'comments': newComments
            });
            const headers = {"Content-Type": "application/json"};
            fetch('/deleteComment', {
                method: 'POST',
                body: body,
                headers: headers
            }).then(res => res.json())
            .then(obj => {
                console.log(obj);
                if (obj.status === 0) {
                    console.log('Deleted comment');
                    //update state here
                    var dataCopy = JSON.parse(JSON.stringify(this.state.data)); //creates a copy of the playlist
                    dataCopy.comments = newComments;
                    this.setState({
                        data: dataCopy,
                        comments: newComments.reverse()
                    });
                }
                else {
                    console.log('Unauthorized');
                }
            });
        }
    }

    updateCharCount(){
        var textbox = document.getElementById("comment-entry");
        var length = textbox.value.length;
        this.setState({charCount: length});
    }

    getSongsTotalLength() {
        if (this.state.data.songs) {
            var sum = 0;
            this.state.data.songs.forEach(song => {
                if (song.length) {
                    sum += song.length;
                }
            });
            return sum;
        }
        return 0;
    }

    getSecondsPadder(seconds) {
        if (seconds % 60 < 10) {
            return '0';
        }
        return '';
    }

    keyPressed = (e) => {
        if (e.target !== document.getElementById("comment-entry") && e.target !== document.getElementById("search-input")) {
            if (e.which === 80 || e.keyCode === 80) {
                this.handlePrevButton();
            }
            if (e.which === 78 || e.keyCode === 78) {
                this.handleNextButton();
            }
            if (e.which === 32 || e.keyCode === 32) {
                e.preventDefault();
                this.handlePlayButton();
            }
        }
    }

    render() {
        var filler_work_break = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        var filler = "aaaaaa aaaaaaa aaaa aaaaaa aaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa aaaaa aaaaa aaaaaaa aaaaaa aaaaa";

        if(this.state.data === null) {
            return <Redirect to="/error" />
        }
        else{
            var editButton = <a href= {"/playlist/" + this.props.playlistId + "/edit"}><img src={edit_img} height="30px" width="30px" data-tip = "Edit"/></a>
            if(this.state.data && this.state.data.author !== this.cookie.get('username')){
                editButton = null;
            }

            var likeButton = <img src={this.getLikeImage()} height="30px" width="30px" onClick = {this.likePlaylist} data-tip = "Like"/>
            var bookmarkButton = <img src={this.getBookmarkImage()} height="30px" width="30px" onClick = {this.bookmarkPlaylist} data-tip = "Bookmark"/>
            var reactTooltip = <ReactTooltip place="bottom" type="dark" effect="solid" className = "playlist-tooltip"/> 
            if(!this.cookie.get('username')){
                likeButton = null;
                bookmarkButton = null;
                reactTooltip = null;
            }
            return (
                <NavBarWrapper>
                    {reactTooltip}
                    <div className="container" id="playlist-page-container">
                        <div className="row" id="row1">
                            <div className="col" id="playlist-cover-container">
                                {this.getPlaylistImage()}
                            </div>
                            <div className="col">
                                <div className="row" id="title-row">
                                    <div className="col-md-auto" style={{paddingRight: "0px"}}>
                                        <img id="play-pause-img-top" src={this.getPlayButtonImage()} height="60px" width="60px" onClick={this.handlePlayButton} /> 
                                    </div>
                                    <div className="col-md-auto" style={{margin: "auto", paddingRight: "0px"}}>
                                        <h1>{this.state.data.name}</h1>
                                        </div>
                                        <div id="icons-div" className="col">
                                            {likeButton}
                                            {bookmarkButton}
                                            <img src={link_img} height="30px" width="30px" onClick = {this.copyLink} data-tip = "Link"/>
                                            {editButton}
                                        </div>       
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Last modified by <a href={"/user/" + this.state.data.author}>{this.state.data.author}</a> on {new Date(this.state.data.last_modified).toDateString()} 
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        {this.state.likeCount ? this.state.likeCount : 0} Likes
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        {this.state.data.songs ? this.state.data.songs.length : 0} Songs, {this.state.data.songs ? Math.floor(this.getSongsTotalLength() / 60) : 0} Minutes {this.state.data.songs ? this.getSongsTotalLength() % 60 : 0} Seconds
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
                                        <h2>SONG - ARTIST</h2>
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
                                                        <div className="row song-row" onClick={() => {this.selectSong(i, 1)}}>
                                                            <div className="col songs-col0">
                                                                {
                                                                    song.note && song.note.length > 0 ? 
                                                                    <img className="song-arrow" id={"song-arrow-" + i} src={this.getArrow(i)} height="30px" width="30px" alt=">" onClick={(e) => {this.handleSongArrowClick(i, e)}}/>
                                                                    : null
                                                                }
                                                                <b><span style = {{fontSize: "14px"}}>{(i+1) + "."}</span></b>
                                                            </div>
                                                            <div className="col songs-col1">
                                                                <b>{song.name}</b> {song.artist ? " - " + song.artist : ""}
                                                            </div>
                                                            <div className="col songs-col2">
                                                                {song.album ? song.album : "N/A"}
                                                            </div>
                                                            <div className="col songs-col3">
                                                                {song.length ? Math.floor(song.length / 60) + ":" + this.getSecondsPadder(song.length) + song.length % 60 : "N/A"}
                                                            </div>
                                                        </div>
                                                        {
                                                            song.note ?
                                                            <div className="row song-notes-row" id={"song-note-"+i}>
                                                                <div className="col">
                                                                    <p>{song.note}</p>
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

                        this.state.data.com_enabled ?

                        <div className="row" id="row3">
                            <div className="col" id="playlist-comments-container">
                                <div className="row">
                                    <div className="col">
                                        <h1>Comments</h1>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <textarea id="comment-entry" placeholder="Add New Comment" maxLength = "500"  onChange = {() => this.updateCharCount()}/> <br/>
                                        {this.state.charCount}/500
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <button type="button" className="btn btn-primary" onClick = {this.submitComment}>Submit</button>
                                    </div>
                                </div>
                                <div className="row" id="displayed-comments-row">
                                    <div className="col">
                                        {
                                            this.state.comments ?
                                            this.state.comments.map((comment, i) => (
                                                <div className="row comment-row" key={"comment"+i}>
                                                    <div className="col">
                                                        <div className="row">
                                                            <div className="col comment-user-col">
                                                            <a href={"/user/" + comment.username}>{comment.username}</a>
                                                            </div>
                                                            <div className="col comment-time-col">
                                                                {new Date(comment.date).toDateString() + " " + new Date(comment.date).toLocaleTimeString()}
                                                                {
                                                                    //this.state.commentUsername[i] === this.cookie.get('username') || //(checking if the user comment is the same as logged in user)
                                                                    comment.username === this.cookie.get('username') || this.state.data.author === this.cookie.get('username') ?
                                                                    <img className = "delete-comment-button" alt="Delete Comment" src={delete_img} width = "20px" height = "20px" onClick = {() => this.deleteComment(i)}></img>
                                                                    : null
                                                                }
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
                                    <img id="prev-song-img" className="invert-color" src={this.getPreviousButtonImage()} height="60px" width="60px" onClick={this.handlePrevButton} />
                                    <img id="play-pause-img" className="invert-color" src={this.getPlayButtonImage()} height="60px" width="60px" onClick={this.handlePlayButton} /> 
                                    <img id="next-song-img" className="invert-color" src={this.getNextButtonImage()} height="60px" width="60px" onClick={this.handleNextButton} />
                                </div>
                                <div className="col" id="play-track-right-col" style={{"maxWidth": "69%"}}>
                                    <div className="row">
                                        <div className="col">
                                            {
                                                this.state.current_song !== null && this.state.data.songs &&  this.state.data.songs[this.state.current_song] ?
                                                <EllipsisWithTooltip placement="top"><h2>{this.state.current_song + 1}. {this.state.data.songs[this.state.current_song].name} - {this.state.data.songs[this.state.current_song].artist}</h2></EllipsisWithTooltip>
                                                : null
                                            }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <EllipsisWithTooltip placement="top">{this.state.data.name} by {this.state.data.author}</EllipsisWithTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-auto">
                                    <YoutubeVideo id={this.state.currentYoutubeVideoId} handleVideoEnd={this.handleVideoEnd} togglePlayButton={this.togglePlayButton} ref={this.videoRef} />
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