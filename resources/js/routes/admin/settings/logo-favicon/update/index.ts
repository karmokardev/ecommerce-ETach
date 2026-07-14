import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SettingController::setting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
export const setting = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setting.url(args, options),
    method: 'post',
})

setting.definition = {
    methods: ["post"],
    url: '/admin/settings/logo-favicon/{key}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SettingController::setting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
setting.url = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { key: args }
    }

    if (Array.isArray(args)) {
        args = {
            key: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        key: args.key,
    }

    return setting.definition.url
            .replace('{key}', parsedArgs.key.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SettingController::setting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
setting.post = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setting.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::setting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
const settingForm = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setting.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::setting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
settingForm.post = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setting.url(args, options),
    method: 'post',
})

setting.form = settingForm

const update = {
    setting: Object.assign(setting, setting),
}

export default update