import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthException from 'App/Exceptions/AuthException'
import RoleService from 'App/Services/User/RoleService'

export default class Role {
  roleService = new RoleService()
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, allowedRoles: string[]) {
    if (allowedRoles.length == 0) {
      await next()
    } else {
      try {
        const roleId = (await auth.use('api').authenticate()).urole_id
        const role = await this.roleService.find(roleId)        
        if (allowedRoles.includes(role.code)) {
          await next()
        } else {
          throw new AuthException('Forbidden!', 403, 'E_UNAUTHORIZED_ACCESS')
        }
      } catch (e) {
        throw new AuthException('Forbidden!', 403, 'E_UNAUTHORIZED_ACCESS')
      }
    }
  }
}
