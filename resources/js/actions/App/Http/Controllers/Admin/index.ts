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
import AttributeController from './AttributeController'
import AttributeValueController from './AttributeValueController'
import ProductController from './ProductController'
import ProductVariantController from './ProductVariantController'
import SupplierController from './SupplierController'
import WarehouseController from './WarehouseController'
import PurchaseController from './PurchaseController'
import StockAdjustmentController from './StockAdjustmentController'
import StockTransferController from './StockTransferController'
import OrderController from './OrderController'
import OrderReturnController from './OrderReturnController'
import ShippingMethodController from './ShippingMethodController'
import ShippingZoneController from './ShippingZoneController'
import ShipmentController from './ShipmentController'
import ReportsController from './ReportsController'

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
    AttributeController: Object.assign(AttributeController, AttributeController),
    AttributeValueController: Object.assign(AttributeValueController, AttributeValueController),
    ProductController: Object.assign(ProductController, ProductController),
    ProductVariantController: Object.assign(ProductVariantController, ProductVariantController),
    SupplierController: Object.assign(SupplierController, SupplierController),
    WarehouseController: Object.assign(WarehouseController, WarehouseController),
    PurchaseController: Object.assign(PurchaseController, PurchaseController),
    StockAdjustmentController: Object.assign(StockAdjustmentController, StockAdjustmentController),
    StockTransferController: Object.assign(StockTransferController, StockTransferController),
    OrderController: Object.assign(OrderController, OrderController),
    OrderReturnController: Object.assign(OrderReturnController, OrderReturnController),
    ShippingMethodController: Object.assign(ShippingMethodController, ShippingMethodController),
    ShippingZoneController: Object.assign(ShippingZoneController, ShippingZoneController),
    ShipmentController: Object.assign(ShipmentController, ShipmentController),
    ReportsController: Object.assign(ReportsController, ReportsController),
}

export default Admin