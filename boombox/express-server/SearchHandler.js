const MongoClient = require('mongodb');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const mongoDbName = 'boombox';
const mongoUserCollection = 'users';
const mongoPlaylistsCollection = 'playlists';
const mongoTagsCollection = 'tags';

class SearchHandler {
    static async searchTags(keyword) {
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
            const collection = client.db(mongoDbName).collection(mongoTagsCollection);

            var cursor = await collection.aggregate([
                {
                    $search: {
                        "text": {
                            "query": keyword,
                            "path": "tag_id"
                        }
                    }
                },
                {$limit: 10}
            ]);

            if(!cursor)
                return {status: -1};

            const tagObjects = await cursor.toArray();
            const tags = tagObjects.map(element => element.tag_id);

            return {
                status: 0,
                result: tags
            };
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally{
            client.close();
        }
    }

    static async searchTagsRoute(req, res) {
        const keyword = req.params.keyword;
        const statusObject = await SearchHandler.searchTags(keyword);
        res.send(statusObject);
    }

    static async searchUsers(keyword){
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
            const collection = client.db(mongoDbName).collection(mongoUserCollection);

            const cursor = await collection.aggregate([
                {
                    $search: {
                        "text": {
                            "query": keyword,
                            "path": "username"
                        }
                    }
                },
                {$limit: 9}
            ]);

            if(!cursor)
                return {status: -1};

            const users = await cursor.toArray();

            return {
                status: 0,
                result: users
            };
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally{
            client.close();
        }
    }

    static async searchUsersRoute(req, res){
        const keyword = req.params.keyword;
        const statusObject = await SearchHandler.searchUsers(keyword);
        res.send(statusObject);
    }

    static async searchPlaylists(keyword){
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
            const collection = client.db(mongoDbName).collection(mongoPlaylistsCollection);
            const maxErrors = Math.ceil(keyword.length / 7);

            //TODO: Limit number of playlists returned
            const cursor = await collection.aggregate([
                {
                    $search: {
                        "text": {
                            "query": keyword,
                            "path": ["name", "songs", "tags"],
                            "fuzzy": {
                                "maxEdits": maxErrors,
                                "prefixLength": 2,
                            }
                        }
                    }
                }
            ]);

            if(!cursor)
                return {status: -1};

            var playlists = await cursor.toArray();
            var playlistsFinal = [];

            for(var playlistObject of playlists) {
                if(!playlistObject.isPrivate){
                    const userQuery = {"_id": playlistObject.user_id};
                    const userObject = await client.db(mongoDbName).collection(mongoUserCollection).findOne(userQuery);
                    if (!userObject) 
                        playlistObject.author = null;

                    else 
                        playlistObject.author = userObject.username;

                    playlistObject.url = "/playlist/" + playlistObject._id;
                    playlistsFinal.push(playlistObject);
                }
            }

            return {
                status: 0,
                result: playlistsFinal
            };
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally{
            client.close();
        }
    }

    static async searchPlaylistsRoute(req, res){
        const keyword = req.params.keyword;
        const statusObject = await SearchHandler.searchPlaylists(keyword);
        res.send(statusObject);
    }
}

module.exports = SearchHandler;