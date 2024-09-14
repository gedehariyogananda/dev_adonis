import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import Account from '../User/Account'
import Article from '../Article/Article'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @column()
  public article_id: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  static get table() {
    return "content.comment" // table name
  }

  @beforeCreate()
  public static setUUID(data: Comment) {
    const namespace = uuidv4()
    data.id = uuidv5('Comment', namespace)
  }

  @belongsTo(() => Account, {
    foreignKey: 'user_id'
  })

  public user: BelongsTo<typeof Account>

  @belongsTo(() => Article, {
    foreignKey: 'article_id'
  })

  public article: BelongsTo<typeof Article>

}
