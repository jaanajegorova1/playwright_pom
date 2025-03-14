import { BasePage } from './base-page'
import { expect, Locator, Page } from '@playwright/test'

export class OrderNotFoundPage extends BasePage {
  readonly notFoundTitle: Locator

  constructor(page: Page) {
    super(page)
    this.notFoundTitle = page.locator('h1.not-found__title')
  }

  async checkNotFoundTitle(): Promise<void> {
    await expect(this.notFoundTitle).toBeVisible()
    await expect(this.notFoundTitle).toHaveText('Order not found')
  }
}
