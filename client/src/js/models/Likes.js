export default class Likes {
    constructor() {
        this.likes = JSON.parse(localStorage.getItem('likes')) || [];
    }

    addLike(id, name, symbol, rank, logo, priceInUSD, priceInBTC, percent_change_24h) {
        const like = {id, name, symbol, rank, logo, priceInUSD, priceInBTC, percent_change_24h};
        this.likes.push(like);
        localStorage.setItem('likes', JSON.stringify(this.likes));
        return like;
    }
    deleteLike(id) {
        this.likes = [...this.likes.filter(like => like.id !== id)];
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    likesCount() {
        return this.likes.length;
    }
    isLiked(id) {
        return this.likes.some(el => el.id === id);
    }
    updateLikes(coins, btcPrice) {
        const newLikes = this.likes.map(like => {
            let updatedValues = coins.filter(c => c.id === like.id).map(c => ({
                rank: c.cmc_rank,
                priceInUSD: c.quote.USD.price,
                priceInBTC: c.quote.USD.price / btcPrice,
                percent_change_24h: c.quote.USD.percent_change_24h
            }))[0];
            return {...like, ...updatedValues};
        });
        this.likes = newLikes;
        localStorage.setItem('likes', JSON.stringify(newLikes));
    }

}