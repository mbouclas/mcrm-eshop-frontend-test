<script lang="ts">
    import type {IMenuItem} from "@models/menus.model";

    let showMenu = false;
    export let link: string;
    export let children: IMenuItem[];
    export let title;
    function toggleMenu() {
        showMenu = !showMenu;
    }

</script>
<li class="mb-0.5 ">
    <div class="relative flex items-center justify-between">
        <a class="w-full font-semibold text-gray-600 dark:text-white text-[15px] menu-item relative py-3 ltr:pl-5 rtl:pr-5 ltr:md:pl-6 rtl:md:pr-6 ltr:pr-4 rtl:pl-4 transition duration-300 ease-in-out"
           href={link} title={title}>
            <span class="block w-full">{title}</span>
        </a>

    </div>
    {#if children && children.length > 0}
        <ul class="pt-0.5 pl-4">
            {#each children as child}
            <li class="mb-0.5 ltr:pl-4 rtl:pr-4">
                <div class="relative flex items-center justify-between">
                    <a class="text-gray-600 dark:text-white w-full text-[15px] menu-item relative py-3 ltr:pl-5 rtl:pr-5 ltr:md:pl-6 rtl:md:pr-6 ltr:pr-4 rtl:pl-4 transition duration-300 ease-in-out"
                       href={child.link || child.permalink}>
                         <span class="block w-full"> - {child.title}</span>
                    </a>
                </div>
            </li>
                {/each}
        </ul>
    {/if}
</li>




