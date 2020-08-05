export default class TwitchVod {
    constructor(data) {
        this.title = data.title;
        this.game = data.game;
        this.views = data.views;
        this.date = data.created_at;
        this.thumbnails = data.thumbnails;
        this.length = data.length;
        this.recordDate = data.recorded_at;
    }

    get url() {
        return `https://clips.twitch.tv/${this.slug}`;
    }
}
