import React from 'react';
import { useParams } from 'react-router';
import { Redirect } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';
import ReactTooltip from 'react-tooltip';
import NavBarWrapper from './NavBarWrapper';
import Tag from './Tag';
import YoutubeVideo from './YoutubeVideo';
import Cookie from 'universal-cookie';
import './css/bootstrap.min.css';
import './PlaylistEdit.css';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import default_playlist_img from './images/default-playlist-cover.png';
import arrow_right_img from './images/keyboard_arrow_right-24px.svg';
import arrow_down_img from './images/keyboard_arrow_down-24px.svg';
import settings_img from './images/settings-24px.svg';
import add_circle_img from './images/add_circle-24px.svg';
import add_box_img from './images/add_box-24px.svg';
import remove_circle_img from './images/remove_circle-24px.svg';
import delete_img from './images/delete-black-24dp.svg';
import search_img from './images/search-black-24dp.svg';
import redo_img from './images/redo-black-24dp.svg';
import undo_img from './images/undo-black-24dp.svg';
import SelectSearch from 'react-select-search';
import moment from 'moment';

const YOUTUBE_API_KEY = "AIzaSyAKoDU8scPN2e76sQKwsu5rIg3XTbEfNt4";
const YOUTUBE_DISCOVERY_DOCS = "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";
const MAX_SEARCH_RESULTS = 20;

