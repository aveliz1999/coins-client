const ADD_COINS = 'ADD_COINS';
const REMOVE_COIN = 'REMOVE_COIN';

export const addCoins = (coins) => {
    return {
        type: ADD_COINS,
        payload: coins
    }
};

export const removeCoin = (coin) => {
    return {
        type: REMOVE_COIN,
        payload: coin
    }
};

export const types = {
    ADD_COINS,
    REMOVE_COIN
};
