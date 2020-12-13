import React from 'react';
import ReactDOM from 'react-dom';

import Cookie from 'universal-cookie';
import { Redirect } from 'react-router';
import { Route,  Switch, BrowserRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import './css/bootstrap.min.css';
import './index.css';

import NavBarWrapper from './NavBarWrapper';
import RelayInfo from './RelayInfo';

import Bookmarks from './Bookmarks';
import Dashboard from './Dashboard';
import Login from './Login';
import PlaylistEdit from './PlaylistEdit';
import PlaylistPage from './PlaylistPage';
import Register from './Register';
import SearchResults from './SearchResults';
import TagResults from './TagResults';
import SettingsPane from './SettingsPane';
import FollowersPage from './FollowersPage';
import FollowingPage from './FollowingPage';
import UserProfile from './UserProfile';
import PageNotFound from './PageNotFound';
import RegisterSuccess from './RegisterSuccess';

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
					<Route path="/registersuccess" component={RegisterSuccess} />
					<Route path="/relay-info/:info" component={RelayInfo} />
					<Route 
						path="/settings-test" 
						render={(props) => (
							<SettingsPane profile_image="" />
						)}
					/>	
					<Route path="/playlist/:playlistId/edit" component={PlaylistEdit} /> {/* add something here or in the class to only allow access is user is creator of playlist*/}
					<Route path="/playlist/:playlistId" component={PlaylistPage} />
					<Route path="/user/:username/followers" component={FollowersPage} />
					<Route path="/user/:username/following" component={FollowingPage} />
					<Route path="/user/:username" component={UserProfile} />
					<Route path="/search/*" component={SearchResults} />
					<Route path="/tag/:tag" component={TagResults} />
					<Route path="/error" component={PageNotFound} />
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
