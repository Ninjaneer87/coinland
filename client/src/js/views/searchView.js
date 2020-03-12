import {elements,formatNumbers} from './base';



export const renderCoin = (coin, btcPrice) => {
    const markup = `
        <li class="results__list__item">
            <a class="results__link" href="#${coin.id}">
                <div class="results__data">
                    <figure class="results__figure">
                        <img class="results__img" src="https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png" alt="Test">
                    </figure>
                    <p class="results__rank">${coin.cmc_rank}</p>
                    <div class="results__name__container">
                        <h4 class="results__name">${coin.name}</h4>
                        <h4 class="results__symbol">(${coin.symbol})</h4>
                    </div>
                    <div class="results__price">
                        <p class="usd__price">
                            $${formatNumbers(coin.quote.USD.price)}
                        </p>
                        <p class="btc__price">
                            ฿${formatNumbers(coin.quote.USD.price / btcPrice, 'btc')}
                        </p>
                        <span class="usd__price__change ${(coin.quote.USD.percent_change_24h < 0) ? 'minus' : ''}">
                        (${coin.quote.USD.percent_change_24h.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </a>
        </li>
    `;
    elements.resultsList.insertAdjacentHTML('beforeend', markup);
}

export const renderCoins = (coins, btcPrice, iteration, resPerLoad = 10, onScroll) => {
    if(!onScroll) elements.resultsList.innerHTML= '';
    const start = (iteration - 1) * resPerLoad;
    const end = start + resPerLoad;
    if(coins.slice(start, end).length !== 0) {
        coins.slice(start, end).forEach(c => renderCoin(c, btcPrice));
    }
};