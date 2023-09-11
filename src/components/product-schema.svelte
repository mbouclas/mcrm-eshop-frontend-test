<script lang="ts">
    import type {IProductModel} from "@models/products.model";

    export let product: IProductModel;

    const props: string[] = [];
    let schema = `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org/",
        "@type": "Product",
    `;
    props.push(`"name": "${product.title}"`);
    props.push(`"image": "${product.thumb}"`);
    props.push(`"description": "${product.description}"`);
    props.push(`"brand": "RPS"`);
    props.push(`"sku": "${product.sku}"`);
    props.push(`
        "offers": {
            "@type": "Offer",
            "url": "${import.meta.env.PUBLIC_SITE_BASE_URL}/product/${product.sku}/${product.slug}/",
            "priceCurrency": "EUR",
            "price": "${product.price}",
            "availability": "https://schema.org/InStock"
        }
    `);

    schema += props.join(',\n');

    schema += `}
    <\/script>
    `;
</script>

{@html schema}
