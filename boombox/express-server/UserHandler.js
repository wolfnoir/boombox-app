const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require('mongodb');
const crypto = require('crypto');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const monogDbName = 'boombox';
const mongoUserCollection = 'users';

class UserHandler {
    /*
        MongoClient.connect(mongoUrl, {useNewUrlParser: true}, (error, client) => {
            if (error) throw error;
            const collection = client.db(monogDbName).collection(mongoUserCollection);
            const userQuery = {'$or': [{username: username}, {email: email}]};
            var cursor = collection.find(userQuery);
            if (cursor.count() != 0) {}
            //cursor = collection.insertOne({});
            client.close();
        });
    }
    */

    static async registerUser(username, password, email) {
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,  
            useUnifiedTopology: true
        }).catch(err => {throw err});

        if (!client) {
            return;
        }
        try {
            const collection = client.db(monogDbName).collection(mongoUserCollection);
            const userQuery = {'$or': [{username: username}, {email: email}]};
            var cursor = collection.find(userQuery);
            if (await cursor.count() != 0) {
                console.log("duplicate");
                return false;
            }
            await collection.insertOne({username: 'test-user'});
        }
        catch (err) {
            throw err;
        }
        finally {
            client.close();
        }
        console.log("okay");
        return true;
    }

    static async registerUserRoute(req, res) {
        const username = 'test-user'; //req.body.username;
	    const password = 'testPassword123?'; //req.body.password;
        const email = 'test@test.com'; ////req.body.email;
        const success = await UserHandler.registerUser(username, password, email);

        res.send(success);
    }
}



module.exports = UserHandler;