import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateRoleValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    code: schema.string.optional({}, [
			rules.maxLength(4)
		]),
    name: schema.string.optional({}, [
			rules.maxLength(50)
		]),
  })
}
