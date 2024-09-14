import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Article from 'App/Models/Article/Article'
import Account from 'App/Models/Account'

export default class UpdateCommentValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    content: schema.string.optional({ trim: true }, [
      rules.maxLength(255)
    ]),
    article_id: schema.string.optional({}, [
      rules.exists({ table: Article.table, column: Article.primaryKey })
    ]),
  })
}