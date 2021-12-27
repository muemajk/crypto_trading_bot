require('dotenv').config;
const cctx = require('cctx');
const axios = require('axios');

const tick = async() => {
    const {asset, base, allocation, spread} = config;
    const market = `${asset}/${base}`;

    const orders = await binanceClient.fetchOpenOrders(market);
    orders.forEach(async order => {
        await binanceClient.cancelOrder(order.id);
    });
    //Remember to set up coin gecko to implement this
    const result = await Promise.all([
        //Coin verses the opposing currency
        axios.get(''),
        //coin verses the opposing currnency
        axios.get('')
    ]);
    //Market price of the currency you wish to trade to
    const marketprice = result[0].data.bitcoin.usd / result[1].data.bitcoin.usd;

    const sellPrice = marketprice * (1 + spread);
    const buyPrice = marketprice * (1 - spread);
    const balances= await binanceClient.fetchBalance();
    const assetBalance = balances.free[asset];
    const baseBalance  = balances.free[base];
    const sellVolume =  assetBalance * allocation;
    const buyVolume = (baseBalance * allocation) / marketprice;

    await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice)
    await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice)

    console.log(
        `
        New tick for ${market}...
        

        `
    )
}

const run = () => {
    const config = {
        asset: 'BTC',
        base: 'USDT',
        allocation: 0.1,
        spread: 0.2,
        tickinterval: 2000,
    };
    const binanceClient = new cctx.binance({
        apikey: process.env.API_KEY,
        secret: process.env.API_SECRET,
    });
    tick(config, binanceClient)
    setInterval(tick, config.tickinterval, config, binanceClient);
}

run();