const MongoClient = require('mongodb');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const mongoDbName = 'boombox';
const mongoUserCollection = 'users';
const mongoPlaylistsCollection = 'playlists';
const mongoTagsCollection = 'tags';

const TAGS_PER_PAGE = 10;
const USERS_PER_PAGE = 9;
const PLAYLISTS_PER_PAGE = 8;

class SearchHandler {
    static async searchTags(keyword, pageNumber) {
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
            const query = "\"" + keyword + "\"";
            const nPerPage = TAGS_PER_PAGE;

            var cursor = await collection.find({
                $text: {
                    $search: query,
                    $caseSensitive: false
                }
            })
            .skip( pageNumber > 0 ? ( ( pageNumber ) * nPerPage ) : 0 )
            .limit( nPerPage )
            .project({ score: { $meta: "textScore" } })
            .sort( { score: { $meta: "textScore" } } );

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
        const page = req.body.page;
        const statusObject = await SearchHandler.searchTags(keyword, page);
        res.send(statusObject);
    }

    static async searchUsers(keyword, pageNumber){
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
            const query = "\"" + keyword + "\"";
            const nPerPage = USERS_PER_PAGE;

            var cursor = await collection.find({
                $text: { $search: query } 
            })
            .skip( pageNumber > 0 ? ( ( pageNumber ) * nPerPage ) : 0 )
            .limit( nPerPage )
            .project({ score: { $meta: "textScore" } })
            .sort( { score: { $meta: "textScore" } } );

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
        const page = req.body.page;
        const statusObject = await SearchHandler.searchUsers(keyword, page);
        res.send(statusObject);
    }

    static async searchPlaylists(keyword, pageNumber){
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
            const query = "\"" + keyword + "\"";
            const nPerPage = PLAYLISTS_PER_PAGE;

            var cursor = await collection.find({
                $text: { $search: query },
                isPrivate: false
            })
            .skip( pageNumber > 0 ? ( ( pageNumber ) * nPerPage ) : 0 )
            .limit( nPerPage )
            .project({ score: { $meta: "textScore" } })
            .sort( { score: { $meta: "textScore" } } );

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
        const page = req.body.page;
        const statusObject = await SearchHandler.searchPlaylists(keyword, page);
        res.send(statusObject);
    }
}

module.exports = SearchHandler;