const { ObjectID, ObjectId } = require("mongodb");
const MongoClient = require('mongodb');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const mongoDbName = 'boombox';
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
                    description: "I like pizza.",
                    image_url: null,
                    last_modified: 1604544250,
                    likes: [],
                    name: "The Pizza Show",
                    tags: [],
                    user_id: ObjectId("5fa214cccc05e350b4f849d4"),
                    songs: [
                        {
                            artist: "",
                            name: "Brooklyn is Pizza Heaven",
                            album: "",
                            note: "BROOKLYN REPRESENT",
                            url: "mH7vFc0bUpU",
                            url_type: youtube
                        },
                        {
                            artist: "",
                            name: "Is New Haven Pizza Better Than New York Pizza?",
                            album: "",
                            note: "hint: its not",
                            url: "BmiQRvib3DQ",
                            url_type: youtube
                        },
                        {
                            artist: "",
                            name: "The Pizza Show: From Deep Dish to Thin Crust",
                            album: "",
                            note: "i hate deep dish pizza with my life!!!!!!",
                            url: "Z0xDAUXPc8c",
                            url_type: youtube
                        },
                        {
                            artist: "",
                            name: "The Pizza Show: Special Slice",
                            album: "",
                            note: "",
                            url: "xQXYWxZCPqA",
                            url_type: youtube
                        },
                        {
                            artist: "",
                            name: "The Original New York Slice: The Pizza Show",
                            album: "",
                            note: "",
                            url: "8pCMoL_b_s",
                            url_type: youtube
                        },
                        {
                            artist: "",
                            name: "Business of Pizza : Pizza Robots",
                            album: "",
                            note: "i wish i had a pizza robot :^(",
                            url: "ZZzFoi_fuF4",
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