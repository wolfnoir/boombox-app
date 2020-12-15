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
const mongoDbName = 'boombox';
const mongoUserCollection = 'users';
const mongoPlaylistsCollection = 'playlists';
const mongoTagsCollection = 'tags';

const PLAYLISTS_PER_PAGE = 8;

class TagHandler {
    static async getTags() {
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

            const cursor = await collection.find();
            if (!cursor) {
                console.log("tags not found");
                return {status: 1};
            }

            const docs = await cursor.toArray();
            const tags = docs.map(element => element.tag_id);

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

    static async getTagsRoute(req, res) {
        const statusObject = await TagHandler.getTags();
        res.send(statusObject);
    }

    static async getTagResults(tag, pageNumber) {
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
            const userCollection = client.db(mongoDbName).collection(mongoUserCollection);
            const playlistCollection = client.db(mongoDbName).collection(mongoPlaylistsCollection);
            const taggedPlaylists = []
            const nPerPage = PLAYLISTS_PER_PAGE;

            const cursor = await playlistCollection.find({"tags": tag, "isPrivate": false})
            .skip( pageNumber > 0 ? ( ( pageNumber ) * nPerPage ) : 0 )
            .limit( nPerPage );
            if (!cursor) {
                console.log("playlists not found");
                return {status: 1};
            }
            
            while(await cursor.hasNext()){
                var playlistObject = await cursor.next();

                const userQuery = {"_id": playlistObject.user_id};
                const playlistUserObject = await userCollection.findOne(userQuery);

                if (!playlistUserObject)
                    playlistObject.author = null;

                else
                    playlistObject.author = playlistUserObject.username;

                playlistObject.url = "/playlist/" + playlistObject._id;

                taggedPlaylists.push(playlistObject);
            };

            return {
                status: 0,
                result: taggedPlaylists
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

    static async getTagResultsRoute(req, res) {
        const tag = req.params.tag;
        const page = req.body.page;
        const statusObject = await TagHandler.getTagResults(tag, page);
        res.send(statusObject);
    }
}

module.exports = TagHandler;