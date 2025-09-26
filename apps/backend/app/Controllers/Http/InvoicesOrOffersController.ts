import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvoiceOrOffer from '../../Models/InvoiceOrOffer'
import { InvoiceOrOfferValidator } from '../../Validators/InvoiceOrOffer'
import Format from '@repo/common/Format'
import InvoiceOrOfferService from 'App/Services/InvoiceOrOffer'

export default class InvoicesOrOffersController {
  public async index(ctx: HttpContextContract) {
    if (!['invoice', 'offer'].includes(ctx.request.qs()['type'])) {
      return ctx.response.badRequest('Type must be invoice or offer')
    }
    if (ctx.request.qs()['count']) {
      return await InvoiceOrOffer.query()
        .where({
          organizationId: ctx.auth.user?.organizationId,
          type: ctx.request.qs()['type'].toLowerCase(),
        })
        .withTrashed()
        .getCount()
    }
    return await InvoiceOrOffer.query()
      .where({
        organizationId: ctx.auth.user?.organizationId,
        type: ctx.request.qs()['type'].toLowerCase(),
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderBy('created_at', 'desc')
  }

  public async store(ctx: HttpContextContract) {
    const body = await ctx.request.validate(InvoiceOrOfferValidator)
    body.number = await InvoiceOrOfferService.nextNumber(ctx.auth.user!, ctx.request.qs()['type'])
    return await InvoiceOrOffer.create({
      ...body,
      type: ctx.request.qs()['type'].toLowerCase(),
      organizationId: ctx.auth.user?.organizationId,
    })
  }

  public async update(ctx: HttpContextContract) {
    const io = await InvoiceOrOffer.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .firstOrFail()
    io.merge(await ctx.request.validate(InvoiceOrOfferValidator))
    await io.save()
    return io
  }

  public async destroy(ctx: HttpContextContract) {
    return (
      await InvoiceOrOffer.query()
        .where({
          organizationId: ctx.auth.user?.organization.id,
          id: ctx.request.param('id'),
        })
        .firstOrFail()
    ).delete()
  }

  public async show(ctx: HttpContextContract) {
    return await InvoiceOrOffer.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .firstOrFail()
  }

  public async duplicate(ctx: HttpContextContract) {
    const io = await InvoiceOrOffer.query()
      .where({ id: ctx.request.param('id'), organizationId: ctx.auth.user?.organizationId })
      .firstOrFail()

    const duplicate = new InvoiceOrOffer()
    duplicate.fill(io.$attributes)
    const number = await InvoiceOrOfferService.nextNumber(ctx.auth.user!, io.type)

    duplicate.number = number
    delete duplicate.$attributes.id
    delete duplicate.$attributes.created_at
    delete duplicate.$attributes.updated_at

    return await duplicate.save()
  }

  public async number(ctx: HttpContextContract) {
    const type = ctx.request.qs()['type']
    if (!['invoice', 'offer'].includes(type)) {
      return ctx.response.badRequest('Type must be invoice or offer')
    }

    return InvoiceOrOfferService.nextNumber(ctx.auth.user!, type)
  }
}
