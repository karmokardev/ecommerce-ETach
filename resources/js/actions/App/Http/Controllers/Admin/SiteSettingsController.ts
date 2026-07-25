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

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::footer
* @see app/Http/Controllers/Admin/SiteSettingsController.php:185
* @route '/admin/settings/footer'
*/
export const footer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: footer.url(options),
    method: 'get',
})

footer.definition = {
    methods: ["get","head"],
    url: '/admin/settings/footer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::footer
* @see app/Http/Controllers/Admin/SiteSettingsController.php:185
* @route '/admin/settings/footer'
*/
footer.url = (options?: RouteQueryOptions) => {
    return footer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::footer
* @see app/Http/Controllers/Admin/SiteSettingsController.php:185
* @route '/admin/settings/footer'
*/
footer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: footer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::footer
* @see app/Http/Controllers/Admin/SiteSettingsController.php:185
* @route '/admin/settings/footer'
*/
footer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: footer.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::footer
* @see app/Http/Controllers/Admin/SiteSettingsController.php:185
* @route '/admin/settings/footer'
*/
const footerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: footer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::footer
* @see app/Http/Controllers/Admin/SiteSettingsController.php:185
* @route '/admin/settings/footer'
*/
footerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: footer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::footer
* @see app/Http/Controllers/Admin/SiteSettingsController.php:185
* @route '/admin/settings/footer'
*/
footerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: footer.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

footer.form = footerForm

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateFooter
* @see app/Http/Controllers/Admin/SiteSettingsController.php:212
* @route '/admin/settings/footer'
*/
export const updateFooter = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFooter.url(options),
    method: 'put',
})

updateFooter.definition = {
    methods: ["put"],
    url: '/admin/settings/footer',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateFooter
* @see app/Http/Controllers/Admin/SiteSettingsController.php:212
* @route '/admin/settings/footer'
*/
updateFooter.url = (options?: RouteQueryOptions) => {
    return updateFooter.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateFooter
* @see app/Http/Controllers/Admin/SiteSettingsController.php:212
* @route '/admin/settings/footer'
*/
updateFooter.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFooter.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateFooter
* @see app/Http/Controllers/Admin/SiteSettingsController.php:212
* @route '/admin/settings/footer'
*/
const updateFooterForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateFooter.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateFooter
* @see app/Http/Controllers/Admin/SiteSettingsController.php:212
* @route '/admin/settings/footer'
*/
updateFooterForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateFooter.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateFooter.form = updateFooterForm

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::hero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:299
* @route '/admin/settings/hero'
*/
export const hero = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hero.url(options),
    method: 'get',
})

hero.definition = {
    methods: ["get","head"],
    url: '/admin/settings/hero',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::hero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:299
* @route '/admin/settings/hero'
*/
hero.url = (options?: RouteQueryOptions) => {
    return hero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::hero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:299
* @route '/admin/settings/hero'
*/
hero.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hero.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::hero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:299
* @route '/admin/settings/hero'
*/
hero.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hero.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::hero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:299
* @route '/admin/settings/hero'
*/
const heroForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hero.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::hero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:299
* @route '/admin/settings/hero'
*/
heroForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hero.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::hero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:299
* @route '/admin/settings/hero'
*/
heroForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hero.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

hero.form = heroForm

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateHero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:318
* @route '/admin/settings/hero'
*/
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/admin/settings/hero',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateHero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:318
* @route '/admin/settings/hero'
*/
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateHero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:318
* @route '/admin/settings/hero'
*/
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateHero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:318
* @route '/admin/settings/hero'
*/
const updateHeroForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::updateHero
* @see app/Http/Controllers/Admin/SiteSettingsController.php:318
* @route '/admin/settings/hero'
*/
updateHeroForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateHero.url(options),
    method: 'post',
})

updateHero.form = updateHeroForm

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::uploadHeroImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:354
* @route '/admin/settings/hero/upload-image'
*/
export const uploadHeroImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadHeroImage.url(options),
    method: 'post',
})

uploadHeroImage.definition = {
    methods: ["post"],
    url: '/admin/settings/hero/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::uploadHeroImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:354
* @route '/admin/settings/hero/upload-image'
*/
uploadHeroImage.url = (options?: RouteQueryOptions) => {
    return uploadHeroImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::uploadHeroImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:354
* @route '/admin/settings/hero/upload-image'
*/
uploadHeroImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadHeroImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::uploadHeroImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:354
* @route '/admin/settings/hero/upload-image'
*/
const uploadHeroImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadHeroImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::uploadHeroImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:354
* @route '/admin/settings/hero/upload-image'
*/
uploadHeroImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadHeroImage.url(options),
    method: 'post',
})

uploadHeroImage.form = uploadHeroImageForm

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::deleteHeroBannerImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:371
* @route '/admin/settings/hero/banner-image'
*/
export const deleteHeroBannerImage = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteHeroBannerImage.url(options),
    method: 'delete',
})

deleteHeroBannerImage.definition = {
    methods: ["delete"],
    url: '/admin/settings/hero/banner-image',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::deleteHeroBannerImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:371
* @route '/admin/settings/hero/banner-image'
*/
deleteHeroBannerImage.url = (options?: RouteQueryOptions) => {
    return deleteHeroBannerImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::deleteHeroBannerImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:371
* @route '/admin/settings/hero/banner-image'
*/
deleteHeroBannerImage.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteHeroBannerImage.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::deleteHeroBannerImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:371
* @route '/admin/settings/hero/banner-image'
*/
const deleteHeroBannerImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteHeroBannerImage.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SiteSettingsController::deleteHeroBannerImage
* @see app/Http/Controllers/Admin/SiteSettingsController.php:371
* @route '/admin/settings/hero/banner-image'
*/
deleteHeroBannerImageForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteHeroBannerImage.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteHeroBannerImage.form = deleteHeroBannerImageForm

const SiteSettingsController = { index, store, update, destroy, typography, updateTypography, footer, updateFooter, hero, updateHero, uploadHeroImage, deleteHeroBannerImage }

export default SiteSettingsController