import {combineReducers} from "redux";
import user from "./userReducer";
import ownedCoins from "./ownedCoinsReducer";
import authenticated from "./authenticationReducer";

export default combineReducers({
    ownedCoins,
    user,
    authenticated
});
