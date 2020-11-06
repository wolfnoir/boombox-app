const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require('mongodb');
const crypto = require('crypto');

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
        const user_id = req.session.user_id;
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
            if (foundPlaylist.user_id != user_id) { //if we want to admin debug, add an AND != for admin account
                console.log("not authorized");
                return {status: 1};
            }
            const status = await collection.deleteOne({"_id": playlistId});
            console.log(status);
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
        const user_id = req.session.user_id;
        const playlistId = new MongoClient.ObjectID(req.body.playlistId);
        const response = await PlaylistHandler.deletePlaylist(user_id, playlistId);

        res.send({
            status: response.status, //status -1: an error occurred, 0: success, 1: you do not have authorization
        });
    }

    /**
     * Edit Playlist
     */
    
    //static async editPlaylist(user_id, playlist_id, com_enabled, comments, description, image_url, likes, name, songs, tags) {
    static async editPlaylist(user_id, playlist_id, com_enabled, description, image_url, name, isPrivate) {
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,  
            useUnifiedTopology: true
        }).catch(err => {
            console.log(err);
            return -1;
        });

        if (!client) {
            console.log("Client is null");
            return -1;
        }

        try {
            const date = new Date();
            const idObject = new MongoClient.ObjectID(playlist_id);
            const userIdObject = MongoClient.ObjectID(user_id);

            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const filter = { "_id": idObject };

            const updateDoc = {
                com_enabled: com_enabled,
                //comments: comments,
                description: description,
                image_url: image_url, //need to do this separately for image upload
                last_modified: date.getDate(),
                //likes: likes,
                name: name,
                isPrivate: isPrivate,
                //songs: songs,
                //tags: tags,
                //user_id: userIdObject
            }

            await collection.updateOne(filter, updateDoc);
        }

        catch (err) {
            console.log(err);
            return -1;
        }

        finally {
            client.close();
        }

        console.log("Success");
        return 0;
    }

    static async editPlaylistRoute(req, res) {
        const user_id = req.session.user_id;
        if (!user_id) {
            res.send({status: 1});
            return;
        }

        const playlist_id = req.body.id;
        const com_enabled = req.body.com_enabled;
        const comments = req.body.comments;
        const description = req.body.description;
        const image_url = req.body.image_url; //need to handle this separately with mult-form
        const likes = req.body.likes;
        const name = req.body.name;
        const isPrivate = req.body.isPrivate;
        const songs = req.body.songs;
        const tags = req.body.tags;
        //const success = await PlaylistHandler.editPlaylist(user_id, playlist_id, com_enabled, comments, description, image_url, likes, name, private, songs, tags);
        const success = await PlaylistHandler.editPlaylist(user_id, playlist_id, com_enabled, description, image_url, name, isPrivate);


        res.send({
            statusCode: success //-1: an error occurred, 0: success, 1: not logged in
        });
    }

    /**
     * Get Playlist
     */

    static async getPlaylist(playlist_id) {
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
            const playlistObject = await collection.findOne(playlistQuery);
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
        const playlist_id = req.params.playlistId;
        console.log(playlist_id);
        const statusObject = await PlaylistHandler.getPlaylist(playlist_id);

        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: playlist not found
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
            if (foundPlaylist.user_id != user_id) { //if we want to admin debug, add an AND != for admin account
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

     static async updateSongs(req, res) {
        const user_id = req.session.user_id;
        const playlistId = req.body.playlistId;
        const songs = req.body.songs;

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
            await collection.updateOne({"_id": playlistId}, {$set: {songs: songs}}); //add status checking for update?
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
}

module.exports = PlaylistHandler;