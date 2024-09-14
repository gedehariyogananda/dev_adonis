import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateArticleValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(255)
    ]),
    content: schema.string({ trim: true }, [
      rules.required()
    ]),
  })
}
