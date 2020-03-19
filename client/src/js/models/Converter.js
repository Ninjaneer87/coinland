export default class Converter {
    constructor(id) {
        this.id = id;
    }

    getValues(coins) {
        if(this.id) {
            const coin = coins.filter(c => c.id === this.id).map(c => ({name: c.name, symbol: c.symbol, price: c.quote.USD.price}))[0];
            if(coin) this.coin = coin;
        } else {
            this.coin = {
                name: 'United States Dollar',
                symbol: 'USD',
                price: 1
            }
        }

    }
}