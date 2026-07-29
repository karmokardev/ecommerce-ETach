import HomeController from './HomeController'
import WishlistController from './WishlistController'
import profileController from './profileController'
import CartController from './CartController'
import CheckoutController from './CheckoutController'
import FeaturedController from './FeaturedController'
import ProductController from './ProductController'

const Frontand = {
    HomeController: Object.assign(HomeController, HomeController),
    WishlistController: Object.assign(WishlistController, WishlistController),
    profileController: Object.assign(profileController, profileController),
    CartController: Object.assign(CartController, CartController),
    CheckoutController: Object.assign(CheckoutController, CheckoutController),
    FeaturedController: Object.assign(FeaturedController, FeaturedController),
    ProductController: Object.assign(ProductController, ProductController),
}

export default Frontand