import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/settings/typography',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::update
* @see app/Http/Controllers/Admin/SiteSettingsController.php:150
* @route '/admin/settings/typography'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

const typography = {
    update: Object.assign(update, update),
}

export default typography