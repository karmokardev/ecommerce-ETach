import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

login.form = loginForm

/**
* @see routes/web.php:80
* @route '/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see routes/web.php:80
* @route '/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see routes/web.php:80
* @route '/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see routes/web.php:80
* @route '/logout'
*/
const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

/**
* @see routes/web.php:80
* @route '/logout'
*/
logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

logout.form = logoutForm

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

register.form = registerForm

/**
* @see \App\Http\Controllers\Frontand\HomeController::home
* @see app/Http/Controllers/Frontand/HomeController.php:9
* @route '/'
*/
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Frontand\HomeController::home
* @see app/Http/Controllers/Frontand/HomeController.php:9
* @route '/'
*/
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Frontand\HomeController::home
* @see app/Http/Controllers/Frontand/HomeController.php:9
* @route '/'
*/
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Frontand\HomeController::home
* @see app/Http/Controllers/Frontand/HomeController.php:9
* @route '/'
*/
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Frontand\HomeController::home
* @see app/Http/Controllers/Frontand/HomeController.php:9
* @route '/'
*/
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Frontand\HomeController::home
* @see app/Http/Controllers/Frontand/HomeController.php:9
* @route '/'
*/
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Frontand\HomeController::home
* @see app/Http/Controllers/Frontand/HomeController.php:9
* @route '/'
*/
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

home.form = homeForm

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:12
* @route '/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:12
* @route '/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:12
* @route '/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:12
* @route '/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:12
* @route '/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:12
* @route '/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:12
* @route '/dashboard'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see \App\Http\Controllers\Admin\UsersController::users
* @see app/Http/Controllers/Admin/UsersController.php:14
* @route '/users'
*/
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UsersController::users
* @see app/Http/Controllers/Admin/UsersController.php:14
* @route '/users'
*/
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsersController::users
* @see app/Http/Controllers/Admin/UsersController.php:14
* @route '/users'
*/
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::users
* @see app/Http/Controllers/Admin/UsersController.php:14
* @route '/users'
*/
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::users
* @see app/Http/Controllers/Admin/UsersController.php:14
* @route '/users'
*/
const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::users
* @see app/Http/Controllers/Admin/UsersController.php:14
* @route '/users'
*/
usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::users
* @see app/Http/Controllers/Admin/UsersController.php:14
* @route '/users'
*/
usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

users.form = usersForm

/**
* @see \App\Http\Controllers\Admin\RoleController::roles
* @see app/Http/Controllers/Admin/RoleController.php:13
* @route '/roles'
*/
export const roles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})

roles.definition = {
    methods: ["get","head"],
    url: '/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\RoleController::roles
* @see app/Http/Controllers/Admin/RoleController.php:13
* @route '/roles'
*/
roles.url = (options?: RouteQueryOptions) => {
    return roles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RoleController::roles
* @see app/Http/Controllers/Admin/RoleController.php:13
* @route '/roles'
*/
roles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\RoleController::roles
* @see app/Http/Controllers/Admin/RoleController.php:13
* @route '/roles'
*/
roles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: roles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\RoleController::roles
* @see app/Http/Controllers/Admin/RoleController.php:13
* @route '/roles'
*/
const rolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: roles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\RoleController::roles
* @see app/Http/Controllers/Admin/RoleController.php:13
* @route '/roles'
*/
rolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: roles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\RoleController::roles
* @see app/Http/Controllers/Admin/RoleController.php:13
* @route '/roles'
*/
rolesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: roles.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

roles.form = rolesForm

/**
* @see \App\Http\Controllers\Admin\PermissionController::permissions
* @see app/Http/Controllers/Admin/PermissionController.php:12
* @route '/permissions'
*/
export const permissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(options),
    method: 'get',
})

permissions.definition = {
    methods: ["get","head"],
    url: '/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PermissionController::permissions
* @see app/Http/Controllers/Admin/PermissionController.php:12
* @route '/permissions'
*/
permissions.url = (options?: RouteQueryOptions) => {
    return permissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PermissionController::permissions
* @see app/Http/Controllers/Admin/PermissionController.php:12
* @route '/permissions'
*/
permissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PermissionController::permissions
* @see app/Http/Controllers/Admin/PermissionController.php:12
* @route '/permissions'
*/
permissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: permissions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PermissionController::permissions
* @see app/Http/Controllers/Admin/PermissionController.php:12
* @route '/permissions'
*/
const permissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: permissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PermissionController::permissions
* @see app/Http/Controllers/Admin/PermissionController.php:12
* @route '/permissions'
*/
permissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: permissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PermissionController::permissions
* @see app/Http/Controllers/Admin/PermissionController.php:12
* @route '/permissions'
*/
permissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: permissions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

permissions.form = permissionsForm

/**
* @see \App\Http\Controllers\Admin\ColorsController::colors
* @see app/Http/Controllers/Admin/ColorsController.php:12
* @route '/colors'
*/
export const colors = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: colors.url(options),
    method: 'get',
})

colors.definition = {
    methods: ["get","head"],
    url: '/colors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ColorsController::colors
* @see app/Http/Controllers/Admin/ColorsController.php:12
* @route '/colors'
*/
colors.url = (options?: RouteQueryOptions) => {
    return colors.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ColorsController::colors
* @see app/Http/Controllers/Admin/ColorsController.php:12
* @route '/colors'
*/
colors.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: colors.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ColorsController::colors
* @see app/Http/Controllers/Admin/ColorsController.php:12
* @route '/colors'
*/
colors.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: colors.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ColorsController::colors
* @see app/Http/Controllers/Admin/ColorsController.php:12
* @route '/colors'
*/
const colorsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: colors.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ColorsController::colors
* @see app/Http/Controllers/Admin/ColorsController.php:12
* @route '/colors'
*/
colorsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: colors.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ColorsController::colors
* @see app/Http/Controllers/Admin/ColorsController.php:12
* @route '/colors'
*/
colorsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: colors.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

colors.form = colorsForm
