import Frontand from './Frontand'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    Frontand: Object.assign(Frontand, Frontand),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers