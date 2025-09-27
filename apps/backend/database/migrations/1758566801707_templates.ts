import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'templates'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('title', 100)
      table.boolean('default').defaultTo(false)
      table.boolean('premium').defaultTo(false)
      table.jsonb('data').defaultTo('{}')
      table.text('html')
      table.text('thumbnail')
      table
        .integer('organization_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')

      table.index('organization_id')
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(DateTime.now().toSQL())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(DateTime.now().toSQL())
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
    this.schema.alterTable('documents', (table) => {
      table
        .integer('template_id')
        .unsigned()
        .references('id')
        .inTable('templates')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  public async down() {
    this.schema.alterTable('documents', (table) => {
      table.dropColumn('template_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
