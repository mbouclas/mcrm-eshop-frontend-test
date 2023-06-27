<script lang="ts">
    import type {IStep} from "@models/checkout";
    import {handleStepChangeAction} from "@stores/checkout.store";

    export let steps: IStep[] = [];


    async function handleClick(step: IStep) {
        if (!step.handler) {
            return window.location.href = step.href;
        }
        // This will set the store state to the new step
        // Somewhere else in the app, we can listen to this change
        handleStepChangeAction(step);
    }
</script>

<nav aria-label="Progress">
    <ol role="list" class="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {#each steps as step}
            <li class="md:flex-1">
                {#if step.status === 'complete'}
                <a href={step.href}
                   on:click|preventDefault={handleClick.bind(this, step)}
                   class:border-indigo-600={step.status === 'complete'}
                   class:border-red-600={step.status === 'complete' && step.current}
                   class:hover:border-red-400={step.status === 'complete' && step.current}
                   class:hover:border-indigo-800={step.status === 'complete'}
                   class:border-gray-200={step.status === 'upcoming'}
                   class:border-gray-300={step.status === 'upcoming'}
                   class="group flex flex-col border-l-4  py-2 pl-4  md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span class="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">{step.title}</span>
                    <span class="text-sm font-medium">{step.description}</span>
                </a>
                    {:else}
                    {#if step.status === 'current'}
                        <p class="group flex flex-col border-l-4 border-gray-600  py-2 pl-4  md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                            <span class="text-sm font-medium text-gray-600 group-hover:text-gray-800">{step.title}</span>
                            <span class="text-sm font-medium">{step.description}</span>
                        </p>
                    {:else }
                        <p class="group flex flex-col border-l-4  py-2 pl-4  md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                            <span class="text-sm font-medium text-gray-600 group-hover:text-indigo-800">{step.title}</span>
                            <span class="text-sm font-medium">{step.description}</span>
                        </p>
                    {/if}

                    {/if}
            </li>
            {/each}
    </ol>
</nav>
