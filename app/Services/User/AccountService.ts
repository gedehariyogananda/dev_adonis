import BaseService from "App/Base/Services/BaseService"
import AccountRepository from "App/Repositories/User/AccountRepository"
import Hash from '@ioc:Adonis/Core/Hash'
import path from 'path';
import { generateHashNameFile } from "App/Utils/HashFileNameUtil"

export default class AccountService extends BaseService {
  constructor() {
    super(new AccountRepository())
  }

  async storeAccount(data: any, avatarImg: any) {
    try {
      if (data.pwd) {
        data.pwd = await Hash.make(data.pwd)
      }

      if (avatarImg) {
        const pathInit = 'avatars'
        const hashedFileName = generateHashNameFile(avatarImg.extname)

        await avatarImg.moveToDisk(pathInit, {
          name: hashedFileName,
          overwrite: true,
        }, 'local');

        data.avatar = path.join(pathInit, hashedFileName)
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
    