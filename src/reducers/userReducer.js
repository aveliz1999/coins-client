const {UPDATE_USER} = require('../actions/userActions').types;

export default (state = {}, action) => {
    if (action.type === UPDATE_USER) {
        return action.payload;
    } else {
        return state;
    }
};
