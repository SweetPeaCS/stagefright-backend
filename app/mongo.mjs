import env from '../config/environment.mjs';
import mongoose from 'mongoose';
import upsertMany from '@meanie/mongoose-upsert-many';

mongoose.set('useUnifiedTopology', true);
mongoose.plugin(upsertMany);
const Schema = mongoose.Schema;

const upsertManyClipsConfig = {
    matchFields: ["slug"]
}
const upsertManyVodsConfig = {
    matchFields: ["vodId"]
}
const thumbnailSchema = new Schema({
    medium: { type: String },
    small: { type: String },
    tiny: { type: String },
}).set('validateBeforeSave', false);
const clipSchema = new Schema({
    title: { type: String },
    slug: { type: String, Required: true},
    broadcaster: { type: String },
    broadcasterDisplayName: { type: String },
    broadcasterLogo: { type: String },
    duration: { type: Number },
    language: { type: String },
    game: { type: String },
    views: { type: Number },
    date: { type: Date },
    thumbnails: { type: thumbnailSchema },
    vodId: { type: Number },
    vodUrl: { type: String },
    vodOffset: { type: Number },
}).set('validateBeforeSave', false);
const vodSchema = new Schema({
    title: { type: String },
    vodId: { type: Number, Required: "Vod needs some Id" },
    length: { type: Number },
    game: { type: String },
    views: { type: Number },
    recordDate: { type: Date },
    thumbnails: { type: thumbnailSchema },
}).set('validateBeforeSave', false);
const Clips = mongoose.model("Clip", clipSchema);
const Vods = mongoose.model("Vods", vodSchema);

export async function startMongoDb() {
    let dbObject, user;

    if(process.env.NODE_ENV === "production") {
        dbObject = env.production.database;
        user = dbObject.mongodbUsers[0];
    } else {
        dbObject = env.development.database;
    }

    console.log(`INFO: Attempting connection to database`);
    console.log(`mongodb://${dbObject.host}:${dbObject.port}/${dbObject.db}`)
    mongoose.connect(`mongodb://${(user ? `${user.username}:${user.password}@`: "")}${dbObject.host}:${dbObject.port}/${dbObject.db}`, {useNewUrlParser: true})
        .then(mongooseInfo => {
            console.log(`INFO: Connection to database established`);
        })
        .catch(error => console.error(error));
}

export function stopMongoDb() {
    mongoose.disconnect();
}

export async function updateMongoRecords(data) {
    const { vods, clips } = data;
    let clipUpdate, vodUpdate;
    console.log(`INFO: Database transfer queued`);

    try {
        clipUpdate = await Clips.upsertMany(clips, upsertManyClipsConfig);
    } catch(error) {
        console.error(error);
    }

    try {
        vodUpdate = await Vods.upsertMany(vods, upsertManyVodsConfig);
    } catch(error) {
        console.error(error);
    }

    console.log(`DB INFO: Clips Updated: ${clipUpdate.nUpserted}, modified ${clipUpdate.nModified}`);
    console.log(`DB INFO: Vods Updated: ${vodUpdate.nUpserted}, modified ${vodUpdate.nModified} VODs processed`);
}