import env from '../config/environment.mjs';
import fs from 'fs';
import path from 'path';
import express from 'express';
import https from 'https';
import cors from 'cors';
import helmet from 'helmet';
import { Clips, Vods, Categories } from './mongo.mjs'

if(process.env.NODE_ENV === "developement") {
    // dev env @ localhost
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const key = fs.readFileSync('/Users/dbrause/Documents/code/stage-fright/config/ssl/server.pem', 'utf8');
const cert = fs.readFileSync('/Users/dbrause/Documents/code/stage-fright/config/ssl/server.crt', 'utf8');
const credentials = { key, cert };

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
            "clips": clip
        });
    }
});
router.put("/clips/:slug", async (req, res) => {
    const clip = await Clips.findOneAndUpdate(
        { slug: req.params.slug }, 
        req.body.clip
    );

    res.send({
        "status": 204,
        "message": "Patch complete"
    });
})
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
        const vods = await Vods.find()
            .sort({ date: -1 })
            .limit(10);
        res.send({
            "vods": [...vods]
        });
    } else {
        const vod = await Vods.findOne({ vodId: req.params.id });
        res.send({
            "vods": vod
        }); 
    }
});
router.put("/vods/:id", async (req, res) => {
    const vod = await Vods.findOneAndUpdate(
        { vodId: req.params.id }, 
        req.body.vod
    );

    res.send({
        "status": 204,
        "message": "Patch complete"
    });
});
router.get("vods/:id/clips", async (req, res) => {
    const clips = await Clips.find({ vodId: req.params.id});
    res.send({
        "clips": [...clips]
    });
});


router.get("/categories", async (req, res) => {
    const categories = await Categories.find();
    res.send({
        "categories": [...categories]
    })
});
router.post("/categories", async (req, res) => {
    const update = req.body.category;
    try {
        const categories = await Categories.findOneAndUpdate(
            { id: req.body.id }, 
            update, 
            { upsert: true }
        );
        res.status(200).send({
            status: 204,
            message: "Creation complete"
        });
    } catch(error) {
        res.status(500).send({
            status: 500,
            message: "Creation failed"
        });
    }
});
router.get("/categories/:id", async (req, res) => {
    const category = await Categories.findOne({ id: req.params.id});
    res.send({
        "categories": category
    })
});
router.post("/categories/:name", async (req, res) => {
    const update = req.body;
    const category = await Categories.findOneAndUpdate(
        { name: req.params.name }, 
        update, 
        { upsert: true }
    );
    res.status(204)
    .send({
        status: 204,
        message: "Update complete"
    });
});
router.delete("/categories/:name", async (req, res) => {
    const category = await Categories.findOneAndDelete(
        { id: req.params.name } 
    );
    res.status(204)
    .send({
        status: 204,
        message: "Deletion complete"
    });
});

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
gateway.use(helmet());
gateway.use(cors());
gateway.use(express.json());
gateway.use("/api", router);

export function startApiGateway() {
    let gatewayVars;

    if(process.env.NODE_ENV === "production") {
        gatewayVars = env.production.api;
    } else {
        gatewayVars = env.development.api;
    }

    try {
        // https.createServer(credentials, gateway).listen(gatewayVars.port);
        gateway.listen(gatewayVars.port);
        console.log("INFO: /api/ gateway launched ");
    } catch(error) {
        console.error(error);
    }
}
