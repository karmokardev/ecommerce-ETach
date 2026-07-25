import HomeController from './HomeController'
import FeaturedController from './FeaturedController'
import WishlistController from './WishlistController'
import CartController from './CartController'

const Frontand = {
    HomeController: Object.assign(HomeController, HomeController),
    FeaturedController: Object.assign(FeaturedController, FeaturedController),
    WishlistController: Object.assign(WishlistController, WishlistController),
    CartController: Object.assign(CartController, CartController),
}

export default Frontand