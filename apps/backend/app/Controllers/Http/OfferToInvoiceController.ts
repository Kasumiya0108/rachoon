import Document from 'App/Models/Document'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OfferToInvoiceController {
  public async update(ctx: HttpContextContract) {
    return await Document.query()
      .where({
        type: 'offer',
        id: ctx.request.param('id'),
        organizationId: ctx.auth.user?.organization.id,
      })
      .update({ type: 'invoice' })
  }
}
