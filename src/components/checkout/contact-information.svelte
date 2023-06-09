<script lang="ts">
    import {object, string, boolean} from 'yup';
    import {extractValidationErrors} from "@helpers/validation";
    import Login from '@components/auth/login.svelte'
    import FormErrors from "@components/form-errors.svelte";
    import {userStore} from "@stores/user.store";
    import PleaseRegisterSection from '@components/checkout/convert-guest-to-user.svelte';
    import Button from '@components/buttons.component.svelte';
    import UserAddresses from '@components/checkout/user-addresses.svelte';
    import type {IUser, IUserStore} from "@models/user.model";
    import {createEventDispatcher} from "svelte";
    import {checkoutStore, setContactInformationAction} from "@stores/checkout.store";
    import type {IEvent, IStoreConfig} from "@models/general";
    import {UserService} from "@services/user.service";
    import type {IConvertGuestToUserEvent} from "@models/checkout";
    const dispatch = createEventDispatcher();

    let user: IUserStore, existingGuest = false,
    config: IStoreConfig, showLoginForm = false,
        showPleaseRegisterSection = false,
        contactInformation;
    export let selectedContact = null;
    const model = {
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        terms: true,
    };

    userStore.subscribe((value) => {
        if (!value || Object.keys(value).length === 0) {return;}
        user = value;

        if (user && user.email) {
            showLoginForm = false;
        }

        if (Array.isArray(user.addresses)) {
            const defaultAddress = user.addresses.find((address) => address.default);
            selectedContact = defaultAddress ? defaultAddress : null;
        }
        // console.log('user in contact-information', value)
        onLoginSuccess({detail: value} as any);
    });

    checkoutStore.subscribe(async (state) => {
        config = state.config;
        contactInformation = state.contactInformation;
    });

    let errors = {};
    const schema = object({
        email: string().email("Email doesn't look right").required('Please provide your email'),
        phone: string().required(),
        firstName: string().required(),
        lastName: string().required(),
        terms: boolean().oneOf([true]),
    });



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



        const res  = await (new UserService()).checkUserEmail(model.email, model);

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

        setContactInformationAction(model);
        dispatch('done', {
            stepId: 'contact',
            data: {selectedContact: null, contact: model}
        });
    }

    function handleLoginClick() {
        showLoginForm = true;
    }

    function validate() {
        if (user) {
            onLoginSuccess({detail: user} as any);
            return;
        }

        if (!selectedContact) {
            errors['contact'] = ['Please select a delivery address to continue'];
            return;
        }

        setContactInformationAction(selectedContact);
        dispatch('done', {
            stepId: 'contact',
            data: {selectedContact}
        });

    }

    function handleGuestDecision(e: IEvent<IConvertGuestToUserEvent>) {
        const payload = e.detail;

        if (payload.decision === 'guest') {
            setContactInformationAction({...payload.data, ...model});
            dispatch('done', {
                stepId: 'contact',
                data: {contact: {...payload.data, ...model}}
            });

            return;
        }
        // open the register form
    }

    function changeContactInformation() {
        contactInformation = {};
        // setContactInformationAction({});
    }

    function onLoginError(e) {
        console.log('login error', e.detail);
    }

    function onLoginSuccess(e: IEvent<IUserStore>) {
        setContactInformationAction({
            firstName: e.detail.firstName,
            lastName: e.detail.lastName,
            email: e.detail.email,
            phone: e.detail['phone'],
        });
        dispatch('done', {
            stepId: 'contact',
            data: {selectedContact: null, contact: model}
        });
    }

</script>

{#if Object.keys(errors).length > 0}
<FormErrors errors={errors} />
{/if}

{#if showPleaseRegisterSection}
<PleaseRegisterSection contact={model} on:done={handleGuestDecision} />
{/if}

{#if Object.keys(contactInformation).length > 0}
    <div class=" min-w-0 break-words bg-white w-full mb-6 shadow-2xl rounded-lg p-6">
        <h3 class="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">{contactInformation.firstName} {contactInformation.lastName}</h3>
        <p class="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
            {contactInformation.email}
        </p>
        {#if contactInformation.phone}
        <p class="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
            {contactInformation.phone}
        </p>
        {/if}
        {#if !user}
        <div class="inline-flex justify-center w-full">
            <button on:click={changeContactInformation}
                    class="bg-sky text-white p-2 rounded items-center">Change Contact Information</button>
        </div>
        {/if}
    </div>
{/if}

{#if showLoginForm}
    <Login initialModel={model} on:loginSuccess={onLoginSuccess} on:loginError={onLoginError} />
{/if}
{#if user && user.email}
    {#if Array.isArray(user.addresses)}
        <UserAddresses bind:selectedContact={selectedContact}  addresses={user.addresses} />
        <Button color="black" onClickHandler={validate}>Continue</Button>
    {/if}

{:else}
    {#if config.guestCheckout }
        {#if !showLoginForm && !showPleaseRegisterSection && Object.keys(contactInformation).length === 0}

        <form class="mt-6" on:submit|preventDefault={submit}>


            <h2 class="text-lg font-medium text-gray-900">Contact information</h2>
            <div class="mt-6">
                <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                <div class="mt-1">
                    <input bind:value={model.firstName} class:border-red-600={errors.firstName}
                           type="text" id="firstName" name="firstName" autocomplete="firstName"
                           placeholder="First Name"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div class="mt-6">
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                <div class="mt-1">
                    <input bind:value={model.lastName} class:border-red-600={errors.lastName}
                           type="text" id="lastName" name="lastName" autocomplete="lastName"
                           placeholder="First Name"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div class="mt-6">
                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                <div class="mt-1">
                    <input bind:value={model.email} class:border-red-600={errors.email}
                           type="email" id="email" name="email" autocomplete="email"
                           placeholder="Last Name"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>


            <div class="mt-6">
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone number</label>
                <div class="mt-1">
                    <input bind:value={model.phone} class:border-red-600={errors.phone}
                           placeholder="Phone number"
                           type="tel" name="phone" id="phone" autocomplete="phone" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
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
