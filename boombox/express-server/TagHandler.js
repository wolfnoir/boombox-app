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
const mongoTagsCollection = 'tags';

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
    }

    static async getTagsRoute(req, res) {
        const statusObject = await TagHandler.getTags();
        res.send(statusObject);
    }
}

module.exports = TagHandler;