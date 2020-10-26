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
import UserProfile from './UserProfile';
=======
import FollowersPage from './FollowersPage';
import FollowingPage from './FollowingPage';
>>>>>>> c9c30165089232ea5c65cbf323834c4144fe5e9d

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
<<<<<<< HEAD
					<Route path="/user/:username" component={UserProfile} />
=======
					<Route path="/user/:username" component={RelayInfo} />
					<Route path="/followers/:username" component={FollowersPage} />
					<Route path="/following/:username" component={FollowingPage} />
>>>>>>> c9c30165089232ea5c65cbf323834c4144fe5e9d
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
