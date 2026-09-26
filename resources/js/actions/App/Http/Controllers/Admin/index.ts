import UserController from './UserController'
import UserApprovalController from './UserApprovalController'
const Admin = {
    UserController: Object.assign(UserController, UserController),
UserApprovalController: Object.assign(UserApprovalController, UserApprovalController),
}

export default Admin