<script lang="ts">
import {onMount, onDestroy} from "svelte";

onMount(() => {
    console.log('mounted');
});

onDestroy(() => {
    console.log('destroyed');
});

</script>
<div>
    <h2 class="text-base font-semibold leading-7 text-gray-900">Profile</h2>
    <p class="mt-1 text-sm leading-6 text-gray-500">This information will be displayed publicly so be careful what you share.</p>

    <dl class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
        <div class="pt-6 sm:flex">
            <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
            <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div class="text-gray-900">Tom Cook</div>
                <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
            </dd>
        </div>
        <div class="pt-6 sm:flex">
            <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
            <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div class="text-gray-900">tom.cook@example.com</div>
                <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
            </dd>
        </div>
        <div class="pt-6 sm:flex">
            <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Title</dt>
            <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div class="text-gray-900">Human Resources Manager</div>
                <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
            </dd>
        </div>
    </dl>
</div>
