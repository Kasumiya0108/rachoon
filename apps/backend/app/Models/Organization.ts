import { compose } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Document from './Document'
import Client from './Client'
import User from './User'
import HashIDs from 'App/Helpers/hashids'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class Organization extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true, serialize: (val) => HashIDs.encode(val) })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public data: any

  @column()
  public settings: any

  @hasMany(() => Document)
  public documents: HasMany<typeof Document>
  @hasMany(() => Client)
  public clients: HasMany<typeof Client>

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
