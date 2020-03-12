
export default class Search {
    constructor(coins) {
        this.coins = coins;
    }
    searchCoins(query) {
        let result;
        if(query) {
            query = query.toLowerCase();
            result = this.coins.filter(c => c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query));
        } else {
            result = this.coins;
        }
        console.log('result from search model', result)
        return result;
    }
}