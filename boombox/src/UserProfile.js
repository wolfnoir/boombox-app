import React from 'react';
import { useParams } from 'react-router';
import { Redirect } from "react-router-dom";
import NavBarWrapper from './NavBarWrapper';
import PlaylistDisplay from './PlaylistDisplay';
import './css/bootstrap.min.css';
import './UserProfile.css';
import profile_icon from './images/account_circle-24px.svg';
import { render } from '@testing-library/react';

/*--------------------------------------------------*/
/* TEMPORARY STATIC IMAGE IMPORTS                   */
/*--------------------------------------------------*/
import wolf_img from './images/watermelon-wolf.jpg';
import horse_img from './images/horse.png';
import leafy_img from "./images/leafy.jpg";
/*--------------------------------------------------*/

function UserProfile() {
    let { username } = useParams();
    console.log(username);
    return <UserProfileDisplay username = {username} />
}

class UserProfileDisplay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: {},
            userPlaylists: [],
            following: {},
            followers: {},
        }
    }

    getProfileImage = () => {
        if (this.props.profile_image) {
            return <img id="profile-image" src={this.props.profile_image} width="150px" height="150px" alt=""/>
        }
        return <img id="profile-image" src={profile_icon} width="150px" height="150px" style={{filter: 'invert(1)'}} alt=""/>
    }

    getUserData(){
        fetch(`/getProfilePageData/${this.props.username}`)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            if (obj.status == 0) {
                this.setState({data: obj.result});
            }
            else {
                this.setState({data: null}); //do stuff for showing not found
            }
        });
    }

    getUserPlaylists(){
        fetch(`/getProfilePageData/${this.props.username}`)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            this.setState({userPlaylists: obj.playlists});
        });
        for (var i = 0; i < this.state.userPlaylists.length; i++) {
            this.state.userPlaylists[i].image = require(this.state.userPlaylists[i].image_url);
            this.state.userPlaylists[i].key = "userPlaylist" + i;
        }
    }

    getUserFollowing(){
        fetch(`/getFollowing/${this.props.username}`)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            this.setState({following: obj.users});
        })
    }

    getUserFollowers(){
        fetch(`/getFollowers/${this.props.username}`)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            this.setState({followers: obj.users});
        })
    }

    componentDidMount(){
        this.getUserData();
        //this.getUserPlaylists();
        //this.getUserFollowers();
        //this.getUserFollowing();
    }

    render(){
        if(this.state.data == null) {
            return <Redirect to="/404" />
        }
        else{
            /*--------------------------------------------------*/
            /* TEMPORARY STATIC IMAGE IMPORTS                   */
            /*--------------------------------------------------*/
            var staticImages = [
                wolf_img, leafy_img, horse_img
            ]
            /*--------------------------------------------------*/
            var listOfUserPlaylists = this.state.userPlaylists.map((playlist, i) => {
                //need to figure out how to load image
                //albumCover={playlist.image} 
                return (
                    <PlaylistDisplay
                        albumCover={staticImages[i]} 
                        title={playlist.name}
                        author={playlist.author}
                        likes={playlist.num_likes} 
                        url={playlist.url}
                        key={playlist.key}
                    />
                )
            });

            return(
                <NavBarWrapper>
                <div className = "user-profile">
                    <table className = "user-profile-header">
                        <tbody>
                            <tr>
                                <td>
                                <div className = "user-profile-img">
                                    {this.getProfileImage()}
                                </div>
                                </td>

                                <td className = "user-profile-info">
                                    <div className = "user-profile-header-text username">
                                        {this.state.data.username}
                                    </div>

                                    <div className = "btn btn-primary follow-button hoverable" /*onClick = {  toggle following in here }*/>
                                        {this.state.data.isFollowing ? "Unfollow" : "Follow"}
                                    </div>

                                    <div className = "user-profile-description">
                                        {this.state.data.bio}
                                    </div>
                                </td>

                                <td className = "user-profile-match-followers">
                                    <div className = "user-profile-header-text match-followers">
                                        Music Match<br/>
                                        53%
                                    </div>

                                    <a className = "user-profile-header-text match-followers followers-link" href = {"/user/" + this.state.data.username + "/following/"}>
                                        Following<br/>
                                        {this.state.data.following ? this.state.data.following.length : 0}
                                    </a>

                                    <a className = "user-profile-header-text match-followers followers-link" href = {"/user/" + this.state.data.username + "/followers"}>
                                        Followers<br/>
                                        {this.state.data.followers ? this.state.data.followers.length : 0}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    

                    <div className = "user-playlists">
                        <div className = "user-profile-header-text my-playlists">
                            My Playlists
                        </div><br/>
                        {listOfUserPlaylists}
                    </div>
                    
                </div>
                </NavBarWrapper>
            );
        }
    }

}

export default UserProfile;