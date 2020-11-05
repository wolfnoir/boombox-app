const { ObjectID, ObjectId } = require("mongodb");
const MongoClient = require('mongodb');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const mongoDbName = 'boombox';
const mongoPlaylistCollection = 'playlists';


// PLAYLIST TEMPLATE
// {
//     com_enabled: true,
//     comments: [],
//     description: "",
//     image_url: null,
//     last_modified: 1604544250,
//     likes: [],
//     name: "",
//     tags: [],
//     user_id: ObjectId(""),
//     songs: [
//         {
//              index: 0,
//              artist: "",
//              album: "",
//              name: "",
//              note: "",
//              url: "",
//              url_type: youtube
//          },
//     ]
// }

class TestPlaylists {
    static async pushTestPlaylists(){
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,  
            useUnifiedTopology: true
        }).catch(err => {
            console.log(err);
            return {status: -1};
        });

        if (!client) {
            console.log("Client is null");
            return {status: -1};
        }

        try {
            const collection = client.db(mongoDbName).collection(mongoPlaylistCollection);
            const youtube = "youtube.com/watch?v=";
            // perform actions on the collection object
            await collection.insertMany([
                {
                    com_enabled: true,
                    comments: [],
                    description: "This is a playlist description. Lorem ispum blah blah bacon cheese and crackers.",
                    image_url: null,
                    isPrivate: false,
                    last_modified: 1604288237,
                    likes: 0,
                    name: "Best of Oingo Boingo",
                    tags: ["new wave", "ska", "pop", "rock"],
                    user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
                    songs: [
                        {
                            index: 0,
                            album: "Dead Man's Party",
                            artist: "Oingo Boingo",
                            name: "Dead Man's Party",
                            note: "This song is great!",
                            url: "iypUpv9xelg",
                            url_type: youtube
                        },
                        {
                            index: 1,
                            album: "Dead Man's Party",
                            artist: "Oingo Boingo",
                            name: "Weird Science",
                            note: "This song is also pretty great.",
                            url: "Jm-upHSP9KU",
                            url_type: youtube
                        },
                        {
                            index: 2,
                            album: "Dead Man's Party",
                            artist: "Oingo Boingo",
                            name: "Just Another Day",
                            note: "This song isn't that great...just kidding, it is!",
                            url: "EJGykmmBjP4",
                            url_type: youtube
                        },
                        {
                            index: 3,
                            album: "Dead Man's Party",
                            artist: "Oingo Boingo",
                            name: "No One Lives Forever",
                            note: "Isn't this just groovy?",
                            url: "6gyF_5GBMj0",
                            url_type: youtube
                        },
                    ]
                },
                {
                    com_enabled: true,
                    comments: [],
                    description: "This is just a test.",
                    image_url: null,
                    isPrivate: false,
                    last_modified: 1604288237,
                    likes: 0,
                    name: "Everywhere at the End of Time",
                    tags: ["ambient"],
                    user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
                    songs: [
                        {
                            index: 0,
                            album: "Everywhere at the End of Time",
                            artist: "The Caretaker",
                            name: "It's just a burning memory",
                            note: "............... :-)",
                            url: "SKBlaMbx0Qo",
                            url_type: youtube
                        },
                        {
                            index: 1,
                            album: "The Best of Al Bowlly",
                            artist: "Al Bowlly",
                            name: "Heartaches",
                            note: "",
                            url: "S652aa_kXjY",
                            url_type: youtube
                        }
                    ]
                },
                {
                    com_enabled: false,
                    comments: [],
                    description: "The comments are not enabled on this playlist--at least, they shouldn't be. Also, none of these songs have notes.",
                    image_url: null,
                    isPrivate: false,
                    last_modified: 1604288237,
                    likes: 0,
                    name: "Chill Tunes",
                    tags: ["lo-fi", "video game", "soundtrack", "vocal"],
                    user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
                    songs: [
                        {
                            index: 0,
                            album: "Transistor (Original Soundtrack)",
                            artist: "Darren Korb",
                            name: "The Spine",
                            note: "",
                            url: "41tIUr_ex3g",
                            url_type: youtube
                        },
                        {
                            index: 1,
                            album: "",
                            artist: "cadmio",
                            name: "train of thought",
                            note: "",
                            url: "bziESwuEqdI",
                            url_type: youtube
                        },
                        {
                            index: 2,
                            album: "Bastion (Original Soundtrack)",
                            artist: "Darren Korb",
                            name: "Build That Wall (Zia's Theme)",
                            note: "",
                            url: "o3SZee4YZX8",
                            url_type: youtube
                        },
                        {
                            index: 3,
                            album: "Transistor (Original Soundtrack)",
                            artist: "Darren Korb",
                            name: "Sandbox",
                            note: "",
                            url: "Bvf5F7UfQ3c",
                            url_type: youtube
                        },
                    ]
                },
                {
                    com_enabled: true,
                    comments: [],
                    description: "I like pizza.",
                    image_url: null,
                    isPrivate: false,
                    last_modified: 1604544250,
                    likes: [],
                    name: "The Pizza Show",
                    tags: [],
                    user_id: ObjectId("5fa214cccc05e350b4f849d4"),
                    songs: [
                        {
                            index: 0,
                            artist: "",
                            name: "Brooklyn is Pizza Heaven",
                            album: "",
                            note: "BROOKLYN REPRESENT",
                            url: "mH7vFc0bUpU",
                            url_type: youtube
                        },
                        {
                            index: 1,
                            artist: "",
                            name: "Is New Haven Pizza Better Than New York Pizza?",
                            album: "",
                            note: "hint: its not",
                            url: "BmiQRvib3DQ",
                            url_type: youtube
                        },
                        {
                            index: 2,
                            artist: "",
                            name: "The Pizza Show: From Deep Dish to Thin Crust",
                            album: "",
                            note: "i hate deep dish pizza with my life!!!!!!",
                            url: "Z0xDAUXPc8c",
                            url_type: youtube
                        },
                        {
                            index: 3,
                            artist: "",
                            name: "The Pizza Show: Special Slice",
                            album: "",
                            note: "",
                            url: "xQXYWxZCPqA",
                            url_type: youtube
                        },
                        {
                            index: 4,
                            artist: "",
                            name: "The Original New York Slice: The Pizza Show",
                            album: "",
                            note: "",
                            url: "8pCMoL_b_s",
                            url_type: youtube
                        },
                        {
                            index: 5,
                            artist: "",
                            name: "Business of Pizza : Pizza Robots",
                            album: "",
                            note: "i wish i had a pizza robot :^(",
                            url: "ZZzFoi_fuF4",
                            url_type: youtube
                        },
                    ]
                },
                {
                    com_enabled: true,
                    comments: [],
                    description: "> You have one (1) new message.",
                    image_url: null,
                    isPrivate: false,
                    last_modified: 1604544250,
                    likes: [],
                    name: "1-800-HOTLINE",
                    tags: ["ambient", "video game", "soundtrack", "electronic"],
                    user_id: ObjectId("5fa214cccc05e350b4f849d4"),
                    songs: [
                        {
                            index: 0,
                            artist: "scntfc",
                            album: "Oxenfree (Original Soundtrack)",
                            name: "Lost (Prologue)",
                            note: "I originally made this playlist as an accompanying 'soundtrack' to a game I was helping run at the time.",
                            url: "30Z9p-2q0Vs",
                            url_type: youtube
                        },
                        {
                            index: 1,
                            artist: "Ben Prunty",
                            album: "The Darkside Detective (Original Soundtrack)",
                            name: "The Lord Speaks Through Me, Brosef",
                            note: "It's got a John Carpenter feel for it, doesn't it?",
                            url: "9CL-zaVQgQY",
                            url_type: youtube
                        },
                        {
                            index: 2,
                            artist: "Coconuts",
                            album: "Coconuts",
                            name: "Silver Lights",
                            note: "Now this is actually part of the Hotline Miami soundtrack.",
                            url: "CcMz3aAZDv4",
                            url_type: youtube
                        },
                        {
                            index: 3,
                            artist: "Ben Prunty",
                            album: "The Darkside Detective (Original Soundtrack)",
                            name: "Super Biblical",
                            note: "I like Ben Prunty's music. I like his work in FtL, too.",
                            url: "Q7m7QFglQn8",
                            url_type: youtube
                        },
                        {
                            index: 4,
                            artist: "Scattle",
                            album: "Hotline Miami (Original Soundtrack)",
                            name: "Flatline",
                            note: "",
                            url: "jYjB-DKDrbs",
                            url_type: youtube
                        },
                        {
                            index: 5,
                            artist: "scntfc",
                            album: "Oxenfree (Original Soundtrack)",
                            name: "The Beach, 7am",
                            note: "This playlist was originally supposed to be much longer....",
                            url: "Q7m7QFglQn8",
                            url_type: youtube
                        },
                    ]
                },
                {
                    com_enabled: true,
                    comments: [],
                    description: "Sorry for liking electroswing.",
                    image_url: null,
                    isPrivate: false,
                    last_modified: 1604594060,
                    likes: [],
                    name: "My Electroswing Playlist",
                    tags: ["electroswing", "swing", "electronic"],
                    user_id: ObjectId("5fa218377738ce1204549971"),
                    songs: [
                        {
                             index: 0,
                             artist: "Caravan Palace",
                             album: "Panic",
                             name: "Rock It For Me",
                             note: "I absolutely love the music video of this!",
                             url: "fBGSJ3sbivI",
                             url_type: youtube
                        },
                        {
                            index: 1,
                            artist: "Caravan Palace",
                            album: "<|°_°|>",
                            name: "Lone Digger",
                            note: "This music video...sparked an entire furry movement.",
                            url: "UbQgXeY_zi4",
                            url_type: youtube
                        },
                        {
                            index: 2,
                            artist: "Parov Stelar",
                            album: "The Paris Swing Box",
                            name: "Booty Swing",
                            note: "",
                            url: "Eco4z98nIQY",
                            url_type: youtube
                        },
                        {
                            index: 3,
                            artist: "Caravan Palace",
                            album: "<|°_°|>",
                            name: "Wonderland",
                            note: "",
                            url: "vCXsRoyFRQE",
                            url_type: youtube
                        },
                        {
                            index: 4,
                            artist: "Caravan Palace",
                            album: "Chronologic",
                            name: "Waterguns (feat. Tom Bailey)",
                            note: "",
                            url: "cpsJw26b3dM",
                            url_type: youtube
                        },
                    ]
                }
            ]);
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }
        finally {
            client.close();
        }
    }
}

TestPlaylists.pushTestPlaylists();