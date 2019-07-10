const UPDATE_USER = 'UPDATE_USER';

export const updateUser = (user) => {
    return {
        type: UPDATE_USER,
        payload: user
    }
};

export const types = {
    UPDATE_USER
};
