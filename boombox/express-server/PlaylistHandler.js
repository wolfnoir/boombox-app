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
            return -1;
        });

        if (!client) {
            console.log("Client is null");
            return -1;
        }

        try {
            const date = new Date();
            const userIdObject = MongoClient.ObjectID(user_id);
            const collection = client.db(monogDbName).collection(mongoPlaylistCollection);

            await collection.insertOne({
                com_enabled: false,
                comments: [],
                description: '',
                image_url: '',
                last_modified: date.getDate(),
                likes: [],
                name: 'Untitled',
                songs: [],
                tags: [],
                user_id: userIdObject
            });
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

    static async createPlaylistRoute(req, res) {
        const user_id = req.session.user_id;
        const success = await UserHandler.createPlaylist(user_id);

        res.send({
            statusCode: success //-1: an error occurred, 0: success
        });
    }

    /**
     * Edit Playlist
     */
    
    static async editPlaylist(user_id, playlist_id, com_enabled, comments, description, image_url, likes, name, songs, tags) {
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
                comments: comments,
                description: description,
                image_url: image_url,
                last_modified: date.getDate(),
                likes: likes,
                name: name,
                songs: songs,
                tags: tags,
                user_id: userIdObject
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
        const image_url = req.body.image_url;
        const likes = req.body.likes;
        const name = req.body.name;
        const songs = req.body.songs;
        const tags = req.body.tags;
        const success = await UserHandler.editPlaylist(user_id, playlist_id, com_enabled, comments, description, image_url, likes, name, songs, tags);

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
            const idObject = new MongoClient.ObjectID(playlist_id);
            const userQuery = { "_id" : idObject };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("playlist not found");
                return {status: 1};
            }

            return {
                status: 0,
                result: userObject
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
        const playlist_id = req.body.playlist_id;
        const statusObject = await PlaylistHandler.getPlaylist(playlist_id);

        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: playlist not found
    }
}

module.exports = PlaylistHandler;