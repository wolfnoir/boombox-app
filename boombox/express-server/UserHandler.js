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
const mongoPlaylistCollection = 'playlists';

class UserHandler {
    /*-------------*/
    /* REGISTER    */
    /*-------------*/      

    static async registerUser(username, password, email) {
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
            const userQuery = {'$or': [{username: username}, {email: email}]};
            var cursor = collection.find(userQuery);
            if (await cursor.count() != 0) {
                console.log("duplicate");
                return {status: 1};
            }
            const salt = crypto.randomBytes(16).toString('hex');
            const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
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
            console.log("okay");
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

    static async registerUserRoute(req, res) {
        /*
        const username = 'test-user'; //req.body.username;
        const password = 'testPassword123?'; //req.body.password;
        const passwordConfirm = 'testPassword123?'; //req.body.passwordConfirm;
        const email = 'test@test.com'; ////req.body.email;
        */
        
        const username = req.body.username;
        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;
        const email = req.body.email;
        if (password !== passwordConfirm) {
            res.send({status: 2}); //passwords do not match
            return;
        }
        const statusObject = await UserHandler.registerUser(username, password, email);
        res.send(statusObject);
    }

    /*-------------*/
    /* LOGIN       */
    /*-------------*/

    static async loginUser(username, password) {
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
            const userQuery = {username: username};
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }
            const salt = userObject.salt;
            const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
            if (hashedPassword !== userObject.password) {
                console.log("non matching password");
                return {status: 1};
            }
            return {
                status: 0,
                user_id: userObject._id
            }
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }
        finally {
            client.close();
        }
    }

    static async loginUserRoute(req, res) {
        //should there be a check to see if user cookie aligns with the session username?
        if (req.cookies.username) {
            console.log("already logged in " + req.cookies.username);
            res.send({status: 2}); //user is already logged in
            return;
        }

        /*
        const username = 'test-user'; //req.body.username;
        const password = 'testPassword123?'; //req.body.password;
        */
       
        const username = req.body.username; 
        const password = req.body.password;
        const statusObject = await UserHandler.loginUser(username, password);
        if (statusObject.status == 0) {
            res.cookie('username', username);
            req.session.logged_in = true;
            req.session.username = username;
            req.session.user_id = statusObject.user_id;
            console.log('login ' + username);
        }
        res.send(statusObject); // [status] -1: an error occurred, 0: success, 1: combination does not exist
    }

    /*--------------*/
    /* LOGOUT       */
    /*--------------*/

    static logoutUserRoute(req, res) {
        var user = req.cookies.username;
        console.log('logout: ' + user);
        res.clearCookie('username');
        req.session.destroy();
        res.send("logout " + user);
    }

    /*------------------------*/
    /* EDIT USER SETTINGS     */
    /*------------------------*/

    static async editUserSettings(username, newIcon, newUsername, newBio, newEmail, currentPassword, newPassword, newPasswordConfirm) {
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
            const userQuery = {username: username};
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }
            var updateObject = {}
            if (newIcon) {
                //TODO: need to handle image storage
            }
            if (newUsername) {
                updateObject.username = newUsername;
            }
            if (newBio) {
                updateObject.bio = newBio;
            }
            if (newEmail) {
                //check if the email already exists
                const foundEmailObject = await collection.findOne({email: newEmail});
                if (foundEmailObject) {
                    console.log("email in use");
                    return {status: 2};
                }
                updateObject.email = newEmail;
            }
            if (newPassword) {
                const salt = userObject.salt;
                const hashedPassword = crypto.createHash('sha256').update(currentPassword + salt).digest('hex');
                if (userObject.password != hashedPassword) {
                    return {status: 3};
                }
                if (newPassword !== newPasswordConfirm) {
                    return {status: 4};   
                }
                const newHashedPassword = crypto.createHash('sha256').update(newPassword + salt).digest('hex');
                updateObject.password = newHashedPassword;
            }
            await collection.updateOne(userQuery, {$set: updateObject});
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

    static async editUserSettingsRoute(req, res) {
        const username = req.cookies.username;
        if (!username) {
            res.send({status: 1});
            return;
        }

        /*
        const newIcon = null; //req.body.newIcon; 
        const newUsername = "qwerty"; //req.body.newUsername;
        const newBio = "sdcfvgbdeswaswedrf"; //req.body.newBio;
        const newEmail = "test2@test.com"; //req.body.newEmail;
        const currentPassword = "testPassword123?"; //req.body.currentPassword
        const newPassword = ""; //req.body.newPassword
        const newPasswordConfirm = ""; //req.body.newPasswordConfirm
        */
        /*
        const newUsername = null; //"test-user-new";
        const newIcon = null;
        const newBio = null; //"this is a bio";
        const newEmail = null; //"test@test.com";
        const currentPassword = null; //"123456";
        const newPassword = null; //"testPassword123?";
        const newPasswordConfirm = null; //"testPassword123?";
        */
        
        const newIcon = req.body.newIcon; 
        const newUsername = req.body.newUsername;
        const newBio = req.body.newBio;
        const newEmail = req.body.newEmail;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const newPasswordConfirm = req.body.newPasswordConfirm;
        const statusObject = await UserHandler.editUserSettings(username, newIcon, newUsername, newBio, newEmail, currentPassword, newPassword, newPasswordConfirm);
        if (statusObject.status == 0 && newUsername) {
            res.cookie('username', newUsername);
            req.session.username = username;
        }
        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: user not found/not logged in, 2: email in use, 3: incorrect password, 4: passwords did not match
    }

    /**
     * Get Bookmarks
     */

    static async getBookmarks(user_id) {
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
            const idObject = new MongoClient.ObjectID(user_id);
            const userQuery = { "_id" : idObject };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            return {
                status: 0,
                result: userObject.bookmarks
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

    static async getBookmarksRoute(req, res) {
        const user_id = req.session.user_id;
        
        if (!user_id) {
            res.send({status: 1});
            return;
        }
        
        const statusObject = await UserHandler.getBookmarks(user_id);
        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: user not found/not logged in
    }

    /**
     * Get Profile Page Data
     */

    static async getProfilePageData(selfId, targetUsername) {
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
            //First, search users collection for the user object
            const collection = client.db(monogDbName).collection(mongoUserCollection);
            const selfIdObject = new MongoClient.ObjectID(selfId);
            const userQuery = { username : targetUsername };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            //Get target user's id
            const targetIdObject = userObject._id;

            //Then, search playlists collection for all of the user's playlists
            const playlistCollection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const playlistQuery = { "user_id" : targetIdObject }; 
            const playlistsObject = await playlistCollection.find(playlistQuery);
            if (!playlistsObject) {
                console.log("playlists not found");
                return {status: 1};
            }

            //Check if the end user is a follower of the target user
            const isFollowing = userObject.following.includes(selfIdObject);

            const data = {
                username: userObject.username,
                bio: userObject.bio,
                playlists: playlistsObject,
                following: isFollowing
            };

            return {
                status: 0,
                result: data
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

    static async getProfilePageDataRoute(req, res) {
        const target_username = req.body.username;
        const self_user_id = req.session.user_id;
        
        if (!target_username) {
            res.send({status: 1});
            return;
        }
        
        const statusObject = await UserHandler.getProfilePageData(self_user_id, target_username);
        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: user not found
    }

    /**
     * Get Followers
     */

    static async getFollowers(username) {
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
            //First, search users collection for the user object
            const collection = client.db(monogDbName).collection(mongoUserCollection);
            const userQuery = { username : username };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            return {
                status: 0,
                result: userObject.followers
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

    static async getFollowersRoute(req, res) {
        const username = req.body.username;
        
        if (!username) {
            res.send({status: 1});
            return;
        }
        
        const statusObject = await UserHandler.getFollowers(username);
        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: user not found
    }

    /**
     * Get Following
     */

    static async getFollowing(username) {
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
            //First, search users collection for the user object
            const collection = client.db(monogDbName).collection(mongoUserCollection);
            const userQuery = { username : username };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            return {
                status: 0,
                result: userObject.following
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

    static async getFollowingRoute(req, res) {
        const username = req.body.username;
        
        if (!username) {
            res.send({status: 1});
            return;
        }
        
        const statusObject = await UserHandler.getFollowing(username);
        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: user not found
    }

    /**
     * Get User Playlists
     */

    static async getUserPlaylists(username) {
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
            //First, search users collection for the user object
            const collection = client.db(monogDbName).collection(mongoUserCollection);
            const userQuery = { username : username };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            //Get target user's id
            const targetIdObject = userObject._id;

            //Then, search playlists collection for all of the user's playlists
            const playlistCollection = client.db(monogDbName).collection(mongoPlaylistCollection);
            const playlistQuery = { "user_id" : targetIdObject }; 
            const playlistsObject = await playlistCollection.find(playlistQuery);
            if (!playlistsObject) {
                console.log("playlists not found");
                return {status: 1};
            }

            return {
                status: 0,
                result: playlistsObject
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

    static async getUserPlaylistsRoute(req, res) {
        const username = req.body.username;
        
        if (!username) {
            res.send({status: 1});
            return;
        }
        
        const statusObject = await UserHandler.getFollowing(username);
        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: user not found
    }
}



module.exports = UserHandler;