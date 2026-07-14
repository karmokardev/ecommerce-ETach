import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::index
* @see app/Http/Controllers/Admin/SiteSettingsController.php:15
* @route '/admin/settings/general'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/settings/general',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::index
* @see app/Http/Controllers/Admin/SiteSettingsController.php:15
* @route '/admin/settings/general'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::index
* @see app/Http/Controllers/Admin/SiteSettingsController.php:15
* @route '/admin/settings/general'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::index
* @see app/Http/Controllers/Admin/SiteSettingsController.php:15
* @route '/admin/settings/general'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::index
* @see app/Http/Controllers/Admin/SiteSettingsController.php:15
* @route '/admin/settings/general'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::index
* @see app/Http/Controllers/Admin/SiteSettingsController.php:15
* @route '/admin/settings/general'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::index
* @see app/Http/Controllers/Admin/SiteSettingsController.php:15
* @route '/admin/settings/general'
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

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::typography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:118
* @route '/admin/settings/typography'
*/
export const typography = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: typography.url(options),
    method: 'get',
})

typography.definition = {
    methods: ["get","head"],
    url: '/admin/settings/typography',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::typography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:118
* @route '/admin/settings/typography'
*/
typography.url = (options?: RouteQueryOptions) => {
    return typography.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::typography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:118
* @route '/admin/settings/typography'
*/
typography.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: typography.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::typography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:118
* @route '/admin/settings/typography'
*/
typography.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: typography.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::typography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:118
* @route '/admin/settings/typography'
*/
const typographyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: typography.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::typography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:118
* @route '/admin/settings/typography'
*/
typographyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: typography.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::typography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:118
* @route '/admin/settings/typography'
*/
typographyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: typography.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

typography.form = typographyForm

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateTypography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
export const updateTypography = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypography.url(options),
    method: 'post',
})

updateTypography.definition = {
    methods: ["post"],
    url: '/admin/settings/typography',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateTypography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
updateTypography.url = (options?: RouteQueryOptions) => {
    return updateTypography.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateTypography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
updateTypography.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypography.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateTypography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
const updateTypographyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTypography.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateTypography
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
updateTypographyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTypography.url(options),
    method: 'post',
})

updateTypography.form = updateTypographyForm

const SiteSettingsController = { index, store, update, destroy, typography, updateTypography }

export default SiteSettingsController