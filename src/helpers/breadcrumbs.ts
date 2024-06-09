import {safeUrl} from "@helpers/urls.ts";

export function constructBreadCrumbs(items: any[], itemSlug: string, current: string) {
    return items.map((item, index) => ({
        title: item.title,
        slug: safeUrl(`/${itemSlug}/${item.slug}`),
    }));
}
