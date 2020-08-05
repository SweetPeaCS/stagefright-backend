import env from '../config/environment.mjs';
import mongoose from 'mongoose';


export function startMongoDb() {
    if(process.env.NODE_ENV === "production") {
        mongoose.connect(`mongodb://${env.production.host}:${env.production.port}/${env.production.database}`, {useNewUrlParser: true});
    } else {
        mongoose.connect(`mongodb://${env.development.host}:${env.development.port}/${env.development.database}`, {useNewUrlParser: true});
    }
}

export function stopMongoDb() {
    mongoose.disconnect();
}

const Schema = mongoose.Schema;
const thumbnailSchema = new Schema({
    medium: { type: String },
    small: { type: String },
    tiny: { type: String },
});
const clipSchema = new Schema({
    title: { type: String, Required: "Clip needs a title" },
    slug: { type: String, Required: "Clip needs URL slug"},
    broadcaster: { type: String },
    broadcasterDisplayName: { type: String },
    broadcasterLogo: { type: String },
    duration: { type: Number },
    language: { type: String },
    game: { type: String },
    views: { type: Number },
    date: { type: Date },
    // thumbnails: { type: thumbnailSchema },
    vodId: { type: Number },
    vodUrl: { type: String },
    vodOffset: { type: Number },
});
const vodSchema = new Schema({
    title: { type: String, Required: "Vod needs a title" },
    vodId: { type: Number, Required: "Vod needs some Id" },
    length: { type: Number },
    game: { type: String },
    views: { type: Number },
    recordDate: { type: Date },
    thumbnails: { type: thumbnailSchema },
});
const Clips = mongoose.model("Clip", clipSchema);
const Vods = mongoose.model("Vods", vodSchema);

export function connectMongoDb() {

}

export function mongoDbIsConnected() {

}

export function updateMongoRecords(data) {
    if(data.vods) {
        Clips.updateMany(data.vods);
    }

    if(data.clips) {
        Vods.updateMany(data.clips);
    }
}