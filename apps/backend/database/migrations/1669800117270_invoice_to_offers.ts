import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'invoice_to_offers'

  public async up() {
    this.schema.alterTable('documents', (table) => {
      table
        .integer('offer_id')
        .unsigned()
        .references('id')
        .inTable('documents')
        .onDelete('SET NULL')

      table.index('offer_id')
      table.dropForeign('client_id')
      table
        .integer('client_id')
        .alter()
        .unsigned()
        .references('id')
        .inTable('clients')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  public async down() {
    this.schema.alterTable('documents', (table) => {
      table.dropIndex('offer_id')
      table.dropColumn('offer_id')
    })
  }
}
