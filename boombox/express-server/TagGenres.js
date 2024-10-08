const MongoClient = require('mongodb');

const mongoUrl = "mongodb+srv://admin:o8chnzxErmyP7sgK@cluster0.avhnr.mongodb.net?retryWrites=true&w=majority";
const monogDbName = 'boombox';
const mongoTagCollection = 'tags';

//https://www.musicgenreslist.com/

class TagGenres {
    static async pushTags(){ 
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
            const collection = client.db(monogDbName).collection(mongoTagCollection);
            // perform actions on the collection object
            await collection.insertMany([
                { tag_id: "alternative" },
                { tag_id: "alternative rock" },
                { tag_id: "experimental rock" },
                { tag_id: "folk punk" },
                { tag_id: "goth" },
                { tag_id: "grunge" },
                { tag_id: "hardcore punk" },
                { tag_id: "hard rock" },
                { tag_id: "indie rock" },
                { tag_id: "lo-fi" },
                { tag_id: "new wave" },
                { tag_id: "progressive rock" },
                { tag_id: "punk" },
                { tag_id: "steampunk" },
                { tag_id: "anime" },
                { tag_id: "blues" },
                { tag_id: "acoustic" },
                { tag_id: "african" },
                { tag_id: "r&b" },
                { tag_id: "ragtime" },
                { tag_id: "classical" },
                { tag_id: "avant-garde" },
                { tag_id: "baroque" },
                { tag_id: "chamber music" },
                { tag_id: "choral" },
                { tag_id: "concerto" },
                { tag_id: "expressionist" },
                { tag_id: "impressionist" },
                { tag_id: "medieval" },
                { tag_id: "minimalism" },
                { tag_id: "opera"},
                { tag_id: "orchestral" },
                { tag_id: "renaissance" },
                { tag_id: "symphonic" },
                { tag_id: "parody music" },
                { tag_id: "country" },
                { tag_id: "bluegrass" },
                { tag_id: "gospel" },
                { tag_id: "pop" },
                { tag_id: "rock" },
                { tag_id: "rap" },
                { tag_id: "soul" },
                { tag_id: "western" },
                { tag_id: "progressive" },
                { tag_id: "dance" },
                { tag_id: "edm" },
                { tag_id: "club" },
                { tag_id: "dubstep" },
                { tag_id: "house" },
                { tag_id: "electronic" },
                { tag_id: "electroswing" },
                { tag_id: "garage" },
                { tag_id: "grime" },
                { tag_id: "breakcore" },
                { tag_id: "techno" },
                { tag_id: "trance" },
                { tag_id: "trap" },
                { tag_id: "easy listening" },
                { tag_id: "swing" },
                { tag_id: "lounge" },
                { tag_id: "8bit" },
                { tag_id: "chiptune" },
                { tag_id: "ambient" },
                { tag_id: "drum and bass" },
                { tag_id: "electro" },
                { tag_id: "electroacoustic" },
                { tag_id: "glitch" },
                { tag_id: "electronic rock" },
                { tag_id: "synthpop" },
                { tag_id: "eurobeat" },
                { tag_id: "experimental" },
                { tag_id: "industrial" },
                { tag_id: "folk" },
                { tag_id: "hip hop" },
                { tag_id: "latin" },
                { tag_id: "holiday" },
                { tag_id: "indie" },
                { tag_id: "indie pop" },
                { tag_id: "noise" },
                { tag_id: "instrumental" },
                { tag_id: "j-pop" },
                { tag_id: "asian" },
                { tag_id: "jazz" },
                { tag_id: "bebop" },
                { tag_id: "big band" },
                { tag_id: "dixieland" },
                { tag_id: "k-pop" },
                { tag_id: "tango" },
                { tag_id: "bossa nova" },
                { tag_id: "mariachi" },
                { tag_id: "metal" },
                { tag_id: "heavy metal" },
                { tag_id: "new age" },
                { tag_id: "meditation" },
                { tag_id: "disco" },
                { tag_id: "boogie" },
                { tag_id: "funk" },
                { tag_id: "reggae" },
                { tag_id: "ska" },
                { tag_id: "afro punk" },
                { tag_id: "traditional" },
                { tag_id: "soundtrack" },
                { tag_id: "musical" },
                { tag_id: "video game" },
                { tag_id: "vocal" },
                { tag_id: "acappella" },
                { tag_id: "gregorian chant" },
                { tag_id: "standards" },
                { tag_id: "calypso" },
                { tag_id: "caribbean" },
                { tag_id: "australia" },
                { tag_id: "celtic" },
                { tag_id: "europe" },
                { tag_id: "france" },
                { tag_id: "japan" },
                { tag_id: "china" },
                { tag_id: "klezmer" },
                { tag_id: "middle east" },
                { tag_id: "hawaii" },
                { tag_id: "polka" },
                { tag_id: "south america" },
            ]);
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
}

TagGenres.pushTags();

