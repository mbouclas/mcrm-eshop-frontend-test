import {atom, action} from 'nanostores';
import type {IUserStore} from "@models/user.model";
import {resetCheckoutAction} from "@stores/checkout.store";

const cachedUser = (typeof localStorage !== 'undefined') ?  localStorage.getItem('user') : null;

export const userStore = atom<IUserStore>({

} as IUserStore);

if (cachedUser) {
    userStore.set(JSON.parse(cachedUser));
}

export const setUserStore = action(userStore, 'setUserStore', (store, user) => {
    store.set(user);
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }

    return store.get();
});

export const logoutUserAction = action(userStore, 'logoutUserAction', (store) => {
    store.set({} as IUserStore);
    localStorage.setItem('user', JSON.stringify({}));
    resetCheckoutAction();
});
