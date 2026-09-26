import DashboardController from './DashboardController'
import Settings from './Settings'
import Admin from './Admin'
import RoomController from './RoomController'
import RoomScheduleController from './RoomScheduleController'
import BookingController from './BookingController'
import PublicRoomController from './PublicRoomController'
import PublicBookingController from './PublicBookingController'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
Settings: Object.assign(Settings, Settings),
Admin: Object.assign(Admin, Admin),
RoomController: Object.assign(RoomController, RoomController),
RoomScheduleController: Object.assign(RoomScheduleController, RoomScheduleController),
BookingController: Object.assign(BookingController, BookingController),
PublicRoomController: Object.assign(PublicRoomController, PublicRoomController),
PublicBookingController: Object.assign(PublicBookingController, PublicBookingController),
}

export default Controllers