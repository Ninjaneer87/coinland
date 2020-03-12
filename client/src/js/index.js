import '../css/style.css';

import {elements, createPopup, popup} from './views/base';

import Coins from './models/Coins';

import Search from './models/search';
import Coin from './models/Coin';
import Likes from './models/Likes';
import Portfolio from './models/Portfolio';
import * as searchView from './views/searchView';
import * as coinView from './views/coinView';
import * as likesView from './views/likesView';
import * as globalsView from './views/globalsView';
import * as portfolioView from './views/portfolioView';


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
    console.log('id from coin controller: ', id)
    console.log()
    if(state.coins.allIds.includes(id)) {
        state.coin = new Coin(id);
        await state.coin.getCoin(state.coins.allCoins, state.coins.metadata);
        coinView.renderCoin(state.coin, state.likes.isLiked(id), state.portfolio.inPortfolio(id));
    } else {
        elements.coin.innerHTML = 'Sadrzaj stranjce';
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
    } else {
        state.portfolio.updateAmount(state.coin.id, amount);
    }
};

// ON LOAD ////////////////////////////////////////////////////
window.addEventListener('load', async () => {
    await coinsController();
    state.likes = new Likes();
    state.portfolio = new Portfolio();
    await coinController();
    
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
// PORTFOLIO BUTTON ////////////////////////////////////////////////////////
document.querySelector('.portfolio__link').addEventListener('click', () => {
    const markup = portfolioView.renderPortfolio(state.portfolio.portfolio);
    createPopup(markup);
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
        event.target.classList.add('add-animation');
        setTimeout(() => {
            document.querySelector('.add__portfolio').classList.remove('add-animation')
        }, 300);
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
    if(event.target.scrollTop > (scrollHeight * 0.7 )) {
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
elements.searchField.addEventListener('focus', () => {
    elements.searchContainer.classList.add('focused');
});
elements.searchField.addEventListener('input', searchController);
elements.searchField.addEventListener('blur', () => {
    elements.searchContainer.classList.remove('focused');
});

// KEYBOARD EVENTS ////////////////////////////////////////////////
document.addEventListener('keydown', () => {
    if(event.keyCode === 27) popup('remove'), state.popup = false; // FOR POPUP
    
    if(event.keyCode === 13 && !state.popup) {
        event.preventDefault();
        if(event.target === elements.searchField && document.querySelector('.results__link')) {
            window.location = document.querySelector('.results__link').href;
            elements.searchField.value = '';
            searchController();
        }
        if(event.target.classList.contains('results__link')) {
            window.location = event.target.href;
        }

    }

    if (event.keyCode === 38) {      
        event.preventDefault();
        if(
            event.target.classList.contains('results__link') && 
            event.target.parentElement.previousElementSibling
        ) {
            const prev = event.target.parentElement.previousElementSibling.firstElementChild;
            prev.focus();
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
    }
    
    if(![27, 13, 38, 40].includes(event.keyCode)) {
        !state.popup && elements.searchField.focus();
    }
});



// CREATE POPUPS //////////////////////////////////////////////////////////////

document.querySelector('.popup-overlay').addEventListener('click', () => {
    //close the popup
    if(event.target.matches('.close__popup')) popup('remove'), state.popup = false;

    //add to portfolio
    if(event.target.matches('.portfolio__submit')) {
        event.preventDefault();
        const amount = document.querySelector('.portfolio__input').value;
        portfolioController(amount);
        console.log(typeof(amount));
        popup('remove');
        state.popup = false;
    }
    //delete item from portfolio
    if(event.target.matches('.delete__icon')) {
        const element = event.target.parentElement.parentElement.parentElement;
        const id = parseInt(element.dataset.id);
        state.portfolio.deleteItem(id);
        elements.popup.innerHTML = portfolioView.renderPortfolio(state.portfolio.portfolio);
        console.log('condition: ', id===state.coin.id);
        if(id === state.coin.id) 
        document.querySelector('.portfolio__icon').classList.remove('marked');
    }
    //edit amount of portfolio item
    if(event.target.matches('.edit__icon')) {
        event.target.classList.add('hide');
        const element = event.target.parentElement.parentElement.parentElement;
        const id = parseInt(element.dataset.id);

        element.querySelector('.save__icon').classList.remove('hide');
        element.querySelector('.balance__amount').classList.add('hide');
        element.querySelector('.edit__amount__input').classList.remove('hide');
        
        element.querySelector('.edit__amount__input').addEventListener('input', () => {
            const value = parseFloat(event.target.value);
            console.log('value from port input: ' ,(value > 0));

            (value > 0) ?
            element.querySelector('.save__icon').classList.remove('disabled') :
            element.querySelector('.save__icon').classList.add('disabled');
            
            if (event.target.value.length > 10) event.target.value = event.target.value.slice(0, 10);
        });
        
        // element.querySelector('.edit__amount__input').addEventListener('focus', () => {
        //     event.target.selectionStart = event.target.value.length;
        // });
        // element.querySelector('.edit__amount__input').focus();

    }
    // save new amount
    if(event.target.matches('.save__icon')) {
        const element = event.target.parentElement.parentElement.parentElement;
        const id = parseInt(element.dataset.id);
        const newAmount = parseFloat(element.querySelector('.edit__amount__input').value);
        state.portfolio.updateAmount(id, newAmount);
        elements.popup.innerHTML = portfolioView.renderPortfolio(state.portfolio.portfolio);
    }
});


// DARK MODE //////////////////////////////////////////
document.querySelector('.day-night').addEventListener('click', () => {
    elements.html.classList.toggle('dark');
    const day = '<i class="fas fa-sun fa-3x nav-icon fa-regular unclickable" aria-hidden="true"></i>';
    const night = '<i class="fas fa-moon fa-3x nav-icon fa-regular unclickable" aria-hidden="true"></i>';
    event.target.innerHTML = event.target.innerHTML === day ? night : day;
});
