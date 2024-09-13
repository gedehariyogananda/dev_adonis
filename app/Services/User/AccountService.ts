import BaseService from "App/Base/Services/BaseService"
import AccountRepository from "App/Repositories/User/AccountRepository"
import Hash from '@ioc:Adonis/Core/Hash'

export default class AccountService extends BaseService {
  constructor() {
    super(new AccountRepository())
  }

  async store(data: any) {
    try {
      if (data.pwd) {
        data.pwd = await Hash.make(data.pwd)
      }
      return await this.repository.store(data)
    } catch (error) {
      throw error
    }
  }

  async update(id: any, data: any) {
    try {
      if (data.pwd) {
        data.pwd = await Hash.make(data.pwd)
      }
      return await this.repository.update(id, data)
    } catch (error) {
      throw error
    }
  }
  
  async findByEmail (email: string) {
    try {
      const akun = await this.repository.findByEmail(email)
      return akun
    } catch (error) {
      throw error
    }
  }
}
    