export function optimizeCloudinaryImage(src: string, w: number|null = null, h: number|null = null) {
    const width = (w) ? `w_${w},` : '';
    const height = (h) ? `h_${h},` : '';
    const crop = (w || h) ? 'c_fit,' : '';
    return src.replace('upload/', `upload/${width}${height}${crop}q_auto:good/f_auto/`);
}

export function cloudinarySrcSet(src: string, sizes = [960, 1280, 1920]) {
    return {
        original: optimizeCloudinaryImage(src),
        copies: sizes.map(size => ({
            url: src.replace('upload/', `upload/w_${size},c_scale,q_auto:good/f_auto/`),
            size
        }))
    };
}
