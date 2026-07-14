import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::store
* @see app/Http/Controllers/Admin/SiteSettingsController.php:27
* @route '/admin/settings/general'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/settings/general',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::store
* @see app/Http/Controllers/Admin/SiteSettingsController.php:27
* @route '/admin/settings/general'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::store
* @see app/Http/Controllers/Admin/SiteSettingsController.php:27
* @route '/admin/settings/general'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::store
* @see app/Http/Controllers/Admin/SiteSettingsController.php:27
* @route '/admin/settings/general'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::store
* @see app/Http/Controllers/Admin/SiteSettingsController.php:27
* @route '/admin/settings/general'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:46
* @route '/admin/settings/general/{key}'
*/
export const update = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/settings/general/{key}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:46
* @route '/admin/settings/general/{key}'
*/
update.url = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{key}', parsedArgs.key.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:46
* @route '/admin/settings/general/{key}'
*/
update.put = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:46
* @route '/admin/settings/general/{key}'
*/
const updateForm = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:46
* @route '/admin/settings/general/{key}'
*/
updateForm.put = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::destroy
* @see app/Http/Controllers/Admin/SiteSettingsController.php:82
* @route '/admin/settings/general/{key}'
*/
export const destroy = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/settings/general/{key}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::destroy
* @see app/Http/Controllers/Admin/SiteSettingsController.php:82
* @route '/admin/settings/general/{key}'
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
* @see \App\Http\Controllers\Admin\SiteSettingsController::destroy
* @see app/Http/Controllers/Admin/SiteSettingsController.php:82
* @route '/admin/settings/general/{key}'
*/
destroy.delete = (args: { key: string | number } | [key: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::destroy
* @see app/Http/Controllers/Admin/SiteSettingsController.php:82
* @route '/admin/settings/general/{key}'
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
* @see \App\Http\Controllers\Admin\SiteSettingsController::destroy
* @see app/Http/Controllers/Admin/SiteSettingsController.php:82
* @route '/admin/settings/general/{key}'
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

const general = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default general