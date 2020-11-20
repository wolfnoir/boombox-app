const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require('mongodb');
const crypto = require('crypto');
const multiparty = require("multiparty");
const fs = require("fs");

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const monogDbName = 'boombox';
const mongoPlaylistCollection = 'playlists';
const mongoUserCollection = 'users';

class PlaylistHandler {
    /**
     * Create Playlist
     */

    static async createPlaylist(user_id) {
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

        var serverResp = null;

        try {
            const date = Date.now();
            const userIdObject = MongoClient.ObjectID(user_id);
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);

            serverResp = await collection.insertOne({
                com_enabled: false,
                comments: [],
                creation_date: date,
                description: '',
                image_url: '',
                isPrivate: false,
                last_modified: date,
                likes: [],
                name: 'Untitled',
                songs: [],
                tags: [],
                user_id: userIdObject
            });
        }

        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }

        console.log("Success");
        return {
            status: 0,
            playlist_id: serverResp.insertedId
        };
    }

    static async createPlaylistRoute(req, res) {
        const username = req.body.username;
        const idResponse = await PlaylistHandler.getUserId(username);
        const user_id = new MongoClient.ObjectID(idResponse.result);
        const response = await PlaylistHandler.createPlaylist(user_id);
        
        res.send({
            status: response.status, //status -1: an error occurred, 0: success
            playlist_id: response.playlist_id
        });
    }

    /*
     * Delete Playlist 
     */

    static async deletePlaylist(user_id, playlistId) {
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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const foundPlaylist = await collection.findOne({"_id": playlistId});
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }
            var stringUserId = user_id.toString();
            var stringPlaylistUserId = foundPlaylist.user_id.toString();
            if (stringUserId !== stringPlaylistUserId) { //if we want to admin debug, add an AND != for admin account
                
                console.log("not authorized");
                return {status: 1};
            }
            const status = await collection.deleteOne({"_id": playlistId});
            if (status.deletedCount > 0) {
                console.log("Success");
                return {status: 0};
            }
            return {status: -1};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }
    }

    static async deletePlaylistRoute(req, res) {
        //const user_id = req.session.user_id;
        const playlistId = new MongoClient.ObjectID(req.body.playlistId);
        const username = req.body.username;
        const idResponse = await PlaylistHandler.getUserId(username);
        const user_id = new MongoClient.ObjectID(idResponse.result);
        const response = await PlaylistHandler.deletePlaylist(user_id, playlistId);

        res.send({
            status: response.status, //status -1: an error occurred, 0: success, 1: you do not have authorization
        });
    }

    static async getUserId(username){
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
            const collection = client.db(monogDbName).collection(mongoUserCollection);
            const user = await collection.findOne({"username": username});
            if (!user){
                console.log("user not found");
                return {status: 1};
            }

            const targetIdObject = user._id;
            return {
                status: 0,
                result: targetIdObject
            };
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }
        finally {
            client.close();
        }
    }

    /**
     * Edit Playlist
     */
    
    //static async editPlaylist(user_id, playlist_id, com_enabled, comments, description, image_url, likes, name, songs, tags) {
    static async editPlaylistSettings(playlist_id, com_enabled, description, name, isPrivate, filename, filepath) {
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
            const date = Date.now();
            console.log(playlist_id);
            const idObject = MongoClient.ObjectID(playlist_id);
            //const userIdObject = MongoClient.ObjectID(user_id);

            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const filter = { "_id": idObject };

            const foundPlaylist = await collection.findOne(filter);
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }

            //TEMPORARILY USING TEMP VARS FOR THIS
            const tempComments = foundPlaylist.comments;
            const tempImage = foundPlaylist.image_url;
            const tempLikes = foundPlaylist.likes;
            const tempSongs = foundPlaylist.songs;
            const tempTags = foundPlaylist.tags;
            const tempUserId = foundPlaylist.user_id;

            //@todo: TEMPORARILY ONLY UPDATING NAME AND DESCRIPTION
            const updateDoc = {
                com_enabled: com_enabled,
                comments: tempComments,
                description: description,
                image_url: tempImage, //need to do this separately for image upload
                last_modified: date,
                likes: tempLikes,
                name: name,
                isPrivate: isPrivate,
                songs: tempSongs,
                tags: tempTags,
                user_id: tempUserId
            };
            //await collection.updateOne(filter, {$set: updateDoc});

            if (filename) {
                const db = client.db("boombox");
                const bucket = new MongoClient.GridFSBucket(db);
                const readStream = fs.createReadStream(filepath);
                const uploadStream = bucket.openUploadStream(filename);
                readStream.pipe(uploadStream)
                    .on('error', (err) => {
                        throw err;
                    })
                    .on('finish', () => {
                        //console.log(uploadStream.id);
                    })
                console.log(uploadStream.id);
                //await collection.updateOne({filter}, {$set: {image_url: uploadStream.id}});
                updateDoc.image_url = uploadStream.id;

                //const fileData = fs.readFileSync(filepath, {encoding: 'base64'});
                //return {status: 0, imageData: fileData};
            }
            await collection.updateOne(filter, {$set: updateDoc});
            if (filename) {
                const fileData = fs.readFileSync(filepath, {encoding: 'base64'});
                return {status: 0, imageData: fileData};
            }

        }

        catch (err) {
            console.log(err);
            return {status: -1};
        }
        
        finally {
            client.close();
        }
        console.log("Success");
        return {status: 0};
    }

    static async editPlaylistSettingsRoute(req, res) {
        console.log("hi");
        
        // const user_id = req.session.user_id;
        // if (!user_id) {
        //     res.send({statusCode: 1});
        //     return;
        // }

        const form = new multiparty.Form();
        const formPromise = new Promise((resolve, reject) => form.parse(req, (err, fields, files) => {
            if (err) {console.log(err);}
            return resolve([fields, files]);
        }));
        const [fields, files] = await formPromise;
        console.log(fields);

        const playlist_id = fields.playlistId[0];
        const description = fields.description[0];
        const name = fields.name[0];
        const isPrivate = fields.isPrivate[0] === "true";
        const com_enabled = fields.com_enabled[0] === "true";

        var filename;
        var filepath;
        if (files && files.file) {
            const uploadedFile = files.file[0];
            const imageExts = ["jpeg", "jpg", "png", "gif"];
            if (uploadedFile &&  uploadedFile.size > 0) {
                filename = uploadedFile.originalFilename;
                console.log(uploadedFile);
                console.log('filename: ', filename);
                if (!imageExts.includes(filename.substring(filename.lastIndexOf('.') + 1))) {
                    console.log('not an image');
                    return {status: 3} //not a proper image file
                }
                filepath = uploadedFile.path;
                console.log('filepath: ', filepath);
            }
        }

        const success = await PlaylistHandler.editPlaylistSettings(playlist_id, com_enabled, description, name, isPrivate, filename, filepath);


        res.send(success); //-1: an error occurred, 0: success, 1: not logged in
    }

    /**
     * Get Playlist
     */

    static async getPlaylist(self_user_id, playlist_id) {
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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const idObject = MongoClient.ObjectID(playlist_id);
            const playlistQuery = { "_id" : idObject };
            var playlistObject = await collection.findOne(playlistQuery);
            if (!playlistObject) {
                console.log("playlist not found");
                return {status: 1};
            }
            const userQuery = {"_id": playlistObject.user_id};
            const userObject = await client.db(monogDbName).collection(mongoUserCollection).findOne(userQuery);
            if (!userObject) {
                playlistObject.author = null;
            }
            else {
                playlistObject.author = userObject.username;
            }
            playlistObject.url = "/playlist/" + playlist_id;

            const selfUserIdObject = MongoClient.ObjectID(self_user_id);
            playlistObject.liked = playlistObject.likes.filter( id => id.equals(selfUserIdObject)).length > 0;

            return {
                status: 0,
                result: playlistObject
            };
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }
        finally {
            client.close();
        }
    }

    static async getPlaylistRoute(req, res) {
        const user_id = req.session.user_id;
        const playlist_id = req.params.playlistId;
        const statusObject = await PlaylistHandler.getPlaylist(user_id, playlist_id);

        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: playlist not found
    }

    static async getPlaylistCoverData(playlistId) {
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
            const db = client.db(monogDbName);

            const playlistCollection = db.collection(mongoPlaylistCollection);
            const playlistObject = await playlistCollection.findOne({_id: MongoClient.ObjectID(playlistId)});
            if (!playlistObject) {
                console.log('playlist not found');
                return {status: 1};
            }
            const object_id = playlistObject.image_url;
            if (!object_id) {
                return {status: 2}; //no image
            }

            const filepath = './tmp_file';
            const bucket = new MongoClient.GridFSBucket(db);
            const downloadStream = bucket.openDownloadStream(object_id);
            const writeStream = fs.createWriteStream(filepath); //TODO: need to generate a better random file (tmp package?)
            
            const downloadPromise = new Promise((resolve, reject) => {
                downloadStream.pipe(writeStream)
                .on('error', (err) => {
                    throw err;
                })
                .on('finish', () => {
                    //console.log(uploadStream.id);
                    console.log("ended");
                    return resolve();
                });
            });
            await downloadPromise;

            const fileData = fs.readFileSync(filepath, {encoding: 'base64'});
            //console.log('filedata ', fileData);
            return {status: 0, imageData: fileData};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }
        finally {
            client.close();
        }
    }

    static async getPlaylistCoverDataRoute(req, res) {
        const playlistId = req.body.playlistId;
        const statusObject = await PlaylistHandler.getPlaylistCoverData(playlistId);
        //console.log(statusObject);
        res.send(statusObject);
    }

    static async updateLikes(user_id, playlistId) {
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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const idObject = MongoClient.ObjectID(playlistId);
            const foundPlaylist = await collection.findOne({"_id": idObject});
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }

            var likes = foundPlaylist.likes;

            if(likes.filter( id => id.equals(user_id)).length > 0)
                likes = likes.filter( id => !id.equals(user_id));

            else
                likes.push(user_id);

            await collection.updateOne({"_id": idObject}, {$set: {likes: likes}}); //add status checking for update?
            return {status: 0};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }
     }

     static async updateLikesRoute(req, res) {
        const username = req.body.username;
        const playlistId = req.body.playlistId;
        const idResponse = await PlaylistHandler.getUserId(username);
        const user_id = new MongoClient.ObjectID(idResponse.result);
        const statusObject = await PlaylistHandler.updateLikes(user_id, playlistId);

        res.send(statusObject);
     }

    /* 
     * Song Handling
     */

     static async addSong(req, res) {
        const user_id = req.session.user_id;
        const playlistId = req.body.playlistId;
        const url = req.body.url;
        const title = req.body.title;
        const artist = req.body.artist;
        const album = req.body.album;

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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const foundPlaylist = await collection.findOne({"_id": playlistId});
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }
            var stringUserId = user_id.toString();
            var stringPlaylistUserId = foundPlaylist.user_id.toString();
            if (stringUserId !== stringPlaylistUserId) { //if we want to admin debug, add an AND != for admin account
                console.log("not authorized");
                return {status: 1};
            }
            const songArray = foundPlaylist.songs;
            songArray.push({
                album: album,
                artist: artist,
                name: title,
                notes: null,
                url: url,
                url_type: "youtube.com/watch?v="
            });
            await collection.updateOne({"_id": playlistId}, {$set: {songs: songArray}}); //add status checking for update?
            return {status: 0};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }
     }

     static async deleteSong(req, res) {
        const user_id = req.session.user_id;
        const playlistId = req.body.playlistId;
        const songPosition = req.body.songPosition;

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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const foundPlaylist = await collection.findOne({"_id": playlistId});
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }
            if (foundPlaylist.user_id != user_id) { //if we want to admin debug, add an AND != for admin account
                console.log("not authorized");
                return {status: 1};
            }
            const songArray = foundPlaylist.songs;
            delete songArray[songPosition];
            await collection.updateOne({"_id": playlistId}, {$set: {songs: songArray}}); //add status checking for update?
            return {status: 0};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }
     } 

     static async updateSongs(user_id, playlistId, songs) {
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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const idObject = MongoClient.ObjectID(playlistId);
            const foundPlaylist = await collection.findOne({"_id": idObject});
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }
            var stringUserId = user_id.toString();
            var stringPlaylistUserId = foundPlaylist.user_id.toString();
            if (stringUserId !== stringPlaylistUserId) { //if we want to admin debug, add an AND != for admin account
                console.log("not authorized");
                return {status: 1};
            }
            await collection.updateOne({"_id": idObject}, {$set: {songs: songs}}); //add status checking for update?
            return {status: 0};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }
     }

     static async updateSongsRoute(req, res) {
        const username = req.body.username;
        const playlistId = req.body.playlistId;
        const songs = req.body.songs;
        const idResponse = await PlaylistHandler.getUserId(username);
        const user_id = new MongoClient.ObjectID(idResponse.result);
        const statusObject = await PlaylistHandler.updateSongs(user_id, playlistId, songs);

        res.send(statusObject);
    }

    static async updateTags(user_id, playlistId, tags) {
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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const idObject = MongoClient.ObjectID(playlistId);
            const foundPlaylist = await collection.findOne({"_id": idObject});
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }
            var stringUserId = user_id.toString();
            var stringPlaylistUserId = foundPlaylist.user_id.toString();
            if (stringUserId !== stringPlaylistUserId) { //if we want to admin debug, add an AND != for admin account
                console.log("not authorized");
                return {status: 1};
            }
            await collection.updateOne({"_id": idObject}, {$set: {tags: tags}}); //add status checking for update?
            return {status: 0};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }
     }

    static async updateTagsRoute(req, res) {
        const username = req.body.username;
        const playlistId = req.body.playlistId;
        const tags = req.body.tags;
        const idResponse = await PlaylistHandler.getUserId(username);
        const user_id = new MongoClient.ObjectID(idResponse.result);
        const statusObject = await PlaylistHandler.updateTags(user_id, playlistId, tags);

        res.send(statusObject);
    }

    /*
     * Other
     */

    static async getImage(req, res) {
        //console.log(req.body);
        const objectIdStr = req.body.image_id;
        if (!objectIdStr) {
            res.send({status: 2}); //no image
            return;
        }

        const object_id = MongoClient.ObjectID(objectIdStr);
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,  
            useUnifiedTopology: true
        }).catch(err => {
            console.log(err);
            res.send({status: -1});
        });

        if (!client) {
            console.log("Client is null");
            res.send({status: -1});
        }

        try {
            const db = client.db(monogDbName); 

            const filepath = './tmp_file';
            const bucket = new MongoClient.GridFSBucket(db);
            const downloadStream = bucket.openDownloadStream(object_id);
            const writeStream = fs.createWriteStream(filepath); //TODO: need to generate a better random file (tmp package?)
            
            const downloadPromise = new Promise((resolve, reject) => {
                downloadStream.pipe(writeStream)
                .on('error', (err) => {
                    throw err;
                })
                .on('finish', () => {
                    //console.log(uploadStream.id);
                    console.log("ended");
                    return resolve();
                });
            });
            await downloadPromise;

            const fileData = fs.readFileSync(filepath, {encoding: 'base64'});
            //console.log('filedata ', fileData);
            res.send({status: 0, imageData: fileData});
        }
        catch (err) {
            console.log(err);
            res.send({status: -1});
        }
        finally {
            client.close();
        }
    }

    static async addComment(playlistId, user_id, content, date){
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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const idObject = MongoClient.ObjectID(playlistId);
            const foundPlaylist = await collection.findOne({"_id": idObject});
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }
            
            //add comment to playlist
            const commentArray = foundPlaylist.comments;
            commentArray.push({
                user_id: user_id,
                content: content,
                date: date,
            });
            await collection.updateOne({"_id": idObject}, {$set: {comments: commentArray}}); //add status checking for update?

            return {
                status: 0,
                user_id: user_id
            };
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }
    }

    static async addCommentRoute(req, res){
        const playlist_id = req.body.playlistId;
        const username = req.body.username;
        const content = req.body.content;
        const date = req.body.date;
        const idResponse = await PlaylistHandler.getUserId(username);
        const user_id = new MongoClient.ObjectID(idResponse.result);

        const statusObject = await PlaylistHandler.addComment(playlist_id, user_id, content, date);

        res.send(statusObject);
    }

    static async deleteComment(index, playlistId){
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
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const idObject = MongoClient.ObjectID(playlistId);
            const foundPlaylist = await collection.findOne({"_id": idObject});
            if (!foundPlaylist) {
                console.log('playlist not found');
                return {status: -1};
            }
            
            //delete comment from playlist
            var commentArray = foundPlaylist.comments;
            commentArray.splice(index, 1)
            await collection.updateOne({"_id": idObject}, {$set: {comments: commentArray}}); //add status checking for update?

            return  {status: 0 };
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        finally {
            client.close();
        }
    }

    static async deleteCommentRoute(req, res){
        const playlist_id = req.body.playlistId;
        const index = req.body.index;

        const statusObject = await PlaylistHandler.deleteComment(index, playlist_id);

        res.send(statusObject);
    }
}

module.exports = PlaylistHandler;