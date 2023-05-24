import {action, atom, computed} from "nanostores";
import type {IAggregation, IPropertiesStore, IPropertyEs, ISearchResult} from "@models/products.model";
import type {IGenericObject} from "@models/general";
export const searchConfig = {
    defaultLimit: 10,
}
export const searchStore = atom<ISearchResult>({
    total: 0,
    data: [],
    aggregations: [] as IAggregation[],
    page: 1,
    pages: 0,
    from: 0,
    limit: searchConfig.defaultLimit
});

export const appliedFiltersStore = atom<IGenericObject[]>([]);

export const propertiesStore = atom<IPropertiesStore>({
    colors: [],
    materials: [],
});



export const searchWithPropertiesStore = computed([searchStore, propertiesStore], (searchResults, properties) => {
    return {
        searchResults,
        properties
    }
});

export const setSearchAction = action(searchStore, 'setSearchAction', (store, res) => {
    store.set(res);

    return store.get();
});

/**
 * add a new filter of filter value. Like color -> black. Second time round will add color -> black,blue
 */
export const addFilterAction = action(appliedFiltersStore, 'setFilterAction', (store, filter, isArrayFilter = true) => {
    const state = store.get();
    const key = Object.keys(filter)[0];
    const foundIdx = state.findIndex(f => f[key]);

    if (foundIdx !== -1) {
        if (isArrayFilter) {
            if (state[foundIdx][key].indexOf(filter[key]) === -1) {
                state[foundIdx][key].push(filter[key]);
            }
        } else {
            state[foundIdx][key] = filter[key];
        }
    }
    else {
        const obj: IGenericObject = {};
        if (isArrayFilter) {
            obj[key] = [filter[key]];
        }
        state.push(obj);
    }

    store.set(state);

    return store.get();
});

/**
 * Remove a value from a filter, like black from colors
 */
export const removeFilterValueAction = action(appliedFiltersStore, 'removeFilterValueAction', (store, key, value) => {
    const state = store.get();
    const idx = state.findIndex(f => f[key]);
    const valueIdx = state[idx][key].findIndex((v: any) => v === value);
    state[idx][key].splice(valueIdx, 1);

    if (state[idx][key].length === 0){
        state.splice(idx, 1);
    }

    store.set(state);

    return store.get();
});

/**
 * remove an entire filter, like colors
 */
export const removeFilterAction = action(appliedFiltersStore, 'removeFilterAction', (store, key) => {
    const state = store.get();
    const idx = state.findIndex(f => f[key]);
    state[idx].splice(idx, 1);

    return store.get();
});


export const setPropertiesAction = action(propertiesStore, 'setPropertiesAction', (store, key, value) => {
    if (!key || !value) {
        return store.get();
    }

    const state = store.get();
    // @ts-ignore
    state[key] = value ;
    store.set(state);

    return store.get();
});
