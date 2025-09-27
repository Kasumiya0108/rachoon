import Document from 'App/Models/Document'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StatusValidator } from 'App/Validators/Document'

export default class InvoiceStatusController {
  public async update(ctx: HttpContextContract) {
    const body = await ctx.request.validate(StatusValidator)
    return await Document.query()
      .where({
        id: ctx.request.param('id'),
        organizationId: ctx.auth.user?.organization.id,
      })
      .update(body)
  }
}
