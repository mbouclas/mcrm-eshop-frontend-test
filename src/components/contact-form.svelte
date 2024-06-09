<script lang="ts">
    import {object, string} from 'yup';
    import {extractValidationErrors, loginErrorHandler} from "@helpers/validation";
    import {setAlertAction} from "@stores/http.store";
    import FormErrors from "@components/form-errors.svelte";
    import Alert from '@components/alerts.component.svelte';
    import {ContactService} from "@services/contact.service";


    export let initialModel;

    let errors = {},
        loginError = null,
        done = false,
        model = {
            ...{}, ...initialModel
        };

    const schema = object({
        firstName: string().required('Please provide your first name'),
        lastName: string().required('Please provide your last name'),
        email: string().email("Email doesn't look right").required('Please provide your email'),
        company: string().required('Please provide your company name'),
        phone: string().required('Please provide your phone number'),
        question: string().required('Please provide your question'),
    });

    async function submit() {
        errors = {};
        try {
            await schema.validate(model, {abortEarly: false});
        } catch (e) {
            errors = extractValidationErrors(e);
            return;
        }

        try {
            await (new ContactService()).submitContactForm(model);
            setAlertAction({type: 'success', message: `Message Sent`, position: 'top', timeout: 3000});

            model = {};
            done = true;
            setTimeout(() => {
                done = false;
            }, 3000);
        } catch (e) {
            loginError = loginErrorHandler(e.message);
            setAlertAction({type: 'error', message: `Error sending the email`, position: 'top', timeout: 3000});

        }

    }
</script>



<form on:submit|preventDefault={submit} method="POST" class="mt-16">
    {#if Object.keys(errors).length > 0}
        <FormErrors errors={errors}/>
    {/if}
    {#if done}
        <Alert type="success">
            Thank you! Your message was sent to our team. We will get back to you as soon as possible.
        </Alert>
    {/if}
    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
            <label for="firstName" class="block text-sm font-semibold leading-6 text-gray-900">First
                name</label>
            <div class="mt-2.5">
                <input bind:value={model.firstName}
                       class:border-red-600={errors.firstName}
                       type="text" name="firstName" id="firstName" autocomplete="firstName"
                       class="border-gray-100 block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
        </div>
        <div>
            <label for="lastName" class="block text-sm font-semibold leading-6 text-gray-900">Last
                name</label>
            <div class="mt-2.5">
                <input bind:value={model.lastName} class:border-red-600={errors.lastName}
                       type="text" name="lastName" id="lastName" autocomplete="family-name"
                       class="border-gray-100 block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
        </div>
        <div class="sm:col-span-2">
            <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Email</label>
            <div class="mt-2.5">
                <input bind:value={model.email} class:border-red-600={errors.email}
                       id="email" name="email" type="email" autocomplete="email"
                       class="border-gray-100 block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
        </div>
        <div class="sm:col-span-2">
            <label for="company"
                   class="block text-sm font-semibold leading-6 text-gray-900">Company</label>
            <div class="mt-2.5">
                <input bind:value={model.company} class:border-red-600={errors.company}
                       type="text" name="company" id="company" autocomplete="organization"
                       class="border-gray-100 block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
        </div>
        <div class="sm:col-span-2">
            <div class="flex justify-between text-sm leading-6">
                <label for="phone" class="block font-semibold text-gray-900">Phone</label>

            </div>
            <div class="mt-2.5">
                <input bind:value={model.phone} class:border-red-600={errors.phone}
                       type="tel" name="phone" id="phone" autocomplete="tel"
                       aria-describedby="phone-description"
                       class="border-gray-100 block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
        </div>
        <div class="sm:col-span-2">
            <div class="flex justify-between text-sm leading-6">
                <label for="message" class="block text-sm font-semibold leading-6 text-gray-900">How can
                    we help you?</label>
                <p id="message-description" class="text-gray-400">Max 500 characters</p>
            </div>
            <div class="mt-2.5">
                                <textarea bind:value={model.question} class:border-red-600={errors.question}
                                          id="message" name="message" rows="4" aria-describedby="message-description"
                                          class="border-gray-100 block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
            </div>
        </div>

    </div>
    <div class="mt-10 flex justify-end border-t border-gray-900/10 pt-8">
        <button type="submit"
                class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Send message
        </button>
    </div>
</form>
