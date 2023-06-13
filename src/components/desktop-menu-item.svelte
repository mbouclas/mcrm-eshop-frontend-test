<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import type {IMenuItem} from "@models/menus.model";
    let showMenu = false;
    export let link: string;
    export let children: IMenuItem[];
    export let title;
    function toggleMenu() {
        showMenu = !showMenu;
    }


</script>

<div class="flex h-full mr-8" on:mouseenter={toggleMenu} on:mouseleave={toggleMenu}>
    <div class="relative flex">
        <a href={link}
           class:border-indigo-600={showMenu}
           class:text-indigo-600={showMenu}
           class:border-transparent={!showMenu}
                class=" text-gray-700  relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out" aria-expanded="false">{title}</a>
    </div>


        <div in:fly="{{ duration: 500 }}" out:fade="{{duration: 100}}"
             class:hidden="{!showMenu}"
             class="absolute inset-x-0 top-full z-10 text-sm shadow-2xl text-gray-500">
            <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true"></div>
            {#if Array.isArray(children) && children.length > 0}
            <div class="relative bg-white">
                <div class="mx-auto max-w-7xl px-8">
                    <div class="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                        <div class="col-start-2 grid grid-cols-2 gap-x-8">
                            <div class="group relative text-base sm:text-sm">
                                <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                    <img src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg" alt="Models sitting back to back, wearing Basic Tee in black and bone." class="object-cover object-center">
                                </div>
                                <a href="#" class="mt-6 block font-medium text-gray-900">
                                    <span class="absolute inset-0 z-10" aria-hidden="true"></span>
                                    New Arrivals
                                </a>
                                <p aria-hidden="true" class="mt-1">Shop now</p>
                            </div>
                            <div class="group relative text-base sm:text-sm">
                                <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                    <img src="https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg" alt="Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees." class="object-cover object-center">
                                </div>
                                <a href="#" class="mt-6 block font-medium text-gray-900">
                                    <span class="absolute inset-0 z-10" aria-hidden="true"></span>
                                    Basic Tees
                                </a>
                                <p aria-hidden="true" class="mt-1">Shop now</p>
                            </div>
                        </div>
                        <div class="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                            <div>

                                <ul role="list" aria-labelledby="Clothing-heading" class="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                    {#each children as item}
                                        <li class="flex">
                                            <a href={item.link || item.permalink} class="hover:text-gray-800">{item.title}</a>
                                        </li>
                                    {/each}
                                     </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/if}
        </div>


</div>
