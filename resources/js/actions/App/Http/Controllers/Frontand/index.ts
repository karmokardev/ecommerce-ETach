import HomeController from './HomeController'
import WishlistController from './WishlistController'
import CartController from './CartController'
import FeaturedController from './FeaturedController'
import ProductController from './ProductController'

const Frontand = {
    HomeController: Object.assign(HomeController, HomeController),
    WishlistController: Object.assign(WishlistController, WishlistController),
    CartController: Object.assign(CartController, CartController),
    FeaturedController: Object.assign(FeaturedController, FeaturedController),
    ProductController: Object.assign(ProductController, ProductController),
}

export default Frontand