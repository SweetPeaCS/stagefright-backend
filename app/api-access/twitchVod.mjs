export default class TwitchVod {
    constructor(data) {
        this.id = data.id;
        this.vodId = data.id;
        this.title = data.title;
        this.game = data.game;
        this.views = data.views;
        this.date = data.created_at;
        this.thumbnails = {
            small: data.thumbnails.small[0].url || 0,
            medium: data.thumbnails.medium[0].url || 0,
            large: data.thumbnails.large[0].url || 0,
        } 
        this.length = data.length;
        this.recordDate = data.recorded_at;
    }

}
