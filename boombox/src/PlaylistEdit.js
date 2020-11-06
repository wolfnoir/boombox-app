import React from 'react';
import { useParams } from 'react-router';
import { Redirect } from "react-router-dom";
import NavBarWrapper from './NavBarWrapper';
import Tag from './Tag';
import Cookie from 'universal-cookie';
import './css/bootstrap.min.css';
import './PlaylistEdit.css';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import like_img from './images/favorite_border-24px.svg';
import bookmark_img from './images/bookmark-24px.svg';
import link_img from './images/link-24px.svg';
import arrow_right_img from './images/keyboard_arrow_right-24px.svg';
import arrow_down_img from './images/keyboard_arrow_down-24px.svg';
import settings_img from './images/settings-24px.svg';
import add_circle_img from './images/add_circle-24px.svg';
import add_box_img from './images/add_box-24px.svg';
import remove_circle_img from './images/remove_circle-24px.svg';
import delete_img from './images/delete-black-24dp.svg';
import edit_img from './images/edit-24px.svg';


/*-----------------------------------------*/
/* STATIC IMPORT                           */
/*-----------------------------------------*/
import horse_img from './images/horse.png';
import { render } from '@testing-library/react';
// import { addSong } from '../express-server/PlaylistHandler';
/*-----------------------------------------*/

