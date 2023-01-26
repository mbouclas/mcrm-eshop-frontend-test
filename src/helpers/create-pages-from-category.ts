import {ProductsService} from "@services/products.service";
import {arrayPaginator} from "@helpers/paginate-array";
import * as lo from 'lodash';

export async function createPagesFromCategory(name: string,  perPage = 10, group?: string) {
    const s = new ProductsService();
    let all = [];
    const categories = await s.load();
    /**
    for (let idx = 0; categories.length > idx; idx++) {
        const records = await s.load(`${name}_${categories[idx].slug}`);
        let i = 0;
        //Let's apply a filter
        if (group) {
            const groups = lo.groupBy(records.data, (item) => {
                return item[group].slug;
            });

           Object.keys(groups).forEach(key => console.log(key, groups[key].length))
            // loop over all groups. For each group, push the data to all
            continue;
        }

        const init = arrayPaginator(records.data, 1, perPage);
        if (init.totalPages === 0) {
            all = all.concat({items: arrayPaginator([], 1, perPage), page: 1});
            i++;

            continue;
        }

        for (let index = 0; init.totalPages > index; index++) {
            // console.log(i, '---', page.slug, idx+1)
            const paginated = arrayPaginator(records.data, index + 1, perPage);
            all = all.concat({
                ...paginated, ...{
                    title: categories[idx].key,
                    page: index + 1,
                    aggregations: records.aggregations,
                    slug: categories[idx].slug
                }
            });
            i++;
        }
    }

    return all ;
     */
}
