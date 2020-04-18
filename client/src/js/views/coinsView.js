import {elements, formatNumbers} from './base';

const renderCoin = (coin) => {
    const markup = `
        <tr class="spacer"></tr>
        <tr class="overview__item">
            <td class="overview__rank">${coin.cmc_rank}</td>
            <td class="overview__name">
            <a class="overview__link" href="#${coin.id}">
                <div class="overview__logo__name">
                    <img class="overview__img" src="https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png">&nbsp;
                    <span>${coin.name}</span>
                </div>
            </a>
            </td>
            <td class="overview__market__cap">$${formatNumbers(coin.quote.USD.market_cap)}</td>
            <td class="overview__price">$${formatNumbers(coin.quote.USD.price)}</td>
            <td class="overview__volume__24h">$${formatNumbers(coin.quote.USD.volume_24h)}</td>
            <td class="overview__circ__supply">${formatNumbers(coin.circulating_supply)} ${coin.symbol}</td>
            <td class="usd__price__change ${(coin.quote.USD.percent_change_24h < 0) ? 'minus' : ''}">
                ${(coin.quote.USD.percent_change_24h).toFixed(2)}%
            </td>
            <td class="overview__chart chart__container">
                <img src="https://s2.coinmarketcap.com/generated/sparklines/web/7d/usd/${coin.id}.png" alt="${coin.name}" class="chart__img">
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <span class="price__7d usd__price__change ${(coin.quote.USD.percent_change_7d < 0) ? 'minus' : ''}">
                    ${coin.quote.USD.percent_change_7d.toFixed(2)}%
                </span>
            </td>
        </tr>
    `;
    return markup;
}

export  const renderAllCoins = (coins, sortCB, sortEventTarget) => {
    if(sortCB) coins.sort(sortCB);
    elements.coin.innerHTML = '';
    const markup = `
        <div class="overview__container">
            <h2 class="overview__heading"> Top 100 Cryptocurrencies By Market Cap </h2>
            <div class="overview__list__container">
                <table class="overview__list">
                    <thead>
                        <tr class="overview__header overview__item">
                            <th class="overview__rank">
                                #
                                <span class="sort__container">
                                    <a class="sort__icon sortByRank"><i class="fas fa-caret-down unclickable"></i></a>
                                    <a class="sort__icon sortByRankReverse"><i class="fas fa-caret-up unclickable"></i></a>
                                </span>
                            </th>
                            <th class="overview__name">
                                Name
                                <span class="sort__container">
                                    <a class="sort__icon sortByName"><i class="fas fa-caret-down unclickable"></i></a>
                                    <a class="sort__icon sortByNameReverse"><i class="fas fa-caret-up unclickable"></i></a>
                                </span>
                            </th>
                            <th class="overview__market__cap">
                                Market Cap
                                <span class="sort__container">
                                    <a class="sort__icon sortByMarketcap"><i class="fas fa-caret-down unclickable"></i></a>
                                    <a class="sort__icon sortByMarketcapReverse"><i class="fas fa-caret-up unclickable"></i></a>
                                </span>
                            </th>
                            <th class="overview__price">
                                Price
                                <span class="sort__container">
                                    <a class="sort__icon sortByPrice"><i class="fas fa-caret-down unclickable"></i></a>
                                    <a class="sort__icon sortByPriceReverse"><i class="fas fa-caret-up unclickable"></i></a>
                                </span>
                            </th>
                            <th class="overview__volume__24h">
                                Volume 24h
                                <span class="sort__container">
                                    <a class="sort__icon sortByVolume"><i class="fas fa-caret-down unclickable"></i></a>
                                    <a class="sort__icon sortByVolumeReverse"><i class="fas fa-caret-up unclickable"></i></a>
                                </span>
                            </th>
                            <th class="overview__circ__supply">
                                Circulating Supply
                                <span class="sort__container">
                                    <a class="sort__icon sortBySupply"><i class="fas fa-caret-down unclickable"></i></a>
                                    <a class="sort__icon sortBySupplyReverse"><i class="fas fa-caret-up unclickable"></i></a>
                                </span>
                            </th>
                            <th class="overview__change__24h">
                                Change (24h)
                                <span class="sort__container">
                                    <a class="sort__icon sortByChange"><i class="fas fa-caret-down unclickable"></i></a>
                                    <a class="sort__icon sortByChangeReverse"><i class="fas fa-caret-up unclickable"></i></a>
                                </span>
                            </th>
                            <th class="overview__chart">
                                Price Graph (7d)
                                <span class="sort__container">
                                    <a class="sort__icon sortByChange7d"><i class="fas fa-caret-down unclickable"></i></a>
                                    <a class="sort__icon sortByChangeReverse7d"><i class="fas fa-caret-up unclickable"></i></a>
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${coins.map(c => renderCoin(c)).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    elements.content.innerHTML = markup;
    if(sortEventTarget)
    elements.content.querySelector(`.${sortEventTarget}`).firstElementChild.classList.add('marked');
}
