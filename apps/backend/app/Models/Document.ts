import { DateTime } from 'luxon'
import { Document as CommonDocument } from '@repo/common/Document'
import {
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Organization from './Organization'
import HashIDs from 'App/Helpers/hashids'
import Template from './Template'
import BaseAppModel from './BaseAppModel'

export default class Document extends BaseAppModel {
  @beforeSave()
  public static async calculate(document: Document) {
    const io = new CommonDocument(document.serialize())
    io.calculate()
    document.data = io.data
  }
  @column({ isPrimary: true, serialize: (val) => HashIDs.encode(val) })
  public id: number

  @column()
  public number: string

  @column()
  public status: string

  @column()
  public type: string

  @column()
  public data: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({ serialize: (val) => HashIDs.encode(val) })
  public clientId: number

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>

  @column({ serialize: (val) => HashIDs.encode(val) })
  public organizationId: number

  @column({ serialize: (val) => HashIDs.encode(val) })
  public templateId: number

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @hasOne(() => Template)
  public template: HasOne<typeof Template>

  @column()
  public offerId: number

  @belongsTo(() => Document, { foreignKey: 'offerId' })
  public offer: BelongsTo<typeof Document>

  @hasMany(() => Document, { foreignKey: 'offerId' })
  public invoices: HasMany<typeof Document>
}
