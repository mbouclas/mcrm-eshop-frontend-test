export function constructBreadCrumbs(items: any[], itemSlug: string, current: string) {
    return items.map((item, index) => ({
        title: item.title,
        slug: `/${itemSlug}/${item.slug}`,
    }));
}
