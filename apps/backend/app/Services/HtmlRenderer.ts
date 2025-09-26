import { launch, LaunchOptions, PDFOptions } from 'puppeteer'
import { PDFiumLibrary, PDFiumPageRenderOptions } from '@hyzyla/pdfium'
export interface PuppeteerOptions {
  launch?: LaunchOptions
  pdf?: PDFOptions
}
import { chromium, firefox } from 'playwright'
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

  public async renderFromHtml(html: string, isPreview: boolean = false, scale: number = 1) {
    const { browser, page } = await this.getBrowserAndPage()

    await page.setContent(html)
    await page.evaluateHandle('document.fonts.ready')

    const pdfOptions: PDFOptions = {
      scale: scale,
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
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ]
    const browser = await chromium.launch({
      args: minimalArgs,
      executablePath: '/usr/bin/chromium-browser',
    })
    const page = await browser.newPage()

    return { browser, page }
  }
}
