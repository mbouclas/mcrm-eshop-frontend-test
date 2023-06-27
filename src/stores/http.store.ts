import {atom, action} from 'nanostores';
import type {IAlertsStore} from "@models/general";

export const appConfig = {
    defaultNoImage: 'https://res.cloudinary.com/dqehxczmc/image/upload/v1683624508/icons/dummy-post-horisontal-thegem-blog-default-large_i9rkvt_zdahwl.jpg'
}
export const httpLoading = atom<boolean>(false);

export const alertsStore = atom<IAlertsStore>({} as IAlertsStore);

export const setHttpLoading = action(httpLoading, 'set', (store, value) => {
    httpLoading.set(value);

    return httpLoading.get();
});


export const setAlertAction = action(alertsStore, 'set', (store, alert: IAlertsStore) => {
    alertsStore.set(alert);

    return alertsStore.get();
});
