import React from 'react';
import { useParams } from 'react-router';
import NavBarWrapper from './NavBarWrapper';
import Tag from './Tag';
import './css/bootstrap.min.css';
import './PlaylistEdit.css';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import like_img from './images/favorite_border-24px.svg';
import bookmark_img from './images/bookmark-24px.svg';
import link_img from './images/link-24px.svg';
import arrow_right_img from './images/keyboard_arrow_right-24px.svg';
import arrow_down_img from './images/keyboard_arrow_down-24px.svg';
import settings_img from './images/settings-24px.svg';
import add_circle_img from './images/add_circle-24px.svg';
import add_box_img from './images/add_box-24px.svg';
import remove_circle_img from './images/remove_circle-24px.svg';
import edit_img from './images/edit-24px.svg';


/*-----------------------------------------*/
/* STATIC IMPORT                           */
/*-----------------------------------------*/
import horse_img from './images/horse.png';
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
        this.state = {
            show: false,
            setShow: false,
            name: this.props.playlistName,
            desc: this.props.playlistDesc
        }
    }

    render(){
        const handleClose = () => this.setState({show: false});
        const handleShow = () => this.setState({show: true});
        return (
        <div>
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
                    <Form.Control>{this.state.playlistName}</Form.Control><br/>
                    <Form.Label>Description</Form.Label><br/>
                    <textarea className = "settings-modal-description">{this.state.playlistDesc}</textarea>
                </Form.Group>
            </Form>

            <center>
              <Button variant="primary" onClick={handleClose}>
                Save
              </Button>

              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>

              <Button variant="danger">
                Delete Playlist
              </Button>
            </center>
            {/* <Modal.Header closeButton>
              <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
              <center>
              <Button variant="primary" onClick={handleClose}>
                Save
              </Button>
              </center>
            </Modal.Footer> */}
          </Modal>
        </div>
      );
    }
}

class PlaylistEditDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            song_notes_open: [],
            //current_song: null, //correct one
            current_song: 2, //temporary for showing
            is_song_playing: false
        }
    }

    componentDidMount() {
        fetch(`/getPlaylistData/${this.props.playlistId}`)
        .then(res => res.json())
        .then(obj => {
            this.setState({data: obj});
            for (var i = 0; i < this.state.data.songs.length; i++) {
                this.state.song_notes_open.push(false);
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

    render() {
        var filler_work_break = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        var filler = "aaaaaa aaaa aaaaaa aaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa aaaaa aaaaa aaaaaaa aaaaaa aaaaa";

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
                                        {/* put playlist-settings class here, in similar view to settingspane in navbar.js */}
                                        <PlaylistSettings playlistName = {this.state.data.name} playlistDesc = {this.state.data.description}/>
                                        {/* <img src={settings_img} height="30px" width="30px" /> */}
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
                                                                <textarea className="song-notes-textarea" id={"song-note-"+i+"-textarea"} value={song.notes} />
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
                    <div className="row" id="row3">
                        <div className="col">
                            <div className="row" id="title-row">
                                <div className="col">
                                    <img id="add-song-icon" src={add_circle_img} height="48px" width="48px" />
                                    <h1>add song</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </NavBarWrapper>
        );
    }
}

export default PlaylistEdit;