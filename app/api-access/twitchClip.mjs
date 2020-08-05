export default class TwitchClip {
    constructor(data) {
        this.title = data.title;
        this.slug = data.slug;
        this.broadcaster = data.broadcaster.name;
        this.broadcasterDisplayName = data.broadcaster.displayname;
        this.broadcasterLogo = data.broadcaster.logo;
        this.duration = data.duration;
        this.language = data.language;
        this.game = data.game;
        this.views = data.views;
        this.date = data.created_at;
        // this.thumbnails = data.thumbnails;

        if(data.vod) {
            this.vodId = data.vod.id;
            this.vodUrl = data.vod.url;
            this.vodOffset = data.vod.offset;    
        }
    }

    get url() {
        return `https://clips.twitch.tv/${this.slug}`;
    }
}
