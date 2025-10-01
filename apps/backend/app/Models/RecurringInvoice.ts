import { DateTime } from 'luxon'
import { column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import HashIDs from '../Helpers/hashids'
import BaseAppModel from './BaseAppModel'
import Document from './Document'

export default class RecurringInvoice extends BaseAppModel {
  @column({ isPrimary: true, serialize: (val) => HashIDs.encode(val) })
  public id: number

  @column()
  public cron: string

  @column()
  public startDate: DateTime

  @column()
  public nextRun: DateTime

  @column()
  public active: boolean

  @column({ serialize: (val) => HashIDs.encode(val) })
  public organizationId: number

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @column({ serialize: (val) => HashIDs.encode(val) })
  public invoiceId: number

  @belongsTo(() => Document, { foreignKey: 'invoiceId' })
  public invoice: BelongsTo<typeof Document>
}
