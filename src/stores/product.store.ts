import {action, atom, computed} from "nanostores";
import type {IProductColorForSelector} from "@models/products.model";
import {object} from 'yup';

export interface IProductStore {
    quantity: number;
    color: IProductColorForSelector;
}
const schema = object({

});
export const productStore = atom<IProductStore>({} as IProductStore);

export const setColorAction = action(productStore, 'setColorAction', (store, color) => {
    const state = store.get();
    state.color = color;
    store.set(state);

    return store.get();
});

export const setQuantityAction = action(productStore, 'setQuantityAction', (store, quantity) => {
    const state = store.get();
    state.quantity = quantity;
    store.set(state);

    return store.get();
});

export const isBagValid = computed(productStore, state => {
    return state.color && state.quantity > 0;
})
