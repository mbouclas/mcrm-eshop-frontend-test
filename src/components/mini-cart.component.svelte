<script lang="ts">
    import {cart, clearCart, removeFromCart} from "@stores/cart.store";
import type { ICart } from '@stores/cart.store';
    import {httpLoading} from "@stores/http.store";
import Loading from '@components/loading-spiner.svelte'
    import {moneyFormat} from "@helpers/money-format";
let Cart: ICart, loading: boolean = false;
cart.subscribe((val) => Cart = val);
httpLoading.subscribe(val => loading = val);

function clear() {
    clearCart();
}

</script>
{#if loading}
<Loading />
    {/if}
<ul>
    <li>Quantity : {Cart.qty}</li>
    <li>total : {moneyFormat(Cart.total)}</li>

</ul>

<button on:click={clear}>Clear Cart</button>
