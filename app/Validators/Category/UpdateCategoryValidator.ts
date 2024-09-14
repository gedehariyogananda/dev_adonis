import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateCategoryValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [
      rules.maxLength(255)
    ]),
    description: schema.string.optional({ trim: true }, [
      rules.maxLength(255)
    ]),
  })
}
