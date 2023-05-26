export function optimizeCloudinaryImage(src: string, w: number|null = null, h: number|null = null, cropMode: 'fit'|'fill' = 'fit') {
    if (!src) {
        return ``;
    }
    const width = (w) ? `w_${w},` : 'w_auto,';
    const height = (h) ? `h_${h},` : '';
    let crop = (w || h) ? 'c_fit,' : '';
    if (crop.length > 0) {
        crop = `c_${cropMode},`
    }
    return src.replace('upload/', `upload/${width}${height}${crop}q_auto:good,f_auto,dpr_auto/`);
}

export function cloudinarySrcSet(src: string, sizes = [767, 1190]) {
    if (!src) {
        return null;
    }

    return {
        original: optimizeCloudinaryImage(src),
        copies: sizes.map(size => ({
            url: src.replace('upload/', `upload/w_${size},c_scale,q_auto:good/f_auto/`),
            size
        }))
    };
}
