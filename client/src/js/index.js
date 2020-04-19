import '../css/style.css';
import '@fortawesome/fontawesome-free/js/all';

import {elements, createPopup, popup, setNotification, renderLoader} from './views/base';
import {sortByName, sortByNameReverse} from './views/portfolioView';
import {
    sortByRank, 
    sortByRankReverse, 
    sortByMarketcap, 
    sortByMarketcapReverse,
    sortByPrice,
    sortByPriceReverse,
    sortByVolume,
    sortByVolumeReverse,
    sortBySupply,
    sortBySupplyReverse,
    sortByChange,
    sortByChangeReverse,
    sortByChange7d,
    sortByChangeReverse7d
} from './views/overviewSorting';

import Coins from './models/Coins';
import Search from './models/search';
import Coin from './models/Coin';
import Likes from './models/Likes';
import Portfolio from './models/Portfolio';
import Converter from './models/Converter';
import * as coinsView from './views/coinsView';
import * as searchView from './views/searchView';
import * as coinView from './views/coinView';
import * as likesView from './views/likesView';
import * as globalsView from './views/globalsView';
import * as portfolioView from './views/portfolioView';
import * as converterView from './views/converterView';


// GLOBAL STATE OF THE APP
// export const state = {};
window.state = {};

// COINS CONTROLLER ////////////////////////////////////////////////////
const coinsController = async () => {
    state.coins = new Coins();
    try {
        await state.coins.getAllCoins();
        state.coins.getAllIds();
        await state.coins.getMetadata();
        await state.coins.getGlobalMetrics();
        globalsView.renderGlobals(state.coins.globals);
        state.bitcoinPrice = state.coins.allCoins[0].quote.USD.price ;
        state.search = new Search(state.coins.allCoins);
        searchController();
    } catch(error) {
        console.log('Error from Coins Controller: ' + error);
    }
};

// SEARCH CONTROLLER ////////////////////////////////////////////////////
const searchController = function() {
    elements.resultsListWrapper.scrollTop = 0;
    const query = elements.searchField.value;
    state.searchResults = state.search.searchCoins(query);
    state.scrollCounter = 1;
    searchView.renderCoins(state.searchResults, state.bitcoinPrice, state.scrollCounter);
}

// COIN CONTROLLER ////////////////////////////////////////////////////
const coinController = async () => {
    const id = parseFloat(window.location.hash.replace('#',''));
    if(state.coins.allIds.includes(id)) {
        state.coin = new Coin(id);
        await state.coin.getCoin(state.coins.allCoins, state.coins.metadata);
        elements.coin.classList.remove('background-image');
        coinView.renderCoin(state.coin, state.likes.isLiked(id), state.portfolio.inPortfolio(id));
    } else {
        // elements.content.innerHTML = '';
        // elements.content.classList.add('background-image');
        elements.content.classList.remove('background-image');
        coinsView.renderAllCoins(state.coins.allCoins);
    }
}

// LIKES CONTROLLER ////////////////////////////////////////////////////
const likesController = (deleteFromListId) => {
    if(!state.likes) state.likes = new Likes();

    if(deleteFromListId) {
        state.likes.deleteLike(deleteFromListId);
        likesView.removeLike(deleteFromListId);
        likesView.showLikesButton(state.likes.likesCount());
        if(state.coin) {
            if(deleteFromListId === state.coin.id) likesView.toggleLikeButton(false);
        }
    } else {
        if(!state.likes.isLiked(state.coin.id)) {
            const newLike = state.likes.addLike(
                state.coin.id,
                state.coin.name,
                state.coin.symbol,
                state.coin.cmc_rank,
                state.coin.logo,
                state.coin.price,
                state.coin.priceInBitcoin,
                state.coin.percent_change_24h
            );
            likesView.toggleLikeButton(true);
            likesView.renderLike(newLike);
            likesView.showLikesButton(state.likes.likesCount());
            setNotification(newLike.symbol, 'Watchlist', state.coin.id);
        } else {
            state.likes.deleteLike(state.coin.id);
            likesView.toggleLikeButton(false);
            likesView.removeLike(state.coin.id);
            likesView.showLikesButton(state.likes.likesCount());
        }
    }
}


