<script lang="ts">
    import {boolean, object, ref, string} from "yup";
    import FormErrors from "@components/form-errors.svelte";
    import Button from '@components/buttons.component.svelte';
    import {extractValidationErrors} from "@helpers/validation";
    import {UserService} from "@services/user.service";
    import type {IUserDto} from "@models/user.model";
    import Alert from "@components/alerts.component.svelte";
    const model = {
        email: '',
        password: '',
        confirm: '',
        firstName: '',
        lastName: '',
        terms: false,
    } as IUserDto;
    let errors = {},
        registrationComplete = false,
    emailInUse = false;

    const schema = object({
        email: string().email("Email doesn't look right").required('Please provide your email'),
        password: string().required('Please provide a password'),
        firstName: string().required('Please provide your first name'),
        lastName: string().required('Please provide your last name'),
        confirm: string().required('Please enter your password again')
            .oneOf([ref('password')], 'Passwords must match'),
        terms: boolean().oneOf([true]).required('You must accept the terms and conditions'),
    });

    async function submit() {
        const userService = new UserService();
        errors = {};
        try {
            await schema.validate(model, {abortEarly: false});
        } catch (e) {
            errors = extractValidationErrors(e);
            return;
        }

        // check if the user already exists
        let user;
        try {
            user = await userService.checkUserEmail(model.email, undefined, true);
        }
        catch (e) {

        }

        if (user.exists) {
            emailInUse = true;
            errors['email'] = 'Email already in use';
            return;
        }

        try {
            await userService.register(model);
        }
        catch (e) {

        }

        registrationComplete = true;
    }
</script>
{#if Object.keys(errors).length > 0}
    <div class="mx-auto max-w-5xl">

    <FormErrors errors={errors} />
    </div>
{/if}
{#if registrationComplete}
<section class="bg-gray-50 dark:bg-gray-900 mt-6 mb-6 mx-auto max-w-5xl">
<Alert type="success">
    Thank you! A confirmation email has been sent to your email address.
</Alert>
</section>
    {/if}
{#if emailInUse}
    <div id="toast-interactive" class="fixed top-5 left-10 sm:left-1/3  w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400" role="alert">
        <div class="flex">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Refresh icon</span>
            </div>
            <div class="ml-3 text-sm font-normal">
                <span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Account Exists</span>
                <div class="mb-2 text-sm font-normal">There's already an account registered with this email</div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <a href="/user" class="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800">Login</a>
                    </div>
                </div>
            </div>
            <button on:click={() => emailInUse = false}
                    type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-interactive" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
        </div>
    </div>
{/if}
{#if !registrationComplete}
<section class="bg-gray-50 dark:bg-gray-900 mt-6 mb-6">
    <div class="grid grid-cols-1 lg:grid-cols-12">
    <div class="flex flex-col items-center justify-center px-6 col-span-8   lg:py-0">

        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Create an account
                </h1>
                <form method="post" class="space-y-4 md:space-y-6" on:submit|preventDefault={submit}>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input bind:value={model.email} class:border-red-600={errors.email}
                                type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com">
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input bind:value={model.password} class:border-red-600={errors.password}
                                type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </div>
                    <div>
                        <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input bind:value={model.confirm} class:border-red-600={errors.confirm}
                                type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </div>
                    <div>
                        <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your first name</label>
                        <input bind:value={model.firstName} class:border-red-600={errors.firstName}
                               type="text" name="firstName" id="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="First Name">
                    </div>
                    <div>
                        <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your last name</label>
                        <input bind:value={model.lastName} class:border-red-600={errors.lastName}
                               type="text" name="lastName" id="lastName" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Last Name">
                    </div>

                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input bind:checked={model.terms} class:border-red-600={errors.terms}
                                    id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                        </div>
                    </div>
                    <Button type="submit" color="black">Create an account</Button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already have an account? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
        <div class="col-span-4 hidden lg:block">
            <img class="object-cover object-center" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg" alt="illustration">
        </div>
    </div>
</section>
    {/if}
