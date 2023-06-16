<script lang="ts">
    import type {IProductCategoryEs} from "@models/products.model";
    import type {IAggregationBucket} from "@models/products.model";

    export let categories: IProductCategoryEs[] = [],
        category: IProductCategoryEs,
        agg: IAggregationBucket,
        idx = 0;

//    return colors.sort(((a, b) => a.variant.variantId > b.variant.variantId ? 1 : -1));


    const mergeCategoriesWithAggs = (items: IProductCategoryEs[], aggs: IAggregationBucket, sortField = 'title') => {
        if (!items || !Array.isArray(items)) {return []}
        return items.map(item => {
            const agg = aggs.results.find(agg => agg.slug === item.slug);

            if (agg) {
                return {
                    ...item,
                    doc_count: agg.doc_count,
                    children: mergeCategoriesWithAggs(item.children, aggs, sortField)
                }
            }
            return item;
        }).sort((a, b) => a[sortField] > b[sortField] ? 1 : -1);
    }


</script>

<ul class:ml-4={idx > 0}>
    {#each mergeCategoriesWithAggs(categories, agg) as item}
        {#if item.doc_count > 0}
        <li class="" >
            <a href={`/products/${item.slug}`} class:list={[{'font-bold': item.slug === category?.slug}]} class="ml-3 text-sm dark:text-white/70 text-gray-600">{item.title} <span>({item.doc_count || 0})</span></a>
            {#if Array.isArray(item.children)}
                <svelte:self categories={item.children} agg={agg} idx={idx = idx + 1} />
            {/if}
        </li>
            {/if}
    {/each}
</ul>
