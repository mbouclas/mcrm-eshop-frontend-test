<script lang="ts">
    import {onMount, onDestroy} from "svelte";
    import AddressSelector from "@components/checkout/past-address-selector.svelte";
    import {UserService} from "@services/user.service";
    import type {IAddress, IUser} from "@models/user.model";
    import AddressForm from "@components/user/address-form.svelte";
    import Modal from "@components/full-screen-modal.svelte";
    import {setModalShownAction} from "@stores/search.store";
    import {setAlertAction} from "@stores/http.store";
    let account: IUser,
    newAddress = {},
        addNewAddress = false,
        modalIsShown = false,
        defaultAddress = {};

    onMount(async () => {
        await get();

    });

    onDestroy(() => {

    });

    async function get() {
        account = await (new UserService()).getUserAccount();
        if (!account || !account.addresses) return;

        if (account.addresses.length > 0) {
            const found = account.addresses.find(address => address.default);
            defaultAddress = found || account.addresses[0];
        }
    }

    async function onFormValid(e) {
        newAddress = e.detail;
        // go and save
        toggleModal();
        await (new UserService()).addNewAddress(newAddress as IAddress);
        await get();
        setAlertAction({type: 'success', message: `Address Added`, position: 'top', timeout: 3000});
    }

    async function setAddressAsDefault(address: IAddress) {
        await (new UserService()).setAddressAsDefault(address['uuid']);
        await get();
        setAlertAction({type: 'info', message: `Default address set`, position: 'top', timeout: 3000});
    }

    async function deleteAddress(address: IAddress) {
        const s = confirm('Are you sure you want to delete this address?');
        if (!s) return;
        await (new UserService()).deleteAddress(address['uuid']);
        await get();
        setAlertAction({type: 'success', message: `Address Deleted`, position: 'top', timeout: 3000});
    }

    function toggleModal() {
        modalIsShown = !modalIsShown;
        setModalShownAction(modalIsShown, 'addressModal');
    }
</script>
<div class="max-w-xl">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900">Your Account</h1>
    <p class="mt-2 text-sm text-gray-500">Review or change your personal information.</p>
</div>

<button on:click={toggleModal}
        type="button" class="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z" clip-rule="evenodd"/></svg>
    Add New Address
</button>
{#if account}
    <fieldset>
        <legend class="text-sm font-semibold leading-6 text-gray-900">Your Addresses</legend>
        {#if Array.isArray(account.addresses) && account.addresses.length > 1}
        <p class="mt-1 text-sm leading-6 text-gray-600">Select one to set as default</p>

        <div class="mt-6 space-y-6">
            {#each account.addresses as address, idx}
                <div class="flex items-center gap-x-3">

                    <button on:click={deleteAddress.bind(this, address)}
                            type="button" class="-m-2 inline-flex p-2 text-red-700 hover:text-gray-500">
                        <svg class="-ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                        </svg>
                        <span class="sr-only">Remove</span>

                    </button>
                    <input on:click={setAddressAsDefault.bind(this, address)} bind:group={defaultAddress} value={address}
                           id={`address-${idx}`} name={`address-${idx}`} type="radio"
                           class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
                    <label on:click={setAddressAsDefault.bind(this, address)}
                           for={`address-${idx}`} class="block text-sm font-medium leading-6 text-gray-900">{address.firstName} {address.lastName}: {address.street}, {address.city}, {address.region}, {address.country}, {address.postCode}</label>

                    {#if address.default}
                    <span class="text-sm text-gray-400">(default)</span>
                        {/if}
                </div>
            {/each}
        </div>
        {/if}
    </fieldset>


{/if}
<Modal title="Add New Address" id="addressModal">
    <AddressForm formTitle="New Address" model={newAddress} on:formValid={onFormValid} />
</Modal>
