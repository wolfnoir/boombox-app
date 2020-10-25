import React from 'react';
import NavBarWrapper from './NavBarWrapper';
import PlaylistDisplay from './PlaylistDisplay';
import './css/bootstrap.min.css'
import './Bookmarks.css'
import bookmark_icon from './images/bookmark-24px.svg';

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
            console.log(obj);
            this.setState({bookmarks: obj.bookmarks})
        });
        for (var i = 0; i < this.state.bookmarks.length; i++) {
            this.state.bookmarks[i].image = require(this.state.bookmarks[i].image_url);
            this.state.bookmarks[i].key = "playlist" + i;
        }
    }

    componentDidMount() {
        this.getBookmarks();
    }

    /*
    <PlaylistDisplay
                albumCover = {logo}
                title = "Lorem Ipsum"
                author = "Anonymous"
                likes = "69" />
    */

    render() {
        
        var listofPlaylistDisplays = this.state.bookmarks.map((playlist) => {
            //need to figure out how to load image
            return (
                <PlaylistDisplay
                    albumCover={playlist.image}
                    title={playlist.name}
                    author={playlist.author}
                    likes={playlist.num_likes} 
                    key={playlist.key}
                />
            )
        });
        
        
        return (
            <NavBarWrapper>
                <div className="container" id="bookmarks-pane">
                    <div className="row" id="row1">
                        <div className="col">
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