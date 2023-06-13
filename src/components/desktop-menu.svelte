<script lang="ts">
    import DesktopMenuItem from '@components/desktop-menu-item.svelte';
    import type {IMenuItem} from "@models/menus.model";

    export let menuItems: IMenuItem[] = [];
    /*
     {#each menuItems as item}
            <DesktopMenuItem menuItem={item}/>
        {/each}
     */
</script>
<nav aria-label="Top" class="relative z-20 bg-white bg-opacity-90 backdrop-blur-xl backdrop-filter">
<div class="lg:ml-8 lg:block lg:self-stretch">
    <div class="flex h-16 items-center">
    <div class="flex h-full space-x-12">
        <slot></slot>

    </div>
    </div>
</div>
</nav>
