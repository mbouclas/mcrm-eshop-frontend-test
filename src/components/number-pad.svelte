<script lang="ts">
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();

    export let counter = 1,
    min = 1,
    max;

    function up() {
        if (counter + 1 >= max) {
            counter = max;
        }
        counter = counter +1;

        dispatch('numberPadChange', counter);
    }

    function down() {
        if (counter - 1 <= min) {
            counter = min;
        }

        counter = counter - 1;

        dispatch('numberPadChange', counter);
    }

    function change() {
        if (counter >= max) {
            counter = max;
        }

        if (counter <= min) {
            counter = min;
        }

        dispatch('numberPadChange', counter);
    }
</script>
<div class="w-32" style="display: inline-flex;
    align-items: center;
    height: 38px;
    font-size: calc(var(--base-text-font-size) - (var(--default-text-font-size) - 15px));
    border: 1px solid var(--border-color);
    border-radius: 3px;
    box-shadow: 0 1px 1px rgba(var(--border-color-rgb),.2);
    vertical-align: middle;">
    <button type="button" on:click={down} style="    display: flex;
    align-items: center;
    padding: 0 12px;
    color: rgba(var(--text-color-rgb),.6);
    height: 100%;
    transition: color .2s ease-in-out;
    touch-action: manipulation;">-</button>
    <input bind:value={counter} on:change={change} type="number" min="1" style="appearance: none;
    padding: 0 5px;
    min-width: 32px;
    text-align: center;
    border: none;
    background: transparent;"
           class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
    />
    <button type="button" on:click={up} style="    display: flex;
    align-items: center;
    padding: 0 12px;
    color: rgba(var(--text-color-rgb),.6);
    height: 100%;
    transition: color .2s ease-in-out;
    touch-action: manipulation;">+</button>
</div>
