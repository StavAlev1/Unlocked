import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicRoomController::index
 * @see app/Http/Controllers/PublicRoomController.php:17
 * @route '/escape-rooms'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/escape-rooms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicRoomController::index
 * @see app/Http/Controllers/PublicRoomController.php:17
 * @route '/escape-rooms'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicRoomController::index
 * @see app/Http/Controllers/PublicRoomController.php:17
 * @route '/escape-rooms'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicRoomController::index
 * @see app/Http/Controllers/PublicRoomController.php:17
 * @route '/escape-rooms'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicRoomController::index
 * @see app/Http/Controllers/PublicRoomController.php:17
 * @route '/escape-rooms'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicRoomController::index
 * @see app/Http/Controllers/PublicRoomController.php:17
 * @route '/escape-rooms'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicRoomController::index
 * @see app/Http/Controllers/PublicRoomController.php:17
 * @route '/escape-rooms'
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
* @see \App\Http\Controllers\PublicRoomController::show
 * @see app/Http/Controllers/PublicRoomController.php:33
 * @route '/escape-rooms/{room}'
 */
export const show = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/escape-rooms/{room}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicRoomController::show
 * @see app/Http/Controllers/PublicRoomController.php:33
 * @route '/escape-rooms/{room}'
 */
show.url = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicRoomController::show
 * @see app/Http/Controllers/PublicRoomController.php:33
 * @route '/escape-rooms/{room}'
 */
show.get = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicRoomController::show
 * @see app/Http/Controllers/PublicRoomController.php:33
 * @route '/escape-rooms/{room}'
 */
show.head = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicRoomController::show
 * @see app/Http/Controllers/PublicRoomController.php:33
 * @route '/escape-rooms/{room}'
 */
    const showForm = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicRoomController::show
 * @see app/Http/Controllers/PublicRoomController.php:33
 * @route '/escape-rooms/{room}'
 */
        showForm.get = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicRoomController::show
 * @see app/Http/Controllers/PublicRoomController.php:33
 * @route '/escape-rooms/{room}'
 */
        showForm.head = (args: { room: string | { uuid: string } } | [room: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const rooms = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default rooms