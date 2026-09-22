import Settings from './Settings'
import Admin from './Admin'
import RoomController from './RoomController'
const Controllers = {
    Settings: Object.assign(Settings, Settings),
Admin: Object.assign(Admin, Admin),
RoomController: Object.assign(RoomController, RoomController),
}

export default Controllers