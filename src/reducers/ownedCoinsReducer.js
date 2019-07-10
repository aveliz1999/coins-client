const {ADD_COINS, REMOVE_COIN} = require('../actions/ownedCoinsActions').types;

export default (state = [], action) => {
    switch (action.type) {
        case ADD_COINS:
            return [
                ...state.filter(coin =>
                    action.payload.findIndex(filterCoin =>
                        filterCoin.uuid === coin.uuid
                    ) === -1
                ),
                ...action.payload
            ];
        case REMOVE_COIN:
            return [
                ...state.filter(coin => coin.uuid !== action.payload.uuid)
            ];
        default:
            return state;
    }
};
