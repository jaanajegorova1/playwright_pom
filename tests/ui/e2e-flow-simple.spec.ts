import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { OrderNotFoundPage } from '../pages/order-not-found'

test('signIn button disabled when incorrect data inserted', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.usernameField.fill(faker.lorem.word(2))
  await loginPage.passwordField.fill(faker.lorem.word(7))
  await loginPage.signInButton.checkVisible()
  await loginPage.signInButton.checkDisabled(true)
})

test('login with correct credentials and verify order creation page', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.statusButton.checkDisabled(false)
  await orderCreationPage.nameField.checkVisible()
})

test('TL-22-1 Mocked auth', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await page.route('**/login/student*', async (route) => {
    //const responseBody = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqZWdvcm92YWoiLCJleHAiOjE3NDE5ODA3OTUsImlhdCI6MTc0MTk2Mjc5NX0.P54DRnca66s644QHUSBZ22SuFbj_vBuD_0LMkaVEz7lfaMvCpdb5HcLr3m5ky5aQOt6dx6GEzEVtOVRho70unA';
    const responseBody = 'test.test.test'
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: responseBody,
    })
  })
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.statusButton.checkDisabled(false)
  await orderCreationPage.nameField.checkVisible()
})

test('TL-22-2 Mocked auth + order creation', async ({ page }) => {
  const name = 'qwefqwefqwfe'
  const phone = 'qwefqwefqwef'
  const comment = 'qwefqwefqwef'
  const orderId = 6010
  const responseBody = {
    status: 'OPEN',
    courierId: null,
    customerName: name,
    customerPhone: phone,
    comment: comment,
    id: orderId,
  }

  const loginPage = new LoginPage(page)
  await loginPage.open()
  await page.route('**/login/student*', async (route) => {
    const responseBody = 'test.test.test'
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: responseBody,
    })
  })
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.statusButton.checkDisabled(false)
  await orderCreationPage.nameField.checkVisible()
  await orderCreationPage.nameField.fill(name)
  await orderCreationPage.phoneField.fill(phone)
  await orderCreationPage.commentField.fill(comment)
  await orderCreationPage.createOrderButton.checkDisabled(false)
  await page.route('**/orders**', async (route) => {
    const method = route.request().method()
    switch (method) {
      case 'POST': {
        return await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(responseBody),
        })
      }
      case 'GET': {
        return await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(responseBody),
        })
      }
      default: {
        return await route.continue()
      }
    }
  })
  const createOrderResponse = page.waitForResponse(
    (response) => response.url().includes('orders') && response.request().method() === 'POST',
  )
  await orderCreationPage.createOrderButton.click()
  await createOrderResponse
  await orderCreationPage.checkCreatedOrderID(orderId)
  await orderCreationPage.notificationPopupClose.click()
  await orderCreationPage.statusButton.click()
  await orderCreationPage.searchOrderInput.fill(`${orderId}`)
  const searchOrderResponse = page.waitForResponse(
    (response) => response.url().includes('orders') && response.request().method() === 'GET',
  )
  await orderCreationPage.trackingButton.click()
  await searchOrderResponse
  expect(page.url().includes(`${orderId}`)).toBeTruthy()
})

test('TL-18-1 Check footer on login page', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.checkFooterAttached()
  await loginPage.langButtonRu.checkVisible()
  await loginPage.langButtonEn.checkVisible()
  await loginPage.privacyPolicyLink.checkVisible()
  await loginPage.cookiePolicyLink.checkVisible()
  await loginPage.tosLink.checkVisible()
})

test('TL-18-2 Check footer on order page', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderPage.checkFooterAttached()
  await orderPage.langButtonRu.checkVisible()
  await orderPage.langButtonEn.checkVisible()
  await orderPage.privacyPolicyLink.checkVisible()
  await orderPage.cookiePolicyLink.checkVisible()
  await orderPage.tosLink.checkVisible()
})

test.only('TL-18-3 Check footer on order not found page', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const notFoundPage = new OrderNotFoundPage(page)
  await loginPage.open()
  const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderPage.statusButton.click()
  await orderPage.orderNumberFiled.fill('12341234')
  await orderPage.trackingButton.click()
  await notFoundPage.checkNotFoundTitle()
  await notFoundPage.checkFooterAttached()
  await notFoundPage.langButtonRu.checkVisible()
  await notFoundPage.langButtonEn.checkVisible()
  await notFoundPage.privacyPolicyLink.checkVisible()
  await notFoundPage.cookiePolicyLink.checkVisible()
  await notFoundPage.tosLink.checkVisible()
})
