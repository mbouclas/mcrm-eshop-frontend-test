<script lang="ts">
    import Button from "@components/buttons.component.svelte";
    import {UserService} from "@services/user.service";
    import {setGuestUserAction} from "@stores/checkout.store";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    export let contact = {};
    function handleClick() {
        window.location.href = '/register';
/*        dispatch('done', {
            decision: 'register',
        });*/
    }

    async function handleNope() {
        const userService = new UserService();
        const guest = await userService.getGuestDetails(contact.email);
        setGuestUserAction(guest);
        dispatch('done', {
            decision: 'guest',
            data: guest
        });
    }
</script>
<div class="mx-auto max-w-2xl lg:text-center">
    <h2 class="text-base font-semibold leading-7 text-indigo-600">Enjoy a better experience</h2>
    <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Register with us</p>
    <p class="mt-6 text-lg leading-8 text-gray-600">
        You have used our service in the past. Why don't you register with us to enjoy a better experience?
    </p>
</div>
<Button type="button" color="cta" onClickHandler={handleClick}>Create an account</Button>
<Button type="button" color="error" onClickHandler={handleNope}>Continue as guest</Button>
