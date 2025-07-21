export function safeUrl(url: unknown) {
    if (typeof url !== 'string' || !url) return '';
    return url.endsWith('/') ? url : url + '/';
}
