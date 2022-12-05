export const sortByRank = (a, b) => {
    if (a.cmc_rank < b.cmc_rank ){
        return -1;
    }
    if ( a.cmc_rank > b.cmc_rank ){
        return 1;
    }
    return 0;
};
export const sortByRankReverse = (a, b) => {
    if (a.cmc_rank > b.cmc_rank ){
        return -1;
    }
    if ( a.cmc_rank < b.cmc_rank ){
        return 1;
    }
    return 0;
};
export const sortByMarketcap = (a, b) => {
    if (a.quote.USD.market_cap > b.quote.USD.market_cap ){
        return -1;
    }
    if ( a.quote.USD.market_cap < b.quote.USD.market_cap ){
        return 1;
    }
    return 0;
};
export const sortByMarketcapReverse = (a, b) => {
    if (a.quote.USD.market_cap < b.quote.USD.market_cap ){
        return -1;
    }
    if ( a.quote.USD.market_cap > b.quote.USD.market_cap ){
        return 1;
    }
    return 0;
};
export const sortByPrice = (a, b) => {
    if (a.quote.USD.price > b.quote.USD.price ){
        return -1;
    }
    if ( a.quote.USD.price < b.quote.USD.price ){
        return 1;
    }
    return 0;
};
export const sortByPriceReverse = (a, b) => {
    if (a.quote.USD.price < b.quote.USD.price ){
        return -1;
    }
    if ( a.quote.USD.price > b.quote.USD.price ){
        return 1;
    }
    return 0;
};
export const sortByVolume = (a, b) => {
    if (a.quote.USD.volume_24h > b.quote.USD.volume_24h ){
        return -1;
    }
    if ( a.quote.USD.volume_24h < b.quote.USD.volume_24h ){
        return 1;
    }
    return 0;
};
export const sortByVolumeReverse = (a, b) => {
    if (a.quote.USD.volume_24h < b.quote.USD.volume_24h ){
        return -1;
    }
    if ( a.quote.USD.volume_24h > b.quote.USD.volume_24h ){
        return 1;
    }
    return 0;
};
export const sortBySupply = (a, b) => {
    if (a.circulating_supply > b.circulating_supply ){
        return -1;
    }
    if ( a.circulating_supply < b.circulating_supply ){
        return 1;
    }
    return 0;
};
export const sortBySupplyReverse = (a, b) => {
    if (a.circulating_supply < b.circulating_supply ){
        return -1;
    }
    if ( a.circulating_supply > b.circulating_supply ){
        return 1;
    }
    return 0;
};
export const sortByChange = (a, b) => {
    if (a.quote.USD.percent_change_24h > b.quote.USD.percent_change_24h ){
        return -1;
    }
    if ( a.quote.USD.percent_change_24h < b.quote.USD.percent_change_24h ){
        return 1;
    }
    return 0;
};
export const sortByChangeReverse = (a, b) => {
    if (a.quote.USD.percent_change_24h < b.quote.USD.percent_change_24h ){
        return -1;
    }
    if ( a.quote.USD.percent_change_24h > b.quote.USD.percent_change_24h ){
        return 1;
    }
    return 0;
};
export const sortByChange7d = (a, b) => {
    if (a.quote.USD.percent_change_7d > b.quote.USD.percent_change_7d ){
        return -1;
    }
    if ( a.quote.USD.percent_change_7d < b.quote.USD.percent_change_7d ){
        return 1;
    }
    return 0;
};
export const sortByChangeReverse7d = (a, b) => {
    if (a.quote.USD.percent_change_7d < b.quote.USD.percent_change_7d ){
        return -1;
    }
    if ( a.quote.USD.percent_change_7d > b.quote.USD.percent_change_7d ){
        return 1;
    }
    return 0;
};