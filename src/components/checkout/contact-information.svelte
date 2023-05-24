<script lang="ts">
    import {object, string, boolean} from 'yup';
    import {extractValidationErrors} from "@helpers/validation";
    import Login from '@components/auth/login.svelte'
    import FormErrors from "@components/form-errors.svelte";
    import {userStore} from "@stores/user.store";
    import PleaseRegisterSection from '@components/checkout/convert-guest-to-user.svelte';
    import Button from '@components/buttons.component.svelte';
    import UserAddresses from '@components/checkout/user-addresses.svelte';
    import type {IUserStore} from "@models/user.model";
    import {createEventDispatcher} from "svelte";
    import {checkoutStore} from "@stores/checkout.store";
    import type {IEvent, IStoreConfig} from "@models/general";
    import {UserService} from "@services/user.service";
    import type {IConvertGuestToUserEvent} from "@models/checkout";
    const dispatch = createEventDispatcher();

    let user: IUserStore, existingGuest = false,
    config: IStoreConfig, showLoginForm = false, showPleaseRegisterSection = false;
    export let selectedContact = null;
    userStore.subscribe((value) => {
        user = value;
        if (user && user.email) {
            showLoginForm = false;
        }

        if (Array.isArray(user.addresses)) {
            const defaultAddress = user.addresses.find((address) => address.default);
            selectedContact = defaultAddress ? defaultAddress : null;
        }
        // console.log('user in contact-information', value)
    });

    checkoutStore.subscribe(async (state) => {
        config = state.config;
    });

    let errors = {};
    const schema = object({
        email: string().email("Email doesn't look right").required('Please provide your email'),
        phone: string().required(),
        terms: boolean().oneOf([true]),
    });

    const model = {
        email: 'bobo@gmail.com',
        phone: '97855782',
        terms: true,
    };

    async function submit() {
        errors = {};
        try {
            await schema.validate(model, {abortEarly: false});
        }
        catch (e) {
            errors = extractValidationErrors(e);
            return;
        }
        //go to see if we have a user with this email



        const res  = await (new UserService()).checkUserEmail(model.email);
        // If so, show the login form
        if (res.exists && res.type === 'user') {
            showLoginForm = true;
            return;
        }

        if (res.exists && res.type === 'guest') {
            existingGuest = true;
            showLoginForm = false;
            showPleaseRegisterSection = true;
            return;
        }

        // otherwise set it on the store and move on
        dispatch('done', {
            stepId: 'contact',
            data: {selectedContact: null, contact: model}
        });
    }

    function handleLoginClick() {
        showLoginForm = true;
    }

    function validate() {
        if (!selectedContact) {
            errors['contact'] = ['Please select a delivery address to continue'];
            return;
        }

        dispatch('done', {
            stepId: 'contact',
            data: {selectedContact}
        });

    }

    function handleGuestDecision(e: IEvent<IConvertGuestToUserEvent>) {
        const payload = e.detail;

        if (payload.decision === 'guest') {
            dispatch('done', {
                stepId: 'contact',
                data: {contact: {...model, ...payload.data}}
            });
            return;
        }
        // open the register form
    }

</script>

{#if Object.keys(errors).length > 0}
<FormErrors errors={errors} />
{/if}

{#if showPleaseRegisterSection}
<PleaseRegisterSection contact={model} on:done={handleGuestDecision} />
{/if}

{#if showLoginForm}
    <Login initialModel={model} />
{/if}
{#if user && user.email}
    {#if Array.isArray(user.addresses)}
        <UserAddresses bind:selectedContact={selectedContact}  addresses={user.addresses} />
        <Button color="black" onClickHandler={validate}>Continue</Button>
    {/if}

{:else}
    {#if config.guestCheckout }
        {#if !showLoginForm && !showPleaseRegisterSection}

        <form class="mt-6" on:submit|preventDefault={submit}>


            <h2 class="text-lg font-medium text-gray-900">Contact information</h2>

            <div class="mt-6">
                <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
                <div class="mt-1">
                    <input bind:value={model.email} class:border-red-600={errors.email}
                           type="email" id="email-address" name="email-address" autocomplete="email"
                           placeholder="email address"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div class="mt-6">
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone number</label>
                <div class="mt-1">
                    <input bind:value={model.phone} class:border-red-600={errors.phone}
                           type="text" name="phone" id="phone" autocomplete="tel" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div class="mt-6 flex space-x-2">
                <div class="flex h-5 items-center">
                    <input bind:checked={model.terms} class:border-red-600={errors.terms}
                           id="terms" name="terms" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                </div>
                <label for="terms" class="text-sm text-gray-500">I have read the terms and conditions and agree to the sale of my personal information to the highest bidder.</label>
            </div>
            <Button color="black" type="submit">Continue</Button>

        </form>

        <div class="mt-10">
            <div class="relative">
                <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm font-medium leading-6">
                    <span class="bg-white px-6 text-gray-900">Already a member?</span>
                </div>
            </div>
            <div class="my-8">
                <Button color="primary" onClickHandler={handleLoginClick}>Sign in</Button>


            </div>
        </div>
            {/if}
        {/if}

    {/if}
