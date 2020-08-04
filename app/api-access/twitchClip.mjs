export default class TwitchClip {
    constructor(data) {
        this.title = data.title;
        this.slug = data.slug;
        this.broadcaster = data.broadcaster;
        this.vod = data.vod;
        this.game = data.game;
        this.views = data.views;
        this.date = data.created_at;
        this.thumbnails = data.thumbnails
    }

    get url() {
        return `https://clips.twitch.tv/${this.slug}`;
    }
}
