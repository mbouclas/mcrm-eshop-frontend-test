import {optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
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
    }
}

