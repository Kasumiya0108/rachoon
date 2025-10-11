export default class AuthController {
  public async index() {
    const envs = {}
    process.env['RACHOON_VERSION'] = process.env.APP_VERSION
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('RACHOON_')) {
        envs[key] = process.env[key]
      }
    })
    return { ...envs }
  }
}
