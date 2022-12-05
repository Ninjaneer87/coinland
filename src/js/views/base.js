// import {state} from '../index';

export const elements = {
    html: document.querySelector('html'),
    body: document.querySelector('body'),
    infoItems: document.querySelector('.info__items'),
    likesIcon: document.querySelector('.likes__field'),
    likesPanelToggle: document.querySelector('.likes__panel__toggle'),
    likesPanel: document.querySelector('.likes__panel'),
    likesList: document.querySelector('.likes__list'),
    heartIconHTML: '<i class="likes__icon unclickable fas fa-heart fa-2x nav-icon faIcon-regular"></i>',
    crossIconHTML: '<i class="close__likes__icon unclickable fas fa-heart fa-2x nav-icon faIcon-regular"></i>',
    popup: document.querySelector('.popup-div-content'),
    searchField: document.querySelector('.search__field'),
    searchContainer: document.querySelector('.search__container'),
    resultsPanel: document.querySelector('.results'),
    resultsList: document.querySelector('.results__list'),
    resultsListWrapper: document.querySelector('.results__list__wrapper'),
    mainContainer: document.querySelector('.main__container'),
    content: document.querySelector('.content'),
    coin: document.querySelector('.coin'),
    notifications: document.querySelector('.notifications'),

};

export const formatNumbers = (number, isBtc) => {
    if(!number > 0) return '';
    let intDec, int, dec;
    number = isBtc ? number.toFixed(8) : number.toFixed(6);
    intDec = number.split('.');
    int = intDec[0];
    if(int.length > 3) {
        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if(isBtc === 'globals') return int;
    dec = intDec[1];
    dec = (int === '0' || isBtc) ? dec : dec.slice(0, 2);
    return (int.length > 7 || (isBtc && int.length > 4)) ? int : int + '.' + dec;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getDate()  + "/" + months[parseInt(date.getMonth(), 10)] + "/" + date.getFullYear() + "  " + strTime;
}


export const createPopup = (htmlContent) => {
    elements.popup.innerHTML = htmlContent;
    popup('add');
};

export const popup = (action) => {
    document.querySelector('.popup-overlay').classList[action]('show-popup');
    elements.body.classList[action]('no-scroll');
    state.popup = action === 'add'? true : false;
    // elements.mainContainer.classList[action]('add-blur');
}

let timeout;
export const setNotification = (symbol, section, id, amount) => {
    let markup = `
        <div class="notification ${section==='Portfolio' ? 'portfolio' : 'watchlist'}" data-id="${id}">
            <span class="amount ${amount > 0 ? '' : 'hide'}">${amount}</span> <span class="symbol">${symbol}</span> added to <span class="section">${section}</span>
        </div>
    `;
    if(section==='update-portfolio') {
        markup = `
            <div class="notification portfolio" data-id="${id}">
                Updated amount of <span class="symbol">${symbol}</span> to : ${amount} ${symbol}
            </div>
        `;
    }
    elements.notifications.insertAdjacentHTML('beforeend', markup);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        elements.notifications.innerHTML = '';
    }, 5000);

    
}

export const renderLoader = parent => {
    const loader = `
        <div class="lds-ripple">
            <div></div>
            <div></div>
        </div>
    `;
    // const loader = `
    //     <div class="lds-circle">
    //         <div>
    //         </div>
    //     </div>
    // `;
    // if(!parent.contains(document.querySelector('.lds-ripple'))) 
    parent.innerHTML = loader;
}