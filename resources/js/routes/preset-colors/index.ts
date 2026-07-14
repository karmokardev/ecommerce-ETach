import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PresetColorController::store
* @see app/Http/Controllers/Admin/PresetColorController.php:11
* @route '/preset-colors'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/preset-colors',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PresetColorController::store
* @see app/Http/Controllers/Admin/PresetColorController.php:11
* @route '/preset-colors'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresetColorController::store
* @see app/Http/Controllers/Admin/PresetColorController.php:11
* @route '/preset-colors'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PresetColorController::store
* @see app/Http/Controllers/Admin/PresetColorController.php:11
* @route '/preset-colors'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PresetColorController::store
* @see app/Http/Controllers/Admin/PresetColorController.php:11
* @route '/preset-colors'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\PresetColorController::destroy
* @see app/Http/Controllers/Admin/PresetColorController.php:29
* @route '/preset-colors/{presetColor}'
*/
export const destroy = (args: { presetColor: number | { id: number } } | [presetColor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/preset-colors/{presetColor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PresetColorController::destroy
* @see app/Http/Controllers/Admin/PresetColorController.php:29
* @route '/preset-colors/{presetColor}'
*/
destroy.url = (args: { presetColor: number | { id: number } } | [presetColor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { presetColor: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { presetColor: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            presetColor: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        presetColor: typeof args.presetColor === 'object'
        ? args.presetColor.id
        : args.presetColor,
    }

    return destroy.definition.url
            .replace('{presetColor}', parsedArgs.presetColor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresetColorController::destroy
* @see app/Http/Controllers/Admin/PresetColorController.php:29
* @route '/preset-colors/{presetColor}'
*/
destroy.delete = (args: { presetColor: number | { id: number } } | [presetColor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\PresetColorController::destroy
* @see app/Http/Controllers/Admin/PresetColorController.php:29
* @route '/preset-colors/{presetColor}'
*/
const destroyForm = (args: { presetColor: number | { id: number } } | [presetColor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PresetColorController::destroy
* @see app/Http/Controllers/Admin/PresetColorController.php:29
* @route '/preset-colors/{presetColor}'
*/
destroyForm.delete = (args: { presetColor: number | { id: number } } | [presetColor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const presetColors = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default presetColors