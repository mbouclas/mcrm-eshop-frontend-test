<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import type {IMenuItem} from "@models/menus.model";
    import type {IGenericObject} from "@models/general";
    import {safeUrl} from "@helpers/urls.ts";
    import {cloudinaryRawSettings} from "@helpers/cloudinary.helper.ts";
    let showMenu = false;
    export let link: string;
    export let children: IMenuItem[];
    export let title;
    export let metaData: IGenericObject;
    let menuTimeout: ReturnType<typeof setTimeout>;
    function openMenu() {
        clearTimeout(menuTimeout);
        showMenu = true;
    }
    function closeMenu() {
        menuTimeout = setTimeout(() => {
            showMenu = false;
        }, 100); // short delay to allow moving between parent and submenu
    }
</script>

<div class="relative flex h-full mr-8"
     on:mouseenter={openMenu}
     on:mouseleave={closeMenu}>
    <div class="flex">
        <a href={link}
           title={title}
           class:border-indigo-600={showMenu}
           class:text-indigo-600={showMenu}
           class:border-transparent={!showMenu}
           class="text-gray-700 dark:text-white relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
           aria-expanded={showMenu}>{title}</a>
    </div>
    {#if Array.isArray(children) && children.length > 0}
        <div class="fixed left-0 top-full w-full max-w-none z-20"
             on:mouseenter={openMenu}
             on:mouseleave={closeMenu}
             transition:fade={{ duration: 150 }}
             class:hidden={!showMenu}>
            <div class="bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700">
                <div class="mx-auto px-8 py-10">
                    <div class="grid grid-cols-3 gap-x-8 gap-y-10">
                        <div class="col-span-2 grid grid-cols-2 gap-8">
                            {#each children as item}
                                <div>
                                    <a href={item.link ? safeUrl(item.link.replace('/category', '/products')) : safeUrl(item.permalink.replace('/category', '/products'))}
                                       class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div class="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 mb-1">{item.title}</div>
                                        {#if item.description}
                                            <span class="text-sm text-gray-500 dark:text-gray-400">{item.description}</span>
                                        {/if}
                                    </a>
                                    {#if item.children && item.children.length > 0}
                                        <ul class="ml-4 list-disc">
                                            {#each item.children as subitem}
                                                <li>
                                                    <a href={safeUrl(subitem.link)}
                                                       class="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                                                        {subitem.title}
                                                    </a>
                                                </li>
                                            {/each}
                                        </ul>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                        {#if metaData && metaData.cta && metaData.cta.image}
                            <div class="flex flex-col items-center justify-center">
                                <div class="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
                                    <img src={cloudinaryRawSettings(typeof metaData.cta.image === 'string' ? metaData.cta.image : metaData.cta.image.url, 'w_384,f_webp')}
                                         width="350" height="350"
                                         alt={metaData.cta.alt} title={metaData.cta.title}
                                         loading="lazy" decoding="async"
                                         class="object-cover object-center w-full h-full">
                                </div>
                                {#if metaData.cta.title}
                                    <div class="font-bold text-lg text-gray-900 dark:text-white mb-2">{metaData.cta.title}</div>
                                {/if}
                                {#if metaData.cta.description}
                                    <div class="text-gray-600 dark:text-gray-300 text-sm">{metaData.cta.description}</div>
                                {/if}
                                {#if metaData.cta.link}
                                    <a href={safeUrl(metaData.cta.link)}
                                       class="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                                        {metaData.cta.buttonText || 'Learn More'}
                                    </a>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
