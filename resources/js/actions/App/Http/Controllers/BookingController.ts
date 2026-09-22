import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BookingController::index
 * @see app/Http/Controllers/BookingController.php:21
 * @route '/rooms/{room}/bookings'
 */
export const index = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/rooms/{room}/bookings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::index
 * @see app/Http/Controllers/BookingController.php:21
 * @route '/rooms/{room}/bookings'
 */
index.url = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::index
 * @see app/Http/Controllers/BookingController.php:21
 * @route '/rooms/{room}/bookings'
 */
index.get = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::index
 * @see app/Http/Controllers/BookingController.php:21
 * @route '/rooms/{room}/bookings'
 */
index.head = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BookingController::index
 * @see app/Http/Controllers/BookingController.php:21
 * @route '/rooms/{room}/bookings'
 */
    const indexForm = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BookingController::index
 * @see app/Http/Controllers/BookingController.php:21
 * @route '/rooms/{room}/bookings'
 */
        indexForm.get = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BookingController::index
 * @see app/Http/Controllers/BookingController.php:21
 * @route '/rooms/{room}/bookings'
 */
        indexForm.head = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\BookingController::create
 * @see app/Http/Controllers/BookingController.php:52
 * @route '/rooms/{room}/bookings/create'
 */
export const create = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/rooms/{room}/bookings/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::create
 * @see app/Http/Controllers/BookingController.php:52
 * @route '/rooms/{room}/bookings/create'
 */
create.url = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::create
 * @see app/Http/Controllers/BookingController.php:52
 * @route '/rooms/{room}/bookings/create'
 */
create.get = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::create
 * @see app/Http/Controllers/BookingController.php:52
 * @route '/rooms/{room}/bookings/create'
 */
create.head = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BookingController::create
 * @see app/Http/Controllers/BookingController.php:52
 * @route '/rooms/{room}/bookings/create'
 */
    const createForm = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BookingController::create
 * @see app/Http/Controllers/BookingController.php:52
 * @route '/rooms/{room}/bookings/create'
 */
        createForm.get = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BookingController::create
 * @see app/Http/Controllers/BookingController.php:52
 * @route '/rooms/{room}/bookings/create'
 */
        createForm.head = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\BookingController::store
 * @see app/Http/Controllers/BookingController.php:80
 * @route '/rooms/{room}/bookings'
 */
export const store = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/rooms/{room}/bookings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BookingController::store
 * @see app/Http/Controllers/BookingController.php:80
 * @route '/rooms/{room}/bookings'
 */
store.url = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::store
 * @see app/Http/Controllers/BookingController.php:80
 * @route '/rooms/{room}/bookings'
 */
store.post = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BookingController::store
 * @see app/Http/Controllers/BookingController.php:80
 * @route '/rooms/{room}/bookings'
 */
    const storeForm = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BookingController::store
 * @see app/Http/Controllers/BookingController.php:80
 * @route '/rooms/{room}/bookings'
 */
        storeForm.post = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BookingController::cancel
 * @see app/Http/Controllers/BookingController.php:117
 * @route '/rooms/{room}/bookings/{booking}/cancel'
 */
export const cancel = (args: { room: string | number, booking: string | number } | [room: string | number, booking: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/rooms/{room}/bookings/{booking}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\BookingController::cancel
 * @see app/Http/Controllers/BookingController.php:117
 * @route '/rooms/{room}/bookings/{booking}/cancel'
 */
cancel.url = (args: { room: string | number, booking: string | number } | [room: string | number, booking: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                    booking: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: args.room,
                                booking: args.booking,
                }

    return cancel.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace('{booking}', parsedArgs.booking.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::cancel
 * @see app/Http/Controllers/BookingController.php:117
 * @route '/rooms/{room}/bookings/{booking}/cancel'
 */
cancel.patch = (args: { room: string | number, booking: string | number } | [room: string | number, booking: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\BookingController::cancel
 * @see app/Http/Controllers/BookingController.php:117
 * @route '/rooms/{room}/bookings/{booking}/cancel'
 */
    const cancelForm = (args: { room: string | number, booking: string | number } | [room: string | number, booking: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BookingController::cancel
 * @see app/Http/Controllers/BookingController.php:117
 * @route '/rooms/{room}/bookings/{booking}/cancel'
 */
        cancelForm.patch = (args: { room: string | number, booking: string | number } | [room: string | number, booking: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancel.form = cancelForm
const BookingController = { index, create, store, cancel }

export default BookingController