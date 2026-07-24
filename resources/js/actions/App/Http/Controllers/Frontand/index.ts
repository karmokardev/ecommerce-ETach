import HomeController from './HomeController'
import WishlistController from './WishlistController'
import CartController from './CartController'

const Frontand = {
    HomeController: Object.assign(HomeController, HomeController),
    WishlistController: Object.assign(WishlistController, WishlistController),
    CartController: Object.assign(CartController, CartController),
}

export default Frontand