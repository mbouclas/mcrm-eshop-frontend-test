<script lang="ts">
    import {object, string} from "yup";
    import Button from "@components/buttons.component.svelte";
    import {extractValidationErrors} from "@helpers/validation.ts";
    import FormErrors from "@components/form-errors.svelte";
    import {ContactService} from "@services/contact.service.ts";
    import Alert from "@components/alerts.component.svelte";
    import {httpLoading} from "@stores/http.store.ts";
    import Loading from "@components/loading-spiner.svelte";
    export let id;
    export let onSubmit: () => void;
    let errors = {};
    let model = {
        quantity: 1
    };
    let success = false;
    const schema = object({
        email: string().email().required('Email is required.'),
        firstName: string().required('First name is required.'),
        lastName: string().required('Last name is required.'),

    });

    async function onsubmit() {
        errors = {};
        try {
            await schema.validate(model, {abortEarly: false});
        }
        catch (e) {
            errors = extractValidationErrors(e);
            return;
        }

        const res = await (new ContactService()).requestPrice(model, id);

        if (res.success) {
            success = true;
            onSubmit();
        }
    }


</script>

<FormErrors errors={errors}/>
{#if success}
<Alert type="success">
    Thank you! Your message was sent to our team. We will get back to you as soon as possible.
</Alert>
    {/if}
<form on:submit|preventDefault={onsubmit}>
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
    <div class="my-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
        <div class="mt-1">
            <input bind:value={model.email} class:border-red-600={errors.email}
                   type="email" id="email" name="email" autocomplete="email"
                   placeholder="Email address"
                   class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
    </div>

    <div class="my-4">
        <label for="phone" class="block text-sm font-medium text-gray-700">Phone number</label>
        <div class="mt-1">
            <input bind:value={model.phone} class:border-red-600={errors.phone}
                   placeholder="Phone number"
                   type="tel" name="phone" id="phone" autocomplete="phone" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
    </div>

    <div class="my-4">
        <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
        <div class="mt-1">
            <input bind:value={model.quantity} class:border-red-600={errors.quantity}
                   placeholder="Quantity"
                   type="number" step="1" min="1" name="quantity" id="quantity" autocomplete="quantity" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
    </div>

    <div class="my-4">
        <div class="flex justify-between text-sm leading-6">
            <label for="message" class="block text-sm font-semibold leading-6 text-gray-900">Any questions?</label>
            <p id="message-description" class="text-gray-400">Max 500 characters</p>
        </div>
        <div class="mt-2.5">
                                <textarea bind:value={model.question} class:border-red-600={errors.question}
                                          id="message" name="message" rows="4" aria-describedby="message-description"
                                          class="border-gray-100 block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
        </div>
    </div>

    <Button color="primary" type="submit" extraClasses="inline-flex gap-4 justify-center">
        {#if $httpLoading}
        <Loading w="6" h="6" /> please wait...
            {:else}
            Send request
            {/if}

    </Button>
</form>
