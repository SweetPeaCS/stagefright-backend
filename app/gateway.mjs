import env from '../config/environment.mjs';
import express from 'express';
import { Clips, Vods } from './mongo.mjs'

const gateway = express();
const router = express.Router();

router.get("/clips", async (req, res) => res.send(await Clips.find()));
router.get("/clips/:slug", async (req, res) => {
    const clip = await Clips.findOne({ slug: req.params.slug })
    res.send(clip);
});


router.get("/vods", async (req, res) => res.send(await Vods.find()));
router.get("/vods/:id", async (req, res) => {
    const vod = await Vods.findOne({ vodId: req.params.id })
    res.send(vod);
});

router.get("/categories");

export function startApiGateway() {
    let gatewayVars;
    gateway.use("/api", router);

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
