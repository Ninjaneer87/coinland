import { elements, formatNumbers } from './base';

export const toggleLikeButton = (isLiked) => {
    // const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    // elements.coin.querySelector('.like__icon use').setAttribute('href', `img/icons.svg#${iconString}`);
    isLiked ? 
    elements.coin.querySelector('.like__icon').classList.add('marked') : 
    elements.coin.querySelector('.like__icon').classList.remove('marked');
}



export const renderLike = (newLike) => {
    const markup = `
        <li class="likes__list__item">
            <a class="likes__link" href="#${newLike.id}">
                <div class="likes__data">
                    <figure class="likes__figure">
                        <img class="likes__img" src="${newLike.logo}" alt="Test">
                    </figure>
                    <p class="likes__rank">${newLike.rank}</p>
                    <div class="likes__name__container">
                        <h4 class="likes__name">${newLike.name}</h4>
                        <h4 class="likes__symbol">(${newLike.symbol})</h4>
                    </div>
                    <div class="results__price">
                        <p class="likes__price">$${formatNumbers(newLike.priceInUSD)} </p>
                        <p class="likes__price btc__price">฿${formatNumbers(newLike.priceInBTC, 'btc')}</p>
                        <span class="usd__price__change ${(newLike.percent_change_24h < 0) ? 'minus' : ''}">
                        (${newLike.percent_change_24h.toFixed(2)}%)
                        </span>
                    </div>

                </div>
            </a>
            <button class="likes__remove" data-id="${newLike.id}" title="Remove from watchlist">
                <svg class="remove__icon unclickable">
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('afterbegin', markup);
}

export const removeLike = (id) => {
    const el = elements.likesList.querySelector(`[href="#${id}"]`).parentElement;
    el.classList.add('scaleZero');
    setTimeout(() => {
        el.remove();
    }, 200);
    
}

let previousNumberOfLikes = 0;
export const showLikesButton = (numberOfLikes, onLoad) => {
    if(numberOfLikes < 1) { 
        elements.likesPanelToggle.classList.remove('showLikesButton');
        if(elements.likesPanel.classList.contains('show__likes')) elements.likesIcon.click();
    } else {
        elements.likesPanelToggle.classList.add('showLikesButton');
        // if(previousNumberOfLikes === 0 && !onLoad) elements.likesIcon.click();
    }
    previousNumberOfLikes = numberOfLikes;
};