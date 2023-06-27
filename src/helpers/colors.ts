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


