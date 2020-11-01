const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require('mongodb');
const { assert } = require("console");
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

app.get("/helloworld", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "helloworld.html"));
});

//should be post
app.get("/registerUser", (req, res) => {
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

app.get("/loginUser", (req, res) => {
    //request.session.loggedin = true;
	//request.session.username = "";
	console.log("current user: " + req.cookies.username);
	res.cookie('username', 'test-user');
	console.log('login test-user');
	res.send("login test-user");
});

app.get("/logoutUser", (req, res) => {
	//request.session.destroy();
	var user = req.cookies.username;
	console.log('logout: ' + user);
	res.clearCookie('username');
	res.send("logout " + user);
});

app.post("/editUserSettings", (req, res) => {

});

//is a placeholder, can expand on it later
app.post("/editPlaylist", (req, res) => {
	
});

//should these be get, post, or both?

app.get("/getBookmarks", (req, res) => {
	var data = {
		playlists: [
			{
				name: "joke playlist",
				author: "smithman32",
				num_likes: 32,
				image_url: "./images/watermelon-wolf.jpg",
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
				name: "creeping noir",
				author: "maltesefalcon",
				num_likes: 54,
				image_url: "./images/noir.jpg",
				url: "/playlist/abc"
			},
			{
				name: "dreams of green",
				author: "smithman32",
				num_likes: 765,
				image_url: "./images/leafy.jpg",
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

app.get("/getNewPlaylists", (req, res) => {
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

app.get("/getRecommendedPlaylists", (req, res) => {
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

app.get("/getPlaylistData/:playlistId", (req, res) => {
	const playlistId = req.params.playlistId;
	console.log(playlistId);
	var data = {
		image_url: './images/horse.png',
		name: 'wonderwall 10 hrs',
		author: 'smithman32',
		last_modified: 1600850614000,
		liked_by_user: false,
		bookmarked_by_user: false,
		num_likes: 69,
		tags: ['wonderwall', 'pop', 'why me'],
		description: 'This playlist is for Deborah, who broke my heart. Please take me back.',
		songs: [
			{
				name: 'Wonderwall',
				artist: 'Oasis',
				full_url: 'https://dummy_url.com',
				notes: '',
				length: 259 //Note: How do we get this data?
			},
			{
				name: 'Wonderwall',
				artist: 'Oasis',
				full_url: 'https://dummy_url.com',
				notes: 'Why the obsession with Wonderwall? Well, it\'s because it\'s the only song I know how to play.',
				length: 259 //Note: How do we get this data?
			},
			{
				name: 'Wonderwall',
				artist: 'Oasis',
				full_url: 'https://dummy_url.com',
				notes: '',
				length: 259 //Note: How do we get this data?
			},
			{
				name: 'Wonderwall',
				artist: 'Oasis',
				full_url: 'https://dummy_url.com',
				notes: '',
				length: 259 //Note: How do we get this data?
			}
		],
		comments_enabled: true,
		comments: [
			{
				username: 'wonderwall333',
				content: 'Nice playlist :)',
				time: 1600854605000
			},
			{
				username: 'wonderwall333',
				content: 'Nice playlist :)',
				time: 1600854545000
			}
		]
	}
	res.json(data);
});

// for advanced search just pass with get, e.g.  /getSearchResults/wonderwall?author=smithman32
app.get("/getSearchResults/:query", (req, res) => {
	var query = req.params.query;
	var data = {
		users: [
			{
				username: 'wonderwall333',
				profile_image_url: '/images/luigi time.gif'
			},
			{
				username: 'ilovewonderwall',
				profile_image_url: './images/kermit.png'
			},
			{
				username: 'wonderwall2',
				profile_image_url: './images/raccoon.png'
			}
		],
		playlists: [
			{
				name: "wonderwall 10 hrs",
				author: "smithman32",
				num_likes: 69,
				image_url: "./images/horse.png",
				url: "/playlist/abc"
			}
		],
		tags: [
			'wonderwall', 'oasis', 'alternative', 'rock', 'does anyone actually like wonderwall'
		]
	};
	res.json(data);
});

app.get("/getProfilePageData/:username", (req, res) => {
	const username = req.params.username;
	var data = {
		username: username,
		following: false,
		bio: "Hi, my name is John Smith, and I love making playlists. Deborah, if you're reading this, I'm sorry, and I'm sending you my 10 hour long Wonderwall playlist to make up for it.",
		playlists: [
			{
				name: "joke playlist",
				author: "smithman32",
				num_likes: 32,
				image_url: "./images/watermelon-wolf.jpg",
				url: "/playlist/abc"
			},
			{
				name: "dreams of green",
				author: "smithman32",
				num_likes: 765,
				image_url: "./images/leafy.jpg",
				url: "/playlist/abc"
			},
			{
				name: "wonderwall 10 hrs",
				author: "smithman32",
				num_likes: 69,
				image_url: "./images/horse.png",
				url: "/playlist/abc"
			}
		]
	}
	res.json(data);
});

app.get("/getFollowers/:username", (req, res) => {
	const username = req.params.username;
	var data = {
		users: []
	};
	for (var i = 0; i < 14; i++) {
		data.users.push({
			username: 'wonderwall333',
			profile_image_url: '/images/luigi time.gif'
		});
		data.users.push({
			username: 'ilovewonderwall',
			profile_image_url: './images/kermit.png'
		});
		data.users.push({
			username: 'wonderwall2',
			profile_image_url: './images/raccoon.png'
		});
	}
	res.json(data);
});

app.get("/getFollowing/:username", (req, res) => {
	const username = req.params.username;
	var data = {
		users: []
	};
	for (var i = 0; i < 14; i++) {
		data.users.push({
			username: 'wonderwall333',
			profile_image_url: '/images/luigi time.gif'
		});
		data.users.push({
			username: 'ilovewonderwall',
			profile_image_url: './images/kermit.png'
		});
		data.users.push({
			username: 'wonderwall2',
			profile_image_url: './images/raccoon.png'
		});
	}
	res.json(data);
});

app.get("/getUserPlaylists/:username", (req, res) => {
	const username = req.params.username;
	var data = {
		playlists: [
			{
				name: "joke playlist",
				author: "smithman32",
				num_likes: 32,
				image_url: "./images/watermelon-wolf.jpg",
				url: "/playlist/abc"
			},
			{
				name: "dreams of green",
				author: "smithman32",
				num_likes: 765,
				image_url: "./images/leafy.jpg",
				url: "/playlist/abc"
			},
			{
				name: "wonderwall 10 hrs",
				author: "smithman32",
				num_likes: 69,
				image_url: "./images/horse.png",
				url: "/playlist/abc"
			}
		]
	};
	res.json(data);
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