function PlaylistEdit() {
    let { playlistId } = useParams();
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
            com_enabled: this.props.com_enabled,
            playlistId: this.props.playlistId,
            userId: this.props.userId,
            redirect: false,
            imageSrc: null,
        }
    }

    getUploadImageIcon() {
        var imageSrc = this.state.imageSrc;
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
        if(prevprops !== this.props) {
                this.setState({
                    com_enabled: this.props.com_enabled,
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

    updateCommentsEnabled = (event) => {
        this.setState({com_enabled: !this.state.com_enabled});
    }

    handleImageUpload = () => {
        var error = document.getElementById("playlist-settings-error");
        const imageExts = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        const input = document.getElementById("file-input");
        if (input.files && input.files[0]) {
            if (!imageExts.includes(input.files[0].type)) {
                error.innerHTML = "ERROR: Please pick a compatible file.";
                return;
            }
            if (input.files[0].size > 2000000) {
                error.innerHTML = "ERROR: File too large. Please pick another picture.";
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                this.setState({imageSrc: e.target.result});
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    handleSavePlaylist = () => {
        var error = document.getElementById("playlist-settings-error");
        if(!this.cookie.get('username')){
            error.innerHTML = "You're not authorized to save this playlist!";
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
        formData.append('com_enabled', this.state.com_enabled);
        formData.append('isPrivate', this.state.private);
        formData.append('file', file);

        const headers = {"Content-Type": "application/json"};
        fetch('/editPlaylistSettings', {
			method: 'POST',
			body: formData, //body,
			//headers: headers
		}).then(res => res.json())
        .then(obj => {
            if (obj.status === 0) {
                console.log("Success!");
            }
            else if (obj.status === 1) {
                error.innerHTML = "ERROR: You're not authorized to save this playlist!";
            }
            else if (obj.status === -1) {
                error.innerHTML = "ERROR: Something broke, whoops! Try again later.";
            }
            else {
                error.innerHTML = "ERROR: Something broke, whoops! Try again later.";
            }

            this.props.onSave(this.state.name, this.state.desc, this.state.private, this.state.com_enabled, this.state.imageSrc);
            this.setState({show: false});
        });
    }

    handleDeletePlaylist = () => {
        var feedback = document.getElementById("playlist-settings-error");
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
            if (obj.status === 0) {
                //alert('successfully deleted playlist');
                window.location = '/';
            }
            else if (obj.status === 1) {
                feedback.innerHTML = "You are not authorized to delete this playlist!";
            }
            else if (obj.status === -1) {
                feedback.innerHTML = "ERROR: Please try again later!";
            }
            else {
                feedback.innerHTML = "ERROR: Please try again later!";
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
        const handleClose = () => {
            this.setState({show: false});
        }
        const handleShow = () => {
            this.setState({show: true});
        }
        return (
            <div>
                {this.handleRedirect()}
                <ReactTooltip place="bottom" type="dark" effect="solid" className = "playlist-tooltip"/> 
                <img src={settings_img} height="30px" width="30px" onClick={handleShow} id = "playlist-settings-button" style = {{ "display": "inline-block" }} data-tip = "Settings"/>

                <Modal id = "settings-modal" show={this.state.show} onHide={handleClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    keyboard={false}> 

                <div className = "settings-modal-header">
                    settings
                </div>

                <Form className = "settings-modal-content">
                    <center><div id = "playlist-settings-error" className = "song-error"></div></center>
                    <Form.Group style = {{display: 'inline-block', marginRight: '50px'}}>
                        <Form.File style = {{display: 'inline-block'}}>
                            {this.getUploadImageIcon()}
                        </Form.File>
                        <div style = {{display: 'inline-block', fontFamily: 'Roboto Condensed', width: '30%', verticalAlign: 'middle'}}>
                            <b>Upload Cover</b><br/>
                            Must be JPG, JPEG, PNG, or GIF, under 2MB
                        </div>
                    </Form.Group>

                    <Form.Group style = {{display: 'inline-block', verticalAlign: 'middle'}} className = "settings-modal-checkboxes">
                        <Form.Check label = "Public Playlist" className = "settings-checkbox" checked = {!this.state.private} onChange = {this.updatePlaylistPrivacy} />
                        <Form.Check label = "Comments Enabled" className = "settings-checkbox" checked = {this.state.com_enabled} onChange = {this.updateCommentsEnabled}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control defaultValue = {this.state.name} onChange={this.updateName} maxLength = "100" /><br/>
                        <Form.Label>Description</Form.Label><br/>
                        <textarea className = "settings-modal-description" defaultValue = {this.state.desc} onChange={this.updateDescription} maxLength = "500"/>
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

class PlaylistTags extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            show: false,
            tags: null,
            allTags: null,
            selectedTags: []
        }

        this.addTags = this.addTags.bind(this);
    }

    componentDidMount() {
        this.fetchTags();
    }

    componentDidUpdate(prevprops) {
        if(prevprops !== this.props)
            this.setState({tags: this.props.tags});
    }

    fetchTags() {
        fetch('/getTags')
        .then(res => res.json())
        .then(data => {
            if(data.status === 0)
                this.setState({ allTags: data.result });
        });
    }

    fetchUnusedTags() {
        const unusedTags = this.state.allTags.filter((element) => !this.state.tags.includes(element));

        if(this.state.tags.length + this.state.selectedTags.length >= 10)
            return unusedTags.map( tag => ({ name: tag, value: tag, disabled: true}));

        else
            return unusedTags.map( tag => ({ name: tag, value: tag}));
    }

    changedValues = (event) => {
        if(this.state.tags.length + this.state.selectedTags.length < 10)
            this.setState({selectedTags: event});
    }

    addTags() {
        if(this.state.selectedTags.length > 0 && this.state.selectedTags.length <= 10){
            this.props.onSubmit(this.state.selectedTags);
            this.setState({
                show: false,
                selectedTags: []
            });
        }
        else if(this.state.selectedTags.length > 10){
            alert("Playlists have a limit of ten tags. Please unselect some tags.");
        }
        else{
            alert("Please select tags to be added!");
        }
        
    }

    render() {
        const handleClose = () => this.setState({show: false});
        const handleShow = () => this.setState({show: true});

        return(
            <div>
                {this.state.tags && this.state.tags.length < 10? <img id="add-tag-icon" src={add_circle_img} height="30px" width="30px" onClick={handleShow}/> : null}

                <Modal show={this.state.show} onHide={handleClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    keyboard={false}>
                    <div className = "tags-modal-header">
                        tags
                    </div>

                    <div><center>
                        <SelectSearch 
                            id = "select-tag-search"
                            closeOnSelect = {false}
                            options = {this.state.tags && this.state.allTags? this.fetchUnusedTags() : []}
                            multiple
                            search
                            placeholder="Select tags"
                            printOptions = "on-focus"
                            onChange={this.changedValues}
                        />
                        </center>
                    </div>

                    <center>
                        <Button onClick={this.addTags}>
                            Add Tags
                        </Button>

                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </center>
                </Modal>
            </div>
        );
    }
}

class PlaylistYoutubeSearch extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            show: false,
            index: this.props.index,
            clientReady: false,
            query: "",
            results: [],
            selectedSong: null,
            selectedSongIndex: null,
        }

        this.loadClient = this.loadClient.bind(this);
    }

    handleSearchChange = (event) => {
        this.setState({query: event.target.value});
    }

    componentDidMount(){
        window.gapi.load("client", this.loadClient);
    }

    loadClient() {
        window.gapi.client.setApiKey(YOUTUBE_API_KEY);

        return window.gapi.client.load(YOUTUBE_DISCOVERY_DOCS)
            .then(() => this.setState({clientReady: true}),
                  function(err) { console.error("Error loading GAPI client for API", err); });
    }
      
    execute = () => {
        if(this.state.clientReady){
            window.gapi.client.youtube.search.list({
                "part": [
                    "snippet"
                ],
                "maxResults": MAX_SEARCH_RESULTS,
                "q": this.state.query,
                "type": [
                    "video"
                ]
            })
            .then(
                (response) => this.setState({results: response.result.items}),
                function(err) { console.error("Execute error", err); alert("Sorry, Youtube Search API quota has been reached for the day. Please manually search for the video URL.")}
            );
        }
    }

    handleAddSong = () => {
        var feedback = document.getElementById("search-youtube-response");
        var results = document.getElementById("youtube-search-results");
        if (this.state.selectedSong){
            //pass props up to page 
            this.props.onSubmit(this.state.selectedSong, this.state.index);
            this.setState({
                show: false,
                selectedSong: null
            });
            feedback.innerHTML = "";
            results.innerHTML = "";
        }
        else {
            feedback.innerHTML = "Please select a video.";
        }
    }

    handleSelectSong = (i) => {
        console.log("index selected: " + i);
        var currentSelected = document.getElementById("youtube-search-result-" + i);
        if(this.state.selectedSongIndex === i){
            currentSelected.classList.remove("selected");
            this.setState({
                selectedSong: null,
                selectedSongIndex: null
            });
            return;
        }

        if(this.state.selectedSongIndex !== null){
            var element = document.getElementById("youtube-search-result-" + this.state.selectedSongIndex);
            element.classList.remove("selected");
        }
        currentSelected.classList.add("selected");
        this.setState({
            selectedSong: this.state.results[i],
            selectedSongIndex: i
        });
        return;
    }

    handleKeyDown = (e) => {
        if(e.target === document.getElementById("search-youtube-input")) {
            if (e.which === 13 || e.keyCode === 13) {
                e.preventDefault();
                this.execute();
            }
        }
    }

    render() {
        const handleClose = () => this.setState({show: false, results: [], selectedSong: null, selectedSongIndex: null, query: ""});
        const handleShow = () => this.setState({show: true, results: [], selectedSong: null, selectedSongIndex: null, query: ""});
        return(
            <div>
                <div onClick = {handleShow} id = "search-open-modal">
                    <img src={search_img} id = "search-youtube-icon" width = "50"/>
                    SEARCH FOR YOUTUBE VIDEO
                </div>
                
                <Modal show={this.state.show} onHide={handleClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    keyboard={false}
                    >
                    <div className = "tags-modal-header">
                        search
                    </div>
                    <center><div id = "search-youtube-response"></div></center>
                    <div id = "search-youtube">
                        <center>
                            <img src={search_img} id = "search-youtube-icon" width = "30" className = "invert-color"/>
                            <input id = "search-youtube-input" onChange={this.handleSearchChange} maxLength = "100" onKeyDown = {this.handleKeyDown}/>

                             <Button variant="secondary"  onClick={this.execute}> 
                                Search
                            </Button>
                        </center>
                    </div>
                    <div id = "youtube-search-results">
                    {/* Search results show up here. */}
                    {
                        this.state.results ?
                        this.state.results.map((video, i) => ( //limits results to 10
                            <div id = {"youtube-search-result-" + i} className = "youtube-search-result" onClick = {() => this.handleSelectSong(i)}>
                                <table>
                                    <tr>
                                        <td id = {"youtube-search-video-" + i} className = "youtube-search-video">
                                            <img src= {video.snippet.thumbnails.default.url}></img>
                                        </td>

                                        <td id = {"youtube-search-snippet-" + i}>
                                            <span id = "video-title"><b>{video.snippet.title}</b></span><br/>
                                            <small>By {video.snippet.channelTitle}</small>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        ))
                        : null
                    }
                    </div>
                    <center>
                        <Button onClick={this.handleAddSong}>
                            Add Song
                        </Button>

                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
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
            noteCharCounts: [],
            imageData: null,
            history: [],
            historyStep: 0,
        }
    }

    getPlaylistImage() {
        if (this.state.imageData) {
            return (
                <img src={this.state.imageData} id="playlist-cover" width="250px" height="250px"/>
            )
        }
        return (
            <img src={default_playlist_img} id="playlist-cover" width="250px" height="250px"/>
        );
    }

    getUndoImg() {
        if (this.state.historyStep === 0) {
            return <img src = {undo_img} onClick = {() => this.handleUndo()} height="30px" width="30px" id = "undo-button" className = "undo-redo-styling disable-svg" data-tip = "Undo (Ctrl + Z)"/>
        }
        else {
            return <img src = {undo_img} onClick = {() => this.handleUndo()} height="30px" width="30px" id = "undo-button" className = "undo-redo-styling" data-tip = "Undo (Ctrl + Z)"/>
        }
    }

    getRedoImg() {
        if (this.state.historyStep === this.state.history.length - 1) {
            return <img src = {redo_img} onClick = {() => this.handleRedo()} height="30px" width="30px" id = "redo-button" className = "undo-redo-styling disable-svg" data-tip = "Redo (Ctrl + Y)"/>
        }
        else {
            return <img src = {redo_img} onClick = {() => this.handleRedo()} height="30px" width="30px" id = "redo-button" className = "undo-redo-styling" data-tip = "Redo (Ctrl + Y)"/>
        }
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
            if (obj.status === 0) {
                this.setState({data: obj.result});
                this.setState({currentData: obj.result});
                for (var i = 0; i < this.state.data.songs.length; i++) {
                    this.state.song_notes_open.push(false);
                    this.state.noteCharCounts.push(this.state.data.songs[i].note.length);
                }
                const songs = this.state.data.songs
                this.setState ({
                    history: [songs]
                });
            }
            else {
                this.setState({data: null});
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
            if (data.imageData) {
                this.setState({imageData: `data:image/jpeg;base64,${data.imageData}`});
            }
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
        var dataCopy = JSON.parse(JSON.stringify(this.state.data));
        if (dataCopy.songs && i < dataCopy.songs.length) {
            dataCopy.songs.splice(i, 1);
        }
        for(var j = 0; j < dataCopy.songs.length; j ++){
            dataCopy.songs[j].index = j;
        }
        this.addToHistory(dataCopy.songs);
        this.setState({data: dataCopy});
    }

    handleEditSong = (i) => {
        var urlField = document.getElementById("edit-song-url-"+i);
        var titleField = document.getElementById("edit-song-title-"+i);
        var artistField = document.getElementById("edit-song-artist-"+i);
        var albumField = document.getElementById("edit-song-album-"+i);
        var noteField = document.getElementById("edit-song-note-"+i)
        var errorField = document.getElementById("edit-song-error-"+i);;
        var lengthField = document.getElementById("edit-song-video-length-"+i)

        var p = new RegExp("^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/watch\\?v\=[a-zA-Z0-9_-]{11,}$");
        var url = urlField.value;

        if(p.test(url)){
            var songId = urlField.value.substring(urlField.value.lastIndexOf("=") + 1);
        
            var dataCopy = JSON.parse(JSON.stringify(this.state.data)); //creates a copy of the song array
            var currentSong = dataCopy.songs[i];

            currentSong.url = songId;
            currentSong.url_type = "youtube.com/watch?v=";
            currentSong.name = titleField.value;
            currentSong.artist = artistField.value;
            currentSong.album = albumField.value;
            currentSong.note = noteField.value;
            currentSong.length = parseInt(lengthField.value);
            errorField.innerHTML = "";

            this.addToHistory(dataCopy.songs);
            this.setState({data: dataCopy});

            this.toggleEditFields(i);
        }
        else {
            errorField.innerHTML = "Must be a vaild YouTube URL.";
        }   
    }

    handleAddSong() {
        var urlField = document.getElementById("add-song-url");
        var titleField = document.getElementById("add-song-title");
        var artistField = document.getElementById("add-song-artist");
        var albumField = document.getElementById("add-song-album");
        var noteField = document.getElementById("add-song-note");
        var errorField = document.getElementById("add-song-error");
        var lengthField = document.getElementById("add-song-video-length");

        var p = new RegExp("^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/watch\\?v\=[a-zA-Z0-9_-]{11,}$");
        var url = urlField.value;
        if(p.test(url)){
            var songId = urlField.value.substring(urlField.value.lastIndexOf("=") + 1);
        
            var dataCopy = JSON.parse(JSON.stringify(this.state.data)); //creates a copy of the song array
            var currentSong = {
                index: this.state.data.songs.length,
                album: albumField.value,
                artist: artistField.value,
                length: parseInt(lengthField.value),
                name: titleField.value,
                note: noteField.value,
                url: songId,
                url_type: "youtube.com/watch?v=" //temporary
            }
            dataCopy.songs.push(currentSong);
            this.addToHistory(dataCopy.songs);
            this.setState({
                data: dataCopy,
                charCount: 0
            });
            this.toggleAddSong();

            urlField.value = "";
            albumField.value = "";
            artistField.value = "";
            titleField.value = "";
            noteField.value = "";
            errorField.innerHTML = "";
        }
        else {
            errorField.innerHTML = "Must be a vaild YouTube URL.";
        }   
    }

    onDragEnd = (result) => {
        //update the state for the new drag and drop result
        //save new state to history for undo/redo
        const { destination, source, draggableId } = result;

        if(!destination){
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        var dataCopy = JSON.parse(JSON.stringify(this.state.data));
        const newSongs = Array.from(this.state.data.songs);
        const song = newSongs[source.index];
        newSongs.splice(source.index, 1);
        newSongs.splice(destination.index, 0, song);
        dataCopy.songs = newSongs;

        this.addToHistory(dataCopy.songs);
        this.setState({data: dataCopy});
    }

    addToHistory(songs){
        const history = this.state.history.slice(0, this.state.historyStep + 1);
        const newHistory = history.concat([songs]);
        this.setState({
            history: newHistory,
            historyStep: newHistory.length - 1
        });
    }

    toggleAddSong() {
        var addSongForm = document.getElementById("add-song-form");
        var isHidden = addSongForm.hidden;
        addSongForm.hidden = !isHidden;
    }

    toggleEditFields(i){
        const songNotesOpen = this.state.song_notes_open;
        songNotesOpen[i] = !songNotesOpen[i];
        this.setState({song_notes_open: songNotesOpen});

        var editField = document.getElementById("edit-song-form-" + i);
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
        this.editSongNote(i);
    }
    
    handleAddTags = (tags) => {
        var data = {...this.state.data};
        data.tags = data.tags.concat(tags);
        this.setState({data});
    }

    saveChanges() {
        this.saveSongs();
        this.saveTags();
    }

    saveSongs(){
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
            //need to make response better
            if (obj.status === 0) {
                //alert('Playlist saved!');
                window.location = '/playlist/' + this.props.playlistId;
            }
            else if (obj.status === 1) {
                alert('You are not authorized to edit this playlist!');
            }
            else {
                alert('ERROR: Whoops! Something broke. Please try again later.');
            }
        });
    }

    saveTags() {
        const body = JSON.stringify({
            'playlistId': this.props.playlistId,
            'tags': this.state.data.tags,
            'username': this.cookie.get('username'),
        });
        const headers = {"Content-Type": "application/json"};
        fetch('/updateTags', {
			method: 'POST',
			body: body,
			headers: headers
		}).then(res => res.json())
        .then(obj => {
            //need to make response better
            if (obj.status === 0) {
                console.log('Playlist saved!');
            }
            else if (obj.status === 1) {
                console.log('You are not authorized to edit this playlist!');
            }
            else {
                console.log('somehow it broke');
            }
        });
    }

    deleteTag = (tag) => {
        var data = {...this.state.data};
        data.tags = data.tags.filter((element) => element !== tag);
        this.setState({data}, () => {
            console.log(this.state.data.tags);
        });
    }

    handleSettingsChange = (name, desc, privacy, commentsEnabled, imageData) => {
        var data = {...this.state.data};
        data.name = name;
        data.description = desc;
        data.isPrivate = privacy;
        data.com_enabled = commentsEnabled;
        this.setState({data});
        if (imageData) {
            console.log("update imagedata");
            this.setState({imageData: imageData});
        }
    }

    addSongNote() {
        var songNote = document.getElementById("add-song-note");
        var length = songNote.value.length;
        this.setState({charCount: length});
    }

    editSongNote(i) {
        var songNote = document.getElementById("edit-song-note-" + i);
        var length = songNote.value.length;
        var array = this.state.noteCharCounts.slice();
        array[i] = length;
        this.setState({noteCharCounts: array});
    }

    keyPressed = (e) => {
        if((e.which === 90 || e.keyCode === 90) && e.ctrlKey){
            this.handleUndo();
        }
        else if ((e.which === 89 || e.keyCode === 89) && e.ctrlKey){
            this.handleRedo();
        }
    }

    handleUndo(){
        var step = this.state.historyStep;
        if(step === 0 || document.activeElement.nodeName === 'TEXTAREA' || document.activeElement.nodeName === 'INPUT' || document.activeElement.nodeName === 'MODAL'){
            return;
        }
        else {
            console.log("undo attempted");
            var dataCopy = JSON.parse(JSON.stringify(this.state.data));
            var previousSongs = this.state.history[step - 1];
            dataCopy.songs = previousSongs;
            this.setState({
                data: dataCopy,
                historyStep: step - 1
            });
            console.log("history step: " + (step - 1));
        }
    }

    handleRedo(){
        var step = this.state.historyStep;
        if(step === this.state.history.length - 1 || document.activeElement.nodeName === 'TEXTAREA' || document.activeElement.nodeName === 'INPUT'){
            return;
        }
        else {
            console.log("redo attempted");
            var dataCopy = JSON.parse(JSON.stringify(this.state.data));
            var nextSongs = this.state.history[step + 1];
            dataCopy.songs = nextSongs;
            this.setState({
                data: dataCopy,
                historyStep: step + 1
            });
            console.log("history step: " + (step + 1));
        }
    }

    autofillSongTitle = (i) => {
        const urlField = i >= 0 ? document.getElementById("edit-song-url-"+i) : document.getElementById("add-song-url");
        const titleField = i >= 0 ? document.getElementById("edit-song-title-"+i) : document.getElementById("add-song-title");
        const artistField = i >= 0 ? document.getElementById("edit-song-artist-"+i) : document.getElementById("add-song-artist");
        const albumField = i >= 0 ? document.getElementById("edit-song-album-"+i) : document.getElementById("add-song-album");
        const validatorField = i >= 0 ? document.getElementById("edit-song-url-validator-"+i) : document.getElementById("add-song-url-validator");
        const videoLengthField = i >= 0 ? document.getElementById("edit-song-video-length-"+i) : document.getElementById("add-song-video-length");

        var p = new RegExp("^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/watch\\?v\=[a-zA-Z0-9_-]{11,}$");
        var url = urlField.value;
        console.log(url);

        if(p.test(url)){
            console.log("matches");
            const songId = urlField.value.substring(urlField.value.lastIndexOf("=") + 1);
            const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${songId}&key=AIzaSyAKoDU8scPN2e76sQKwsu5rIg3XTbEfNt4&part=snippet&part=contentDetails`;
            fetch(endpoint)
            .then(res => res.json())
            .then(obj => {
                if (obj.items.length > 0) {
                    titleField.value = obj.items[0].snippet.title;
                    validatorField.innerHTML = null;

                    //Do stuff with length
                    const duration = moment.duration(obj.items[0].contentDetails.duration);
                    const length = duration.asSeconds();
                    videoLengthField.value = length;
                    console.log(duration, length);
                    console.log(videoLengthField.value);
                    artistField.value = "";
                    albumField.value = "";
                }
                else {
                    console.log("youtube video not found");
                    validatorField.innerHTML = "YouTube video not found";
                }
            });
        }
        else {
            if (url) {
                console.log("invalid youtube video url");
                validatorField.innerHTML = "Invalid YouTube video URL."
            }
            else {
                validatorField.innerHTML = null;
            }
        }

    }

    getSecondsPadder(seconds) {
        if (seconds % 60 < 10) {
            return '0';
        }
        return '';
    }

    handleSelectSong = (video, index) => {
        //if index === -1 then its adding a new song
        //if index is otherwise a number >= 0, then it's editing a current song
        console.log("add/edit song index: " + index);
        const urlField = index >= 0 ? document.getElementById("edit-song-url-"+index) : document.getElementById("add-song-url");
        const url = "https://www.youtube.com/watch?v=" + video.id.videoId;
        urlField.value = url;
        console.log("youtube url: " + url);
        this.autofillSongTitle(index);
    }

    render() {
        var filler_work_break = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        var filler = "aaaaaa aaaa aaaaaa aaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa aaaaa aaaaa aaaaaaa aaaaaa aaaaa";
        if(this.state.data === null) {
            return <Redirect to="/error" />
        }
        else if (this.state.data.author && this.state.data.author !== this.cookie.get('username')){
            //eventually have custom error messages for each page error
            return <Redirect to="/error" />
        }
        else{
            const history = this.state.history;
            const current = history[this.state.historyStep];
            return (
                <div onKeyDown = {this.keyPressed} tabIndex="0">
                <NavBarWrapper>
                    <ReactTooltip place="bottom" type="dark" effect="solid" className = "playlist-tooltip"/> 
                    <div className="container" id="playlist-edit-container" >
                    <DragDropContext
                        onDragEnd = {this.onDragEnd}
                    >
                        <div className="row" id="row1">
                            <div className="col" id="playlist-cover-container">
                                {this.getPlaylistImage()}
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col" id="playlist-edit-state-buttons-col">
                                        <button type="button" className="btn btn-primary" onClick = {() => this.saveChanges()}>Save Changes</button>
                                        <a href={"/playlist/" + this.props.playlistId}>
                                            <button type="button" className="btn btn-danger">Back</button>
                                        </a>
                                        <br/>
                                        <div id = "undo-redo">
                                            {this.getUndoImg()}
                                            {this.getRedoImg()}
                                        </div>
                                    </div>
                                </div>
                                <div className="row" id="title-row">
                                    <div className="col">
                                        <h1>{this.state.data.name}</h1>
                                        <div id="icons-div">
                                            <PlaylistSettings onSave = {this.handleSettingsChange} playlistName = {this.state.data.name} playlistDesc = {this.state.data.description} privacy = {this.state.data.isPrivate} playlistId = {this.props.playlistId} com_enabled = {this.state.data.com_enabled}/>
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
                                                <img className="remove-tag-icon" src={remove_circle_img} onClick={() => this.deleteTag(tag)}/>
                                            </div>
                                            ) 
                                            : null}
                                        <div id="tags-div">
                                            <PlaylistTags tags={this.state.data.tags} onSubmit={this.handleAddTags} />
                                        </div>
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
                                    <Droppable droppableId = "edit-playlist-droppable">
                                            { (provided) => (
                                                <div className="col songs-data-container"
                                                    ref = {provided.innerRef}
                                                    {...provided.droppableProps}
                                                >
                                                {
                                                    this.state.data.songs ?
                                                    this.state.data.songs.map((song, i) => (
                                                        <Draggable draggableId = {"song-" + i} index = {i}>
                                                            {(provided) => (
                                                                <div key={"song-"+i}
                                                                    ref = {provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    
                                                                >
                                                                <div className="row" id = "song-row" >
                                                                    <div className="col songs-col0">
                                                                        
                                                                    <img className="song-arrow" id={"song-arrow-" + i} 
                                                                        src={this.getArrow(i)}       
                                                                        onClick = {() => this.toggleEditFields(i)}                                                                  
                                                                        height="25px" width="25px" alt=">"/> {/* should add onclick to toggle arrow*/}
                                                                        <b><span style = {{fontSize: "14px"}}>{(i+1) + "."}</span></b>
                                                                    </div>
                                                                    <div className="col songs-col1">
                                                                        <b>{song.name ? song.name : ""}</b> {song.artist ? " - " + song.artist : ""}
                                                                    </div>
                                                                    <div className="col songs-col2">
                                                                        {song.album ? song.album : ""}
                                                                    </div>
                                                                    <div className="col songs-col3">
                                                                        {/* @TODO: get this from youtube data api */}
                                                                        {song.length ? Math.floor(song.length / 60) + ":" + this.getSecondsPadder(song.length) + song.length % 60 : "N/A"}
                                                                    </div>
                                                                    <img className="delete-song-button" id = {"delete-song-"+i} src = {delete_img} onClick = {(e) =>  this.handleDeleteSong(e, i)}/>
                                                                </div>
                                                                <center>
                                                                    <Form id = {"edit-song-form-" + i} hidden>
                                                                        <Row>
                                                                            <Col>
                                                                                <PlaylistYoutubeSearch index = {i} onSubmit = {this.handleSelectSong}/>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <Form.Group>
                                                                                    <Form.Label>URL</Form.Label>
                                                                                    <div id = {"edit-song-error-"+i} className = "song-error"></div>
                                                                                    <Form.Control id = {"edit-song-url-"+i} className = "edit-song-textbox" onChange = {() => this.autofillSongTitle(i)} placeholder = "Or, paste YouTube URL here." maxLength = "50"></Form.Control>
                                                                                    <div id={"edit-song-url-validator-"+i} className="song-url-validator"></div>
                                                                                    <input type="hidden" id={"edit-song-video-length-"+i} value={song.length} />
        
                                                                                    <Form.Label>Title</Form.Label>
                                                                                    <Form.Control id = {"edit-song-title-"+i} className = "edit-song-textbox" maxLength = "100"></Form.Control>
        
                                                                                    <Form.Label>Artist</Form.Label>
                                                                                    <Form.Control id = {"edit-song-artist-"+i} className = "edit-song-textbox" maxLength = "100"></Form.Control>
        
                                                                                    <Form.Label>Album</Form.Label>
                                                                                    <Form.Control id = {"edit-song-album-"+i} className = "edit-song-textbox" maxLength = "100"></Form.Control>
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col>
                                                                                <Form.Group>
                                                                                    <Form.Label>Note</Form.Label>
                                                                                    <Form.Control as="textarea" id = {"edit-song-note-"+i} className = "edit-song-textarea" maxLength = "250" onChange = {() => this.editSongNote(i)} ></Form.Control>
                                                                                    <span id = {"edit-song-char-count-" + i}>{this.state.noteCharCounts[i]}</span><span id = "edit-song-max-char">/250</span>
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
                                                            )}
                                                        </Draggable>
                                                    ))
                                                    : null
                                                }
                                                {provided.placeholder}
                                                </div> 
                                            )}
                                        </Droppable>
                                    </div>
                                </div>        
                        </div>
                        <div className="row" id="row3">
                            <div className="col">
                                <div className="row" id="title-row">
                                    <div className="col" id = "add-song">
                                        {/* <AddSongModal/> */}
                                        <div onClick={() => this.toggleAddSong()}>
                                            <img id="add-song-icon" src={add_circle_img} height="48px" width="48px" />
                                                                    <h1>add song</h1>
                                        </div>
                                        <center>
                                            <Form id = "add-song-form" hidden>
                                                <Row>
                                                    <Col>
                                                        <PlaylistYoutubeSearch index = {-1} onSubmit = {this.handleSelectSong}/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Form.Group>                                                          
                                                            <Form.Label>URL</Form.Label>
                                                            <div id = {"add-song-error"} className = "song-error"></div>
                                                            <Form.Control id = "add-song-url" className = "add-song-textbox" onChange={() => {this.autofillSongTitle(-1)}} placeholder = "Or, paste YouTube URL here." maxLength = "50"></Form.Control>
                                                            <div id="add-song-url-validator" className="song-url-validator"></div>
                                                            <input type="hidden" id="add-song-video-length" />

                                                            <Form.Label>Title</Form.Label>
                                                            <Form.Control id = "add-song-title" className = "add-song-textbox" maxLength = "100"></Form.Control>

                                                            <Form.Label>Artist</Form.Label>
                                                            <Form.Control id = "add-song-artist" className = "add-song-textbox" maxLength = "100"></Form.Control>

                                                            <Form.Label>Album</Form.Label>
                                                            <Form.Control id = "add-song-album" className = "add-song-textbox" maxLength = "100"></Form.Control>
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

                                                <Button variant="primary" type="button" id = "add-song-button" onClick = {() => this.toggleAddSong()}>
                                                        Cancel
                                                </Button>
                                            </Form>
                                        </center>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </DragDropContext>
                    </div>

                </NavBarWrapper>
                </div>
            );
        }
    }
}

export default PlaylistEdit;