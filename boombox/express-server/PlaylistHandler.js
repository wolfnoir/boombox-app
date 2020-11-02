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

    static async createPlaylist() {
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
            var date = new Date();
            var user_id = req.session.user_id;
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
                user_id: user_id,
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
        const success = await UserHandler.createPlaylist();

        res.send({
            statusCode: success //-1: an error occurred, 0: success, 1: duplicate username or email
        });
    }

    /**
     * Edit Playlist
     */
    
    static async editPlaylist(id, com_enabled, comments, description, image_url, likes, name, notes, songs, tags) {
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
            var date = new Date();
            var user_id = req.session.user_id;
            var idObject = new MongoClient.ObjectID(id);
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
                user_id: user_id,
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
        const id;
        const com_enabled = false;
        const comments = [];
        const description = "I am an edited playlist!";
        const image_url = "";
        const likes = [];
        const name = "Dummy Playlist";
        const songs = [];
        const tags = [];
        const success = await UserHandler.editPlaylist(id, com_enabled, comments, description, image_url, likes, name, notes, songs, tags);

        res.send({
            statusCode: success //-1: an error occurred, 0: success, 1: duplicate username or email
        });
    }
}

module.exports = PlaylistHandler;