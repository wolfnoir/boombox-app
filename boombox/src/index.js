import React from 'react';
import ReactDOM from 'react-dom';

import Cookie from 'universal-cookie';
import { Redirect } from 'react-router';
import { Route,  Switch, BrowserRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import './css/bootstrap.min.css';
import './index.css';

import NavBarWrapper from './NavBarWrapper';
import NavBarTest from './NavBarTest';
import RelayInfo from './RelayInfo';

import Bookmarks from './Bookmarks';
import Dashboard from './Dashboard';
import Login from './Login';
import PlaylistPage from './PlaylistPage';
import Register from './Register';
import SettingsPane from './SettingsPane';
<<<<<<< HEAD
import FollowersPage from './FollowersPage';
import FollowingPage from './FollowingPage';
=======
import UserProfile from './UserProfile';
>>>>>>> d3d54113e61d71b79b61cb6dc39306ed911e6247

class MyRouter extends React.Component {
	constructor(props) {
		super(props);
		this.cookie = new Cookie();
		this.state = {loggedIn : this.cookie.get('username')};
	}

    render() {
		return (
			<div>
				<Switch>
					<Route exact path="/" component={Dashboard} />
					<Route path="/testnav" component={NavBarWrapper} />
					<Route path="/login" component={Login} />
					<Route path="/my-bookmarks">
						{this.state.loggedIn ? <Bookmarks /> : <Redirect to="/" />}
					</Route>
					<Route path="/register" component={Register} />
					<Route path="/navbar-test" component={NavBarTest} />
					<Route path="/relay-info/:info" component={RelayInfo} />
					<Route 
						path="/settings-test" 
						render={(props) => (
							<SettingsPane profile_image="" />
						)}
					/>	
					<Route path="/playlist/:playlistId" component={PlaylistPage} />
					<Route path="/followers/:username" component={FollowersPage} />
					<Route path="/following/:username" component={FollowingPage} />
					<Route path="/user/:username" component={UserProfile} />
				</Switch>
			</div>
	    );
    }
}

ReactDOM.render(
	<BrowserRouter>
	<MyRouter />
	</BrowserRouter>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
