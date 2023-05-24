import {atom, action} from 'nanostores';

export const appConfig = {
    defaultNoImage: 'https://res.cloudinary.com/dqehxczmc/image/upload/v1683624508/icons/dummy-post-horisontal-thegem-blog-default-large_i9rkvt_zdahwl.jpg'
}
export const httpLoading = atom<boolean>(false);

export const setHttpLoading = action(httpLoading, 'set', (store, value) => {
    httpLoading.set(value);

    return httpLoading.get();
});
