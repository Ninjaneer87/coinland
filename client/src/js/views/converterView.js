import { elements } from './base';

export const staticHTML = `
    <div class="converter">
        <input type="number" class="amount__to__convert" value="1" placeholder="Enter Amount">
        <div class="convert__a">
            <form class="convert__form__a">
                <input type="text" class="converter__input__a" autocomplete="off" spellcheck="false" placeholder="Bitcoin (BTC)">
                <div class="results__wrapper__a hide">
                    <ul class="results__list__a">
                        
                    </ul>
                </div>
            </form>
            <button class="converter__usd__a">(USD)</button>
            <div class="coin__a">
            </div>
        </div>
        <button class="converter__swap" title="Swap currencies"><i class="fas fa-exchange-alt fa-3x unclickable"></i></button>
        <div class="convert__b">
            <form class="convert__form__b">
                <input type="text" class="converter__input__b" autocomplete="off" spellcheck="false" placeholder="United States Dollar (USD)">
                <div class="results__wrapper__b hide">
                    <ul class="results__list__b">
                        
                    </ul>
                </div>
            </form>
            <button class="converter__usd__b">(USD)</button>
            <div class="coin__b">
            </div>
        </div>
        <div class="converter__display">
            <span>1565 BTC</span> = <span>5,667.45978455 USD</span>
        </div>
    </div>
`;

const renderItem = (item, type) => {
    const markup = `
        <li class="convert__item__${type}" data-price="${item.price}">
            <span class="convert__name">${item.name}</span>&nbsp;
            <span class="convert__symbol">(${item.symbol})</span>
        </li>
    `;
    return markup;
};

export const renderItems = (items, type) => {
    const markup = items.slice(0, 4).map(item => renderItem(item, type)).join('');
    document.querySelector(`.results__list__${type}`).innerHTML = markup;
};