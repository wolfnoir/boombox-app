const { ObjectID, ObjectId } = require("mongodb");
const MongoClient = require('mongodb');
const fs = require('fs');
const crypto = require('crypto');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const mongoDbName = 'boombox-test';
const mongoUserCollection = 'users';
const mongoPlaylistCollection = 'playlists';
const mongoTagCollection = 'tags';
const baseImagePath = "../../src/images/";

class DataGenerator {

    /*
        CHANGE FORMAT OF JSONS TO BE KEYBASED NOT PLAIN ARRAY
        TAGS.JSON CAN BE AN EXCEPTION SO TAG_ID IS ALREADY AN IDENTIFIER
    */

    static async generateData() {
        
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,  
            useUnifiedTopology: true
        }).catch(err => {
            console.log(err);
            process.exit(1);
        });
        if (!client) {
            console.log("Client is null");
            process.exit(1);
        }
        this.client = client;
        
        const images = await DataGenerator.uploadImages();
        const users = await DataGenerator.generateUsers(images);
        const tags = await DataGenerator.generateTags();
        const playlists = await DataGenerator.generatePlaylists(images, users);
        //await DataGenerator.generateAdditionalData(users, playlists);
        client.close();
        process.exit(0);
    }


    static async uploadImages() {
        console.log("upload images")
        const fileData = fs.readFileSync('images.json');
        const images = JSON.parse(fileData);

        const db = this.client.db(mongoDbName);
        const bucket = new MongoClient.GridFSBucket(db);

        for (const [image, value] of Object.entries(images)) {
            //console.log("\t", image);
            const filepath = baseImagePath + value.path;
            const filename = value.name;
            
            const readStream = fs.createReadStream(filepath);
            const uploadStream = bucket.openUploadStream(filename);
            //console.log(uploadStream);

            const uploadPromise = new Promise((resolve, reject) => {
                readStream.pipe(uploadStream)
                .on('error', (err) => {
                    throw err;
                })
                .on('finish', () => {
                    console.log("\tfinished upload");
                    return resolve();
                });
            });
            await uploadPromise;
            images[image].objectId = uploadStream.id;
            console.log("\timage: " +  image + " id: " + uploadStream.id);   
        } 
        return images;
    }

    static async generateUsers(images) {
        console.log("generate users");

        const fileData = fs.readFileSync('users.json');
        const users = JSON.parse(fileData);

        const db = this.client.db(mongoDbName);
        const usersCollection = db.collection(mongoUserCollection);

        for (const [user, value] of Object.entries(users)) {
            const salt = crypto.randomBytes(16).toString('hex');
            const hashedPassword = crypto.createHash('sha256').update(value.password + salt).digest('hex');
            value.password = hashedPassword;
            users[user].password = hashedPassword;

            const imageId = images[value.icon_url] ? images[value.icon_url].objectId : null;
            value.icon_url = imageId;
            users[user].icon_url = imageId;
            
            const res = await usersCollection.insertOne(value);
            users[user].objectId = res.insertedId;
        }
        return users;
    }

    static async generateTags() {
        console.log("generate tags");

        const fileData = fs.readFileSync('tags.json');
        const tags = JSON.parse(fileData);

        const db = this.client.db(mongoDbName);
        const tagsCollection = db.collection(mongoTagCollection);

        const res = await tagsCollection.insertMany(tags);
        const tagList = [];        
        for (const [tag, value] of Object.entries(tags)) {
            tagList.push(value.tag_id);
        }
        return tagList;
    }

    static async generatePlaylists(images, users) {
        console.log("generate playlists");
        
        const fileData = fs.readFileSync('playlists.json');
        const playlists = JSON.parse(fileData);

        const db = this.client.db(mongoDbName);
        const playlistsCollection = db.collection(mongoPlaylistCollection);
        
        for (const [playlist, value] of Object.entries(playlists)) {
            const userId = users[value.user_id] ? users[value.user_id].objectId : null;
            value.user_id = userId;
            playlists[playlist].user_id = userId;

            const imageId = images[value.image_url] ? images[value.image_url].objectId : null;
            value.image_url = imageId;
            playlists[playlist].image_url = imageId;

            const res = await playlistsCollection.insertOne(value);
            playlists[playlist].objectId = res.insertedId;
        }
        return playlists;
    }

    //UNTESTED
    static async generateAdditionalData(users, playlists) {
        console.log("generate additional data");

        const db = this.client.db(mongoDbName);
        const playlistsCollection = db.collection(mongoPlaylistCollection);
        const usersCollection = db.collection(mongoUserCollection);

        for (const [user, value] of Object.entries(users)) {
            const updateDoc = {};
            const following = [];
            const followers = [];
            const bookmarks = [];
            var i;
            for (i = 0; i < value.following.length; i++) {
                const userId = users[value.following[i]] ? users[value.following[i]].objectId : null;
                if (userId) {
                    following.push(userId);
                }
            }
            for (i = 0; i < value.followers.length; i++) {
                const userId = users[value.followers[i]] ? users[value.followers[i]].objectId : null;
                if (userId) {
                    followers.push(userId);
                }
            }
            for (i = 0; i < value.bookmarks.length; i++) {
                const playlistId = playlists[value.bookmarks[i]] ? playlists[value.bookmarks[i]].objectId : null;
                if (playlistId) {
                    bookmarks.push(playlistId);
                }
            }
            updateDoc.following = following;
            updateDoc.followers = followers;
            updateDoc.bookmarks = bookmarks;
            await usersCollection.updateOne({username: value.username}, {$set: updateDoc});
        }
        
        //for (const [playlist, value] of Object.entries(playlists)) {}

        return;
    }
}

DataGenerator.generateData();