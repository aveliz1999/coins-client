const AUTHENTICATE = 'AUTHENTICATE';
const DEAUTHENTICATE = 'DEAUTHENTICATE';

export const authenticate = () => {
    return {
        type: AUTHENTICATE
    }
};

export const deauthenticate = () => {
    return {
        type: DEAUTHENTICATE
    }
};

export const types = {
    AUTHENTICATE,
    DEAUTHENTICATE
};

