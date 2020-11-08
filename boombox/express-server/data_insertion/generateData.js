const MongoClient = require('mongodb');
const fs = require('fs');
const crypto = require('crypto');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const mongoDbName = 'boombox';
const mongoUserCollection = 'users';
const mongoPlaylistCollection = 'playlists';

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
            return {status: -1};
        });
        if (!client) {
            console.log("Client is null");
            return {status: -1};
        }
        this.client = client;

        try {
            DataGenerator.uploadImages();
            DataGenerator.generateUsers();
            DataGenerator.generateTags();
            DataGenerator.generatePlaylists();
            DataGenerator.generateAdditionalData();
        }
        catch (err) {
            console.log(err);
            return {status: -1};
        }

        return {status: 0}
    }


    static async uploadImages() {
        const images = null; //load from json - format: {filename, path}

        const db = client.db(mongoDbName);
        const bucket = new MongoClient.GridFSBucket(db);

        for (const [key, value] of Object.entries(images)) {
            const readStream = fs.createReadStream(filepath);
            const uploadStream = bucket.openUploadStream(filename);
            readStream.pipe(uploadStream)
                .on('error', (err) => {
                    throw err;
                }).on('finish', () => {});
            images.key.objectId = uploadStream.id;
        }
    }

    static async generateUsers() {
        //replace icon_urls with objectid responses from uploadimages
        //password is plaintext by default, generate a salt and hash before insert
    }

    static async generateTags() {

    }

    static async generatePlaylists() {
        //replace user_ids with id responses from generateuser, and image_urls with objectids from uploadimages
    }

    static async generateAdditionalData() {
        //add bookmarks, likes, follows, etc.
    }
}

DataGenerator.generateData();