import Cookies from "universal-cookie";
import {types} from '../actions/authenticationActions';

const {AUTHENTICATE, DEAUTHENTICATE} = types;
const cookies = new Cookies();

export default (state = !!cookies.get('authenticated'), action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return !!cookies.get('authenticated');
        case DEAUTHENTICATE:
            return false;
        default:
            return state;
    }
};
