import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SettingsPane from './SettingsPane';
import NavBarTest from './NavBarTest';
import * as serviceWorker from './serviceWorker';
import { Route,  Switch, BrowserRouter} from 'react-router-dom';
import PlaylistTest from './PlaylistTest';

/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/

class MyRouter extends React.Component {
    render() {
	return (<Switch>
		<div>
		<Switch>
		<Route exact path="/" component={App} />
		<Route path="/navbar-test" component={NavBarTest} />
		<Route path="/playlist-test" component={PlaylistTest} />
		<Route 
			path="/settings-test" 
			render={(props) => (
				<SettingsPane profile_image="" />
			)}
		/>
		</Switch>
		</div>
		</Switch>
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
