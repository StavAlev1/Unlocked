import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicBookingController::store
 * @see app/Http/Controllers/PublicBookingController.php:18
 * @route '/escape-rooms/{room}/bookings'
 */
export const store = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/escape-rooms/{room}/bookings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicBookingController::store
 * @see app/Http/Controllers/PublicBookingController.php:18
 * @route '/escape-rooms/{room}/bookings'
 */
store.url = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { room: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.uuid
                : args.room,
                }

    return store.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicBookingController::store
 * @see app/Http/Controllers/PublicBookingController.php:18
 * @route '/escape-rooms/{room}/bookings'
 */
store.post = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PublicBookingController::store
 * @see app/Http/Controllers/PublicBookingController.php:18
 * @route '/escape-rooms/{room}/bookings'
 */
    const storeForm = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PublicBookingController::store
 * @see app/Http/Controllers/PublicBookingController.php:18
 * @route '/escape-rooms/{room}/bookings'
 */
        storeForm.post = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PublicBookingController::show
 * @see app/Http/Controllers/PublicBookingController.php:34
 * @route '/booking/{booking}'
 */
export const show = (args: { booking: string | { uuid: string } } | [booking: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/booking/{booking}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicBookingController::show
 * @see app/Http/Controllers/PublicBookingController.php:34
 * @route '/booking/{booking}'
 */
show.url = (args: { booking: string | { uuid: string } } | [booking: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { booking: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { booking: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    booking: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        booking: typeof args.booking === 'object'
                ? args.booking.uuid
                : args.booking,
                }

    return show.definition.url
            .replace('{booking}', parsedArgs.booking.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicBookingController::show
 * @see app/Http/Controllers/PublicBookingController.php:34
 * @route '/booking/{booking}'
 */
show.get = (args: { booking: string | { uuid: string } } | [booking: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicBookingController::show
 * @see app/Http/Controllers/PublicBookingController.php:34
 * @route '/booking/{booking}'
 */
show.head = (args: { booking: string | { uuid: string } } | [booking: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicBookingController::show
 * @see app/Http/Controllers/PublicBookingController.php:34
 * @route '/booking/{booking}'
 */
    const showForm = (args: { booking: string | { uuid: string } } | [booking: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicBookingController::show
 * @see app/Http/Controllers/PublicBookingController.php:34
 * @route '/booking/{booking}'
 */
        showForm.get = (args: { booking: string | { uuid: string } } | [booking: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicBookingController::show
 * @see app/Http/Controllers/PublicBookingController.php:34
 * @route '/booking/{booking}'
 */
        showForm.head = (args: { booking: string | { uuid: string } } | [booking: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const PublicBookingController = { store, show }

export default PublicBookingController