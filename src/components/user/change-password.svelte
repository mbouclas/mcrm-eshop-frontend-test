<script lang="ts">
    import { object, ref, string} from "yup";
    import {UserService} from "@services/user.service";
    import {extractValidationErrors} from "@helpers/validation";
    import FormErrors from "@components/form-errors.svelte";
    import {createEventDispatcher} from "svelte";
    import {setAlertAction} from "@stores/http.store";
    const dispatch = createEventDispatcher();

    export let email;
    let model = {
        password: '',
        confirmPassword: '',
    },
        errors = {};

    const schema = object({
        password: string().required('Please provide a password'),
        confirm: string().required('Please enter your password again')
            .oneOf([ref('password')], 'Passwords must match'),
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

        const res = await userService.changePassword(email, model.password);

        if (res.success) {
            setAlertAction({type: 'success', message: `Password Changed`, position: 'top', timeout: 5000});
            dispatch('success');
        }
    }



</script>

<FormErrors errors={errors}/>
<form on:submit|preventDefault={submit}>
<div class="mb-2">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
    <input bind:value={model.password} class:border-red-600={errors.password}
           type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
</div>
<div class="mb-2">
    <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
    <input bind:value={model.confirm} class:border-red-600={errors.confirm}
           type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
</div>
<button
        type="submit"
        class="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
>Change your password
</button>
</form>