function PlaylistEdit() {
    let { playlistId } = useParams();
    console.log(playlistId);
    return <PlaylistEditDisplay playlistId={playlistId}/>
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

class PlaylistSettings extends React.Component {
    constructor(props){
        super(props);
        this.cookie = new Cookie();
        this.state = {
            show: false,
            setShow: false,
            name: this.props.playlistName,
            desc: this.props.playlistDesc,
            playlistId: this.props.playlistId,
            userId: this.props.userId,
            redirect: false,
        }
    }

    componentDidUpdate() {
        if(this.props.playlistName != this.state.name 
            || this.props.playlistDesc != this.state.desc 
            ||  this.props.playlistId != this.state.playlistId 
            || this.props.userId != this.state.userId) {
                this.setState({
                    name: this.props.playlistName,
                    desc: this.props.playlistDesc,
                    playlistId: this.props.playlistId,
                    userId: this.props.userId
                });
            }
    }

    handleDeletePlaylist = () => {
        const body = JSON.stringify({
            'username': this.cookie.get('username'),
            'playlistId': this.props.playlistId
        });
        const headers = {"Content-Type": "application/json"};
        fetch('/deletePlaylist', {
			method: 'POST',
			body: body,
			headers: headers
		}).then(res => res.json())
        .then(obj => {
            console.log(obj);
            if (obj.status === 0) {
                alert('successfully deleted playlist');
                window.location = '/';
            }
            else if (obj.status === 1) {
                alert('not authorized');
            }
            else if (obj.status === -1) {
                alert('error');
            }
            else {
                alert('somehow it broke');
            }
        });
    }

    //make this happen for real
    handleRedirect() {
        if (this.state.redirect){
            return <Redirect to="/" />
        }
    }

    render(){
        const handleClose = () => this.setState({show: false});
        const handleShow = () => this.setState({show: true});
        return (
            <div>
                {this.handleRedirect()}
                <img src={settings_img} height="30px" width="30px" onClick={handleShow} id = "playlist-settings-button"/>

                <Modal show={this.state.show} onHide={handleClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    keyboard={false}> 

                <div className = "settings-modal-header">
                    settings
                </div>

                <Form className = "settings-modal-content">
                    <Form.Group style = {{display: 'inline-block', marginRight: '50px'}}>
                        <Form.File style = {{display: 'inline-block'}}>
                            <img src = {add_box_img} style={{filter: 'invert(1)', width: '100px', cursor: 'pointer'}}/>
                        </Form.File>
                        <div style = {{display: 'inline-block', fontFamily: 'Roboto Condensed', width: '30%', verticalAlign: 'middle'}}>
                            <b>Upload Cover</b><br/>
                            Must be JPG, JPEG, PNG, or GIF, under 500KB
                        </div>
                    </Form.Group>

                    <Form.Group style = {{display: 'inline-block', verticalAlign: 'middle'}} className = "settings-modal-checkboxes">
                        <Form.Check label = "Public Playlist" className = "settings-checkbox"/>
                        <Form.Check label = "Enable Comments" className = "settings-checkbox"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control defaultValue = {this.state.name} /><br/>
                        <Form.Label>Description</Form.Label><br/>
                        <textarea className = "settings-modal-description" defaultValue = {this.state.desc} />
                    </Form.Group>
                </Form>

                <center>
                    <Button variant="primary" onClick={handleClose}>
                    Save
                    </Button>

                    <Button variant="secondary" onClick={handleClose}>
                    Cancel
                    </Button>

                    <Button variant="danger" onClick = {this.handleDeletePlaylist}>
                    Delete Playlist
                    </Button>
                </center>
                </Modal>
            </div>
        );
    }
}

class PlaylistEditDisplay extends React.Component {
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
            console.log(obj);
            if (obj.status == 0) {
                this.setState({data: obj.result});
                this.setState({currentData: obj.result});
                for (var i = 0; i < this.state.data.songs.length; i++) {
                    this.state.song_notes_open.push(false);
                }
            }
            else {
                this.setState({data: null}); //need to change the component to have a not found page
            }
        });
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

    handleDeleteSong = (i) => {
        const index = i;
        //TODO: handle delete song here
    }

    handleEditSong = (i) => {
        var urlField = document.getElementById("edit-song-url-"+i);
        var titleField = document.getElementById("edit-song-title-"+i);
        var artistField = document.getElementById("edit-song-artist-"+i);
        var albumField = document.getElementById("edit-song-album-"+i);
        var noteField = document.getElementById("edit-song-note-"+i);

        var p = new RegExp("^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$");
        var url = urlField.value;

        if(p.test(url)){
            var songId = urlField.value.substring(urlField.value.lastIndexOf("=") + 1);
        
            var dataCopy = this.state.data; //creates a copy of the song array
            var currentSong = dataCopy.songs[i];
            console.log(currentSong);

            currentSong.url = songId;
            currentSong.url_type = "youtube.com/watch?v=";
            currentSong.name = titleField.value;
            currentSong.artist = artistField.value;
            currentSong.album = albumField.value;
            currentSong.note = noteField.value;

            console.log(dataCopy);
            this.setState({data: dataCopy});

            this.toggleEditFields(i);
        }
        else {
            alert("Must be valid YouTube URL!");
        }   
    }

    handleAddSong() {
        //TODO: handle add song
        var urlField = document.getElementById("add-song-url");
        var titleField = document.getElementById("add-song-title");
        var artistField = document.getElementById("add-song-artist");
        var albumField = document.getElementById("add-song-album");
        var noteField = document.getElementById("add-song-note");

        var p = new RegExp("^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$");
        var url = urlField.value;
        if(p.test(url)){
            var songId = urlField.value.substring(urlField.value.lastIndexOf("=") + 1);
        
            var dataCopy = this.state.data; //creates a copy of the song array
            var currentSong = {
                index: this.state.data.songs.length + 1,
                album: albumField.value,
                artist: artistField.value,
                name: titleField.value,
                note: noteField.value,
                url: songId,
                url_type: "youtube.com/watch?v=" //temporary
            }
            console.log(currentSong);
            dataCopy.songs.push(currentSong);
            console.log(dataCopy);
            this.setState({data: dataCopy});
            this.toggleAddSong();

            urlField.value = "";
            albumField.value = "";
            artistField.value = "";
            titleField.value = "";
            noteField.value = "";
        }
        else {
            alert("Must be valid YouTube URL!");
        }   
    }

    toggleAddSong() {
        var addSongForm = document.getElementById("add-song-form");
        var isHidden = addSongForm.hidden;
        addSongForm.hidden = !isHidden;
    }

    toggleEditFields(i){
        console.log("test");
        var editField = document.getElementById("edit-song-form-" + i);
        console.log("edit-song-form-" + i);
        console.log(editField);
        var isHidden = editField.hidden;
        editField.hidden = !isHidden;
        var currentSong = this.state.data.songs[i];

        var urlField = document.getElementById("edit-song-url-"+i);
        var titleField = document.getElementById("edit-song-title-"+i);
        var artistField = document.getElementById("edit-song-artist-"+i);
        var albumField = document.getElementById("edit-song-album-"+i);
        var noteField = document.getElementById("edit-song-note-"+i);

        var url = currentSong.url_type + currentSong.url;
        urlField.value = url;
        titleField.value = currentSong.name;
        artistField.value = currentSong.artist;
        albumField.value = currentSong.album;
        noteField.value = currentSong.note;
    }

    render() {
        var filler_work_break = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        var filler = "aaaaaa aaaa aaaaaa aaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa aaaaa aaaaa aaaaaaa aaaaaa aaaaa";
        if(this.state.data == null) {
            return <Redirect to="/error" />
        }
        else if (this.state.data.author && this.state.data.author !== this.cookie.get('username')){
            //eventually have custom error messages for each page error
            return <Redirect to="/error" />
        }
        else{
            return (
                <NavBarWrapper>
                    <div className="container" id="playlist-edit-container">
                        <div className="row" id="row1">
                            <div className="col" id="playlist-cover-container">
                                <img src={horse_img} id="playlist-cover" width="250px" height="250px"/>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col" id="playlist-edit-state-buttons-col">
                                        <a href={"/playlist/" + this.props.playlistId}>
                                            <button type="button" className="btn btn-primary">Save Changes</button>
                                        </a>
                                        <a href={"/playlist/" + this.props.playlistId}>
                                            <button type="button" className="btn btn-danger">Cancel</button>
                                        </a>
                                    </div>
                                </div>
                                <div className="row" id="title-row">
                                    <div className="col">
                                        <h1>{this.state.data.name}</h1>
                                        <div id="icons-div">
                                            <PlaylistSettings playlistName = {this.state.data.name} playlistDesc = {this.state.data.description} playlistId = {this.state.data._id}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p>{this.state.data.description}</p>
                                    </div>
                                </div>
                                <div className="row" id="tags-row">
                                    <div className="col">
                                        <div style={{"marginRight": "10px", "display": "inline-block"}}><h2>tags:</h2></div>
                                        {this.state.data.tags ? 
                                            this.state.data.tags.map((tag, i) => 
                                            <div key={"tagDiv" + i} style={{"display": "inline-block"}}>
                                                <Tag number = {i} content = {tag}/>
                                                <img className="remove-tag-icon" src={remove_circle_img} />
                                            </div>
                                            ) 
                                            : null}
                                        <img id="add-tag-icon" src={add_circle_img} height="30px" width="30px" />
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
                                                        <div className="row" id = "song-row" onClick = {() => this.toggleEditFields(i)}>
                                                            <div className="col songs-col0">
                                                                {/* should decide based on state? */}
                                                                
                                                            <img className="song-arrow" id={"song-arrow-" + i} 
                                                                src={
                                                                    this.state.song_notes_open[i] ?
                                                                    arrow_down_img
                                                                    : arrow_right_img
                                                                } 
                                                                height="30px" width="30px" alt=">"/> {/* should add onclick to toggle arrow*/}
                                                                <b>{(i+1) + "."}</b>
                                                            </div>
                                                            <div className="col songs-col1">
                                                                <b>{song.name}</b> {song.artist ? " - " + song.artist : ""}
                                                            </div>
                                                            <div className="col songs-col2">
                                                                {song.album ? song.album : "N/A"}
                                                            </div>
                                                            <div className="col songs-col3">
                                                                {/* TODO: get this from youtube data api */}
                                                                {song.length ? Math.floor(song.length / 60) + ":" + song.length % 60 : "N/A"}
                                                            </div>
                                                            <img id = {"delete-song-"+i} src = {delete_img} onClick = {() =>  this.handleDeleteSong(i)}/>
                                                        </div>
                                                        <center>
                                                            <Form id = {"edit-song-form-" + i} hidden>
                                                                <Row>
                                                                    <Col>
                                                                        <Form.Group>
                                                                            <Form.Label>URL</Form.Label>
                                                                            <Form.Control id = {"edit-song-url-"+i} className = "edit-song-textbox" placeholder = "Paste YouTube URL here." ></Form.Control>

                                                                            <Form.Label>Title</Form.Label>
                                                                            <Form.Control id = {"edit-song-title-"+i} className = "edit-song-textbox" ></Form.Control>

                                                                            <Form.Label>Artist</Form.Label>
                                                                            <Form.Control id = {"edit-song-artist-"+i} className = "edit-song-textbox" ></Form.Control>

                                                                            <Form.Label>Album</Form.Label>
                                                                            <Form.Control id = {"edit-song-album-"+i} className = "edit-song-textbox" ></Form.Control>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col>
                                                                        <Form.Group>
                                                                            <Form.Label>Note</Form.Label>
                                                                            <Form.Control as="textarea" id = {"edit-song-note-"+i} className = "edit-song-textarea" ></Form.Control>
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                                <Button variant="primary" type="button" id = "add-song-button" onClick = {() =>  this.handleEditSong(i)}>
                                                                        Submit
                                                                </Button>
                                                                <Button variant="primary" type="button" id = "add-song-button" onClick = {() => this.toggleEditFields(i)}>
                                                                        Cancel
                                                                </Button>
                                                            </Form>
                                                        </center>
                                                    </div>
                                                ))
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>        
                        </div>
                        <div className="row" id="row3">
                            <div className="col">
                                <div className="row" id="title-row">
                                    <div className="col" id = "add-song">
                                        {/* <AddSongModal/> */}
                                        <div onClick={this.toggleAddSong}>
                                            <img id="add-song-icon" src={add_circle_img} height="48px" width="48px" />
                                                                    <h1>add song</h1>
                                        </div>
                                        <center>
                                            <Form id = "add-song-form" hidden>
                                                <Row>
                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label>URL</Form.Label>
                                                            <Form.Control id = "add-song-url" className = "add-song-textbox" placeholder = "Paste YouTube URL here." ></Form.Control>

                                                            <Form.Label>Title</Form.Label>
                                                            <Form.Control id = "add-song-title" className = "add-song-textbox" ></Form.Control>

                                                            <Form.Label>Artist</Form.Label>
                                                            <Form.Control id = "add-song-artist" className = "add-song-textbox" ></Form.Control>

                                                            <Form.Label>Album</Form.Label>
                                                            <Form.Control id = "add-song-album" className = "add-song-textbox" ></Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label>Note</Form.Label>
                                                            <Form.Control as="textarea" id = "add-song-note" className = "add-song-textarea" ></Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Button variant="primary" type="button" id = "add-song-button" onClick = {() => this.handleAddSong()}>
                                                        Submit
                                                </Button>

                                                <Button variant="primary" type="button" id = "add-song-button" onClick = {this.toggleAddSong}>
                                                        Cancel
                                                </Button>
                                            </Form>
                                        </center>
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

export default PlaylistEdit;