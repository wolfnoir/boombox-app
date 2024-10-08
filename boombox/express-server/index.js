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

const UserHandler = require('./UserHandler.js');
const TagHandler = require("./TagHandler");
const SearchHandler = require("./SearchHandler");

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const monogDbName = 'boombox';
const mongoUserCollection = 'users';
const mongoPlaylistCollection = 'playlists';
const mongoSongCollection = 'songs';
const mongoTagCollection = 'tags';

/*-----------------------------------------------------
Non-React routes (take priority over React routes)
-------------------------------------------------------*/

// app.all("/helloworld", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "build", "helloworld.html"));
// });

//SHOULD BE POST ONLY
//app.get("/registerUser", UserHandler.registerUserRoute);
app.post("/registerUser", UserHandler.registerUserRoute);

//SHOULD BE POST ONLY
//app.get("/loginUser", UserHandler.loginUserRoute);
app.post("/loginUser", UserHandler.loginUserRoute);


//SHOULD BE POST ONLY
//app.get("/logoutUser", UserHandler.logoutUserRoute);
app.post("/logoutUser", UserHandler.logoutUserRoute);

//SHOULD BE POST ONLY
//app.get("/editUserSettings", UserHandler.editUserSettingsRoute);
app.post("/editUserSettings", UserHandler.editUserSettingsRoute);

app.post("/editUserIcon", UserHandler.editUserIconRoute);

app.post("/getUserIcon", UserHandler.getUserIconDataRoute);

app.get("/testImage", (req, res) => {
	res.sendFile(path.join(__dirname, "add_item.html"));
});
app.post("/testImage", UserHandler.testImage);

app.all("/getBookmarks", UserHandler.getBookmarksRoute);

app.all("/getPlaylistData/:playlistId", PlaylistHandler.getPlaylistRoute);

app.post("/getPlaylistCover", PlaylistHandler.getPlaylistCoverDataRoute);

app.all("/getProfilePageData/:username", UserHandler.getProfilePageDataRoute);

app.all("/getUserSettings/:username", UserHandler.getUserSettingsRoute);

app.all("/getFollowers/:username", UserHandler.getFollowersRoute);

app.all("/getFollowing/:username", UserHandler.getFollowingRoute);

app.all("/getUserPlaylists/:username", UserHandler.getUserPlaylistsRoute);

app.post("/updateFollowers", UserHandler.updateFollowersRoute);

app.post("/checkIfFollowing", UserHandler.checkIfFollowingRoute);

app.post("/getUsername", UserHandler.getUsernameRoute);

app.all("/getUserMatch/:username", UserHandler.getUserMatchRoute);

app.post("/createPlaylist", PlaylistHandler.createPlaylistRoute);

app.post("/deletePlaylist", PlaylistHandler.deletePlaylistRoute);

app.post("/editPlaylistSettings", PlaylistHandler.editPlaylistSettingsRoute);

app.post("/updateLikes", PlaylistHandler.updateLikesRoute);

app.post("/updateBookmarks", PlaylistHandler.updateBookmarksRoute);

app.post("/addComment", PlaylistHandler.addCommentRoute);

app.post("/deleteComment", PlaylistHandler.deleteCommentRoute);

app.post("/addSong", PlaylistHandler.addSong);

app.post("/deleteSong", PlaylistHandler.deleteSong);

app.post("/updateSongs", PlaylistHandler.updateSongsRoute);

app.post("/updateTags", PlaylistHandler.updateTagsRoute);

app.post("/addPlaylistTag", (req, res) => {});

app.post("/deletePlaylistTag", (req, res) => {});

app.post("/getImage", PlaylistHandler.getImage);

app.post("/getNewPlaylists", UserHandler.getNewPlaylistsRoute);

app.all("/getTags", TagHandler.getTagsRoute);

app.all("/getTagResults/:tag", TagHandler.getTagResultsRoute);

app.all("/searchTags/:keyword*", SearchHandler.searchTagsRoute);

app.all("/searchUsers/:keyword*", SearchHandler.searchUsersRoute);

app.all("/searchPlaylists/:keyword*", SearchHandler.searchPlaylistsRoute);

/*
app.all("/getNewPlaylists", (req, res) => {
	var data = {
		playlists: [
			{
				name: "wonderwall 10 hrs",
				author: "smithman32",
				likes: new Array(69),
				image_url: "./images/horse.png",
				url: "/playlist/abc"
			},
			{
				name: "o, my love",
				author: "banishtheknight",
				likes: new Array(23),
				image_url: "./images/mountain.jpg",
				url: "/playlist/abc"
			},
			{
				name: "smallest church in the whole mysterious universe",
				author: "tequilasunset",
				likes: new Array(653),
				image_url: "./images/disco-church.png",
				url: "/playlist/abc"
			},
			{
				name: "searching for you",
				author: "sidneyfalco",
				likes: new Array(43),
				image_url: "./images/noir2.png",
				url: "/playlist/abc"
			}
		]
	};
	res.json(data);
});
*/

app.all("/getRecommendedPlaylists", UserHandler.getRecommendedPlaylistsRoute);

/*
app.all("/getRecommendedPlaylists", (req, res) => {
	var data = {
		playlists: [
			{
				name: "dreams of green",
				author: "smithman32",
				likes: new Array(765),
				image_url: null, //"./images/leafy.jpg",
				url: "/playlist/abc"
			},
			{
				name: "creeping noir",
				author: "maltesefalcon",
				likes: new Array(54),
				image_url: null, //"./images/noir.jpg",
				url: "/playlist/abc"
			}
		],
		music_match: 57,
		num_following: 23,
		num_followers: 45
	}; 
	res.json(data);
});
*/

/*----------------------------- ------------------------
React routes
-------------------------------------------------------*/
app.all("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`App runnning on port ${ PORT }`);
})