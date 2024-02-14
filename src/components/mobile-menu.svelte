<script lang="ts">
    import Sidebar from "@components/sidebar.svelte";
    import {modalStore,  setModalToggleAction} from "@stores/search.store";
    import {logoMobileUrl} from "@data/defaults";
    import MobileCart from "@components/mobile-cart.svelte";
    import {cart} from "@stores/cart.store";
    import {config} from "@data/config.ts";
    let shown = true,
    cartCount = 0;
    const modalId = 'mobileMenu',
        searchModalId = 'mobileSearch',
        cartModalId = 'mobileCart';

    cart.subscribe(state => {
        if (Array.isArray(state.items) && state.items.length > 0)
        {
            cartCount = state.items.length;
            return
        }

        cartCount = 0;
    })

    modalStore.subscribe((state) => {
        let found = false;
        [modalId, cartModalId, 'filters'].forEach(key => {
            if (state.items[key] === true) {
                found = true;
            }
        });

        // Any of the above drawer is open, we don't want to show the mobile menu
        shown = !found;
    });
    function toggleMenu() {
        setModalToggleAction(modalId);
    }

    function toggleSearch() {
        setModalToggleAction(searchModalId);
    }

    function toggleCart() {
        setModalToggleAction(cartModalId);
    }
</script>
<Sidebar title="Cart" id={cartModalId}>
    <MobileCart />
</Sidebar>


<Sidebar id="mobileMenu">
    <div slot="title">
        <img alt={config.seo.defaults.title}
             title={config.seo.defaults.title}
             src={logoMobileUrl}
             width="95"
             height="67"
             decoding="async"
        >
    </div>
    <ul class="list-none m-0 p-0 mobileMenu dark:text-white">
        <slot></slot>
    </ul>
</Sidebar>

{#if shown}
    <div class="dark">
<div class="block lg:hidden fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
    <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
        <button on:click={toggleMenu} type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-l-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                    xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
            <span class="sr-only">Home</span>
        </button>
        <button on:click={toggleSearch} data-tooltip-target="tooltip-wallet" type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                 xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/></svg>

        </button>

        <div class="flex items-center justify-center">
            <a href="/" class="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
            </a>
        </div>

        <button on:click={toggleCart} type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                    xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2zm0-3l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1v2h2l3.6 7.59L3.62 17H19v-2H7z"/></svg>

        </button>

        <a href="/user" class="inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"></path>
            </svg>

        </a>

    </div>
</div>
    </div>
    {/if}


<style>
    .mobileMenu li li {
        --tw-text-opacity: 1;
        color: rgb(90 90 90/var(--tw-text-opacity));
    }
    .mobileMenu li li div>a {
        position: relative;
        padding-top: .625rem;
        padding-bottom: .625rem;
    }

    :is([dir=ltr] .mobileMenu li>ul>li>div>a):before {
        left: .375rem;
    }

    .mobileMenu li>ul>li>div>a:before {
        content: "";
        height: 1px;
        position: absolute;
        top: 50%;
        display: flex;
        width: .375rem;
        --tw-bg-opacity: 1;
        background-color: rgb(90 90 90/var(--tw-bg-opacity));
    }
</style>
