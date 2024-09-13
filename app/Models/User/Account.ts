import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'

export default class Account extends BaseModel {
  public static softDelete = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public urole_id: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public pwd: string

  @column()
  public email: string

  @column()
  public google_id: string

  @column()
  public fullname: string

  @column()
  public avatar: string

  @column()
  public is_ban: boolean

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime()
  public deleted_at: DateTime

  static get table() {
    return "user.account"
  }

  @beforeFind()
  public static findWithoutSoftDeletes(query: any) {
    query.whereNull("deleted_at")
  }

  @beforeFetch()
  public static fetchWithoutSoftDeletes(query) {
    query.whereNull("deleted_at")
  }

  @belongsTo(() => Role, {
    foreignKey: 'urole_id'
  })
  public role: BelongsTo<typeof Role>
}
