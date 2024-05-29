<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import type {IMenuItem} from "@models/menus.model";
    import type {IGenericObject} from "@models/general";
    let showMenu = false;
    export let link: string;
    export let children: IMenuItem[];
    export let title;
    export let metaData: IGenericObject;
    function toggleMenu() {
        showMenu = !showMenu;
    }


</script>


<div class="flex h-full mr-8" on:mouseenter={toggleMenu} on:mouseleave={toggleMenu}>
    <div class="relative flex">
        <a href={link}
           title={title}
           class:border-indigo-600={showMenu}
           class:text-indigo-600={showMenu}
           class:border-transparent={!showMenu}
                class=" text-gray-700 dark:text-white  relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out" aria-expanded="false">{title}</a>
    </div>





       <div in:fly="{{ duration: 500 }}" out:fade="{{duration: 100}}"
             class:hidden="{!showMenu}"
             class="absolute inset-x-0 top-full z-10 text-sm shadow-2xl text-gray-500 dark:text-white">
            <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true"></div>
            {#if Array.isArray(children) && children.length > 0}
            <div class="relative bg-white">
                <div class="mx-auto max-w-7xl px-8">
                    <div class="grid grid-cols-3 gap-x-8 gap-y-10 py-16">
                        {#if metaData && metaData.cta.image}
                                <div class="group relative text-base sm:text-sm ">
                                <div class=" overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                    <img src={metaData.cta.image} width="350" height="350"
                                         alt={metaData.cta.alt} title={metaData.cta.title}
                                         class=" object-fill object-center">
                                </div>
                                <a href={metaData.cta.url} class="mt-6 block font-medium text-gray-900">
                                    <span class="absolute inset-0 z-10" aria-hidden="true"></span>
                                    {metaData.cta.title}
                                </a>
                                <p aria-hidden="true" class="mt-1">Shop now</p>
                            </div>
                            {/if}
                        <div class="row-start-1 col-span-2 ">
                            <div class="grid max-w-screen-xl space-y-2 px-4 py-5 mx-auto text-gray-900 dark:text-white xl:grid-cols-3 lg:grid-cols-2 md:px-6">
                                {#each children as item}
                                <div>
                                    <a href={item.link ? item.link.replace('/category', '/products') : item.permalink.replace('/category', '/products')} class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div class="font-semibold">{item.title}</div>
                                        <span class="text-sm text-gray-500 dark:text-gray-400">{item.description || ''}</span>
                                    </a>
                                </div>
                                {/each}
</div>
</div>

                    </div>
                </div>
            </div>
            {/if}
        </div>
</div>
