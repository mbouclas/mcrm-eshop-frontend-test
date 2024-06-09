export function safeUrl(url: string) {
    return (url.endsWith('/')) ? url : url + '/';
}
