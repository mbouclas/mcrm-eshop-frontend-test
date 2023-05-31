<script lang="ts">
    import type {IProductModel, IPropertyEs} from "@models/products.model";
    import ColorSelector from '@components/product/color-selector.svelte';
    import {propertiesStore} from "@stores/search.store";
    import {getProductColors} from "@helpers/product";
    import {moneyFormat} from "@helpers/money-format";
    import {optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
    import {appConfig} from "@stores/http.store";
    let productColors = [];
    export let item: IProductModel,
        colors: IPropertyEs[] = [];

    propertiesStore.subscribe(state => {
        productColors = getProductColors(state.colors, item.variants.filter(variant => variant.color && variant.image));
    });




    function slimDownProduct(item: IProductModel) {
        return {
            id: item.id,
            title: item.title,
        }
    }
</script>

<div class=" relative flex flex-col overflow-hidden rounded-lg border border-sky border-opacity-50 bg-white">
    <div class=" sm:aspect-none group-hover:opacity-75 sm:h-96">
        <a href={`/product/${item.sku}/${item.slug}`} title={item.title}>
            <img  src={optimizeCloudinaryImage(item.thumb || appConfig.defaultNoImage, 360, 360, 'fill')} id={`item-${item.slug}`}
                  alt={item.title}
                  title={item.title}
                  width="158"
                  height="158"
                  class="h-full object-contain w-full  sm:h-full sm:w-full transition duration-200 hover:scale-110">
        </a>
    </div>
    <div class="flex flex-1 flex-col space-y-2 p-4 bg-gray-50">
        <h3 class="text-sm font-medium text-gray-900">
            <a href={`/product/${item.sku}/${item.slug}`} title={item.title}>
                <span aria-hidden="true" class=" inset-0"></span>
                {item.title}
            </a>
        </h3>
        <ColorSelector colors={colors} targetImage={`#item-${item.slug}`} />
        <div class="flex flex-1 flex-col justify-end">
            {#if productColors.length > 0}
                <p class="text-sm italic text-gray-500">{productColors.length} {productColors.length === 1 ? 'color' : 'colors'}</p>
            {/if}
            <p class="text-base font-medium text-gray-900">{moneyFormat(item.price)}</p>
        </div>


    </div>
</div>
