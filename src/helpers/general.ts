import type {IGenericObject} from "@models/general";

export function sortBy(items: any[], sortField = 'createdAt', way = 'desc') {
    return items.sort((a, b) => {
        if (way === 'asc') {
            return new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
        }

        return new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime()
    });
}

export function highlighter(str: string, term: string) {
    return str.replace(new RegExp(term, "gi"), (match) => `<mark class="mark">${match}</mark>`);
}


export function scrollToEl(targetEl: string|null|HTMLBodyElement|Element, offsetHeader = false, useSmooth = true) {
    if (typeof document === 'undefined') {return;}

    if (!targetEl) {
        targetEl = document.querySelector('body');
    }

    if (typeof targetEl === 'string') {
        targetEl = document.querySelector(targetEl);
    }

    // @ts-ignore
    targetEl.scrollIntoView({

        behavior: useSmooth ? 'smooth' : 'auto',
    })
}


interface QueryParams {
    [key: string]: string | string[];
}

export function qs(a: string): QueryParams {
    if (!a) return {};

    const parts = a.split('#')[0].split('&');
    let b = parts.length;
    const c: QueryParams = {};

    while (b--) {
        const d = parts[b].split('=');
        let k = d[0].replace('[]', '');
        let v = decodeURIComponent(d[1] || '');

        if (c[k]) {
            if (typeof c[k] === 'string') {
                c[k] = [v, c[k] as string];
            } else {
                (c[k] as string[]).unshift(v);
            }
        } else {
            c[k] = v;
        }
    }

    return c;
}

export function setUrl(filters: IGenericObject[]) {
    //ssr
    if (typeof location === 'undefined' || typeof document === 'undefined') {return;}
    const url = new URL(location.href);
    [...url.searchParams.keys()].forEach(key => url.searchParams.delete(key));

    filters.forEach(filter => {
        const key = Object.keys(filter)[0];

        if (key === 'page' && filter[key] <= 1) {
            return ;
        }

        // {sort: 'we'}
        if (typeof filter[key] === "object" && !Array.isArray(filter[key])) {
            url.searchParams.set(`${key}`, filter[key][key]);
            return;
        }

        if (Array.isArray(filter[key]) && filter[key].length === 0) {
            return;
        }
        else if (Array.isArray(filter[key])) {

            filter[key].forEach((f: any, idx: number) => {
                url.searchParams.set(`${key}[${idx}]`, f);
            });
            return ;
        }

        url.searchParams.set(key, filter[key])
    });


    history.pushState(null, '', url);
    return;

}


export function loadFiltersFromUrl(string: string) {
    const filters = qs(string);
    const ret: any = [];

    const regex = /\[\d+\]/gm;

    for (let key in filters) {
        let cleanKey = decodeURI(key);
        // colors[] will be true, page will be false
        const isArrayKey = cleanKey.match(regex);

        cleanKey = cleanKey.replace(regex, '');

        const foundIndex = ret.findIndex((v: IGenericObject) => cleanKey === Object.keys(v)[0])
        // First iteration of this key, it doesn't exist yet
        if (foundIndex === -1 || !Array.isArray(ret[foundIndex][cleanKey])) {
            const temp: IGenericObject = {};

            temp[cleanKey] = (!isArrayKey) ? filters[key] :  [filters[key]];
            ret.push(temp);
            continue;
        }



        ret[foundIndex][cleanKey].push(filters[key]);

    }

    return ret;
}
