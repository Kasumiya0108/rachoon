import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DocumentType } from '@repo/common'
import NumberService from 'App/Services/Number'

export default class AuthController {
  public async index(ctx: HttpContextContract) {
    const type = ctx.request.param('type')
    if (
      ![
        `${DocumentType.Invoice}`,
        `${DocumentType.Offer}`,
        `${DocumentType.Reminder}`,
        'client',
      ].includes(type)
    ) {
      return ctx.response.badRequest('Invalid type')
    }

    if (type === 'client') {
      return NumberService.client(ctx.auth.user!.organizationId)
    }

    return NumberService.document(ctx.auth.user!.organizationId, Number(type))
  }
}
