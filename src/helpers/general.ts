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
