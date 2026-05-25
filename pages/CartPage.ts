import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.innerText();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async getItemPrices(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-price"]').allInnerTexts();
  }

  async getItemNameByIndex(index: number): Promise<string> {
    return this.page
      .locator('[data-test="inventory-item-name"]')
      .nth(index)
      .innerText();
  }

  async getItemPriceByIndex(index: number): Promise<string> {
    return this.page
      .locator('[data-test="inventory-item-price"]')
      .nth(index)
      .innerText();
  }

  async removeItemByName(productName: string): Promise<void> {
    const kebab = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const removeBtn = this.page.locator(`[data-test="remove-${kebab}"]`);
    await removeBtn.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async isOnCartPage(): Promise<boolean> {
    return this.page.url().includes('/cart.html');
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const names = await this.getItemNames();
    return names.includes(productName);
  }
}
