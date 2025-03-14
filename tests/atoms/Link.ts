import { expect, Locator, Page } from '@playwright/test'

export class Link {
  readonly page: Page
  readonly linkLocator: Locator

  constructor(page: Page, selector: string) {
    this.page = page
    this.linkLocator = page.locator(selector)
  }

  async checkVisible(): Promise<void> {
    await expect(this.linkLocator).toBeVisible()
  }
}