// PORTFOLIO CONTROLLER ///////////////////////////////////////
const portfolioController = (amount) => {
    if(!state.portfolio) state.portfolio = new Portfolio();

    if(!state.portfolio.inPortfolio(state.coin.id)) {
        const newItem = state.portfolio.addItem(                
            state.coin.id,
            state.coin.name,
            state.coin.symbol,
            state.coin.cmc_rank,
            state.coin.logo,
            state.coin.price,
            state.coin.priceInBitcoin,
            state.coin.percent_change_24h,
            parseFloat(amount),
        );
        portfolioView.togglePortfolioButton(true);
        setNotification(newItem.symbol, 'Portfolio', state.coin.id, amount);
    } else {
        state.portfolio.updateAmount(state.coin.id, amount);
        setNotification(state.coin.symbol, 'update-portfolio', state.coin.id, amount);
    }
};

// CONVERTER CONTROLLER ///////////////////////////////////////
const converterController = () => {
    let amount = parseFloat(document.querySelector('.amount__to__convert').value);
    if(!amount) amount = 0;
    converterView.displayConversion(amount, state.converter_a, state.converter_b);
}

// ON LOAD ////////////////////////////////////////////////////
window.addEventListener('load', async () => {
    const dayNight = JSON.parse(localStorage.getItem('dayNight'));
    if(dayNight) setDayNight(dayNight);

    renderLoader(elements.resultsList);
    renderLoader(elements.content);
    await coinsController();
    state.likes = new Likes();
    state.portfolio = new Portfolio();

    elements.content.innerHTML = '';
    elements.content.classList.add('background-image');

    if(window.location.hash)
    await coinController();

    //converter a -> bitcoin
    state.converter_a = new Converter(1);
    state.converter_a.getValues(state.coins.allCoins);
    //converter b -> usd
    state.converter_b = new Converter();
    state.converter_b.getValues(state.coins.allCoins);
    
    state.portfolio.updatePortfolio(state.coins.allCoins, state.bitcoinPrice);
    state.likes.updateLikes(state.coins.allCoins, state.bitcoinPrice);
    state.likes.likes.forEach(like => likesView.renderLike(like));
    likesView.showLikesButton(state.likes.likesCount());
});

// ON HASHCHANGE ////////////////////////////////////////////////
window.addEventListener('hashchange', () => {
    elements.content.scrollTop = 0;
    elements.html.scrollTop = 0;
    coinController();
    if(window.innerWidth < 760) {
        if(elements.likesPanel.classList.contains('show__likes'))
        elements.likesIcon.click();
    }

} );

//LOGO BUTTON
document.querySelector('.logo__link').addEventListener('click', async () => {
    history.pushState(null, null, window.location.href.split('#')[0]);
    await coinsController();
    elements.content.innerHTML = '';
    elements.content.classList.add('background-image');
    elements.html.scrollTop = 0;
});
// HOME BUTTON ////////////////////////////////////////////////////
document.querySelector('.header__home').addEventListener('click', async () => {
    // window.history.pushState({}, window.location.href, "/");
    history.pushState(null, null, window.location.href.split('#')[0]);
    await coinsController();
    elements.content.classList.remove('background-image');
    coinsView.renderAllCoins(state.coins.allCoins);
    elements.html.scrollTop = 0;
});
// PORTFOLIO BUTTON ////////////////////////////////////////////////////////
document.querySelector('.portfolio__link').addEventListener('click', () => {
    const markup = portfolioView.renderPortfolio(state.portfolio.portfolio);
    createPopup(markup);
});
// CONVERTER BUTTON ////////////////////////////////////////////////////////
document.querySelector('.converter__link').addEventListener('click', () => {
    const markup = converterView.staticHTML;
    createPopup(markup);
    converterController();
    // AMOUNT INPUT
    document.querySelector('.amount__to__convert').addEventListener('input', converterController);
    // CONVERTER INPUTS
    [...document.querySelectorAll('.converter__input__a, .converter__input__b')].forEach((element, i) => {
        element.addEventListener('input', () => {
            element.nextElementSibling.classList.remove('hide')
            processInput(i === 0 ? 'a' : 'b');
        });
        element.addEventListener('click', () => {
            element.nextElementSibling.classList.toggle('hide')
            processInput(i === 0 ? 'a' : 'b');
        });
    });

    function processInput(type) {
        document.querySelector(`.results__list__${type}`).scrollTop = 0;
        const query = event.target.value;
        const results = state.search.searchCoins(query, true)
            .map(c => ({id: c.id, name: c.name, symbol: c.symbol, price: c.quote.USD.price}));
        (results.length !== 0) ? 
        converterView.renderItems(results, type) : 
        document.querySelector(`.results__list__${type}`).innerHTML = '';
    }
});


