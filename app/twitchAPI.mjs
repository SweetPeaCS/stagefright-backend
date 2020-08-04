import axios from 'axios';

// Clips
export async function getClip(id, authentication) {
    const clipEndpointURL = `https://api.twitch.tv/kraken/clips/${id}`;
    const headers = {
        "headers": {
            "Client-ID": authentication.clientid,
            "Accept": "application/vnd.twitchtv.v5+json"
        }
    };

    let response = axios.get(clipEndpointURL, headers)
    return (await response).data;
}

export async function getTopClips(channel, authentication, top=5) {
    const topClipEndpointURL = `https://api.twitch.tv/kraken/clips/top` +
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

    let response = axios.get(topClipEndpointURL, headers)
    return (await response).data.clips;
}

// Vods
export async function getVideo(id, authentication) {
    const videoEndpointURL = `https://api.twitch.tv/kraken/videos/${id}`;
    const headers = {
        "headers": {
            "Client-ID": authentication.clientid,
            "Accept": "application/vnd.twitchtv.v5+json"
        }
    };

    let response = axios.get(videoEndpointURL, headers)
    return (await response).data;
}

export async function getTopVods(channel, authentication, top=5) {
    const topVideoEndpointURL = `https://api.twitch.tv/kraken/videos/top` +
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

    let response = axios.get(topVideoEndpointURL, headers)
    return (await response).data.videos;
}