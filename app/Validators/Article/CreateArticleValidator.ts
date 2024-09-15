import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
    ),

    // request array schema file object
    article_img : schema.array.optional().members(
      schema.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      })
    )
  })
}

