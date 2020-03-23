import { elements, formatNumbers } from './base';

export const togglePortfolioButton = (inPortfolio) => {
    inPortfolio ? 
    elements.coin.querySelector('.portfolio__icon').classList.add('marked') : 
    elements.coin.querySelector('.portfolio__icon').classList.remove('marked');
}

export const addAmount = (coin, inPortfolio, button='portfolio__submit') => {
    const markup = `
        <form class="portfolio__wrap">
            <input type="number" step="0.00000001" class="portfolio__input" maxlength="10" placeholder="Amount of ${coin.symbol}">
            <button class="${button}" disabled>${inPortfolio ? 'Update': 'Add'}</button>
        </form>
    `;
    return markup;
};

export const renderItem = (item) => {
    const markup = `
        <li class="portfolio__item" data-id="${item.id}">
            <img class="portfolio__img" src="${item.logo}" />
            <div class="portfolio__symbol" >${item.name}</div>
            <div class="portfolio__price">
                <div class="portfolio__usd">$${formatNumbers(item.priceInUSD)}</div>
                <div class="portfolio__btc">฿${formatNumbers(item.priceInBTC, 'btc')}</div>
                <span class="usd__price__change ${(item.percent_change_24h < 0) ? 'minus' : ''}">(${item.percent_change_24h.toFixed(2)}%)
                </span>
            </div>
            <div class="portfolio__balance">
                <div class="balance__dollar">$${formatNumbers(item.amount * item.priceInUSD)}</div>
                <div class="balance__amount bold"><span>${item.amount}</span>&nbsp;<span> ${item.symbol}</span></div>
                <form class="edit__amount__form">
                    <input type="number" class="edit__amount__input hide">                        
                <button class="save__button" disabled hidden></button>
                </form>
                <div class="port__item__buttons">
                    <a class="save__icon icon-button hide disabled" data-tool-tip="save changes">
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

export const calcHoldings = (items, type) => {
    const values = items.map(item => item.amount * (type === 'usd' ? item.priceInUSD : item.priceInBTC));
    const holdings = values.reduce((acc, value) => acc + value, 0);
    return holdings;
}

export function sortByName(a, b) {
    if (a.name < b.name ){
        return -1;
    }
    if ( a.name > b.name ){
        return 1;
    }
    return 0;
}
export function sortByNameReverse(a, b) {
    if (a.name > b.name ){
        return -1;
    }
    if ( a.name < b.name ){
        return 1;
    }
    return 0;
}
export function sortByPriceChange (a, b) {
    if (a.percent_change_24h > b.percent_change_24h ){
        return -1;
    }
    if ( a.percent_change_24h < b.percent_change_24h ){
        return 1;
    }
    return 0;
}
export function sortByPriceChangeReverse(a, b) {
    if (a.percent_change_24h < b.percent_change_24h ){
        return -1;
    }
    if ( a.percent_change_24h > b.percent_change_24h ){
        return 1;
    }
    return 0;
}
export function sortByBalance(a, b) {
    if (a.amount * a.priceInUSD > b.amount * b.priceInUSD ){
        return -1;
    }
    if ( a.amount * a.priceInUSD < b.amount * b.priceInUSD  ){
        return 1;
    }
    return 0;
}
export function sortByBalanceReverse(a, b) {
    if (a.amount * a.priceInUSD < b.amount * b.priceInUSD ){
        return -1;
    }
    if ( a.amount * a.priceInUSD > b.amount * b.priceInUSD  ){
        return 1;
    }
    return 0;
}

export const updateHoldings = (portfolio) => {
    const usdHoldings = formatNumbers(calcHoldings(portfolio, 'usd'));
    const btcHoldings = formatNumbers(calcHoldings(portfolio, 'btc'), 'btc');
    document.querySelector('.usd__holdings .value').innerHTML = `$${usdHoldings}`;
    document.querySelector('.btc__holdings .value').innerHTML = `฿${btcHoldings}`;
};
export const insertContent = `
    <div class="insert__coin">
        <form class="insert__coin__form">
            <input type="text" class="insert__coin__input" autocomplete="off" spellcheck="false" placeholder="Select coin">
            <div class="insert__results__wrapper hide">
                <ul class="insert__results__list">
                    
                </ul>
            </div>
        </form>
    </div>
    <div class="insert__amount">
    </div>
`;

export const renderPortfolio = (items, sortCB) => {
    if(sortCB) items.sort(sortCB);
    const markup = `
        <div class="portfolio">
            <h2 class="portfolio__title">PORTFOLIO</h2>
            <div class="portfolio__content">
                <div class="holdings">
                    <div class="usd__holdings">
                        <div class="value">$${formatNumbers(calcHoldings(items, 'usd'))}</div>
                        <div class="caption">Total Holdings in USD</div>
                    </div>
                    <div class="insert__portfolio">
                        <a class="insert__portfolio__link"><i class="fas fa-plus fa-2x insert__portfolio__icon unclickable"></i></a>
                        <div class="insert__content hide">
                        </div>
                    </div>
                    <div class="btc__holdings">
                        <div class="value">฿${formatNumbers(calcHoldings(items), 'btc')}</div>
                        <div class="caption">Total Holdings in BTC</div>
                    </div>
                </div>
                <div class="portfolio__item portfolio__header">
                    <div class="portfolio__head">
                        Currency
                        <a class="sort__icon sortByName" title="A-Z"><i class="fas fa-caret-down unclickable"></i></a>
                        <a class="sort__icon sortByNameReverse" title="Z-A"><i class="fas fa-caret-up unclickable"></i></a>
                    </div>
                    <div class="portfolio__head">
                        Change (24h)
                        <a class="sort__icon sortByPriceChange" title="Gainers"><i class="fas fa-caret-down unclickable"></i></a>
                        <a class="sort__icon sortByPriceChangeReverse" title="Losers"><i class="fas fa-caret-up unclickable"></i></a>
                    </div>
                    <div class="portfolio__head">
                        Balance
                        <a class="sort__icon sortByBalance" title="Highest balance"><i class="fas fa-caret-down unclickable"></i></a>
                        <a class="sort__icon sortByBalanceReverse" title="Lowest balance"><i class="fas fa-caret-up unclickable"></i></a>
                    </div>
                </div>
                <ul class="portfolio__list">
                    ${items.map(item => renderItem(item)).join('')}
                </ul>
            </div>
        </div>
    `;
    return markup;
}

const renderInsertItem = (item) => {
    const markup = `
        <li class="insert__item">
            <a class="insert__link" data-id="${item.id}" href="javascript:;">
                <span class="insert__name unclickable">${item.name}</span>&nbsp;
                <span class="insert__symbol unclickable">(${item.symbol})</span>
            </a>
        </li>
    `;
    return markup;
};

export const renderInsertResults = (items) => {
    const markup = items.map(item => renderInsertItem(item)).join('');
    document.querySelector('.insert__results__list').innerHTML = markup;
};