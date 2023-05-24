import {PropertiesService} from "@services/properties.service";
import type {IProductColorForSelector, IPropertyValue, IVariantEs} from "@models/products.model";

export interface IProductProperty {
    propertyUuid: string;
    propertyName: string;
    type: 'color'|'size'|'material'|'other';
    propertySlug: string;
    code?: string;
    color?: string;
    image?: string;
    value?: string;
    slug: string;
    uuid: string;
    name: string;
}
const propertiesService = new PropertiesService();
const colors: IProductProperty[] = await propertiesService.getPropertyValues({slug: 'color'});
export function findColor(code: string) {
    return propertiesService.findValue(colors,{code})
}

/*export function getProductColors(propertyValues: IProductProperty[], variants: IVariantEs[] = []) {
    if (!propertyValues) {return []}
    const colors: {color: string, image?: string}[] = [];
    propertyValues.forEach(value => {
        if (!value.color) {return}

        const variant = variants.find(v => {
            // console.log(v.color, v.image, value.code)
            return v.color === value.code;
        });

        colors.push({color: value.color, image: variant?.image})
    });

    return colors
}*/

export function getProductColors(propertyValues: IPropertyValue[], variants: IVariantEs[] = []) {
    const colors: IProductColorForSelector[] = [];
    variants.forEach(variant => {
        const found = propertyValues.find(v => v.code === variant.color);
        if (found) {
            colors.push({
                color: found.color as string,
                image: found.image,
                code: found.code as string,
                name: found.name,
                variant: {
                    variantId: variant.variantId,
                    image: variant.image as string,
                    color: variant.color,
                }
            })
        }
    });



    return colors.sort(((a, b) => a.variant.variantId > b.variant.variantId ? 1 : -1));
}
