const { ObjectID, ObjectId } = require("mongodb");
const MongoClient = require('mongodb');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const monogDbName = 'boombox';
const mongoPlaylistCollection = 'playlists';

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
            //err handle here
        }

        try {
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const youtube = "youtube.com/watch?v=";
            // perform actions on the collection object
            collection.insertMany([
                {
                    com_enabled: true,
                    comments: [],
                    description: "This is a playlist description. Lorem ispum blah blah bacon cheese and crackers.",
                    image_url: null,
                    last_modified: 1604288237,
                    likes: 0,
                    name: "Best of Oingo Boingo",
                    tags: ["new wave", "ska", "pop", "rock"],
                    user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
                    songs: [
                        {
                            artist: "Oingo Boingo",
                            name: "Dead Man's Party",
                            note: "This song is great!",
                            url: "iypUpv9xelg",
                            url_type: youtube
                        },
                        {
                            artist: "Oingo Boingo",
                            name: "Weird Science",
                            note: "This song is also pretty great.",
                            url: "Jm-upHSP9KU",
                            url_type: youtube
                        },
                        {
                            artist: "Oingo Boingo",
                            name: "Just Another Day",
                            note: "This song isn't that great...just kidding, it is!",
                            url: "EJGykmmBjP4",
                            url_type: youtube
                        },
                        {
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
                    last_modified: 1604288237,
                    likes: 0,
                    name: "Everywhere at the End of Time",
                    tags: ["ambient"],
                    user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
                    songs: [
                        {
                            artist: "The Caretaker",
                            name: "It's just a burning memory",
                            note: "............... :-)",
                            url: "SKBlaMbx0Qo",
                            url_type: youtube
                        },
                        {
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
                    last_modified: 1604288237,
                    likes: 0,
                    name: "Chill Tunes",
                    tags: ["lo-fi", "video game", "soundtrack", "vocal"],
                    user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
                    songs: [
                        {
                            artist: "Transistor Original Soundtrack",
                            name: "The Spine",
                            note: "",
                            url: "41tIUr_ex3g",
                            url_type: youtube
                        },
                        {
                            artist: "cadmio",
                            name: "train of thought",
                            note: "",
                            url: "bziESwuEqdI",
                            url_type: youtube
                        },
                        {
                            artist: "Bastion Original Soundtrack",
                            name: "Build That Wall (Zia's Theme)",
                            note: "",
                            url: "o3SZee4YZX8",
                            url_type: youtube
                        },
                        {
                            artist: "Transistor Original Soundtrack",
                            name: "Sandbox",
                            note: "",
                            url: "Bvf5F7UfQ3c",
                            url_type: youtube
                        },
                    ]
                }
            ]);
        }
        catch (err) {
            console.log(err);
            //err handle here
        }
        finally {
            client.close();
        }
    }
}

module.exports = TestPlaylists;
// MongoClient.connect(mongoUrl, {useNewUrlParser: true}, (error, client) => {
//     if (error) throw error;
//     const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
//     const youtube = "youtube.com/watch?v=";
//     // perform actions on the collection object
//     collection.insertMany([
//         {
//             com_enabled: true,
//             comments: [],
//             description: "This is a playlist description. Lorem ispum blah blah bacon cheese and crackers.",
//             image_url: null,
//             last_modified: 1604288237,
//             likes: 0,
//             name: "Best of Oingo Boingo",
//             tags: ["new wave", "ska", "pop", "rock"],
//             user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
//             songs: [
//                 {
//                     artist: "Oingo Boingo",
//                     name: "Dead Man's Party",
//                     note: "This song is great!",
//                     url: "iypUpv9xelg",
//                     url_type: youtube
//                 },
//                 {
//                     artist: "Oingo Boingo",
//                     name: "Weird Science",
//                     note: "This song is also pretty great.",
//                     url: "Jm-upHSP9KU",
//                     url_type: youtube
//                 },
//                 {
//                     artist: "Oingo Boingo",
//                     name: "Just Another Day",
//                     note: "This song isn't that great...just kidding, it is!",
//                     url: "EJGykmmBjP4",
//                     url_type: youtube
//                 },
//                 {
//                     artist: "Oingo Boingo",
//                     name: "No One Lives Forever",
//                     note: "Isn't this just groovy?",
//                     url: "6gyF_5GBMj0",
//                     url_type: youtube
//                 },
//             ]
//         },
//         {
//             com_enabled: true,
//             comments: [],
//             description: "This is just a test.",
//             image_url: null,
//             last_modified: 1604288237,
//             likes: 0,
//             name: "Everywhere at the End of Time",
//             tags: ["ambient"],
//             user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
//             songs: [
//                 {
//                     artist: "The Caretaker",
//                     name: "It's just a burning memory",
//                     note: "............... :-)",
//                     url: "SKBlaMbx0Qo",
//                     url_type: youtube
//                 },
//                 {
//                     artist: "Al Bowlly",
//                     name: "Heartaches",
//                     note: "",
//                     url: "S652aa_kXjY",
//                     url_type: youtube
//                 }
//             ]
//         },
//         {
//             com_enabled: false,
//             comments: [],
//             description: "The comments are not enabled on this playlist--at least, they shouldn't be. Also, none of these songs have notes.",
//             image_url: null,
//             last_modified: 1604288237,
//             likes: 0,
//             name: "Chill Tunes",
//             tags: ["lo-fi", "video game", "soundtrack", "vocal"],
//             user_id: ObjectId("5f9f58abf5bf7e2ac904b8ba"),
//             songs: [
//                 {
//                     artist: "Transistor Original Soundtrack",
//                     name: "The Spine",
//                     note: "",
//                     url: "41tIUr_ex3g",
//                     url_type: youtube
//                 },
//                 {
//                     artist: "cadmio",
//                     name: "train of thought",
//                     note: "",
//                     url: "bziESwuEqdI",
//                     url_type: youtube
//                 },
//                 {
//                     artist: "Bastion Original Soundtrack",
//                     name: "Build That Wall (Zia's Theme)",
//                     note: "",
//                     url: "o3SZee4YZX8",
//                     url_type: youtube
//                 },
//                 {
//                     artist: "Transistor Original Soundtrack",
//                     name: "Sandbox",
//                     note: "",
//                     url: "Bvf5F7UfQ3c",
//                     url_type: youtube
//                 },
//             ]
//         }
//     ]);

//     client.close();
// });