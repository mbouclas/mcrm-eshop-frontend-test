import {config} from "@data/config.ts";

export function cloudinaryRawSettings(src: string, settings: string) {
    if (!src) {
        return ``;
    }

    if (typeof src === 'object') {
        src = src['url'];
    }

    const ext = src.split('.').pop()
    if ([ 'jpg', 'png' ].indexOf(ext as string) !== -1) {
        src = src.replace(/\.[^/.]+$/, ".webp")
    }

    return src.replace('upload/', `upload/${settings}/`);
}
export function optimizeCloudinaryImage(src: string, w: number|null = null, h: number|null = null, cropMode: 'fit'|'fill' = 'fit', q = 'auto:good'): string {
    if (typeof src == 'undefined' || !src) {
        return  config.defaultNoImage;
    }

    if (typeof src === 'object') {
        src = src['url'];
    }

    try {
        const ext = src.split('.').pop()
        if ([ 'jpg', 'png' ].indexOf(ext as string) !== -1) {
            src = src.replace(/\.[^/.]+$/, ".webp")
        }

        const width = (w) ? `w_${w},` : 'w_auto,';
        const height = (h) ? `h_${h},` : '';
        let crop = (w || h) ? 'c_fit,' : '';
        if (crop.length > 0) {
            crop = `c_${cropMode},`
        }
        return src.replace('upload/', `upload/${width}${height}${crop}q_${q},f_auto,dpr_auto/`);
    }
    catch (e) {
        return  config.defaultNoImage;
    }

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
