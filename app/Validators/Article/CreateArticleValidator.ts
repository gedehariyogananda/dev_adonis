import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account'
import Category from 'App/Models/Category/Category'

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

    // request array of object
    categories: schema.array().members(
      schema.object().members({
        id: schema.string({}, [
          rules.exists({ table: Category.table, column: Category.primaryKey })
        ])
      })
    )
  })
}

