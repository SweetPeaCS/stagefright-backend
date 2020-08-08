import env from '../config/environment.mjs';
import express from 'express';

const gateway = express();

export function startApiGateway() {
    if(process.env.NODE_ENV === "production") {
        gateway.listen(env.production.frontend.port);
    } else {
        gateway.listen(env.development.frontend.port);
    }
}
