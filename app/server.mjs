// Libraries
import TwitchApp from './api-access/twitchApp.mjs';
import { getClipData, getVodData } from './clipManager.mjs';
import { updateMongoRecords } from './mongo.mjs';

// Configs
import ChannelList from '../config/channels.mjs';
import TwitchCredentials from '../config/twitch.mjs';
const { clientid, secret } = TwitchCredentials;
const access = new TwitchApp(clientid, secret);

export async function launch() {
    // startMongoDb();
    // mongoDbIsOnline();
    await forceRefreshData();
    // startFrontEnd();
}

export async function forceRefreshData() {
    const topClips = await getClipData(ChannelList, access);
    const vods = await getVodData(topClips, access);
    updateMongoRecords(topClips, vods);
}