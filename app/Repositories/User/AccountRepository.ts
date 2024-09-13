import BaseRepository from "App/Base/Repositories/BaseRepository";
import Account from "App/Models/User/Account";

export default class AccountRepository extends BaseRepository {
  constructor() {
    super(Account)
  }

  async findByEmail(email: string) {
    try {
      return await this.model.query().where('email', email).first()
    } catch (error) {
      throw error
    }
  }
}
    