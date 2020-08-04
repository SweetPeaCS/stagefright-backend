// Libraries
import TwitchApp from './api-access/twitchApp.mjs';
import { getClipData } from './clipManager.mjs';

// Configs
import ChannelList from '../config/channels.mjs';
import TwitchCredentials from '../config/twitch.mjs';
const { clientid, secret } = TwitchCredentials;
const access = new TwitchApp(clientid, secret);

export function launch() {
    // startMongoDb();
    getClipData(ChannelList, access);
    // getVodData();
    // startFrontEnd();
}

export function forceRefreshData() {
    getClipData(ChannelList, access);
    // getVodData();
}