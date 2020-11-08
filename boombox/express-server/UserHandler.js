const path = require("path");
const express = require("express");
const session = require("express-session");
const multiparty = require("multiparty");
const cookieParser = require("cookie-parser");
const MongoClient = require('mongodb');
const fs = require('fs');
const crypto = require('crypto');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const mongoDbName = 'boombox';
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
            const collection = client.db(mongoDbName).collection(mongoUserCollection);
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
        //const passwordConfirm = req.body.passwordConfirm;
        const email = req.body.email;
        // if (password !== passwordConfirm) {
        //     res.send({status: 2}); //passwords do not match
        //     return;
        // }
        const statusObject = await UserHandler.registerUser(username, password, email);
        res.send(statusObject);
    }

    /*-------------*/
    /* LOGIN       */
    /*-------------*/

    static async loginUser(email, password) {
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
            const userQuery = {email: email};
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
                user_id: userObject._id,
                username: userObject.username
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

        
        // const username = 'test-user'; //req.body.username;
        // const password = 'testPassword123?'; //req.body.password;
        
       
        console.log("body", req.body);
        console.log("params", req.params);

        const email = req.body.email; 
        const password = req.body.password;
        const statusObject = await UserHandler.loginUser(email, password);
        if (statusObject.status == 0) {
            res.cookie('username', statusObject.username);
            req.session.logged_in = true;
            req.session.username = statusObject.username;
            req.session.user_id = statusObject.user_id;
            console.log('login ' + statusObject.username);
            delete statusObject.user_id;
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

    static async editUserSettings(username, newUsername, newBio, newEmail, currentPassword, newPassword, newPasswordConfirm) {
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
            const userQuery = {username: username};
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }
            var updateObject = {}
            /*
            if (newIcon) {
                //TODO: need to handle image storage
            }
            */
            if (newUsername) {
                updateObject.username = newUsername;
            }
            if (newBio) {
                updateObject.bio = newBio;
            }
            if (newEmail) {
                console.log(newEmail);
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

        const newUsername = req.body.newUsername;
        const newBio = req.body.newBio;
        const newEmail = req.body.newEmail;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const newPasswordConfirm = req.body.newPasswordConfirm;
        const statusObject = await UserHandler.editUserSettings(username, newUsername, newBio, newEmail, currentPassword, newPassword, newPasswordConfirm);
        if (statusObject.status == 0 && newUsername) {
            res.cookie('username', newUsername);
            req.session.username = newUsername;
        }
        res.send(statusObject); //[status] -1: error occurred, 0: success, 1: user not found/not logged in, 2: email in use, 3: incorrect password, 4: passwords did not match
    }

    static async editUserIcon(req, res) {  
        const username = req.cookies.username;
        if (!username) {
            res.send({status: 1});
            return;
        }

        const form = new multiparty.Form();
        const formPromise = new Promise((resolve, reject) => form.parse(req, (err, fields, files) => {
            if (err) {console.log(err);}
            return resolve([fields, files]);
        }));
        const [fields, files] = await formPromise;
        const uploadedFile = files.file[0];
        const imageExts = ["jpeg", "jpg", "png", "gif"];
        if (!uploadedFile || uploadedFile.size == 0) {
            return {status: 2}; //no file selected
        }
        const filename = uploadedFile.originalFilename;
        console.log(uploadedFile);
        console.log('filename: ', filename);
        if (!imageExts.includes(filename.substring(filename.lastIndexOf('.') + 1))) {
            console.log('not an image');
            return {status: 3} //not a proper image file
        }
        const filepath = uploadedFile.path;
        console.log('filepath: ', filepath);

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
            const db = client.db(mongoDbName);
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
            await db.collection(mongoUserCollection).updateOne({username: username}, {$set: {icon_url: uploadStream.id}});
            const fileData = fs.readFileSync(filepath, {encoding: 'base64'});
            return {status: 0, iconData: fileData};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }
    }

    static async editUserIconRoute(req, res) {
        const statusObject = await UserHandler.editUserIcon(req, res);
        res.json(statusObject);
    }

    static async getUserIconData(username) {
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
            const db = client.db(mongoDbName);

            const userCollection = db.collection(mongoUserCollection);
            const userObject = await userCollection.findOne({username: username});
            if (!userObject) {
                console.log('user not found');
                return {status: 1};
            }
            const object_id = userObject.icon_url;
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
            return {status: 0, iconData: fileData};
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }
    }

    static async getUserIconDataRoute(req, res) {
        const username = req.body.username;
        const statusObject = await UserHandler.getUserIconData(username);
        //console.log(statusObject);
        res.send(statusObject);
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
            const collection = client.db(mongoDbName).collection(mongoUserCollection);

            /*
            const idObject = new MongoClient.ObjectID(user_id);
            const userQuery = { "_id" : idObject };
            */

            const userQuery = {username: user_id};

            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            const playlistCollection = client.db(mongoDbName).collection(mongoPlaylistCollection);
            const bookmarkedPlaylists = []
            for (var i = 0; i < userObject.bookmarks.length; i++) {
                const playlistObject = await playlistCollection.findOne({"_id": userObject.bookmarks[i]});
                const userQuery = {"_id": playlistObject.user_id};
                const playlistUserObject = await collection.findOne(userQuery);
                if (!playlistUserObject) {
                    playlistObject.author = null;
                }
                else {
                    playlistObject.author = playlistUserObject.username;
                }
                playlistObject.url = "/playlist/" + userObject.bookmarks[i];
                bookmarkedPlaylists.push(playlistObject);
            }

            return {
                status: 0,
                result: bookmarkedPlaylists
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
        const user_id = req.cookies.username; //req.session.user_id;
        
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

    //static async getProfilePageData(selfId, targetUsername) {
    static async getProfilePageData(selfUsername, targetUsername) {
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
            const collection = client.db(mongoDbName).collection(mongoUserCollection);
            //const selfIdObject = new MongoClient.ObjectID(selfId);
            const userQuery = { username : targetUsername };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            //Get target user's id
            const targetIdObject = userObject._id;

            //Then, search playlists collection for all of the user's playlists
            const playlistCollection = client.db(mongoDbName).collection(mongoPlaylistCollection);
            const playlistQuery = { "user_id" : targetIdObject }; 
            const playlistsObject = await playlistCollection.find(playlistQuery);
            if (!playlistsObject) {
                console.log("playlists not found");
                return {status: 1};
            }

            const userPlaylists = [];
            await playlistsObject.forEach((playlist) => {
                userPlaylists.push(playlist);
            });
            for (var i = 0; i < userPlaylists.length; i++) {
                const playlist = userPlaylists[i];
                const userQuery = {"_id": playlist.user_id};
                const playlistUserObject = await collection.findOne(userQuery);
                if (!playlistUserObject) {
                    playlist.author = null;
                }
                else {
                    playlist.author = playlistUserObject.username;
                }
                playlist.url = "/playlist/" + playlist._id;
                console.log(playlist);
                //userPlaylists.push(playlist);
            }
            

            //Check if the end user is a follower of the target user
            //const isFollowing = userObject.following.includes(selfIdObject);
            const selfUserObject = await collection.findOne({username: selfUsername});
            var isFollowing = false;
            if (selfUserObject)
                isFollowing = userObject.following.includes(selfUserObject._id);

            const data = {
                username: userObject.username,
                bio: userObject.bio,
                playlists: userPlaylists,
                isFollowing: isFollowing,
                followers: userObject.followers,
                following: userObject.following
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
        /*
        finally {
            client.close();
        }
        */
    }

    static async getProfilePageDataRoute(req, res) {
        const target_username = req.params.username;
        //const self_user_id = req.session.user_id;
        const self_user_id = req.cookies.username;

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
            const collection = client.db(mongoDbName).collection(mongoUserCollection);
            const userQuery = { username : username };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            const userFollowers = [];
            for (var i = 0; i < userObject.followers.length; i++) {
                const followerObject = await collection.findOne({"_id": userObject.followers[i]});
                userFollowers.push(followerObject);
            }

            return {
                status: 0,
                result: userFollowers
            };
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }
        /*
        finally {
            client.close();
        }
        */
    }

    static async getFollowersRoute(req, res) {
        const username = req.params.username;
        
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
            const collection = client.db(mongoDbName).collection(mongoUserCollection);
            const userQuery = { username : username };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            const userFollowing = [];
            for (var i = 0; i < userObject.following.length; i++) {
                const followerObject = await collection.findOne({"_id": userObject.following[i]});
                userFollowing.push(followerObject);
            }

            return {
                status: 0,
                result: userFollowing
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
        const username = req.params.username;

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
            const collection = client.db(mongoDbName).collection(mongoUserCollection);
            const userQuery = { username : username };
            const userObject = await collection.findOne(userQuery);
            if (!userObject) {
                console.log("user not found");
                return {status: 1};
            }

            //Get target user's id
            const targetIdObject = userObject._id;

            //Then, search playlists collection for all of the user's playlists
            const playlistCollection = client.db(mongoDbName).collection(mongoPlaylistCollection);
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

    /*------------------------*/
    /* STANDALONE IMAGE STUFF */
    /*------------------------*/

    static async testImage(req, res) {
        /*
        variables:
            -image field name (this example has the field name as file [files.file])

        need to check:
            -if file was actually uploaded (files.content[0].size > 0)
            -check the file extension
        */
        console.log('body', req.body);

        const form = new multiparty.Form();
        const formPromise = new Promise((resolve, reject) => form.parse(req, (err, fields, files) => {
            if (err) {console.log(err);}
            return resolve([fields, files]);
        }));
        const [fields, files] = await formPromise;
        console.log('fields', fields);
        console.log(files);

        
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,  
            useUnifiedTopology: true
        }).catch(err => {
            console.log(err);
            //return {status: -1};
        });

        if (!client) {
            console.log("Client is null");
            //return {status: -1};
        }

        try {
            const db = client.db(mongoDbName);
            const bucket = new MongoClient.GridFSBucket(db);
            const readStream = fs.createReadStream(files.file[0].path);
            const uploadStream = bucket.openUploadStream(files.file[0].originalFilename);
            readStream.pipe(uploadStream)
                .on('error', (err) => {
                    throw err;
                })
                .on('finish', () => {
                    //console.log(uploadStream.id);
                })
            console.log(uploadStream.id);
            //return {status: 0}
        }
        catch (err) {
            console.log(err);
            //return {status: -1};
        }
        finally {
            //client.close();
        }
        
        res.send("hello"); //change to something that the client can actually use
    }

    static async getImageData(object_id) {
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,  
            useUnifiedTopology: true
        }).catch(err => {
            console.log(err);
            //return {status: -1};
        });

        if (!client) {
            console.log("Client is null");
            //return {status: -1};
        }

        try {
            const db = client.db(mongoDbName);
            const bucket = new MongoClient.GridFSBucket(db);
            const downloadStream = bucket.openDownloadStream(object_id);
            const writeStream = fs.createWriteStream('./tmp_file');
            downloadStream.pipe(writeStream)
                .on('error', (err) => {
                    throw err;
                })
                .on('finish', () => {
                    //console.log(uploadStream.id);
                })
            //return {status: 0}
        }
        catch (err) {
            console.log(err);
            //return {status: -1};
        }
        finally {
            //client.close();
        }
        res.send("hello"); //change to something that the client can actually use
    }


}



module.exports = UserHandler;