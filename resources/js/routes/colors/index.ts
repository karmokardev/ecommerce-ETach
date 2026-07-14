import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ColorsController::update
* @see app/Http/Controllers/Admin/ColorsController.php:28
* @route '/colors'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/colors',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ColorsController::update
* @see app/Http/Controllers/Admin/ColorsController.php:28
* @route '/colors'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ColorsController::update
* @see app/Http/Controllers/Admin/ColorsController.php:28
* @route '/colors'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ColorsController::update
* @see app/Http/Controllers/Admin/ColorsController.php:28
* @route '/colors'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ColorsController::update
* @see app/Http/Controllers/Admin/ColorsController.php:28
* @route '/colors'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const colors = {
    update: Object.assign(update, update),
}

export default colors