// Libraries
import { getTopClips, getVideo } from './twitchAPI.mjs';
import TwitchClip from './api-access/TwitchClip.mjs';
import TwitchVod from './api-access/TwitchVod.mjs';
import ObjectsToCsv from 'objects-to-csv';

export async function getClipData(channels, access) {
    let resultClips = [];

    // Work through channel list to get Top clips
    for(let channel of channels) {
        console.log(`INFO: Getting top clips for ${channel}`);
        let clips = await getTopClips(channel, access, 100);
        console.log(`Found ${clips.length} clips`);
        resultClips = [...resultClips, ...clips];
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

    for(let id of vodSet) {
        let vod = await getVodForClip(id, access)
        resultList.push(vod);
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
        let newVod = new TwitchVod(clip);
        resultList.push(newVod);
    }

    return resultList;
}

export async function writeDataToDisk(list, filename) {
    const csv = new ObjectsToCsv(list);
    await csv.toDisk(`./export/${filename}.csv`);
}