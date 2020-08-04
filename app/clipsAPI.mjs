import axios from 'axios';

export async function obtainTopClips(channel, authentication, top=5) {
    const top100EndpointURL = `https://api.twitch.tv/kraken/clips/top` +
        `?channel=${channel}` +
        `&period=month` +
        `&trending=false` +
        `&limit=${top}`;
    const headers = {
        "headers": {
            "Client-ID": authentication.clientid,
            "Accept": "application/vnd.twitchtv.v5+json"
        }
    };

    let response = axios.get(top100EndpointURL, headers)
    return (await response).data.clips;
}
