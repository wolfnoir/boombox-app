const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require('mongodb');
const { assert } = require("console");
const PlaylistHandler = require("./PlaylistHandler");
const app = express(); // create express app

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use(session({
	secret: 'sdh78g873huriniw',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const monogDbName = 'boombox';
const mongoUserCollection = 'users';
const mongoPlaylistCollection = 'playlists';
const mongoSongCollection = 'songs';
const mongoTagCollection = 'tags';

/*-----------------------------------------------------
Non-React routes (take priority over React routes)
-------------------------------------------------------*/

app.all("/helloworld", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "helloworld.html"));
});

//should be post
app.post("/registerUser", (req, res) => {
	MongoClient.connect(mongoUrl, {useNewUrlParser: true}, (error, client) => {
		if (error) throw error;
		const collection = client.db(monogDbName).collection(mongoUserCollection);
		// perform actions on the collection object
		collection.insertOne({
			id: 0,
			username: 'test-user',
			password: 'tfyydfwuefciuw',
			email: 'test@test.com',
			salt: '37tgde7ergcue3b2i3',
			followers: [],
			followees: []
		});
		client.close();
	});
	res.send("hello");
});

app.all("/loginUser", (req, res) => {
    //request.session.loggedin = true;
	//request.session.username = "";
	console.log("current user: " + req.cookies.username);
	res.cookie('username', 'test-user');
	console.log('login test-user');
	res.send("login test-user");
});

app.all("/logoutUser", (req, res) => {
	//request.session.destroy();
	var user = req.cookies.username;
	console.log('logout: ' + user);
	res.clearCookie('username');
	res.send("logout " + user);
});

app.post("/editUserSettings", (req, res) => {});

app.all("/getBookmarks", (req, res) => {});

app.all("/getPlaylistData/:playlistId", (req, res) => {});

app.all("/getProfilePageData/:username", (req, res) => {});

app.all("/getFollowers/:username", (req, res) => {});

app.all("/getFollowing/:username", (req, res) => {});

app.all("/getUserPlaylists/:username", (req, res) => {});

app.post("/createPlaylist", PlaylistHandler.createPlaylistRoute);

//is a placeholder, can expand on it later
app.post("/editPlaylist", PlaylistHandler.editPlaylistRoute);

app.all("/getNewPlaylists", (req, res) => {
	var data = {
		playlists: [
			{
				name: "wonderwall 10 hrs",
				author: "smithman32",
				num_likes: 69,
				image_url: "./images/horse.png",
				url: "/playlist/abc"
			},
			{
				name: "o, my love",
				author: "banishtheknight",
				num_likes: 23,
				image_url: "./images/mountain.jpg",
				url: "/playlist/abc"
			},
			{
				name: "smallest church in the whole mysterious universe",
				author: "tequilasunset",
				num_likes: 653,
				image_url: "./images/disco-church.png",
				url: "/playlist/abc"
			},
			{
				name: "searching for you",
				author: "sidneyfalco",
				num_likes: 43,
				image_url: "./images/noir2.png",
				url: "/playlist/abc"
			}
		]
	};
	res.json(data);
});

app.all("/getRecommendedPlaylists", (req, res) => {
	var data = {
		playlists: [
			{
				name: "dreams of green",
				author: "smithman32",
				num_likes: 765,
				image_url: "./images/leafy.jpg",
				url: "/playlist/abc"
			},
			{
				name: "creeping noir",
				author: "maltesefalcon",
				num_likes: 54,
				image_url: "./images/noir.jpg",
				url: "/playlist/abc"
			}
		],
		music_match: 57,
		num_following: 23,
		num_followers: 45
	}; 
	res.json(data);
});


/*----------------------------- ------------------------
React routes
-------------------------------------------------------*/
app.all("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});