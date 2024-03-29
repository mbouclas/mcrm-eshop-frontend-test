import {optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
export const config = {
    seo: {
        defaults: {
            title: 'RPS Promotions | Custom prints and embroidery',
            description: 'Every Company Needs Promo Products!  RPS Offers Logo-Branded Merch for All Occasions. Gifts, Events, Marketing. Shop Now!',
            canonical: import.meta.env.BASE_URL,
        }
    },
    defaultNoImage : optimizeCloudinaryImage('https://res.cloudinary.com/dqehxczmc/image/upload/v1683624508/icons/dummy-post-horisontal-thegem-blog-default-large_i9rkvt_zdahwl.jpg'),
    heroImages: {
    }
}

