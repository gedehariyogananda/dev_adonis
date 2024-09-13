import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/User/Role'
import Account from 'App/Models/User/Account'

export default class UpdateAccountValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    urole_id: schema.string.optional({}, [
      rules.exists({table: Role.table, column: Role.primaryKey})
    ]),
    username: schema.string.optional({}, [
      rules.maxLength(100),
      rules.unique({table: Account.table, column: 'username', where: {deleted_at: null}, whereNot: {id: this.ctx.params.id}})
    ]),
    pwd: schema.string.optional({}, [
      rules.minLength(6)
    ]),
    email: schema.string.optional({}, [
      rules.maxLength(255),
      rules.email(),
      rules.unique({column: 'email', table: Account.table, where: {deleted_at: null}, whereNot: {id: this.ctx.params.id}})
    ]),
    google_id: schema.string.optional({}, [
      rules.maxLength(255)
    ]),
    fullname: schema.string.optional({}, [
      rules.maxLength(100)
    ]),
    avatar: schema.string.optional(),
    is_ban: schema.boolean.optional(),
  })
}
