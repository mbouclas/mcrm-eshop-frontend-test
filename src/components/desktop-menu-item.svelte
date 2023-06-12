<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import type {IMenuItem} from "@models/menus.model";
    let showMenu = false;
    export let menuItem: IMenuItem;

    function toggleMenu() {
        showMenu = !showMenu;
    }
</script>

<div class="flex" on:mouseenter={toggleMenu} on:mouseleave={toggleMenu}>
    <div class="relative flex">
        <!-- Item active: "border-indigo-600 text-indigo-600", Item inactive: "border-transparent text-gray-700 hover:text-gray-800" -->
        <a href={menuItem.link || menuItem.permalink}
                class="border-transparent text-gray-700 hover:border-indigo-600 hover:text-indigo-600 relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out" aria-expanded="false">{menuItem.title}</a>
    </div>

    {#if showMenu}
        <div in:fly="{{ duration: 500 }}" out:fade="{{duration: 100}}"
             class="absolute inset-x-0 top-full z-10 text-sm shadow-2xl text-gray-500">
            <!-- Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow -->
            <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true"></div>
            {#if Array.isArray(menuItem.children)}
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
                                    {#each menuItem.children as item}
                                        <li class="flex">
                                            <a href={item.link || item.permalink} class="hover:text-gray-800">{item.title}</a>
                                        </li>
                                    {/each}
                                    <li class="flex">
                                        <a href="#" class="hover:text-gray-800">Tops</a>
                                    </li>

                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/if}
        </div>

    {/if}
</div>
