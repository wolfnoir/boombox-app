import React from 'react';
import { useParams } from 'react-router';
import { Redirect } from "react-router-dom";
import NavBarWrapper from './NavBarWrapper';
import UserDisplay from './UserDisplay';
import './css/bootstrap.min.css';
import './FollowingPage.css';
import arrow_back_img from './images/arrow_back-24px.svg';

/*--------------------------------------------------*/
/* TEMPORARY STATIC IMAGE IMPORTS                   */
/*--------------------------------------------------*/
import wolf_img from './images/watermelon-wolf.jpg';
import mountain_img from "./images/mountain.jpg";
import church_img from "./images/disco-church.png";
/*--------------------------------------------------*/

class ArrowBackComponent extends React.Component {
    render() {
        return (
            <a href={this.props.url}>
                <img id="back-arrow" src={arrow_back_img} height="50px" width="50px" alt="Return to Profile"/>
            </a>
        );
    }
}

function FollowingPage() {
    let { username } = useParams();
    return <FollowingPageDisplay username={username}/>
}

class FollowingPageDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            following: [],
            user: "",
        }
    }

    getFollowingUsers() {
        fetch(`/getFollowing/${this.props.username}`)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            if (obj.status == 0) {
                this.setState({following: obj.result});
            }
            else {
                this.setState({following: null}); //not found stuff do
            }
        })
    }

    componentDidMount() {
        const{ username } = this.props.username;

        this.setState({user: username}, () => {
            this.getFollowingUsers();

            for(var i = 0; i < this.state.following.length; i++) {
                this.state.following[i].image = require(this.state.following[i].profile_image_url);
            }
        });
    }

    render() {
        if(this.state.data == null) {
            return <Redirect to="/404" />
        }
        else {
            /*--------------------------------------------------*/
            /* TEMPORARY STATIC IMAGE IMPORTS                   */
            /*--------------------------------------------------*/
            var staticImages = [wolf_img, mountain_img, church_img];
            /*--------------------------------------------------*/

            var returnUrl = "/user/" + this.state.user;

            var followingList = this.state.following.map((user, i) => {
                return (
                    <UserDisplay 
                        //picture = {user.image}
                        picture = {staticImages[i % 3]}
                        username = {user.username}
                    />
                )
            });

            //@todo need to pass in back_url as prop from user profile
            return(
                <NavBarWrapper>
                    <div className="container" id="following-pane">
                        <div className="row" id="row1">
                            <ArrowBackComponent url={returnUrl} />
                            <div className="col" id="following-header">
                                Following ({followingList.length})
                            </div>
                        </div>
                        <div className="row" id="row2">
                            <div className="col">
                                <center>
                                {followingList}
                                </center>
                            </div>
                        </div>
                    </div>
                </NavBarWrapper>
            );
        }
    }
}

export default FollowingPage;