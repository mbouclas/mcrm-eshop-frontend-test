import {atom, task, onMount, action} from 'nanostores'
import {CartService} from "@services/cart.service";
import type {IAddToCartDto} from "@services/cart.service";
import {setAlertAction} from "@stores/http.store";
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

export interface IConditionAttributes {
    description: string;
}

export interface IConditionArgs {
    kind: string;
    active: boolean;
    rules?: any[] | null;
    attributes: IConditionAttributes;
    type: string;
    title: string;
    uuid: string;
    value: string;
    slug: string;
    updatedAt: string;
    target: string;
    order: number;
}

export interface ICartCondition {
    args: IConditionArgs;
    rules?: any[] | null;
    attributes: IConditionAttributes;
    kind: string;
    active: boolean;
    type: string;
    title: string;
    uuid: string;
    value: string;
    slug: string;
    updatedAt: string;
    target: string;
    parsedRawValue: number;
    parsedRawValueType: { type: 'fixed'|'percentage'; operator: 'add'|'subtract' };
}

export interface ICart {
    id?: string;
    items?: (ICartItem)[] | null;
    total: number;
    shipping: number;
    numberOfItems?: number;
    subTotal?: number;
    vatRate?: number;
    metaData?: ICartMetaData;
    appliedConditions?: ICartCondition[] | null;
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

export interface ICartEvent {
    action: 'add' | 'remove' | 'clear';
    product: IAddToCartDto;
    quantity: number;
    silent?: boolean;
}

const cachedCart = (typeof localStorage !== 'undefined') ? localStorage.getItem('cart') : null;

export const cart = atom<ICart>({
    total: 0,
    shipping: 0,
    qty: 0,
    items: [],
});

export const cartEventsStore = atom<Partial<ICartEvent>>({});

onMount(cart, () => {
    task(async () => {
        if (typeof localStorage === 'undefined') {
            return cart.get();
        }

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
    if (typeof localStorage === 'undefined') {return;}
    localStorage.setItem('cart', JSON.stringify(value));
});

export const addToCartAction = async (item: IAddToCartDto, overwriteQuantity = false) => {
    const res = await cartService.addToCart(item, overwriteQuantity);
    res.qty = res.items.length;
    if (!item.metaData) {
        item.metaData = {};
    }

    item.metaData['cartItem'] = res.items.find((x: ICartItem) => x.variantId === item.variantId);
    cart.set(res);
    setAlertAction({type: 'success', message: `Item added to cart`, position: 'top', timeout: 3000});
    sendCartEventAction({
        action: 'add',
        product: item,
        quantity: item.quantity
    });
}

export const updateCartAction = (newCart: ICart) => {
    cart.set(newCart)
    setAlertAction({type: 'success', message: `Cart Updated`, position: 'top', timeout: 3000});
    return cart.get();
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

export const setCartItems = action(cart, 'setCartItems', (store, items: ICartItem[]) => {
    const state = store.get();
    state.items = items;
    store.set(state);

    return store.get();
});

export async function removeFromCart(item: IAddToCartDto) {
    item.quantity = 0;
    const res = await cartService.removeFromCart(item);
    res.qty = res.items.length;

    cart.set(res);
    setAlertAction({type: 'info', message: `Item removed from cart`, position: 'top', timeout: 3000});
}

export const clearCart = async () => {
    const res = await cartService.clearCart();
    res.qty = 0;

    cart.set(res);
    setAlertAction({type: 'info', message: `Cart cleared`, position: 'top', timeout: 3000});
}

export function getCart() {
    return cart.get();
}


export function sendCartEventAction(event: ICartEvent) {
    cartEventsStore.set(event);
}
