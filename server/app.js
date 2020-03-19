const { APIKEY } = require('./config');

const express = require('express');
const cors = require('cors');
const rp = require('request-promise');

const app = express();
const data = {};
app.use(cors());
app.use(express.json());

const requestOptionsAllCoins = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
        'start': '1',
        'limit': '100',
        'convert': 'USD'
    },
    headers: {
        'X-CMC_PRO_API_KEY': APIKEY,
        'Accept': 'application/json'
    },
    json: true,
    gzip: true
};
function getAllCoins() {
    rp(requestOptionsAllCoins).then(response => {
        data.allCoins = response;
        data.allIds = response.data.map(c => c.id).toString();
        const requestOptionsMetadata =  {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info',
            qs: {
                'id': data.allIds
            },
            headers: {
                'X-CMC_PRO_API_KEY': APIKEY
            },
            json: true,
            gzip: true
        };
        rp(requestOptionsMetadata).then(resp => {
            data.metadata = resp;
        }).catch((err) => {
            console.log('Metadata call error: ', err.message);
        })
    }).catch((err) => {
        console.log('API call error: ', err.message);
    });
}
const requestOptionsGlobals = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
    qs: {
        'convert': 'USD'
    },
    headers: {
        'X-CMC_PRO_API_KEY': APIKEY
    },
    json: true,
    gzip: true
};
function getGlobals() {
    rp(requestOptionsGlobals).then(response => {
        data.globals = response;
    }).catch(err => {
        console.log('Globals api call error: ', err.message);
    });
}
setInterval(() => {
    getAllCoins();
    getGlobals();
}, 900000);

getAllCoins();
getGlobals();

app.get('/allcoins', (req,res) => {
    res.json(data.allCoins);
});
app.get('/metadata', (req, res) => {
    res.json(data.metadata);
});
app.get('/globals', (req, res) => {
    res.json(data.globals);
});

app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});

////////////////////////////////////////
// app.get('/allcoins', (req,res) => {
//     const requestOptions = {
//         method: 'GET',
//         uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
//         qs: {
//             'start': '1',
//             'limit': '100',
//             'convert': 'USD'
//         },
//         headers: {
//             'X-CMC_PRO_API_KEY': APIKEY,
//             'Accept': 'application/json'
//         },
//         json: true,
//         gzip: true
//     };
//     processReqRes(requestOptions, res);
// });

// app.post('/metadata', (req, res) => {
//     const ids = req.body.ids.toString();
//     const requestOptions = {
//         method: 'GET',
//         uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info',
//         qs: {
//             'id': ids
//         },
//         headers: {
//             'X-CMC_PRO_API_KEY': APIKEY
//         },
//         json: true,
//         gzip: true
//     };
//     processReqRes(requestOptions, res);
// });

// app.get('/globals', (req, res) => {
//     const requestOptions = {
//         method: 'GET',
//         uri: 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
//         qs: {
//             'convert': 'USD'
//         },
//         headers: {
//             'X-CMC_PRO_API_KEY': APIKEY
//         },
//         json: true,
//         gzip: true
//     };
//     processReqRes(requestOptions, res);
// });

// app.get('/coin/:id', (req, res) => {
//     const id = req.params.id;
//     const requestOptions = {
//         method: 'GET',
//         uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map',
//         qs: {
//             'symbol': 'BTC,USDT,BNB'
//         },
//         headers: {
//             'X-CMC_PRO_API_KEY': APIKEY
//         },
//         json: true,
//         gzip: true
//     };
// });

// function processReqRes(reqOpts, res) {
//     rp(reqOpts).then(response => {
//         res.json(response);
//     }).catch((err) => {
//         console.log('API call error:', err.message);
//     });
// }
