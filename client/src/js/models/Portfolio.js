export default class Portfolio {
    constructor() {
        this.portfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
    }

    addItem(id, name, symbol, rank, logo, priceInUSD, priceInBTC, percent_change_24h, amount) {
        const item = {id, name, symbol, rank, logo, priceInUSD, priceInBTC, percent_change_24h, amount};
        this.portfolio.push(item);
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
        return item;
    }
    deleteItem(id) {
        console.log('portfolio before: ', this.portfolio);
        this.portfolio = this.portfolio.filter(item => item.id !== id);
        console.log('id from deleteitem portfolio model: ', id)
        console.log('portfolio after: ', this.portfolio);
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
    }
    updateAmount(id, amount) {
        const updatedItem = this.portfolio.find(item => item.id === id)
        updatedItem.amount = amount;
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
        return updatedItem;
    }
    updatePortfolio(coins, btcPrice) {
        const newPortfolio = this.portfolio.map(item => {
            let updatedValues = coins.filter(c => c.id === item.id).map(c => ({
                priceInUSD: c.quote.USD.price,
                priceInBTC: c.quote.USD.price / btcPrice,
                percent_change_24h: c.quote.USD.percent_change_24h
            }))[0];
            return {...item, ...updatedValues};
        });
        this.portfolio = newPortfolio;
        localStorage.setItem('portfolio', JSON.stringify(newPortfolio));
    }
    portfolioCount() {
        return this.portfolio.length;
    }
    inPortfolio(id) {
        return this.portfolio.some(el => el.id === id);
    }
}