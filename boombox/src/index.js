import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SettingsPane from './SettingsPane';
import NavBarTest from './NavBarTest';
import * as serviceWorker from './serviceWorker';
import { Route,  Switch, BrowserRouter} from 'react-router-dom';
import PlaylistTest from './PlaylistTest';
import Login from './Login';
import './css/bootstrap.min.css';
import NavBarWrapper from './NavBarWrapper';
import Bookmarks from './Bookmarks';
import RelayInfo from './RelayInfo';

/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/

/*
<Switch>
		<div>
		<Switch>
		<Route exact path="/" component={App} />
		<Route path="/testnav" component={NavBarWrapper} />
		<Route path="/playlist-test" component={PlaylistTest} />
		<Route path="/login" component={Login} />
		<Route path="/my-bookmarks" component={Bookmarks} />
		<Route path="/navbar-test" component={NavBarTest} />
		<Route 
			path="/settings-test" 
			render={(props) => (
				<SettingsPane profile_image="" />
			)}
		/>
		</Switch>
		</div>
		</Switch>
*/

class MyRouter extends React.Component {
    render() {
	return (
		<div>
			<Switch>
				<Route exact path="/" component={App} />
				<Route path="/testnav" component={NavBarWrapper} />
				<Route path="/playlist-test" component={PlaylistTest} />
				<Route path="/login" component={Login} />
				<Route path="/my-bookmarks" component={Bookmarks} />
				{/* <Route path="/register" component={Register} /> */}
				<Route path="/navbar-test" component={NavBarTest} />
				<Route path="/relay-info/:info" component={RelayInfo} />
				<Route 
					path="/settings-test" 
					render={(props) => (
						<SettingsPane profile_image="" />
					)}
				/>	
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
