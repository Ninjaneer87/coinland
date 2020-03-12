import {elements} from './base';

export const renderGlobals = (globals) => {
    const markup = `
        <li class="info__item">
            Cryptocurrencies: 
            <span class="cryptocurrencies">
                5,143
            </span>
        </li>
        <li class="info__item">
            Markets: 
            <span class="markets">
                20,737
            </span>
        </li>
        <li class="info__item">
            Market Cap: 
            <span class="market__cap">
                $276,847,277,301
            </span>
        </li>
        <li class="info__item">
            24h Vol: 
            <span class="24h__volume">
                $158,274,811,658
            </span>
        </li>
        <li class="info__item">
            BTC Dominance: 
            <span class="btc__dominance">
                63.2%
            </span>
        </li>
    `;
    elements.infoItems.innerHTML = markup;
};