import {atom, task, onMount, action} from 'nanostores'
import {CartService, IAddToCartDto} from "@services/cart.service";
import {setHttpLoading} from "@stores/http.store";
import type {IGenericObject} from "@models/general";

const cartService = new CartService();

export interface ICartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    title: string;
    slug?: string;
    productId: string;
    variantId?: string;
    metaData?: IGenericObject;
}

export interface ICart {
    id?: string;
    items?: (ICartItem)[] | null;
    total: number;
    numberOfItems?: number;
    subTotal?: number;
    vatRate?: number;
    metaData?: ICartMetaData;
    appliedConditions?: any[] | null;
    couponApplied?: ICartCoupon;
    qty: number;
}


export interface ICartMetaData extends IGenericObject {
}

export interface ICartCoupon extends IGenericObject {
}

export interface ICartItem {
    productId: string;
    quantity: number;
    price: number;
    title: string;
    thumb: string;
    uuid: string;
}

const cachedCart = localStorage.getItem('cart');

export const cart = atom<ICart>({
    total: 0,
    qty: 0,
    items: [],
});

onMount(cart, () => {
    task(async () => {
        const res = await cartService.getCart();
        res.qty = res.items.length;
        cart.set(res);

        return cart.get();
    })
})

if (cachedCart) {
    cart.set(JSON.parse(cachedCart));
}

cart.subscribe(value => {
    localStorage.setItem('cart', JSON.stringify(value));
});

export const addToCartAction = async (item: IAddToCartDto, overwriteQuantity = false) => {
    const res = await cartService.addToCart(item, overwriteQuantity);
    res.qty = res.items.length;

    cart.set(res);
}

export const saveCartToServerAction = async () => {
  const c = cart.get();
  if (!c.items) {
    return;
  }

  await cartService.saveCartToServer(c.items);
};

export const setMetaDataAction = action(cart, 'setMetaDataAction', (store, idx: number, metaData: IGenericObject) => {
    const state = store.get();
    if (!state.items) {
        return store.get();
    }

    state.items[idx].metaData = metaData;
    store.set(state);

    return store.get();
});

export async function removeFromCart(item: IAddToCartDto) {
    item.quantity = 0;
    const res = await cartService.removeFromCart(item);
    res.qty = res.items.length;

    cart.set(res);
}

export const clearCart = async () => {
    const res = await cartService.clearCart();
    res.qty = 0;

    cart.set(res);
}

export function getCart() {
    return cart.get();
}
