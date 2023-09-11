<script lang="ts">
    import type {IAddress} from "@models/user.model";
    import {createEventDispatcher} from "svelte";

    export let addresses: IAddress[] = [];

    export let model: IAddress = {} as IAddress;
    const dispatch = createEventDispatcher();
    function setAddress(address) {
        model = address;
        dispatch('setAddress', address)
    }
</script>


<fieldset>
    <legend class="text-sm font-semibold leading-6 text-gray-900">Use a Past Address</legend>
    <p class="mt-1 text-sm leading-6 text-gray-600">You have used the following address in the past, do you want to use it?</p>
    <div class="mt-6 space-y-6">
        {#each addresses as address}
            <div class="flex items-center gap-x-3">
                <input on:click={setAddress.bind(this, address)}
                       id="push-everything" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
                <label on:click={setAddress.bind(this, address)}
                       for="push-everything" class="block text-sm font-medium leading-6 text-gray-900">{address.firstName} {address.lastName}: {address.street}, {address.city}, {address.region}, {address.country}, {address.postCode}</label>
            </div>
        {/each}
    </div>
</fieldset>


