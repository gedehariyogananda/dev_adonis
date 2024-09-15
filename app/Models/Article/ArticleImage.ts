import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import Article from './Article'

export default class ArticleImage extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public article_img: string

  @column()
  public article_id: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  static get table() {
    return "content.article_images" 
  }

  @beforeCreate()
  public static setUUID(data: ArticleImage) {
    const namespace = uuidv4()
    data.id = uuidv5('ArticleImage', namespace)
  }

  @belongsTo(() => Article, {
    foreignKey: 'article_id'
  })

  public article: BelongsTo<typeof Article>

}
