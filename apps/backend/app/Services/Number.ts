import { DocumentType } from '@repo/common'
import { Format } from '@repo/common'
import Client from 'App/Models/Client'
import Document from 'App/Models/Document'
import Organization from 'App/Models/Organization'

export default class Numberervice {
  public static async document(organizationId: number, type: DocumentType) {
    const count = await Document.query()
      .where({
        organizationId: organizationId,
        type: type,
      })
      .withTrashed()
      .getCount()

    const organization = await Organization.findOrFail(organizationId)

    let documentNumber: any
    switch (type) {
      case DocumentType.Invoice:
        documentNumber = organization.settings.invoices.number
        break
      case DocumentType.Offer:
        documentNumber = organization.settings.offers.number
        break
      case DocumentType.Reminder:
        documentNumber = organization.settings.reminders.number
        break
      default:
        throw new Error('Type must be invoice, offer or reminder')
    }

    return Format.number(documentNumber, Number(count))
  }

  public static async client(organizationId: number) {
    const organization = await Organization.findOrFail(organizationId)

    const count = await Client.query()
      .where({
        organizationId: organization.id,
      })
      .withTrashed()
      .getCount()

    return Format.number(organization.settings.clients.number, Number(count))
  }
}
