import {atom, action, task, onMount} from 'nanostores';
import {setHttpLoading} from "@stores/http.store";
import type {IUserStore} from "@models/user.model";

const cachedUser = localStorage.getItem('user');

export const userStore = atom<IUserStore>({

} as IUserStore);

if (cachedUser) {
    userStore.set(JSON.parse(cachedUser));
}

export const setUserStore = action(userStore, 'setUserStore', (store, user) => {
    store.set(user);
    localStorage.setItem('user', JSON.stringify(user));
    return store.get();
});
