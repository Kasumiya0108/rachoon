import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrganizationHelper from 'App/Helpers/organization'
import Hash from '@ioc:Adonis/Core/Hash'
export default class AuthController {
  public async index(ctx: HttpContextContract) {
    const organization = await OrganizationHelper.getFromContext(ctx)
    if (!organization) {
      return ctx.response.notFound('No organization')
    } else {
      return organization
    }
  }
}
