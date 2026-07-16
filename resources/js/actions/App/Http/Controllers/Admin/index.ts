import DashboardController from './DashboardController'
import UsersController from './UsersController'
import RoleController from './RoleController'
import PermissionController from './PermissionController'
import ColorsController from './ColorsController'
import PresetColorController from './PresetColorController'
import SiteSettingsController from './SiteSettingsController'
import SettingController from './SettingController'
import CategoryController from './CategoryController'
import BrandController from './BrandController'

const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    UsersController: Object.assign(UsersController, UsersController),
    RoleController: Object.assign(RoleController, RoleController),
    PermissionController: Object.assign(PermissionController, PermissionController),
    ColorsController: Object.assign(ColorsController, ColorsController),
    PresetColorController: Object.assign(PresetColorController, PresetColorController),
    SiteSettingsController: Object.assign(SiteSettingsController, SiteSettingsController),
    SettingController: Object.assign(SettingController, SettingController),
    CategoryController: Object.assign(CategoryController, CategoryController),
    BrandController: Object.assign(BrandController, BrandController),
}

export default Admin