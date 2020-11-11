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
import default_playlist_img from './images/default-playlist-cover.png';
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

class PlaylistSettings extends React.Component {
    constructor(props){
        super(props);
        this.cookie = new Cookie();
        this.state = {
            show: false,
            name: this.props.playlistName,
            desc: this.props.playlistDesc,
            private: this.props.privacy,
            playlistId: this.props.playlistId,
            userId: this.props.userId,
            redirect: false,
            imageSrc: null,
        }
    }

    getUploadImageIcon() {
        var imageSrc = this.state.imageSrc;
        //console.log(imageSrc);
        if (imageSrc) {
            return (
                <div>
                    <label htmlFor="file-input"><img src = {imageSrc} style={{width: '100px', height: '100px', cursor: 'pointer'}}/></label>
                    <input id="file-input" type="file" style={{display: "none"}} onChange={this.handleImageUpload} />
                </div>
            )
        }
        return (
            <div>
                <label htmlFor="file-input"><img src = {add_box_img} style={{filter: 'invert(1)', width: '100px', cursor: 'pointer'}}/></label>
                <input id="file-input" type="file" style={{display: "none"}} onChange={this.handleImageUpload} />
            </div>
        );
    }

    componentDidUpdate(prevprops) {
        if(prevprops != this.props) {
                this.setState({
                    name: this.props.playlistName,
                    desc: this.props.playlistDesc,
                    private: this.props.privacy,
                    playlistId: this.props.playlistId,
                    userId: this.props.userId
                });
            }
    }

    updateName = (event) => {
        this.setState({name: event.target.value});
    }

    updateDescription = (event) => {
        this.setState({desc: event.target.value});
    }

    updatePlaylistPrivacy = (event) => {
        this.setState({private: !this.state.private});
    }

    handleImageUpload = () => {
        const input = document.getElementById("file-input");
        console.log("hi");
        if (input.files && input.files[0]) {
            console.log(input.files);
            const reader = new FileReader();
            reader.onload = (e) => {
                this.setState({imageSrc: e.target.result});
                //console.log(e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    handleSavePlaylist = () => {
        if(!this.cookie.get('username')){
            alert("You're not authorized to save this playlist!");
            return;
        }
        const body = JSON.stringify({
            'id': this.props.playlistId,
            'description': this.state.desc,
            //@todo: Should we add image here?
            'name': this.state.name,
            'userId': this.state.userId,
        });
        
        const fileInput = document.getElementById("file-input");
        var file;
        if (fileInput.value) {
            file = fileInput.files[0];
        }
        const formData = new FormData();
        formData.append('playlistId', this.props.playlistId);
        formData.append('description', this.state.desc);
        formData.append('name', this.state.name);
        formData.append('userId', this.state.userId);
        formData.append('com_enabled', null);
        formData.append('isPrivate', this.state.private);
        formData.append('file', file);

        const headers = {"Content-Type": "application/json"};
        fetch('/editPlaylistSettings', {
			method: 'POST',
			body: formData, //body,
			//headers: headers
		}).then(res => res.json())
        .then(obj => {
            console.log(obj);
            if (obj.status === 0) {
                console.log('successfully saved playlist');
            }
            else if (obj.status === 1) {
                console.log('not authorized');
            }
            else if (obj.status === -1) {
                console.log('error');
            }
            else {
                console.log('somehow it broke');
            }

            const imageSrcCropped = this.state.imageSrc? this.state.imageSrc.replace('data:image/jpeg;base64,', '') : null;

            this.props.onSave(this.state.name, this.state.desc, this.state.private, imageSrcCropped);
            this.setState({show: false});
        });
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
                            {this.getUploadImageIcon()}
                        </Form.File>
                        <div style = {{display: 'inline-block', fontFamily: 'Roboto Condensed', width: '30%', verticalAlign: 'middle'}}>
                            <b>Upload Cover</b><br/>
                            Must be JPG, JPEG, PNG, or GIF, under 500KB
                        </div>
                    </Form.Group>

                    <Form.Group style = {{display: 'inline-block', verticalAlign: 'middle'}} className = "settings-modal-checkboxes">
                        <Form.Check label = "Public Playlist" className = "settings-checkbox" checked = {!this.state.private} onChange = {this.updatePlaylistPrivacy} />
                        <Form.Check label = "Enable Comments" className = "settings-checkbox"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control defaultValue = {this.state.name} onChange={this.updateName} /><br/>
                        <Form.Label>Description</Form.Label><br/>
                        <textarea className = "settings-modal-description" defaultValue = {this.state.desc} onChange={this.updateDescription}/>
                    </Form.Group>
                </Form>

                <center>
                    <Button variant="primary" onClick={this.handleSavePlaylist}>
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
            charCount: 0,
            imageData: null,
        }
    }

    getPlaylistImage() {
        if (this.state.imageData) {
            return (
                <img src={`data:image/jpeg;base64,${this.state.imageData}`} id="playlist-cover" width="250px" height="250px"/>
            )
        }
        return (
            <img src={default_playlist_img} id="playlist-cover" width="250px" height="250px"/>
        );
    }

    componentDidMount() {
        fetch(`/getPlaylistData/${this.props.playlistId}`)
        .then(res => res.json())
        .then(obj => {
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
    }

    getArrow(i) {
        if (this.state.song_notes_open[i]) {
            return arrow_down_img;
        }
        return arrow_right_img;
    }

    handleSongArrowClick = (i) => {
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

    handleDeleteSong = (e, i) => {
        e.stopPropagation();
        console.log("call");
        var dataCopy = this.state.data;
        if (dataCopy.songs && i < dataCopy.songs.length) {
            console.log("delete ", i);
            dataCopy.songs.splice(i, 1);
        }
        for(var j = 0; j < dataCopy.songs.length; j ++){
            dataCopy.songs[j].index = j;
        }
        this.setState({data: dataCopy});
        console.log(this.state.data.songs);
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

        const songNotesOpen = this.state.song_notes_open;
        songNotesOpen[i] = !songNotesOpen[i];
        this.setState({song_notes_open: songNotesOpen});

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
    
    saveChanges() {
        const body = JSON.stringify({
            'playlistId': this.props.playlistId,
            'songs': this.state.data.songs,
            'username': this.cookie.get('username'),
        });
        const headers = {"Content-Type": "application/json"};
        fetch('/updateSongs', {
			method: 'POST',
			body: body,
			headers: headers
		}).then(res => res.json())
        .then(obj => {
            console.log(obj);
            //need to make response better
            if (obj.status == 0) {
                alert('Playlist saved!');
            }
            else if (obj.status == 1) {
                alert('You are not authorized to edit this playlist!');
            }
            else {
                alert('somehow it broke');
            }
        });
    }

    handleSettingsChange = (name, desc, privacy, imageData) => {
        console.log(name, desc);
        console.log(imageData);
        var data = {...this.state.data};
        data.name = name;
        data.description = desc;
        data.isPrivate = privacy;
        this.setState({data});
        if (imageData) {
            this.setState({imageData: imageData});
        }
    }

    addSongNote() {
        var songChars = document.getElementById("add-song-char-count");
        var songNote = document.getElementById("add-song-note");
        var length = songNote.value.length;
        this.setState({charCount: length});
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
                                {this.getPlaylistImage()}
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col" id="playlist-edit-state-buttons-col">
                                        <button type="button" className="btn btn-primary" onClick = {() => this.saveChanges()}>Save Changes</button>
                                        <a href={"/playlist/" + this.props.playlistId}>
                                            <button type="button" className="btn btn-danger">Cancel</button>
                                        </a>
                                    </div>
                                </div>
                                <div className="row" id="title-row">
                                    <div className="col">
                                        <h1>{this.state.data.name}</h1>
                                        <div id="icons-div">
                                            <PlaylistSettings onSave = {this.handleSettingsChange} playlistName = {this.state.data.name} playlistDesc = {this.state.data.description} privacy = {this.state.data.isPrivate} playlistId = {this.props.playlistId}/>
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
                                                                src={this.getArrow(i)} 
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
                                                            <img className="delete-song-button" id = {"delete-song-"+i} src = {delete_img} onClick = {(e) =>  this.handleDeleteSong(e, i)}/>
                                                        </div>
                                                        <center>
                                                            <Form id = {"edit-song-form-" + i} hidden>
                                                                <Row>
                                                                    <Col>
                                                                        <Form.Group>
                                                                            <Form.Label>URL</Form.Label>
                                                                            <Form.Control id = {"edit-song-url-"+i} className = "edit-song-textbox" placeholder = "Paste YouTube URL here." maxLength = "50"></Form.Control>

                                                                            <Form.Label>Title</Form.Label>
                                                                            <Form.Control id = {"edit-song-title-"+i} className = "edit-song-textbox" maxLength = "50"></Form.Control>

                                                                            <Form.Label>Artist</Form.Label>
                                                                            <Form.Control id = {"edit-song-artist-"+i} className = "edit-song-textbox" maxLength = "50"></Form.Control>

                                                                            <Form.Label>Album</Form.Label>
                                                                            <Form.Control id = {"edit-song-album-"+i} className = "edit-song-textbox" maxLength = "50"></Form.Control>
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
                                                            <Form.Control id = "add-song-url" className = "add-song-textbox" placeholder = "Paste YouTube URL here." maxLength = "50"></Form.Control>

                                                            <Form.Label>Title</Form.Label>
                                                            <Form.Control id = "add-song-title" className = "add-song-textbox" maxLength = "50"></Form.Control>

                                                            <Form.Label>Artist</Form.Label>
                                                            <Form.Control id = "add-song-artist" className = "add-song-textbox" maxLength = "50"></Form.Control>

                                                            <Form.Label>Album</Form.Label>
                                                            <Form.Control id = "add-song-album" className = "add-song-textbox" maxLength = "50"></Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label>Note</Form.Label>
                                                            <Form.Control as="textarea" id = "add-song-note" maxLength = "250" className = "add-song-textarea" onChange = {() => this.addSongNote()}></Form.Control>
                                                            <span id = "add-song-char-count">{this.state.charCount}</span><span id = "add-song-max-char">/250</span>
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