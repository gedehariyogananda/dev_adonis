import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateArticleValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    title: schema.string.optional({ trim: true }, [
      rules.maxLength(255)
    ]),
    content: schema.string.optional({ trim: true }),
    categories: schema.array.optional().members(
      schema.object().members({
        id: schema.string({}, [
          rules.exists({ table: 'categories', column: 'id' })
        ])
      })
    )
  })
}