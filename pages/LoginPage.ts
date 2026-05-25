import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorCloseButton: Locator;
  private readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
    this.loginLogo = page.locator('.login_logo');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async getErrorMessageText(): Promise<string> {
    return this.errorMessage.innerText();
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async closeErrorMessage(): Promise<void> {
    await this.errorCloseButton.click();
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.loginButton.isVisible();
  }

  async isUsernameFieldVisible(): Promise<boolean> {
    return this.usernameInput.isVisible();
  }

  async isPasswordFieldVisible(): Promise<boolean> {
    return this.passwordInput.isVisible();
  }

  async getLogoText(): Promise<string> {
    return this.loginLogo.innerText();
  }

  async getUsernameInputBorderColor(): Promise<string | null> {
    return this.usernameInput.evaluate((el) =>
      window.getComputedStyle(el).borderColor
    );
  }

  async expectErrorIconOnUsername(): Promise<void> {
    await expect(this.usernameInput).toHaveClass(/error/);
  }

  async expectErrorIconOnPassword(): Promise<void> {
    await expect(this.passwordInput).toHaveClass(/error/);
  }
}
