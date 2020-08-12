import env from '../config/environment.mjs';
import express from 'express';
import cors from 'cors';
import { Clips, Vods } from './mongo.mjs'

const gateway = express();
const router = express.Router();

router.get("/clips", async (req, res) => {
    let clips;
    if(req.query.vodId) {
        let search = req.query.vodId;
        clips = await Clips.find({ vodId: search });
    } else {
        clips = await Clips.find();
    }

    res.send({
        "clips": [...clips]
    });
});
router.get("/clips/:slug", async (req, res) => {
    if (req.params.slug === "latest") {
        const clips = await Clips.find().sort({ date: -1 }).limit(10);
        res.send({
            "clips": [...clips]
        });
    } else {
        const clip = await Clips.findOne({ slug: req.params.slug })
        res.send({
            "clips": clips
        });
    }
});
router.get("/clips/:slug/vod", async (req, res) => {
    const clip = await Clips.findOne({ slug: req.params.slug });
    if(clip.vodId) {
        const vod = await Vods.findOne({ vodId: clip.vodId });
        res.send({
            "vods": vod
        });
    } else {
        res.status(404)
            .send("This Clip has no live vod");
    }    
});


router.get("/vods", async (req, res) => {
    const vods = await Vods.find();
    res.send({
        "vods": [...vods]
    });
});
router.get("/vods/:id", async (req, res) => {
    if (req.params.id === "latest") {
        const vods = await Vods.find().sort({ date: -1 }).limit(10);
        res.send({
            "vods": [...vods]
        });
    } else {
        const vod = await Vods.findOne({ vodId: req.params.id })
        res.send({
            "vods": vod
        });
    }
});
router.get("vods/:id/clips", async (req, res) => {
    const clips = await Clips.find({ vodId: req.params.id});
    res.send({
        "clips": [...clips]
    });
});


router.get("/categories");
router.get("/channel/:broadcaster", async (req, res) => {
    const clips = await Clips.find({ broadcaster: req.params.broadcaster });
    res.send({
        "clips": [...clips]
    });
});

router.get("/search", async (req, res) => {
    const query = req.params.query;
    
    const clips = await Clips.find({
        $or:[
            { 'title': query }, 
            { 'broadcaster': query }, 
            { 'slug': query }, 
            { 'game': query } 
        ]
    });
    
    const vods = await Vods.find({
        $or:[ 
            { 'title': query }, 
            { 'name': query} , 
            { 'nickname': query }, 
            { 'game': query }
        ]
    });
    
    res.send({
        "clips": [...clips],
        "vods": [...vods]
    });
});

// Router setup
gateway.use(cors());
gateway.use("/api", router);

export function startApiGateway() {
    let gatewayVars;

    if(process.env.NODE_ENV === "production") {
        gatewayVars = env.production.api;
    } else {
        gatewayVars = env.development.api;
    }

    try {
        gateway.listen(gatewayVars.port);
        console.log("INFO: /api/ gateway launched ");
    } catch(error) {
        console.error(error);
    }
}
