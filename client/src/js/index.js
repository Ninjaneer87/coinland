import '../css/style.css';

import {elements, createPopup, popup, formatNumbers, setNotification, backgroundBtc} from './views/base';
import { usd } from './config';

import Coins from './models/Coins';

import Search from './models/search';
import Coin from './models/Coin';
import Likes from './models/Likes';
import Portfolio from './models/Portfolio';
import Converter from './models/Converter';
import * as searchView from './views/searchView';
import * as coinView from './views/coinView';
import * as likesView from './views/likesView';
import * as globalsView from './views/globalsView';
import * as portfolioView from './views/portfolioView';
import * as converterView from './views/converterView';


// GLOBAL STATE OF THE APP
window.state = {};

// COINS CONTROLLER ////////////////////////////////////////////////////
const coinsController = async () => {
    state.coins = new Coins();
    try {
        await state.coins.getAllCoins();
        console.log(state.coins.allCoins);
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
    // if(event) event.preventDefault();
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
        elements.coin.innerHTML = '';
        elements.coin.classList.add('background-image');
    }
}

// LIKES CONTROLLER ////////////////////////////////////////////////////
const likesController = (deleteFromListId) => {
    if(!state.likes) state.likes = new Likes();

    if(deleteFromListId) {
        state.likes.deleteLike(deleteFromListId);
        likesView.removeLike(deleteFromListId);
        likesView.showLikesButton(state.likes.likesCount());
        if(deleteFromListId === state.coin.id) likesView.toggleLikeButton(false);
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
    await coinsController();
    state.likes = new Likes();
    state.portfolio = new Portfolio();
    await coinController();
    state.converter_a = new Converter(1);
    state.converter_a.getValues(state.coins.allCoins);
    state.converter_b = new Converter();
    state.converter_b.getValues(state.coins.allCoins);
    
    state.portfolio.updatePortfolio(state.coins.allCoins, state.bitcoinPrice);
    state.likes.updateLikes(state.coins.allCoins, state.bitcoinPrice);
    state.likes.likes.forEach(like => likesView.renderLike(like));
    likesView.showLikesButton(state.likes.likesCount(), true);
});

// ON HASHCHANGE ////////////////////////////////////////////////
window.addEventListener('hashchange', coinController);

// HOME BUTTON ////////////////////////////////////////////////////
document.querySelector('.header__logo').addEventListener('click', async () => {
    window.history.pushState({}, document.title, "/");
    await coinsController();
    await coinController();
    elements.html.scrollTop = 0;
});
//LOGO BUTTON
document.querySelector('.logo__link').addEventListener('click', () => {
    document.querySelector('.header__logo').click();
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
            processInput(i === 0 ? 'a' : 'b');
        })
    });
    document.querySelector('.converter__input__a').focus();

    function processInput(type) {
        const query = event.target.value;
        if(query) {
            const results = state.search.searchCoins(query, true)
                .map(c => ({id: c.id, name: c.name, symbol: c.symbol, price: c.quote.USD.price}));
            if(results.length !== 0) {
                converterView.renderItems(results, type);
                document.querySelector(`.results__wrapper__${type}`).classList.remove('hide')

            } else {
                document.querySelector(`.results__list__${type}`).innerHTML = '';
                document.querySelector(`.results__wrapper__${type}`).classList.add('hide')
            }
            
        } else {
            document.querySelector(`.results__list__${type}`).innerHTML = '';
            document.querySelector(`.results__wrapper__${type}`).classList.add('hide');
        }
    }
});


// LIKES EVENTS ////////////////////////////////////////////////////////////
// LIKE BUTTON & PORTFOLIO
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
            if (event.target.value.length > 10) event.target.value = event.target.value.slice(0, 10);
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
// LIKES PANEL
elements.likesIcon.addEventListener('click', () => {
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
    //FOR CONVERTER SEARCH
    if(event.keyCode === 13 && state.popup) {
        if(event.target.matches('.convert__link')) {
            event.preventDefault();
            event.target.click();
        } 
        if(event.target.matches('.converter__input__a, .converter__input__b')) {
            event.preventDefault();
            const firstResult = event.target.nextElementSibling.firstElementChild.firstElementChild.firstElementChild;
            console.log('firstResult: ', firstResult)
            if(firstResult) firstResult.click();
        }
    }

    if (event.keyCode === 38) {      
        event.preventDefault();
        // search results
        // converter results
        if(
            (event.target.classList.contains('results__link') ||
            event.target.classList.contains('convert__link')) && 
            event.target.parentElement.previousElementSibling
        ) {
            const prev = event.target.parentElement.previousElementSibling.firstElementChild;
            prev.focus();
        } else if(            
            (event.target.classList.contains('results__link') ||
            event.target.classList.contains('convert__link')) && 
            !event.target.parentElement.previousElementSibling
        ) {
            let parentInput = event.target.parentElement.parentElement.parentElement.previousElementSibling;
            if(event.target.classList.contains('results__link')) parentInput = elements.searchField;
            parentInput.focus();
        }
    }

    if (event.keyCode === 40) {
        event.preventDefault();
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
        if(state.popup && document.querySelector('.convert__link')) {
            console.log('hi keydown pressed');
            if(!event.target.classList.contains('convert__link')) {
                console.log(document.querySelector('.convert__link'))
                // event.preventDefault();
                document.querySelector('.convert__link').focus();
            } 
            if(
                event.target.classList.contains('convert__link') && event.target.parentElement.nextElementSibling
                ) {
                console.log('hi from convert__link');
                const next = event.target.parentElement.nextElementSibling.firstElementChild;
                next.focus();
            }
        }
    }
    
    if(![27, 13, 38, 40].includes(event.keyCode)) {
        // global search
        !state.popup && elements.searchField.focus();
        // converter search
        if(state.popup && event.target.matches('.convert__link')) {
            const parentInput = event.target.parentElement.parentElement.parentElement.previousElementSibling;
            parentInput.focus();
        }
    }
});



// POPUPS //////////////////////////////////////////////////////////////

document.querySelector('.popup-overlay').addEventListener('click', () => {
    //close the popup
    if(event.target.matches('.popup-overlay, .close__popup')) popup('remove');

    //PORTFOLIO /////////////////////////////////////////////
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

        if(id === state.coin.id) 
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
            if (event.target.value.length > 10) event.target.value = event.target.value.slice(0, 10);
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
        }
    });

    // CONVERTER //////////////////////////////////////////////////////
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

// NOTIFICATION EVENTS//
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
    console.log('html contains dark: ', elements.html.classList.contains('dark'));
    (elements.html.classList.contains('dark')) ? setDayNight('day') : setDayNight('night');
});
function setDayNight(setType){
    console.log('settype', setType)
    const day = '<i class="fas fa-sun fa-3x nav-icon fa-regular unclickable" aria-hidden="true"></i>';
    const night = '<i class="fas fa-moon fa-3x nav-icon fa-regular unclickable" aria-hidden="true"></i>';
    if(setType === 'day') {
        console.log('settype', setType)
        console.log('day called')
        elements.html.classList.remove('dark');
        document.querySelector('.day-night').innerHTML = day;
        localStorage.setItem('dayNight', JSON.stringify('day'));
    } else {
        console.log('night called')
        elements.html.classList.add('dark');
        document.querySelector('.day-night').innerHTML = night;
        localStorage.setItem('dayNight', JSON.stringify('night'));
    }
        
}
