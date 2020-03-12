import axios from 'axios';
import { ALLCOINS_URI, METADATA_URI, GLOBALS_URI } from '../config';

export default class Coins {
    constructor(query) {
        this.allCoins = [];
    }

    async getAllCoins() {
        try{
            // const localCoins = JSON.parse(localStorage.getItem('allCoins'));
            // if(localCoins) {
            //     this.allCoins = localCoins;
            // } else {
                const res = await axios(ALLCOINS_URI);
                this.allCoins = res.data.data;
                // localStorage.setItem('allCoins', JSON.stringify(this.allCoins));
            // }
        } catch(error) {
            console.log('Error from Coins model / getAllCoins: ' + error);
        }
    }
    getAllIds() {
        this.allIds = this.allCoins.map(coin => coin.id);
    }

    // async getMetadata() {
    //     try{
    //         const localMeta = JSON.parse(localStorage.getItem('metadata'));
    //         if(localMeta) {
    //             this.metadata = localMeta;
    //         } else {
    //             const res = await axios({
    //                 method: 'post',
    //                 url: METADATA_URI,
    //                 data: JSON.stringify({ids: this.allIds}),
    //                 headers: {
    //                     'content-type': 'application/json'
    //                 }
    //             });
    //             this.metadata = res.data.data;
    //             localStorage.setItem('metadata', JSON.stringify(this.metadata));
    //         }
    //     } catch(error) {
    //         console.log('Error from Coins model / getMetadata: ' + error);
    //     }
    // }
    async getMetadata() {
        try{
            // const localMeta = JSON.parse(localStorage.getItem('metadata'));
            // if(localMeta) {
            //     this.metadata = localMeta;
            // } else {
                const res = await axios(METADATA_URI);
                this.responseMeta = res;
                this.metadata = res.data.data;
                // localStorage.setItem('metadata', JSON.stringify(this.metadata));
            // }
        } catch(error) {
            console.log('Error from Coins model / getMetadata: ' + error);
        }
    }

    async getGlobalMetrics() {
        try{
            // const localGlobals = JSON.parse(localStorage.getItem('globals'));
            // if(localGlobals) {
            //     this.globals = localGlobals;
            // } else {
                const res = await axios(GLOBALS_URI);
                this.globals = res;
            //     localStorage.setItem('globals', JSON.stringify(this.globals));
            // }
        } catch(error) {
            console.log('Error from Coins model / getMetadata: ' + error);
        }
    }

    
}