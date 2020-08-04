// Libraries
import { getTopClips, getVideo } from './twitchAPI.mjs';
import TwitchClip from './api-access/TwitchClip.mjs';
import ObjectsToCsv from 'objects-to-csv';

export async function getClipData(channels, access) {
    let resultClips = [];

    // Work through channel list to get Top clips
    for(let channel of channels) {
        console.log(`INFO: Getting top clips for ${channel}`);
        let clips = await getTopClips(channel, access, 100);
        console.log(`INFO: Found ${clips.length} items`);
        resultClips = [...resultClips, ...clips];
    }
    
    // resultClips = convertListofClips(resultClips);
    await writeDataToDisk(resultClips, "clips");
    return resultClips;
};

export async function getVodData(listOfClips, access) {
    let vodSet = new Set();
    let resultList = [];

    for(let clip of listOfClips) {
        vodSet.add(clip.vod.id);
    }

    for(let id of vodSet) {
        let vod = await getVodForClip(id, access)
        resultList.push(vod);
    }

    await writeDataToDisk(resultList, "vods");
    return resultList;
}

export async function getVodForClip(id, access) {
    let vod = await getVideo(id, access);
    return vod;
}

export function convertToClip(object) {
    return new TwitchClip(clip);    
}

export function convertListofClips(list) {
    let resultList = [];
    for(let clip of list) {
        resultList.push(convertToClip(clip));
    }

    return resultList;
}

export async function writeDataToDisk(list, filename) {
    const csv = new ObjectsToCsv(list);
    await csv.toDisk(`./export/${filename}.csv`);
}