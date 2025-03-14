import { expect, Locator, Page } from '@playwright/test'
import { Button } from '../atoms/Button'
import { Link } from '../atoms/Link'

export class BasePage {
  readonly page: Page
  readonly footer: Locator
  readonly langButtonRu: Button
  readonly langButtonEn: Button
  readonly privacyPolicyLink: Link
  readonly cookiePolicyLink: Link
  readonly tosLink: Link

  protected constructor(page: Page) {
    this.page = page
    this.footer = this.page.locator('.Footer')
    this.langButtonRu = new Button(this.page, '.language__button:has-text("RU")')
    this.langButtonEn = new Button(this.page, '.language__button:has-text("EN")')
    this.privacyPolicyLink = new Link(this.page, '[href="/pdf/politics.pdf"]')
    this.cookiePolicyLink = new Link(this.page, '[href="/pdf/cookie.pdf"]')
    this.tosLink = new Link(this.page, '[href="/pdf/conditions.pdf"]')
  }

  async checkFooterAttached(): Promise<void> {
    await expect(this.footer).toBeAttached()
  }
}
