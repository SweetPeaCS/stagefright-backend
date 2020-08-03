import axios from 'axios';

export async function obtainTop100Clips(channel, authentication) {
    const top100EndpointURL = `https://api.twitch.tv/kraken/clips/top` +
        `?channel=${channel}` +
        `&period=month` +
        `&trending=false` +
        `&limit=1`;
    const headers = {
        "headers": {
            "Client-ID": authentication.clientid,
            "Accept": "application/vnd.twitchtv.v5+json"
        }
    };

    axios.get(top100EndpointURL, headers)
        .then(response => {
            console.log("Step 1: " +response.data.title)
            return response.data; 
        })
        .catch(error => {
            console.error("ERR: Could not get response from Clip API");
            console.error(`Status: HTTP ${error.response.status}`);
        });
}
