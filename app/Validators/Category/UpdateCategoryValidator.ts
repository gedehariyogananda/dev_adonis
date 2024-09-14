import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateCategoryValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    // your validation rules
  })
}
