import {action, atom, computed} from "nanostores";
import type {
    IAggregation,
    IModalStore,
    IPropertiesStore,
    IPropertyEs,
    ISearchResult,
    ISort
} from "@models/products.model";
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
    limit: searchConfig.defaultLimit,
    initialSearch: true,
});

export const modalStore = atom<IModalStore>({
    id: 'default',
    shown: false,
});

export const sortOrderStore = atom<ISort>({} as ISort);

export const appliedFiltersStore = atom<IGenericObject[]>([]);

export const propertiesStore = atom<IPropertiesStore>({
    colors: [],
    materials: [],
});



export const searchWithPropertiesStore = computed([searchStore, propertiesStore, appliedFiltersStore], (searchResults, properties, appliedFilters) => {
    return {
        searchResults,
        properties,
        appliedFilters
    }
});

export const searchWithFiltersStore = computed([searchStore, appliedFiltersStore], (searchResults, appliedFilters) => {
    return{
        searchResults,
        appliedFilters
    }
})

export const setSearchAction = action(searchStore, 'setSearchAction', (store, res, initialSearch ) => {
    res['initialSearch'] = (typeof initialSearch === 'undefined' && typeof res['initialSearch'] === 'undefined') ? false : initialSearch;
    store.set(res);
    return store.get();
});

export const setInitialSearch = action(searchStore, 'setInitialSearchAction', (store, value) => {
   const state = store.get();
   state.initialSearch = value;

   store.set(state);
   return store.get();
});

/**
 * add a new filter of filter value. Like color -> black. Second time round will add color -> black,blue
 */
export const addFilterAction = action(appliedFiltersStore, 'setFilterAction', (store, filter, isArrayFilter) => {
    isArrayFilter = (typeof isArrayFilter === 'undefined') ? true : isArrayFilter;
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
        } else {
            obj[key] = filter[key];
        }
        state.push(obj);
    }

    store.set(state);

    return store.get();
});

/**
 * This action doesn't trigger the store change state on purpose. It's only used to set filters on static mode
 * and avoid going into dynamic mode after the set is done
 */
export const setInitialFiltersAction = action(appliedFiltersStore, 'setInitialFiltersAction', (store, filters) => {
    store.set(filters);

});

/**
 * Remove a value from a filter, like black from colors
 */
export const removeFilterValueAction = action(appliedFiltersStore, 'removeFilterValueAction', (store, key, value) => {
    const state = store.get();
    const idx = state.findIndex(f => f[key]);
    if (!Array.isArray(state[idx][key])){
        state.splice(idx, 1);
        store.set(state);

        return store.get();
    }

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
    if (idx === -1) {
        return  store.get();
    }

    state.splice(idx, 1);

    return store.get();
});

export const clearAllFiltersAction = action(appliedFiltersStore, 'clearAllFiltersAction', (store => {
    store.set([]);

    return store.get()
}));


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


export const setFiltersAction = action(appliedFiltersStore, 'setFiltersAction', (store, filters) => {
    store.set(filters);

    return store.get();
})

export const setModalShownAction = action(modalStore, 'setModalShownAction', (store, value, id) => {
   const state = store.get();
   state.shown = value;
   if (id) {
       state.id = id;
   }

   store.set(state);

   return store.get();
});

export const setSortAction = action(sortOrderStore, 'setSortAction', (store, sortBy: ISort) => {
    if (typeof sortBy.sort === 'object') {
        sortBy.sort = sortBy.sort['sort'];
    }

    if (typeof sortBy.way === 'object') {
        sortBy.way = sortBy.way['way'];
    }

    store.set(sortBy);

   return store.get();
});



export const sortWithFilters = computed([sortOrderStore, appliedFiltersStore], (sort, filters) => {
    return {
        sort,
        filters,

    }
})
