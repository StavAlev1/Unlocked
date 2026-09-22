import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RoomScheduleController::edit
 * @see app/Http/Controllers/RoomScheduleController.php:17
 * @route '/rooms/{room}/schedule/edit'
 */
export const edit = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/rooms/{room}/schedule/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoomScheduleController::edit
 * @see app/Http/Controllers/RoomScheduleController.php:17
 * @route '/rooms/{room}/schedule/edit'
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
* @see \App\Http\Controllers\RoomScheduleController::edit
 * @see app/Http/Controllers/RoomScheduleController.php:17
 * @route '/rooms/{room}/schedule/edit'
 */
edit.get = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoomScheduleController::edit
 * @see app/Http/Controllers/RoomScheduleController.php:17
 * @route '/rooms/{room}/schedule/edit'
 */
edit.head = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoomScheduleController::edit
 * @see app/Http/Controllers/RoomScheduleController.php:17
 * @route '/rooms/{room}/schedule/edit'
 */
    const editForm = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoomScheduleController::edit
 * @see app/Http/Controllers/RoomScheduleController.php:17
 * @route '/rooms/{room}/schedule/edit'
 */
        editForm.get = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoomScheduleController::edit
 * @see app/Http/Controllers/RoomScheduleController.php:17
 * @route '/rooms/{room}/schedule/edit'
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
* @see \App\Http\Controllers\RoomScheduleController::update
 * @see app/Http/Controllers/RoomScheduleController.php:48
 * @route '/rooms/{room}/schedule'
 */
export const update = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/rooms/{room}/schedule',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\RoomScheduleController::update
 * @see app/Http/Controllers/RoomScheduleController.php:48
 * @route '/rooms/{room}/schedule'
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
* @see \App\Http\Controllers\RoomScheduleController::update
 * @see app/Http/Controllers/RoomScheduleController.php:48
 * @route '/rooms/{room}/schedule'
 */
update.put = (args: { room: string | number } | [room: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\RoomScheduleController::update
 * @see app/Http/Controllers/RoomScheduleController.php:48
 * @route '/rooms/{room}/schedule'
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
* @see \App\Http\Controllers\RoomScheduleController::update
 * @see app/Http/Controllers/RoomScheduleController.php:48
 * @route '/rooms/{room}/schedule'
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
    
    update.form = updateForm
const RoomScheduleController = { edit, update }

export default RoomScheduleController