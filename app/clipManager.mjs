// Libraries
import { obtainTopClips } from './clipsAPI.mjs';
import TwitchClip from './api-access/TwitchClip.mjs';
import ObjectsToCsv from 'objects-to-csv';

export async function getClipData(channels, access) {
    let resultClips = [];

    // Work through channel list to get Top clips
    for(let channel of channels) {
        console.log(`INFO: Getting top clips for ${channel}`);
        let clips = await obtainTopClips(channel, access, 100);
        console.log(`INFO: Found ${clips.length} items`);
        resultClips = [...resultClips, ...clips];
    }
    
    // resultClips = convertListofClips(resultClips);
    await writeDataToDisk(resultClips);
    return resultClips;
};

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

export async function writeDataToDisk(list) {
    const csv = new ObjectsToCsv(list);
    await csv.toDisk("./export/test.csv");
}