// LIKES EVENTS ////////////////////////////////////////////////////////////
// ADD LIKE BUTTON & ADD PORTFOLIO
elements.coin.addEventListener('click', () => {
    if(event.target.matches('.likes__toggle, .likes__toggle *')) {
        likesController();
        document.querySelector('.like__icon').classList.add('add-animation');
        setTimeout(() => {
            document.querySelector('.like__icon').classList.remove('add-animation')
        }, 300);
    }
    if(event.target.matches('.add__portfolio')) {
        const markup = portfolioView.addAmount(state.coin, state.portfolio.inPortfolio(state.coin.id));
        createPopup(markup);
        document.querySelector('.portfolio__input').addEventListener('input', () => {
            const value = parseFloat(event.target.value);
            document.querySelector('.portfolio__submit').disabled = (value > 0) ? false : true ;
            if (event.target.value.length > 10) {
                event.target.value = event.target.value.slice(0, 10);
                if(!parseFloat(event.target.value) > 0)
                document.querySelector('.portfolio__submit').disabled = true;
            }
        });
        document.querySelector('.portfolio__input').focus();
    }
});
//REMOVE FROM LIKES LIST BUTTON
elements.likesList.addEventListener('click', () => {
    if(event.target.matches('.likes__remove')) {
        likesController(parseInt(event.target.dataset.id, 10));
    }
});
// LIKES PANEL OPEN/CLOSE
elements.likesIcon.addEventListener('click', () => {
    if(document.querySelector('.show__search'))
    document.querySelector('.find').click();
    elements.likesPanel.classList.toggle("show__likes");
    event.target.innerHTML = 
        event.target.innerHTML === elements.crossIconHTML ?  
        elements.heartIconHTML : 
        elements.crossIconHTML
    ;
} );


// SEARCH EVENTS ////////////////////////////////////////////////////
// SEARCH PANEL FOR SMALL SCREENS
document.querySelector('.find').addEventListener('click', () => {
    if(document.querySelector('.show__likes'))
    elements.likesIcon.click();
    elements.resultsPanel.classList.toggle('show__search');
});
elements.resultsPanel.addEventListener('click', () => {
    if(event.target.closest('.results__list__item')) {
        elements.resultsPanel.classList.remove('show__search');
        elements.html.scrollTop = 0;
    }
});
// SEARCH - LOAD MORE RESULTS ON SCROLL
elements.resultsListWrapper.addEventListener('scroll', () => {
    const height = event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight - height;
    if(event.target.scrollTop > (scrollHeight * 0.9 )) {
        state.scrollCounter++;
        searchView.renderCoins(
            state.searchResults,
            state.bitcoinPrice,
            state.scrollCounter,
            10,
            true
        );
    }
});
// SEARCH FIELD EVENTS 
elements.searchContainer.addEventListener('click', () => {
    if(event.target.matches('.search__container, .search__container *'))
    elements.searchField.focus();
})
elements.searchField.addEventListener('input', searchController);

