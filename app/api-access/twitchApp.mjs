import axios from 'axios';

export default class TwitchApp {
    constructor(client, secret) {
        this.clientid = client;
        this.clientSecret = secret;
        this.init();
    }

    async init() {
        this.bearer = await this.obtainBearer(this.clientid, this.clientSecret);
    }

    async obtainBearer(id, secret) {
        const bearerEndpointURL = `https://id.twitch.tv/oauth2/token` +
            `?client_id=${id}` +
            `&client_secret=${secret}` +
            `&grant_type=client_credentials`

        axios.post(bearerEndpointURL)
                .then(response => response.data)
                .catch(error => {
                    console.error("ERR: Could not obtain bearer token");
                    console.error(`Status: HTTP ${error.response.status}`);
                });
            
    }
}
