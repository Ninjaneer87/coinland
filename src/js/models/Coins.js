import axios from "axios";
import { ALLCOINS_URI, METADATA_URI, GLOBALS_URI } from "../config";

export default class Coins {
  constructor() {
    this.allCoins = [];
  }

  async getAllCoins() {
    try {
      const res = await axios(ALLCOINS_URI);
      this.allCoins = res.data.data;
    } catch (error) {
      console.log("Error from Coins model / getAllCoins: " + error);
    }
  }
  getAllIds() {
    this.allIds = this.allCoins.map((coin) => coin.id);
  }

  async getMetadata() {
    try {
      const res = await fetch(METADATA_URI, {
        method: "POST",
        body: JSON.stringify({ ids: this.allIds }),
      });
      this.responseMeta = await res.json();
      this.metadata = this.responseMeta.data;
    } catch (error) {
      console.log("Error from Coins model / getMetadata: " + error);
    }
  }

  async getGlobalMetrics() {
    try {
      let res = await axios(GLOBALS_URI);
      res = {
        total_cryptocurrencies: res.data.data.total_cryptocurrencies,
        active_market_pairs: res.data.data.active_market_pairs,
        total_market_cap: res.data.data.quote.USD.total_market_cap,
        total_volume_24h: res.data.data.quote.USD.total_volume_24h,
        btc_dominance: res.data.data.btc_dominance,
        last_updated: res.data.data.last_updated,
      };
      this.globals = res;
    } catch (error) {
      console.log("Error from Coins model / getGlobalMetrics: " + error);
    }
  }
}