// KEYBOARD EVENTS ////////////////////////////////////////////////
document.addEventListener('keydown', () => {
    if(event.keyCode === 27) popup('remove'); // FOR POPUP
    // FOR GLOBAL SEARCH
    if(event.keyCode === 13 && !state.popup) {
        event.preventDefault();
        if(event.target === elements.searchField && document.querySelector('.results__link')) {
            window.location = document.querySelector('.results__link').href;
            elements.searchField.value = '';
            searchController();
        }
        if(event.target.classList.contains('results__link')) {
            window.location = event.target.href;
            elements.html.scrollTop = 0;
        }
    }
    //FOR CONVERTER SEARCH & PORTFOLIO INSERT SEARCH
    if(event.keyCode === 13 && state.popup) {
        if((event.target.matches('.convert__link') || event.target.matches('.insert__link'))) {
            event.preventDefault();
            event.target.click();
        } 
        if(event.target.matches('.converter__input__a, .converter__input__b, .insert__coin__input')) {
            event.preventDefault();
            if(event.target.nextElementSibling.firstElementChild.innerHTML !== '') {
                const firstResult = event.target.nextElementSibling.firstElementChild.firstElementChild.firstElementChild;
                firstResult.click();
            }
        }
    }

    if (event.keyCode === 38) {      
        event.preventDefault();
        // search results &
        // converter results &
        // portfolio insert results
        if(
            (event.target.classList.contains('results__link') ||
            event.target.classList.contains('convert__link') ||
            event.target.classList.contains('insert__link')) && 
            event.target.parentElement.previousElementSibling
        ) {
            const prev = event.target.parentElement.previousElementSibling.firstElementChild;
            prev.focus();
        } else if(            
            (event.target.classList.contains('results__link') ||
            event.target.classList.contains('convert__link') ||
            event.target.classList.contains('insert__link')) && 
            !event.target.parentElement.previousElementSibling
        ) {
            let parentInput = event.target.parentElement.parentElement.parentElement.previousElementSibling;
            if(event.target.classList.contains('results__link')) parentInput = elements.searchField;
            parentInput.focus();
        }
    }

    if (event.keyCode === 40) {
        event.preventDefault();
        // search results 
        if(!state.popup && document.querySelector('.results__link')) {
            if(!event.target.classList.contains('results__link'))
                document.querySelector('.results__link').focus();
            if(
                event.target.classList.contains('results__link') && event.target.parentElement.nextElementSibling
                ) {
                const next = event.target.parentElement.nextElementSibling.firstElementChild;
                next.focus();
            }
        }
        // converter and portfolio insert results
        if(state.popup && (document.querySelector('.convert__link') || document.querySelector('.insert__link'))) {
            if(event.target.matches('.converter__input__a, .converter__input__b, .insert__coin__input')) {
                const firstResult = event.target.nextElementSibling.firstElementChild.firstElementChild.firstElementChild;
                if(firstResult) firstResult.focus();
            }
            if((event.target.classList.contains('convert__link') || event.target.classList.contains('insert__link')) && 
                event.target.parentElement.nextElementSibling
            ) {
                const next = event.target.parentElement.nextElementSibling.firstElementChild;
                next.focus();
            }
        }
    }
    
    if(![27, 13, 38, 40].includes(event.keyCode)) {
        // global search
        !state.popup && elements.searchField.focus();
        // converter search
        if(state.popup && (event.target.matches('.convert__link') || event.target.matches('.insert__link'))) {
            const parentInput = event.target.parentElement.parentElement.parentElement.previousElementSibling;
            parentInput.focus();
        }
    }
});

// OVERVIEW SORTING ITEMS //////////////////////////////////////////////////////////////
document.querySelector('.content').addEventListener('click', () => {
    const sorts = {
        sortByName, 
        sortByNameReverse,
        sortByRank, 
        sortByRankReverse, 
        sortByMarketcap, 
        sortByMarketcapReverse,
        sortByPrice,
        sortByPriceReverse,
        sortByVolume,
        sortByVolumeReverse,
        sortBySupply,
        sortBySupplyReverse,
        sortByChange,
        sortByChangeReverse,
        sortByChange7d,
        sortByChangeReverse7d
    }
    for(const [key, value] of Object.entries(sorts)) {
        if(event.target.matches(`.${key}`)) {
            elements.popup.innerHTML = coinsView.renderAllCoins([...state.coins.allCoins], value, key);
        }
    }
});

