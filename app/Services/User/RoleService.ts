import BaseService from "App/Base/Services/BaseService"
import RoleRepository from "App/Repositories/User/RoleRepository"

export default class RoleService extends BaseService {
  constructor() {
    super(new RoleRepository())
  }
}
    