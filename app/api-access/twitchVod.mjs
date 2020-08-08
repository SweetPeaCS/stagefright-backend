export default class TwitchVod {
    constructor(data) {
        this.vodId = data.id;
        this.title = data.title;
        this.game = data.game;
        this.views = data.views;
        this.date = data.created_at;
        this.thumbnails = {
            small: data.thumbnails.small[0].url,
            medium: data.thumbnails.medium[0].url,
            large: data.thumbnails.large[0].url,
        } 
        this.length = data.length;
        this.recordDate = data.recorded_at;
    }

}
