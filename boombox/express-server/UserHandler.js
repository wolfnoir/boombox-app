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
        }).catch(err => {
            console.log(err);
            return -1;
        });

        if (!client) {
            console.log("Client is null");
            return -1;
        }

        try {
            const collection = client.db(monogDbName).collection(mongoUserCollection);
            const userQuery = {'$or': [{username: username}, {email: email}]};
            var cursor = collection.find(userQuery);
            if (await cursor.count() != 0) {
                console.log("duplicate");
                return 1;
            }
            const salt = crypto.randomBytes(16).toString('hex');
            const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
            console.log(hashedPassword);
            await collection.insertOne({
                username: username,
                email: email,
                password: hashedPassword,
                salt: salt,
                pw_reset_link: null,
                icon_url: null,
                bio: '',
                following: [],
                followers: [],
                bookmarks: []
            });
        }
        catch (err) {
            console.log(err);
            return -1;
        }
        finally {
            client.close();
        }
        console.log("okay");
        return 0;
    }

    static async registerUserRoute(req, res) {
        const username = 'test-user'; //req.body.username;
	    const password = 'testPassword123?'; //req.body.password;
        const email = 'test@test.com'; ////req.body.email;
        const success = await UserHandler.registerUser(username, password, email);
        res.send({
            statusCode: success //-1: an error occurred, 0: success, 1: duplicate username or email
        });
    }
}



module.exports = UserHandler;