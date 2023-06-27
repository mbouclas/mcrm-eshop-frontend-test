<script lang="ts">
    import type {IProductModel, IPropertyEs} from "@models/products.model";
    import ColorSelector from '@components/product/color-selector.svelte';
    import {propertiesStore} from "@stores/search.store";
    import {getProductColors} from "@helpers/product";
    import {moneyFormat} from "@helpers/money-format";
    import {optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
    import {appConfig} from "@stores/http.store";
    import Spinner from "@components/loading-spiner.svelte";
    import {onMount} from "svelte";

    let productColors = [],
        target: Element|null,
        mask: Element|null;
    export let item: IProductModel,
        colors: IPropertyEs[] = [];

    propertiesStore.subscribe(state => {
        productColors = getProductColors(state.colors, item.variants.filter(variant => variant.color || variant.image));
    });

    function slimDownProduct(item: IProductModel) {
        return {
            id: item.id,
            title: item.title,
        }
    }


</script>

<div class="product-item relative flex flex-col overflow-hidden rounded border hover:rounded-xl hover:shadow-2xl border border-black/20  border-opacity-50 bg-white" id={`item-${item.slug}`}>
    <div class="hidden absolute bg-black/70 h-full w-full z-50 loading-mask">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Spinner w={24} h={24} />
        </div>
    </div>
    <div class=" sm:aspect-none group-hover:opacity-75 sm:h-96 relative">

        <a href={`/product/${item.sku}/${item.slug}`} title={item.title}>
            <img  src={optimizeCloudinaryImage(item.thumb || appConfig.defaultNoImage, 360, 360, 'fill')}
                  alt={item.title}
                  title={item.title}
                  width="158"
                  height="158"
                  class="product-image h-full object-contain w-full  sm:h-full sm:w-full transition duration-200 hover:scale-110">
        </a>
    </div>
    <div class="flex flex-1 flex-col space-y-2 p-4 ">
        <h3 class="text-sm font-medium text-gray-900">
            <a href={`/product/${item.sku}/${item.slug}`} title={item.title}>
                <span aria-hidden="true" class=" inset-0"></span>
                {item.title}
            </a>
        </h3>
        <ColorSelector colors={productColors} targetImage={`#item-${item.slug}`} />
        <div class="flex flex-1 flex-col justify-end">
            {#if productColors.length > 0}
                <p class="text-sm italic text-gray-500">{productColors.length} {productColors.length === 1 ? 'color' : 'colors'}</p>
            {/if}
            <p class="text-base font-medium text-gray-900">{moneyFormat(item.price)}</p>
        </div>


    </div>
</div>
