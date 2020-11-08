import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import PlaylistDisplay from './PlaylistDisplay';
import './css/bootstrap.min.css';
import './Bookmarks.css';
import bookmark_icon from './images/bookmark-24px.svg';

/*--------------------------------------------------*/
/* TEMPORARY STATIC IMAGE IMPORTS                   */
/*--------------------------------------------------*/
import wolf_img from './images/watermelon-wolf.jpg';
import mountain_img from "./images/mountain.jpg";
import church_img from "./images/disco-church.png";
import noir_img from "./images/noir.jpg";
import leafy_img from "./images/leafy.jpg";
import noir2_img from "./images/noir2.png";
/*--------------------------------------------------*/

class Bookmarks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: []
        }
    }

    getBookmarks = () => {
        fetch('/getBookmarks')
        .then(res => res.json())
        .then(obj => {
            if (obj.status == 0) {
                console.log(obj);
                this.setState({bookmarks: obj.result});
                /*
                for (var i = 0; i < this.state.bookmarks.length; i++) {
                    this.state.bookmarks[i].image = require(this.state.bookmarks[i].image_url);
                    this.state.bookmarks[i].key = "bookmarkedPlaylist" + i;
                }
                */
            }
            else {
                this.setState({data: null}) //need to change the component to have a not found page
            }
        });
    }

    componentDidMount() {
        this.getBookmarks();
    }

    render() {
         /*--------------------------------------------------*/
        /* TEMPORARY STATIC IMAGE IMPORTS                   */
        /*--------------------------------------------------*/
        var staticImages = [
            wolf_img, mountain_img, church_img, noir_img, leafy_img, noir2_img
        ]
        /*--------------------------------------------------*/

        var listofPlaylistDisplays = this.state.bookmarks.map((playlist, i) => {
            //need to figure out how to load image
            //albumCover={playlist.image} 
            return (
                <PlaylistDisplay
                    albumCover={staticImages[i]} 
                    title={playlist.name}
                    author={playlist.author}
                    likes={playlist.likes} 
                    url={playlist.url}
                    image_url={playlist.image_url}
                    key={playlist.key}
                />
            )
        });
        
        
        return (
            <NavBarWrapper>
                <div className="container" id="bookmarks-pane">
                    <div className="row" id="row1">
                        <div className="col" id = "bookmarks-header">
                            <img src={bookmark_icon} width="30px" height="30px" alt="" /> bookmarks
                            {/*   <img src={require('./images/watermelon-wolf.jpg')} alt="" />   */}
                        </div>
                    </div>
                    <div className="row" id="row2">
                        <div className="col">
                            {listofPlaylistDisplays}
                        </div>
                    </div>
                </div>
            </NavBarWrapper>
        )
    }
}

export default Bookmarks;