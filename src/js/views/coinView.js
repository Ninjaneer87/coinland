import {elements,formatNumbers} from './base';

export const clearCoinContainer = () => {
    elements.coin.innerHTML = '';
}



const createLink = (link) => `
    <a href="${link}" class="info__link" target="_blank"><i class="fas fa-external-link-alt fa-lg small-icon"></i></a>
`;

const labels = ['Website: ','Explorer: ','Technical Documentation: ','Message Board: ','Source Code: ','Announcement: ','Chat: ','Twitter: ','Reddit: '];

const icons = [
    '<i class="fas fa-link fa-lg faIcon-regular"></i>',
    '<i class="fas fa-search fa-lg faIcon-regular"></i>',
    '<i class="fas fa-file fa-lg faIcon-regular"></i>',
    '<i class="fas fa-clipboard-list fa-lg faIcon-regular"></i>',
    '<i class="fas fa-code fa-lg faIcon-regular"></i>',
    '<i class="fas fa-bell fa-lg faIcon-regular"></i>',
    '<i class="fas fa-comment-dots fa-lg faIcon-regular"></i>',
    '<i class="fab fa-twitter fa-lg faIcon-regular"></i>',
    '<i class="fab fa-reddit fa-lg faIcon-regular"></i>'
];

const createLinks = (links) => {
    let i = 0;
    let markup = '';
    for(const link in links) {
        markup += `
            <li class="link__item ${(links[link].length < 1) ? 'hide' : ''}">
                <span class="link__icon">${icons[i]}</span>
                <div class="link__wrap">
                    <span>${labels[i]}</span>
                    ${(links[link].length > 0) && links[link].map(l => createLink(l)).join('')}
                </div>
            </li>
        `;
        i++;
    }
    return markup;
};

const createTag = (tag) => `
    <span class="tag ${(tag === null) && 'hide'}">${tag}</span>
`;

export const renderCoin = (coin, isLiked, inPortfolio) => {
    clearCoinContainer();
    const markup = `

        <div class="name__container">
            <img src="${coin.logo}" class="logo__img">
            <h1 class="coin__name">${coin.name}
                <span class="coin__symbol">(${coin.symbol})</span>
            </h1>
            <button class="likes__toggle" title="Add to watchlist">
                <i class="like__icon fas fa-heart fa-2x nav-icon faIcon-regular ${isLiked ? 'marked' : ''}"></i>
            </button>
            <button class="add__portfolio" title="Add to portfolio">
                <i class="fas fa-chart-pie fa-2x nav-icon faIcon-regular portfolio__icon ${inPortfolio ? 'marked' : ''}"></i>
            </button>
        </div>

        <div class="coin__price">
            <h2 class="usd">
                <span class="usd__price">$${formatNumbers(coin.price)}</span> 
                <span class="usd__currency">USD</span>
                <span class="usd__price__change ${(coin.percent_change_24h < 0) ? 'minus' : ''}">(${coin.percent_change_24h.toFixed(2)}%)</span>
            </h2>
            <h2 class="btc">
                <span class="btc__price">฿${formatNumbers(coin.priceInBitcoin, 'btc')}</span> 
                <span class="btc__currency">BTC</span>
            </h2>
        </div>

        <ul class="coin__links__content">
            <li class="link__item">
                <span class="link__icon">
                    <i class="fas fa-chart-bar fa-lg faIcon-regular"></i>
                </span>
                <span class="rank__label">Rank ${coin.cmc_rank}</span>
            </li>
            ${createLinks(coin.links)}
            <li class="link__item ">
                <span class="link__icon">
                    <i class="fas fa-tag fa-lg faIcon-regular"></i>
                </span>
                <div class="link__wrap" title="${coin.tags.join(', ')}">
                    <span class="tag">${coin.category}</span>
                    ${(coin.tags) ? coin.tags.slice(0, 9).map(tag => createTag(tag)).join('') : ''}
                    ${coin.tags.length > 9 ? '<span class="tag">...</span>' : ''}
                </div>
            </li>
        </ul>
        
        <ul class="totals">
            <li class="totals__item">
                <div class="totals__head">Market Cap</div>
                <div class="totals__body">
                    <div class="market__cap__usd">$${formatNumbers(coin.market_cap)} USD</div>
                    <div class="market__cap__btc btc__price">฿${formatNumbers(coin.market_cap / coin.bitcoinPrice, 'btc')} BTC</div>
                </div>
            </li>
            <li class="totals__item">
                <div class="totals__head">Volume (24h)</div>
                <div class="totals__body">
                    <div class="volume__usd">$${formatNumbers(coin.volume_24h)} USD</div>
                    <div class="volume__btc btc__price">฿${formatNumbers(coin.volume_24h / coin.bitcoinPrice, 'btc')} BTC</div>
                </div>
            </li>
            <li class="totals__item">
                <div class="totals__head">Circulating Supply</div>
                <div class="totals__body">
                    ${(coin.circulating_supply) && formatNumbers(coin.circulating_supply)} ${coin.symbol}
                </div>
            </li>
            <li class="totals__item">
                <div class="totals__head">Total Supply</div>
                <div class="totals__body">
                    ${(coin.total_supply) && formatNumbers(coin.total_supply)} ${coin.symbol}
                </div>
            </li>
            <li class="totals__item ${(!coin.max_supply) && 'hide'}">
                <div class="totals__head">Max Supply</div>
                <div class="totals__body">
                    ${(coin.max_supply) && formatNumbers(coin.max_supply)} ${coin.symbol}
                </div>
            </li>
        </ul>

        <div class="coin__chart">
            <h3 class="price__graph">Price Graph (7d)</h3>
            <div class="chart__container">
                <img src="https://s3.coinmarketcap.com/generated/sparklines/web/7d/usd/${coin.id}.png" alt="${coin.name}" class="chart__img">
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <div class="chart__line"></div>
                <div class="chart__line"></div>
            </div>
        </div>
        <div class="coin__description">
            <h3 class="description__heading">About ${coin.name}</h3>
            ${coin.description}
        </div>
    `;
    elements.coin.innerHTML = markup;
    elements.content.innerHTML = '';
    elements.content.appendChild(elements.coin);
}