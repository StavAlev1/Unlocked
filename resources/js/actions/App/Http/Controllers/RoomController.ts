import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RoomController::index
 * @see app/Http/Controllers/RoomController.php:20
 * @route '/rooms'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/rooms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoomController::index
 * @see app/Http/Controllers/RoomController.php:20
 * @route '/rooms'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoomController::index
 * @see app/Http/Controllers/RoomController.php:20
 * @route '/rooms'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoomController::index
 * @see app/Http/Controllers/RoomController.php:20
 * @route '/rooms'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoomController::index
 * @see app/Http/Controllers/RoomController.php:20
 * @route '/rooms'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoomController::index
 * @see app/Http/Controllers/RoomController.php:20
 * @route '/rooms'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoomController::index
 * @see app/Http/Controllers/RoomController.php:20
 * @route '/rooms'
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
* @see \App\Http\Controllers\RoomController::create
 * @see app/Http/Controllers/RoomController.php:39
 * @route '/rooms/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/rooms/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoomController::create
 * @see app/Http/Controllers/RoomController.php:39
 * @route '/rooms/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoomController::create
 * @see app/Http/Controllers/RoomController.php:39
 * @route '/rooms/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoomController::create
 * @see app/Http/Controllers/RoomController.php:39
 * @route '/rooms/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoomController::create
 * @see app/Http/Controllers/RoomController.php:39
 * @route '/rooms/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoomController::create
 * @see app/Http/Controllers/RoomController.php:39
 * @route '/rooms/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoomController::create
 * @see app/Http/Controllers/RoomController.php:39
 * @route '/rooms/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\RoomController::store
 * @see app/Http/Controllers/RoomController.php:47
 * @route '/rooms'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/rooms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoomController::store
 * @see app/Http/Controllers/RoomController.php:47
 * @route '/rooms'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoomController::store
 * @see app/Http/Controllers/RoomController.php:47
 * @route '/rooms'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoomController::store
 * @see app/Http/Controllers/RoomController.php:47
 * @route '/rooms'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoomController::store
 * @see app/Http/Controllers/RoomController.php:47
 * @route '/rooms'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\RoomController::edit
 * @see app/Http/Controllers/RoomController.php:72
 * @route '/rooms/{room}/edit'
 */
export const edit = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/rooms/{room}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoomController::edit
 * @see app/Http/Controllers/RoomController.php:72
 * @route '/rooms/{room}/edit'
 */
edit.url = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: args.room,
                }

    return edit.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoomController::edit
 * @see app/Http/Controllers/RoomController.php:72
 * @route '/rooms/{room}/edit'
 */
edit.get = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoomController::edit
 * @see app/Http/Controllers/RoomController.php:72
 * @route '/rooms/{room}/edit'
 */
edit.head = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoomController::edit
 * @see app/Http/Controllers/RoomController.php:72
 * @route '/rooms/{room}/edit'
 */
    const editForm = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoomController::edit
 * @see app/Http/Controllers/RoomController.php:72
 * @route '/rooms/{room}/edit'
 */
        editForm.get = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoomController::edit
 * @see app/Http/Controllers/RoomController.php:72
 * @route '/rooms/{room}/edit'
 */
        editForm.head = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\RoomController::update
 * @see app/Http/Controllers/RoomController.php:97
 * @route '/rooms/{room}'
 */
export const update = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/rooms/{room}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\RoomController::update
 * @see app/Http/Controllers/RoomController.php:97
 * @route '/rooms/{room}'
 */
update.url = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: args.room,
                }

    return update.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoomController::update
 * @see app/Http/Controllers/RoomController.php:97
 * @route '/rooms/{room}'
 */
update.put = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\RoomController::update
 * @see app/Http/Controllers/RoomController.php:97
 * @route '/rooms/{room}'
 */
update.patch = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\RoomController::update
 * @see app/Http/Controllers/RoomController.php:97
 * @route '/rooms/{room}'
 */
    const updateForm = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoomController::update
 * @see app/Http/Controllers/RoomController.php:97
 * @route '/rooms/{room}'
 */
        updateForm.put = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\RoomController::update
 * @see app/Http/Controllers/RoomController.php:97
 * @route '/rooms/{room}'
 */
        updateForm.patch = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\RoomController::destroy
 * @see app/Http/Controllers/RoomController.php:135
 * @route '/rooms/{room}'
 */
export const destroy = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/rooms/{room}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RoomController::destroy
 * @see app/Http/Controllers/RoomController.php:135
 * @route '/rooms/{room}'
 */
destroy.url = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: args.room,
                }

    return destroy.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoomController::destroy
 * @see app/Http/Controllers/RoomController.php:135
 * @route '/rooms/{room}'
 */
destroy.delete = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\RoomController::destroy
 * @see app/Http/Controllers/RoomController.php:135
 * @route '/rooms/{room}'
 */
    const destroyForm = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoomController::destroy
 * @see app/Http/Controllers/RoomController.php:135
 * @route '/rooms/{room}'
 */
        destroyForm.delete = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const RoomController = { index, create, store, edit, update, destroy }

export default RoomController