import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import Account from '../User/Account'
import Category from '../Category/Category'
import Comment from '../Comment/Comment'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public user_id: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  static get table() {
    return "content.article" 
  }

  @beforeCreate()
  public static setUUID(data: Article) {
    const namespace = uuidv4()
    data.id = uuidv5('Article', namespace)
  }

  @belongsTo(() => Account, {
    foreignKey: 'user_id'
  })

  public user: BelongsTo<typeof Account>

  // many to many setup 
  @manyToMany(() => Category, {
    pivotTable: 'content.article_categories',
    pivotForeignKey: 'article_id',
    pivotRelatedForeignKey: 'category_id'
  })

  public categories: ManyToMany<typeof Category>
  // end setup

  @hasMany(() => Comment, {
    foreignKey: 'article_id'
  })

  public comments: HasMany<typeof Comment>

  
}
