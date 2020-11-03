import React from 'react';
import { useParams } from 'react-router';
import { Redirect } from "react-router-dom";
import NavBarWrapper from './NavBarWrapper';
import UserDisplay from './UserDisplay';
import './css/bootstrap.min.css';
import './FollowersPage.css';
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

function FollowersPage() {
    let { username } = useParams();
    return <FollowersPageDisplay username={username}/>
}

class FollowersPageDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            followers: [],
            user: "",
        }
    }

    getFollowers() {
        fetch(`/getFollowers/${this.props.username}`)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);
            if (obj.status == 0) {
                this.setState({followers: obj.result});
            }
            else {
                this.setState({followers: null}); //not found stuff
            }
        })
    }

    componentDidMount() {
        this.setState({user: this.props.username}, () => {
            this.getFollowers();

            for(var i = 0; i < this.state.followers.length; i++) {
                this.state.followers[i].image = require(this.state.followers[i].profile_image_url);
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

            var followersList = this.state.followers.map((user, i) => {
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
                    <div className="container" id="followers-pane">
                        <div className="row" id="row1">
                            <ArrowBackComponent url={returnUrl} />
                            <div className="col" id="followers-header">
                                Followers ({followersList.length})
                            </div>
                        </div>
                        <div className="row" id="row2">
                            <div className="col">
                                <center>
                                {followersList}
                                </center>
                            </div>
                        </div>
                    </div>
                </NavBarWrapper>
            );
        }
    }
}

export default FollowersPage;