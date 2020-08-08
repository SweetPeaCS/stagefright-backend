import env from '../config/environment.mjs';
import express from 'express';
import cors from 'cors';
import { Clips, Vods } from './mongo.mjs'

const gateway = express();
const router = express.Router();

router.get("/clips", async (req, res) => {
    const clips = await Clips.find()
    res.send({
        "clips": [...clips]
    });
});
router.get("/clips/:slug", async (req, res) => {
    const clip = await Clips.findOne({ slug: req.params.slug })
    res.send(clip);
});


router.get("/vods", async (req, res) => {
    const vods = await Vods.find();
    res.send({
        "vods": [...vods]
    });
});
router.get("/vods/:id", async (req, res) => {
    const vod = await Vods.findOne({ vodId: req.params.id })
    res.send(vod);
});

router.get("/categories");

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
