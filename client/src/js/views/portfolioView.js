import { elements, formatNumbers } from './base';

export const togglePortfolioButton = (inPortfolio) => {
    inPortfolio ? 
    elements.coin.querySelector('.portfolio__icon').classList.add('marked') : 
    elements.coin.querySelector('.portfolio__icon').classList.remove('marked');
}

export const addAmount = (coin, inPortfolio) => {
    const markup = `
        <form class="portfolio__wrap">
            <input type="number" step="0.00000001" class="portfolio__input" maxlength="10" placeholder="Amount of ${coin.symbol}">
            <button class="portfolio__submit" disabled>${inPortfolio ? 'Update': 'Add'}</button>
        </form>
    `;
    return markup;
};

export const renderItem = (item) => {
    const markup = `
        <li class="portfolio__item" data-id="${item.id}">
            <img class="portfolio__img" src="${item.logo}" />
            <div class="portfolio__symbol">${item.symbol}</div>
            <div class="portfolio__price">
                <div class="portfolio__usd">$${formatNumbers(item.priceInUSD)}</div>
                <div class="portfolio__btc">฿${formatNumbers(item.priceInBTC, 'btc')}</div>
                <span class="usd__price__change ${(item.percent_change_24h < 0) ? 'minus' : ''}">(${item.percent_change_24h.toFixed(2)}%)
                </span>
            </div>
            <div class="portfolio__balance">
                <div class="balance__dollar">$${formatNumbers(item.amount * item.priceInUSD)}</div>
                <div class="balance__amount bold"><span>${item.amount}</span>&nbsp;<span> ${item.symbol}</span></div>
                <input type="number" class="edit__amount__input hide">
                <div class="port__item__buttons">
                    <a class="save__icon save__icon-click icon-button hide disabled" data-tool-tip="save changes">
                        <i class="far fa-check-square unclickable"></i>
                    </a>
                    <a class="edit__icon icon-button" data-tool-tip="change amount">
                        <i class="far fa-edit unclickable"></i>
                        </a>
                    <a class="delete__icon icon-button" data-tool-tip="remove from portfolio">
                        <i class="far fa-trash-alt unclickable"></i>
                    </a>
                </div>
            </div>
        </li>
    `;
    return markup;
};

const calcHoldings = (items, type) => {
    const values = items.map(item => item.amount * (type === 'usd' ? item.priceInUSD : item.priceInBTC));
    const holdings = values.reduce((acc, value) => acc + value, 0);
    return holdings;
}



export const renderPortfolio = (items) => {
    const markup = `
        <div class="portfolio">
            <h2 class="portfolio__title">PORTFOLIO</h2>
            <div class="portfolio__content">
                <div class="holdings">
                    <div class="usd__holdings">
                        <div class="value">$${formatNumbers(calcHoldings(items, 'usd'))}</div>
                        <div class="caption">Total Holdings in USD</div>
                    </div>
                    <div class="btc__holdings">
                        <div class="value">฿${formatNumbers(calcHoldings(items), 'btc')}</div>
                        <div class="caption">Total Holdings in BTC</div>
                    </div>
                </div>
                <div class="portfolio__item portfolio__header">
                    <div class="portfolio__head">Currency</div>
                    <div class="portfolio__head">Price</div>
                    <div class="portfolio__head">Balance</div>
                </div>
                <ul class="portfolio__list">

                    ${items.map(item => renderItem(item)).join('')}
                </ul>
            </div>
        </div>
    `;
    return markup;
}