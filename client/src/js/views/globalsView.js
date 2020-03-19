import {elements, formatNumbers, formatDate} from './base';

export const renderGlobals = (globals) => {
    const markup = `
        <li class="info__item">
            Cryptocurrencies: 
            <span class="cryptocurrencies" data-tool-tip="Last updated: ${formatDate(globals.last_updated)}">
                ${formatNumbers(globals.total_cryptocurrencies, 'globals')}
            </span>
        </li>
        <li class="info__item">
            Markets: 
            <span class="markets" data-tool-tip="Last updated: ${formatDate(globals.last_updated)}">
            ${formatNumbers(globals.active_market_pairs, 'globals')}
            </span>
        </li>
        <li class="info__item">
            Market Cap: 
            <span class="market__cap" data-tool-tip="Last updated: ${formatDate(globals.last_updated)}">
                $${formatNumbers(globals.total_market_cap)}
            </span>
        </li>
        <li class="info__item">
            24h Vol: 
            <span class="24h__volume" data-tool-tip="Last updated: ${formatDate(globals.last_updated)}">
                $${formatNumbers(globals.total_volume_24h)}
            </span>
        </li>
        <li class="info__item">
            BTC Dominance: 
            <span class="btc__dominance" data-tool-tip="Last updated: ${formatDate(globals.last_updated)}">
            ${globals.btc_dominance.toFixed(1)}%
            </span>
        </li>
    `;
    elements.infoItems.innerHTML = markup;
};