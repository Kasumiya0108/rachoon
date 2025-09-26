import Format from '@repo/common/Format'
import InvoiceOrOffer from 'App/Models/InvoiceOrOffer'
import User from 'App/Models/User'

export default class InvoiceOrOfferService {
  public static async nextNumber(user: User, type: string) {
    const count = await InvoiceOrOffer.query()
      .where({
        organizationId: user?.organizationId,
        type: type.toLowerCase(),
      })
      .withTrashed()
      .getCount()

    const io =
      type === 'invoice'
        ? user.organization.settings.invoices.number
        : user.organization.settings.offers.number

    return Format.invoiceOrOfferNumber(io, Number(count))
  }
}
