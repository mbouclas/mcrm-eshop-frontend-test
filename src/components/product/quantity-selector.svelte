<script lang="ts">
    import {isBagValid, setQuantityAction} from "@stores/product.store";
    import NumberPad from "@components/number-pad.svelte";

    export let quantity = 1;
    let valid = false,
    dirty = false;
    setQuantityAction(quantity);

    isBagValid.subscribe(state => {
        if (!state && quantity === 0) {
            valid = false;
            return;
        }

        valid = true;
    })

    function update() {
        dirty = true;

        setQuantityAction(quantity);
    }
</script>


    <div class="w-full">
        <label for="quantity" class=" text-sm font-medium text-gray-700">Quantity</label>
        <p class="block">
        <NumberPad min={1} max={10000} counter={quantity} on:numberPadChange={(e) => setQuantityAction(e.detail)}
        />
        </p>
    </div>
