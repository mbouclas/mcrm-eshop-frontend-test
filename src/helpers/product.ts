import type {IProductColorForSelector, IPropertyValue, IVariantEs} from "@models/products.model";

export function getProductColors(propertyValues: IPropertyValue[], variants: IVariantEs[] = []) {
    if (!propertyValues || !variants) {
        return [];
    }
    const colors: IProductColorForSelector[] = [];
    variants.forEach(variant => {
        const found = propertyValues.find(v => v.code === variant.color);
        if (found) {
            colors.push({
                color: found.color as string,
                image: found.image,
                code: found.code as string,
                name: found.name,
                slug: found.slug as string,
                variant: {
                    uuid: variant.uuid,
                    variantId: variant.variantId,
                    image: variant.image as string,
                    color: variant.color,
                }
            })
        }
    });



    return colors.sort(((a, b) => a.variant.variantId > b.variant.variantId ? 1 : -1));
}
