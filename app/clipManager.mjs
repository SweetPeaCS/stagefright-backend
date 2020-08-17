// Libraries
import { getTopClips, getVideo } from './twitchAPI.mjs';
import TwitchClip from './api-access/TwitchClip.mjs';
import TwitchVod from './api-access/TwitchVod.mjs';
import ObjectsToCsv from 'objects-to-csv';

export async function getClipData(channels, access) {
    let resultClips = [];

    // Work through channel list to get Top clips
    for(let channel of channels) {
        try {
            let clips = await getTopClips(channel, access, 100);
            console.log(`INFO: Found ${clips.length} clips for ${channel}`);
            resultClips = [...resultClips, ...clips];
        } catch(error) {
            console.error(`ERR: HTTP ${error.response.status}`);
            console.error(`ERR: Could not get clips for Channel ${channel}`);
        }
        
    }
    
    resultClips = convertListofClipObjects(resultClips);
    if(process.env.NODE_ENV === "development") {
        await writeDataToDisk(resultClips, "clips");
    }
    return resultClips;
};

export async function getVodData(listOfClips, access) {
    let vodSet = new Set();
    let resultList = [];

    for(let clip of listOfClips) {
        if(clip.vodId) {
            vodSet.add(clip.vodId);
        }
    }

    console.log(`INFO: Looking for ${vodSet.size} VODs`)
    console.log(`INFO: This may take a while...`)

    for(let id of vodSet) {
        try {
            let vod = await getVodForClip(id, access)
            resultList.push(vod);
        } catch(error) {
            console.error(`ERR: Problem getting VOD for ID ${id}`)
        }
    }

    resultList = convertListofVodObjects(resultList);
    if(process.env.NODE_ENV === "development") {
        await writeDataToDisk(resultList, "vods");
    }
    return resultList;
}

export async function getVodForClip(id, access) {
    let vod = await getVideo(id, access);
    return vod;
}

export function convertListofClipObjects(list) {
    let resultList = [];

    for(let clip of list) {
        let newClip = new TwitchClip(clip);
        resultList.push(newClip);
    }

    return resultList;
}

export function convertListofVodObjects(list) {
    let resultList = [];

    for(let clip of list) {
        try {
        let newVod = new TwitchVod(clip);
        resultList.push(newVod);
        } catch(error) {
            console.error("Failed to generate Vod for:");
            console.error(clip);
        }
    }

    return resultList;
}

export async function writeDataToDisk(list, filename) {
    const csv = new ObjectsToCsv(list);
    await csv.toDisk(`./export/${filename}.csv`);
}