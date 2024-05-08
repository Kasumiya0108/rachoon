import { launch, LaunchOptions, PDFOptions } from 'puppeteer'
import { PDFiumLibrary, PDFiumPageRenderOptions } from '@hyzyla/pdfium'
export interface PuppeteerOptions {
  launch?: LaunchOptions
  pdf?: PDFOptions
}

import sharp from 'sharp'

export default class HtmlRenderer {
  constructor() {}

  private async renderFunction(options: PDFiumPageRenderOptions) {
    return await sharp(options.data, {
      raw: {
        width: options.width,
        height: options.height,
        channels: 4,
      },
    })
      .png()
      .toBuffer()
  }

  public async renderFromHtml(html: string, isPreview: boolean = false) {
    const { browser, page } = await this.getBrowserAndPage()

    await page.setContent(html)
    await page.evaluateHandle('document.fonts.ready')

    const pdfOptions: PDFOptions = {
      scale: 1,
      printBackground: true,
      preferCSSPageSize: true,
    }
    try {
      const pdf = await page.pdf(pdfOptions)
      const buffer = Buffer.from(pdf)

      if (isPreview) {
        const library = await PDFiumLibrary.init()
        const doc = await library.loadDocument(buffer)
        const images: any = []
        for (const page of doc.pages()) {
          const p = await page.render({ scale: 3, render: this.renderFunction })
          images.push('data:image/png;base64' + ',' + Buffer.from(p.data).toString('base64'))
        }
        return images
      }

      return ['data:application/pdf;base64,' + buffer.toString('base64')]
    } catch (e) {
      console.error(e)
    } finally {
      await browser.close()
    }
  }

  /**
   *
   * @param path The file path to save the PDF to. If path is a relative path, then it is resolved relative to current
   * working directory. If no path is provided, the PDF won't be saved to the disk.
   */
  public async renderFromHtmlToFile(html: string, path: string) {
    const { browser, page } = await this.getBrowserAndPage()

    await page.setContent(html, {})

    const pdfOptions: PDFOptions = {
      format: 'A4',
    }
    await page.pdf({
      ...pdfOptions,
      path,
    })
    await browser.close()
  }

  private async getBrowserAndPage() {
    const minimalArgs = [
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ]
    const browser = await launch({
      args: minimalArgs,
      executablePath: '/usr/bin/chromium-browser',
      defaultViewport: {
        width: 1240,
        height: 1754,
      },
    })
    const page = await browser.newPage()

    return { browser, page }
  }
}
