import {atom, action} from 'nanostores';
export const httpLoading = atom<boolean>(false);

export const setHttpLoading = action(httpLoading, 'set', (store, value) => {
    httpLoading.set(value);

    return httpLoading.get();
});
