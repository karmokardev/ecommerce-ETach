import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:15
* @route '/admin/settings/logo-favicon'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/settings/logo-favicon',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:15
* @route '/admin/settings/logo-favicon'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:15
* @route '/admin/settings/logo-favicon'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:15
* @route '/admin/settings/logo-favicon'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:15
* @route '/admin/settings/logo-favicon'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:15
* @route '/admin/settings/logo-favicon'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:15
* @route '/admin/settings/logo-favicon'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:30
* @route '/admin/settings/logo-favicon'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/settings/logo-favicon',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:30
* @route '/admin/settings/logo-favicon'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:30
* @route '/admin/settings/logo-favicon'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:30
* @route '/admin/settings/logo-favicon'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:30
* @route '/admin/settings/logo-favicon'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\SettingController::updateSetting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
export const updateSetting = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSetting.url(args, options),
    method: 'post',
})

updateSetting.definition = {
    methods: ["post"],
    url: '/admin/settings/logo-favicon/{key}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SettingController::updateSetting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
updateSetting.url = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateSetting.definition.url
            .replace('{key}', parsedArgs.key.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SettingController::updateSetting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
updateSetting.post = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSetting.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::updateSetting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
const updateSettingForm = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateSetting.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::updateSetting
* @see app/Http/Controllers/Admin/SettingController.php:73
* @route '/admin/settings/logo-favicon/{key}'
*/
updateSettingForm.post = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateSetting.url(args, options),
    method: 'post',
})

updateSetting.form = updateSettingForm

/**
* @see \App\Http\Controllers\Admin\SettingController::destroy
* @see app/Http/Controllers/Admin/SettingController.php:102
* @route '/admin/settings/logo-favicon/{key}'
*/
export const destroy = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/settings/logo-favicon/{key}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SettingController::destroy
* @see app/Http/Controllers/Admin/SettingController.php:102
* @route '/admin/settings/logo-favicon/{key}'
*/
destroy.url = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{key}', parsedArgs.key.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SettingController::destroy
* @see app/Http/Controllers/Admin/SettingController.php:102
* @route '/admin/settings/logo-favicon/{key}'
*/
destroy.delete = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::destroy
* @see app/Http/Controllers/Admin/SettingController.php:102
* @route '/admin/settings/logo-favicon/{key}'
*/
const destroyForm = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SettingController::destroy
* @see app/Http/Controllers/Admin/SettingController.php:102
* @route '/admin/settings/logo-favicon/{key}'
*/
destroyForm.delete = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const SettingController = { index, update, updateSetting, destroy }

export default SettingController