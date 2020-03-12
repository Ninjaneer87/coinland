import axios from 'axios';

export default class Coin {
    constructor(id) {
        this.id = id;
    }

    getCoin(coins, meta) {
        // const coins = JSON.parse(localStorage.getItem('allCoins'));
        // const meta = JSON.parse(localStorage.getItem('metadata'));
        // console.log(bitcoinPrice);
        if(coins && meta) {
            const coinData = coins.filter(c => c.id === this.id);
            console.log('coindata: ',coinData);
            if(coinData.length > 0) {
                const coin = {...coinData, ...meta};
                console.log('coin: ', coin);
                this.name = coin[this.id].name;
                this.symbol = coin[this.id].symbol;
                this.description = coin[this.id].description;
                this.platform = coin[this.id].platform;
                this.category = coin[this.id].category;
                this.tags = coin[this.id].tags;
                this.logo = coin[this.id].logo;
                // this.website = coin[this.id].urls.website;
                // this.technical_doc = coin[this.id].urls.technical_doc;
                // this.twitter = coin[this.id].urls.twitter;
                // this.reddit = coin[this.id].urls.reddit;
                // this.message_board = coin[this.id].urls.message_board;
                // this.announcement = coin[this.id].urls.announcement;
                // this.chat = coin[this.id].urls.chat;
                // this.explorer = coin[this.id].urls.explorer;
                // this.source_code = coin[this.id].urls.source_code;
                this.cmc_rank = coin[0].cmc_rank;
                this.num_market_pairs = coin[0].num_market_pairs;
                this.date_added = coin[0].date_added;
                this.max_supply = coin[0].max_supply;
                this.circulating_supply = coin[0].circulating_supply;
                this.total_supply = coin[0].total_supply;
                this.last_updated = coin[0].last_updated;
                this.bitcoinPrice = coins[0].quote.USD.price;
                
                this.price = coin[0].quote.USD.price;
                this.volume_24h = coin[0].quote.USD.volume_24h;
                this.percent_change_1h = coin[0].quote.USD.percent_change_1h;
                this.percent_change_24h = coin[0].quote.USD.percent_change_24h;
                this.percent_change_7d = coin[0].quote.USD.percent_change_7d;
                this.priceInBitcoin = coin[0].quote.USD.price / this.bitcoinPrice;
                this.market_cap = coin[0].quote.USD.market_cap;
                
                this.links = {
                    website: coin[this.id].urls.website,
                    explorer: coin[this.id].urls.explorer,
                    technical_doc: coin[this.id].urls.technical_doc,
                    message_board: coin[this.id].urls.message_board,
                    source_code: coin[this.id].urls.source_code,
                    announcement: coin[this.id].urls.announcement,
                    chat: coin[this.id].urls.chat,
                    twitter: coin[this.id].urls.twitter,
                    reddit: coin[this.id].urls.reddit,
                }
                // console.log(this.priceInBitcoin)
            }


        }

    }
}