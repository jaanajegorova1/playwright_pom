import { Page } from '@playwright/test'
import { OrderPage } from './order-page'
import { SERVICE_URL } from '../../config/env-data'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { BasePage } from './base-page'

export class LoginPage extends BasePage {
  readonly url: string = SERVICE_URL
  readonly signInButton: Button
  readonly usernameField: Input
  readonly passwordField: Input

  constructor(page: Page) {
    super(page)
    this.signInButton = new Button(page, '[data-name=signIn-button]')
    this.usernameField = new Input(page, '[data-name=username-input]')
    this.passwordField = new Input(page, '[data-name=password-input]')
  }

  async open() {
    await this.page.goto(this.url)
  }

  async signIn(username: string, password: string) {
    await this.usernameField.checkVisible()
    await this.passwordField.checkVisible()
    await this.usernameField.fill(username)
    await this.passwordField.fill(password)
    await this.signInButton.click()
    return new OrderPage(this.page)
  }
}
