import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import Article from '../Article/Article'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  static get table() {
    return "content.category" // table name
  }

  @beforeCreate()
  public static setUUID(data: Category) {
    const namespace = uuidv4()
    data.id = uuidv5('Category', namespace)
  }
}
