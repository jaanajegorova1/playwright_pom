import { expect, Locator, Page } from '@playwright/test'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { BasePage } from './base-page'

export class OrderPage extends BasePage {
  readonly statusButton: Button
  readonly nameField: Input
  readonly phoneField: Input
  readonly commentField: Input
  readonly statusModal: Locator
  readonly orderNumberFiled: Input
  readonly trackingButton: Button
  readonly createOrderButton: Button
  readonly notificationPopupText: Locator
  readonly notificationPopupClose: Button
  readonly searchOrderInput: Input

  constructor(page: Page) {
    super(page)
    this.statusButton = new Button(page, '[data-name="openStatusPopup-button"]')
    this.nameField = new Input(page, '#name')
    this.phoneField = new Input(page, '#phone')
    this.commentField = new Input(page, '#comment')
    this.statusModal = page.getByTestId('searchOrder-popup')
    this.orderNumberFiled = new Input(page, '[data-name="searchOrder-popup"] input')
    this.createOrderButton = new Button(page, '.new-order__button')
    this.notificationPopupText = page.locator('span.notification-popup__text')
    this.notificationPopupClose = new Button(
      page,
      '[data-name="orderSuccessfullyCreated-popup-ok-button"]',
    )
    this.searchOrderInput = new Input(page, '[data-name="searchOrder-input"]')
    this.trackingButton = new Button(page, '[data-name="searchOrder-submitButton"]')
  }

  async checkCreatedOrderID(id: number): Promise<void> {
    expect(await this.notificationPopupText.innerText()).toContain(`${id}`)
  }
}
