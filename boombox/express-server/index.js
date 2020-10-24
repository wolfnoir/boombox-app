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
	res.json({'bookmarks': [{}, {}, {}, {}]});
	//res.json(["a", "b", "c"]);
	//res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.get("/getFollowingNewPlaylists", (req, res) => {
	res.json({})
});

app.get("/getRecommendedPlaylists", (req, res) => {
	res.json({})
});

app.get("/getPlaylist/:playlistId", (req, res) => {
	//req.params.playlistId
	res.json({})
});

app.get("/getSearchResults", (req, res) => {
	res.json({})
});

app.get("/getProfilePageData", (req, res) => {
	res.json({})
});

app.get("/getFollowers", (req, res) => {
	res.json({})
});

app.get("/getFollowing", (req, res) => {
	res.json({})
});

app.get("/getUserPlaylists", (req, res) => {
	res.json({})
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