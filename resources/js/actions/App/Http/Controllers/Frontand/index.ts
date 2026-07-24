import HomeController from './HomeController'
import WishlistController from './WishlistController'

const Frontand = {
    HomeController: Object.assign(HomeController, HomeController),
    WishlistController: Object.assign(WishlistController, WishlistController),
}

export default Frontand