// POPUPS //////////////////////////////////////////////////////////////

document.querySelector('.popup-overlay').addEventListener('click', () => {
    //close the popup
    if(event.target.matches('.popup-overlay, .close__popup')) popup('remove');

    //PORTFOLIO /////////////////////////////////////////////
    // PORTFOLIO INSERT INPUT (INTERNAL)
    if(event.target.matches('.insert__portfolio__link')) {
        document.querySelector('.insert__content').classList.toggle('hide');
        document.querySelector('.insert__content').innerHTML = portfolioView.insertContent;
        //input field
        document.querySelector('.insert__coin__input').addEventListener('input', () => {
            event.target.nextElementSibling.classList.remove('hide')
            processInput();
        });
        document.querySelector('.insert__coin__input').addEventListener('click', () => {
            event.target.nextElementSibling.classList.toggle('hide')
            processInput();
        });
        // document.querySelector('.insert__coin__input').focus();
        // document.querySelector('.insert__coin__input').click();
        function processInput() {
            document.querySelector('.insert__results__list').scrollTop = 0;
            const query = event.target.value;
            const portfolioIds = state.portfolio.portfolio.map(item => item.id);
            const results = state.search.searchCoins(query)
                .map(c => ({id: c.id, name: c.name, symbol: c.symbol}))
                .filter(coin => !portfolioIds.includes(coin.id));
            (results.length !== 0) ? 
            portfolioView.renderInsertResults(results) : 
            document.querySelector('.insert__results__list').innerHTML = '';
        }
    }
    if(event.target.matches('.insert__link')) {
        const id = parseInt(event.target.dataset.id, 10);
        state.portfolio_add_id = id;
        state.portfolio_add_coin = new Coin(id);
        state.portfolio_add_coin.getCoin(state.coins.allCoins, state.coins.metadata);
        // const newItem = 
        // state.portfolio.addItem(newItem);
        // converterController();

        document.querySelector('.insert__coin__input').value = '';
        document.querySelector('.insert__coin__input').placeholder = `${state.portfolio_add_coin.name} (${state.portfolio_add_coin.symbol})`;
        document.querySelector('.insert__results__list').innerHTML = '';
        document.querySelector('.insert__results__wrapper').classList.add('hide');

        document.querySelector('.insert__amount').innerHTML = portfolioView.addAmount(
            state.portfolio_add_coin,
            false,
            'insert__submit'
        );
        document.querySelector('.portfolio__input').focus();
        document.querySelector('.portfolio__input').addEventListener('input', () => {
            const value = parseFloat(event.target.value);
            document.querySelector('.insert__submit').disabled = (value > 0) ? false : true ;
            if (event.target.value.length > 10) {
                event.target.value = event.target.value.slice(0, 10);
                if(!parseFloat(event.target.value) > 0)
                document.querySelector('.insert__submit').disabled = true;
            }
            
        });
    }
    if(event.target.matches('.insert__submit')) {
        event.preventDefault();
        const amount = document.querySelector('.portfolio__input').value;
        const newItem = state.portfolio.addItem(                
            state.portfolio_add_coin.id,
            state.portfolio_add_coin.name,
            state.portfolio_add_coin.symbol,
            state.portfolio_add_coin.cmc_rank,
            state.portfolio_add_coin.logo,
            state.portfolio_add_coin.price,
            state.portfolio_add_coin.priceInBitcoin,
            state.portfolio_add_coin.percent_change_24h,
            parseFloat(amount),
        );
        if(state.coin)
        portfolioView.togglePortfolioButton(state.coin.id === state.portfolio_add_coin.id);
        document.querySelector('.insert__content').classList.add('hide');
        const markup = portfolioView.renderItem(newItem);
        document.querySelector('.portfolio__list').insertAdjacentHTML('afterbegin', markup);
        portfolioView.updateHoldings(state.portfolio.portfolio);
        
        const element = elements.popup.querySelector(`li[data-id="${state.portfolio_add_coin.id}"]`);
        element.classList.add('updated');
        element.scrollIntoView();
        setTimeout(() => {
            element.classList.remove('updated');
        }, 2000);
    }
    //////////////////////////////////////////////////////////////

    //add to portfolio
    if(event.target.matches('.portfolio__submit')) {
        event.preventDefault();
        const amount = document.querySelector('.portfolio__input').value;
        portfolioController(amount);
        popup('remove');
    }
    if(event.target.closest('.portfolio__item')) {
        if(!event.target.matches('.delete__icon, .edit__icon, .save__icon, .edit__amount__input')) {
            [...document.querySelectorAll('.edit__amount__input, .save__icon')].forEach(el => el.classList.add('hide'));
            [...document.querySelectorAll('.balance__amount, .edit__icon')].forEach(el => el.classList.remove('hide'));
        }
    }
    //delete item from portfolio
    if(event.target.matches('.delete__icon')) {
        const element = event.target.parentElement.parentElement.parentElement;
        const id = parseInt(element.dataset.id);
        state.portfolio.deleteItem(id);
        element.classList.add('scaleZero');
        setTimeout(() => {
            element.remove();
        }, 200);
        portfolioView.updateHoldings(state.portfolio.portfolio);

        if(state.coin && id === state.coin.id) 
        document.querySelector('.portfolio__icon').classList.remove('marked');
    }
    //edit amount of portfolio item
    if(event.target.matches('.edit__icon')) {
        const element = event.target.parentElement.parentElement.parentElement;
        const id = parseInt(element.dataset.id);
        [...document.querySelectorAll('.edit__amount__input, .save__icon')].forEach(el => el.classList.add('hide'));
        [...document.querySelectorAll('.balance__amount, .edit__icon')].forEach(el => el.classList.remove('hide'));
        
        event.target.classList.add('hide');
        element.querySelector('.save__icon').classList.remove('hide');
        element.querySelector('.balance__amount').classList.add('hide');
        element.querySelector('.edit__amount__input').classList.remove('hide');
        element.querySelector('.edit__amount__input').focus();
        
        element.querySelector('.edit__amount__input').addEventListener('input', () => {
            const value = parseFloat(event.target.value);
            if(value > 0) {
                element.querySelector('.save__icon').classList.remove('disabled');
                element.querySelector('.save__button').disabled = false;
            } else {
                element.querySelector('.save__icon').classList.add('disabled');
                element.querySelector('.save__button').disabled = true;
            }
            if (event.target.value.length > 10) {
                event.target.value = event.target.value.slice(0, 10);
                if(!parseFloat(event.target.value) > 0) {
                    element.querySelector('.save__icon').classList.add('disabled');
                    document.querySelector('.save__button').disabled = true;
                }
            } 
        });
    }
    // save new amount
    if(event.target.matches('.save__icon, .save__button')) {
        event.preventDefault();
        const element = event.target.parentElement.parentElement.parentElement;
        const id = parseInt(element.dataset.id);
        const newAmount = parseFloat(element.querySelector('.edit__amount__input').value);
        const updatedItem = state.portfolio.updateAmount(id, newAmount);
        const updatedElement = portfolioView.renderItem(updatedItem);
        element.outerHTML = updatedElement;

        elements.popup.querySelector(`li[data-id="${id}"]`).classList.add('updated');
        setTimeout(() => {
            elements.popup.querySelector(`li[data-id="${id}"]`).classList.remove('updated');
        }, 2000);

        portfolioView.updateHoldings(state.portfolio.portfolio);
    }
    // portfolio sorting items
    [
        'sortByName', 
        'sortByNameReverse', 
        'sortByPriceChange', 
        'sortByPriceChangeReverse', 
        'sortByBalance', 
        'sortByBalanceReverse'
    ].map(item => {
        if(event.target.matches(`.${item}`)) {
            elements.popup.innerHTML = portfolioView.renderPortfolio(state.portfolio.portfolio, portfolioView[item]);
            elements.popup.querySelector(`.${item}`).classList.add('marked');
        }
    });

    // CONVERTER //////////////////////////////////////////////////////
    // hide results on click outside
    if(!event.target.closest('.results__list__a, .results__list__b, .converter__input__a, .converter__input__b') ) {
        const resultsA = document.querySelector(`.results__wrapper__a`);
        if(resultsA) resultsA.classList.add('hide');
        const resultsB = document.querySelector(`.results__wrapper__b`);
        if(resultsB) resultsB.classList.add('hide');
    }
    //select items to convert
    ['a','b'].map(item => {
        if(event.target.matches(`.convert__item__${item}`)) {
            const id = parseInt(event.target.dataset.id, 10);
            item==='a' ? state.converter_a = new Converter(id) : state.converter_b = new Converter(id);
            item==='a' ? state.converter_a.getValues(state.coins.allCoins) : state.converter_b.getValues(state.coins.allCoins);
            converterController();
            document.querySelector(`.converter__input__${item}`).value = '';
            document.querySelector(`.converter__input__${item}`).focus();
            document.querySelector(`.results__list__${item}`).innerHTML = '';
            document.querySelector(`.results__wrapper__${item}`).classList.add('hide');
        }
        if(event.target.matches(`.converter__usd__${item}`)) {
            item==='a' ? state.converter_a = new Converter() : state.converter_b = new Converter();
            item==='a' ? state.converter_a.getValues() : state.converter_b.getValues();
            converterController();
        }
    });
    //swap currencies
    if(event.target.matches('.converter__swap')) {
        state.converter_b = {...[state.converter_a, state.converter_a = {...state.converter_b}][0]};
        converterController();
    }
});

