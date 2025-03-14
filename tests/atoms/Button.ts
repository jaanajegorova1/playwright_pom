import { expect, Locator, Page } from '@playwright/test'

export class Button {
  readonly page: Page
  readonly buttonLocator: Locator

  constructor(page: Page, selector: string) {
    this.page = page
    this.buttonLocator = page.locator(selector)
  }

  async checkVisible(): Promise<void> {
    await expect(this.buttonLocator).toBeVisible()
  }

  async click(): Promise<void> {
    await this.buttonLocator.click()
  }

  async checkDisabled(expected: boolean): Promise<void> {
    if (expected) {
      await expect(this.buttonLocator).toBeDisabled()
    } else {
      await expect(this.buttonLocator).toBeEnabled()
    }
  }
}
