<script lang="ts">
    import {UserService} from "@services/user.service";
    import {object, string} from 'yup';
    import {extractValidationErrors, loginErrorHandler} from "@helpers/validation";
    import {setUserStore} from "@stores/user.store";
    import {createEventDispatcher} from "svelte";
    const userService = new UserService();
    const dispatch = createEventDispatcher();
    let loginError = null;
    export let initialModel;

    let errors = {};
    const model = {
        ...{
            email: '',
            password: '',
            rememberMe: true,
        }, ...initialModel
    }

    const schema = object({
        email: string().email("Email doesn't look right").required('Please provide your email'),
        password: string().required(),
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

        try {
            const res = await userService.login(model.email, model.password, model.rememberMe);
            setUserStore(res);
            dispatch('loginSuccess', res);
        }
        catch (e) {
            loginError = loginErrorHandler(e.message);
            dispatch('loginError', e);
        }

    }


</script>
{#each Object.entries(errors) as error}
    <p class="text-red-500 text-xs italic">{error}</p>
{/each}
{#if loginError}
    <p class="text-red-600 font-semibold italic">{loginError}</p>
{/if}

<form
        class="space-y-6"
        method="POST"
        on:submit|preventDefault={submit}

>
    <div>
        <label for="email" class="block text-sm font-medium text-gray-700"
        >Email address</label
        >
        <div class="mt-1">
            <input
                    class:border-red-600={errors.email}
                    bind:value={model.email}
                    id="email"
                    placeholder="email address"
                    name="email"
                    type="email"
                    autocomplete="email"
                    class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
        </div>
    </div>

    <div>
        <label for="password" class="block text-sm font-medium text-gray-700"
        >Password</label
        >
        <div class="mt-1">
            <input
                    class:border-red-600={errors.password}
                    bind:value={model.password}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    autocomplete="current-password"
                    class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
        </div>
    </div>

    <div class="flex items-center justify-between">
        <div class="flex items-center">
            <input
                    bind:checked={model.rememberMe}
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-black focus:ring-gray-500"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"
            >Remember me</label
            >
        </div>

        <div class="text-sm">
            <a
                    href="/forgot-password"
                    class="font-medium text-black hover:text-gray-900"
            >Forgot your password?</a
            >
        </div>
    </div>

    <div>
        <button
                type="submit"
                class="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >Sign in</button
        >
    </div>
</form>

<div class="mt-6">
    <div class="relative">
        <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-2 text-gray-500"
          >Not a member yet? <a href="/register" class="underline font-medium"
          >Sign up here!</a
          >
          </span>
        </div>
    </div>
</div>
