export const elements = {
    html: document.querySelector('html'),
    body: document.querySelector('body'),
    infoItems: document.querySelector('.info__items'),
    likesIcon: document.querySelector('.likes__field'),
    likesPanelToggle: document.querySelector('.likes__panel__toggle'),
    likesPanel: document.querySelector('.likes__panel'),
    likesList: document.querySelector('.likes__list'),
    heartIconHTML: '<svg class="likes__icon unclickable"><use href="img/icons.svg#icon-heart"></use></svg>',
    crossIconHTML: '<svg class="close__likes__icon unclickable"><use href="img/icons.svg#icon-circle-with-cross"></use></svg>',
    popup: document.querySelector('.popup-div-content'),
    searchField: document.querySelector('.search__field'),
    searchContainer: document.querySelector('.search__container'),
    resultsPanel: document.querySelector('.results'),
    resultsList: document.querySelector('.results__list'),
    resultsListWrapper: document.querySelector('.results__list__wrapper'),
    mainContainer: document.querySelector('.main__container'),
    coin: document.querySelector('.coin'),

};

export const formatNumbers = (number, isBtc) => {
    let intDec, int, dec;
    // console.log('number from format', number);
    number = isBtc ? number.toFixed(8) : number.toFixed(6);
    intDec = number.split('.');
    int = intDec[0];
    if(int.length > 3) {
        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    dec = intDec[1];
    // console.log('dec from format', dec);
    dec = (int === '0' || isBtc) ? dec : dec.slice(0, 2);
    return int.length > 7 || (isBtc && int.length > 4) ? int : int + '.' + dec;
};

export const createPopup = (htmlContent) => {
    elements.popup.innerHTML = htmlContent;
    state.popup = true;
    popup('add');
};

export const popup = (action) => {
    document.querySelector('.popup-overlay').classList[action]('show-popup');
    elements.body.classList[action]('no-scroll');
    // elements.mainContainer.classList[action]('add-blur');
}

