import {cloudinarySrcSet, optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
export const config = {
    seo: {
        defaults: {
            title: '',
            description: '',
            canonical: import.meta.env.BASE_URL,
        }
    },
    defaultNoImage : optimizeCloudinaryImage('https://res.cloudinary.com/dqehxczmc/image/upload/v1683624508/icons/dummy-post-horisontal-thegem-blog-default-large_i9rkvt_zdahwl.jpg'),
    heroImages: {
/*        aboutUs: {
            alt: 'About Us',
            title: 'About Us',
            image: cloudinarySrcSet('https://res.cloudinary.com/dekcsdfag/image/upload/v1680161872/heroes/about4_hhis00.png'),
        },*/
    }
}

