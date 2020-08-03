// Libraries
import TwitchApp from './api-access/twitchApp.mjs';
import { obtainTop100Clips } from './clips-api.mjs';

// Configs
import ChannelList from '../config/channels.mjs';
import TwitchCredentials from '../config/twitch.mjs';
const { clientid, secret } = TwitchCredentials;
const access = new TwitchApp(clientid, secret);

async () => await obtainTop100Clips("esl_csgo", access)
    .then(clips => console.log(clips));
