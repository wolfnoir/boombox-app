const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
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

/*-----------------------------------------------------
Non-React routes (take priority over React routes)
-------------------------------------------------------*/

app.get("/helloworld", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "helloworld.html"));
});

app.post("/loginUser", (req, res) => {
    //request.session.loggedin = true;
    //request.session.username = "";
});

app.post("/logoutUser", (req, res) => {
    //request.session.destroy();
});

app.post("/editUsername", (req, res) => {
	
});

app.post("/editPassword", (req, res) => {
	
});

app.post("/editProfileImage", (req, res) => {
	
});

app.post("/editEmail", (req, res) => {
	
});

app.post("/editBio", (req, res) => {
	
});

//is a placeholder, can expand on it later
app.post("/editPlaylist", (req, res) => {
	
});




//should these be get, post, or both?

app.get("/getBookmarks", (req, res) => {
	return {'bookmarks': [{}, {}, {}]};
});

app.get("/getFollowingNewPlaylists", (req, res) => {
	return {}
});

app.get("/getRecommendedPlaylists", (req, res) => {
	return {}
});

app.get("/getPlaylist/:playlistId", (req, res) => {
	//req.params.playlistId
	return {}
});

app.get("/getSearchResults", (req, res) => {
	return {}
});

app.get("/getProfilePageData", (req, res) => {
	return {}
});

app.get("/getFollowers", (req, res) => {
	return {}
});

app.get("/getFollowing", (req, res) => {
	return {}
});

app.get("/getUserPlaylists", (req, res) => {
	return {}
});







/*----------------------------- ------------------------
React routes
-------------------------------------------------------*/
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});



// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});