// Libraries
import TwitchApp from './api-access/twitchApp.mjs';
import { getClipData, getVodData } from './clipManager.mjs';
import { startMongoDb, stopMongoDb, updateMongoRecords } from './mongo.mjs';

// Configs
import ChannelList from '../config/channels.mjs';
import TwitchCredentials from '../config/twitch.mjs';
const { clientid, secret } = TwitchCredentials;
const access = new TwitchApp(clientid, secret);

export async function launch() {
    startMongoDb();
    // startApiGateway();
    await forceRefreshData();
    // startFrontEnd();
    stopMongoDb();
}

export async function forceRefreshData() {
    const topClips = await getClipData(ChannelList, access);
    const vods = await getVodData(topClips, access);
    console.log(`INFO: Found ${vods.length} matching vods`);
    console.log(`INFO: for total of ${topClips.length} clips`);
    const saveData = { "clips": topClips, "vods": vods };
    updateMongoRecords(saveData);
}