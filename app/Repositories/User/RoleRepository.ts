import BaseRepository from "App/Base/Repositories/BaseRepository";
import Role from "App/Models/User/Role";

export default class RoleRepository extends BaseRepository {
  constructor() {
    super(Role)
  }
}
    