// NOTIFICATION EVENTS/////////////////////////////////////////////////
elements.notifications.addEventListener('click' , () => {
    if(event.target.matches('.portfolio')) {
        document.querySelector('.portfolio__link').click();
        event.target.classList.add('hide');

        const id = parseInt(event.target.dataset.id, 10);
        const element = elements.popup.querySelector(`li[data-id="${id}"]`);
        element.classList.add('updated');
        element.scrollIntoView();
        setTimeout(() => {
            element.classList.remove('updated');
        }, 2000);
    } 
    if(event.target.matches('.watchlist')) {
        if(!elements.likesPanel.classList.contains('show__likes')) elements.likesIcon.click();
        event.target.classList.add('hide');

        const id = parseInt(event.target.dataset.id, 10);
        const element = elements.likesPanel.querySelector(`a[href="#${id}"]`).parentElement;
        element.classList.add('updated');
        element.scrollIntoView();
        setTimeout(() => {
            element.classList.remove('updated');
        }, 2000);
    } 
});


// DARK MODE //////////////////////////////////////////
document.querySelector('.day-night').addEventListener('click', () => {
    (elements.html.classList.contains('dark')) ? setDayNight('day') : setDayNight('night');
});
function setDayNight(setType){
    const day = `<i class="fas fa-sun fa-2x nav-icon faIcon-regular unclickable" aria-hidden="true"></i>
                <span class="nav-label unclickable">Day</span>`;
    const night = `<i class="fas fa-moon fa-2x nav-icon faIcon-regular unclickable" aria-hidden="true"></i>
                <span class="nav-label unclickable">Night</span>`;
    if(setType === 'day') {
        elements.html.classList.remove('dark');
        document.querySelector('.day-night').innerHTML = day;
        localStorage.setItem('dayNight', JSON.stringify('day'));
    } else {
        elements.html.classList.add('dark');
        document.querySelector('.day-night').innerHTML = night;
        localStorage.setItem('dayNight', JSON.stringify('night'));
    }
        
}
