import Settings from './Settings'
import Admin from './Admin'
import RoomController from './RoomController'
import RoomScheduleController from './RoomScheduleController'
import BookingController from './BookingController'
const Controllers = {
    Settings: Object.assign(Settings, Settings),
Admin: Object.assign(Admin, Admin),
RoomController: Object.assign(RoomController, RoomController),
RoomScheduleController: Object.assign(RoomScheduleController, RoomScheduleController),
BookingController: Object.assign(BookingController, BookingController),
}

export default Controllers