import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly burgerMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.innerText();
  }

  async addProductToCart(productName: string): Promise<void> {
    const addButton = this.page.locator(
      `[data-test="add-to-cart-${this.toKebabCase(productName)}"]`
    );
    await addButton.click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const removeButton = this.page.locator(
      `[data-test="remove-${this.toKebabCase(productName)}"]`
    );
    await removeButton.click();
  }

  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.innerText();
    return parseInt(text, 10);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isVisible();
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getInventoryItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async isAddToCartButtonVisible(productName: string): Promise<boolean> {
    const btn = this.page.locator(
      `[data-test="add-to-cart-${this.toKebabCase(productName)}"]`
    );
    return btn.isVisible();
  }

  async isRemoveButtonVisible(productName: string): Promise<boolean> {
    const btn = this.page.locator(
      `[data-test="remove-${this.toKebabCase(productName)}"]`
    );
    return btn.isVisible();
  }

  async getProductPrice(productName: string): Promise<string> {
    const item = this.page.locator('[data-test="inventory-item"]').filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
    return item.locator('[data-test="inventory-item-price"]').innerText();
  }

  async isOnInventoryPage(): Promise<boolean> {
    return this.page.url().includes('/inventory.html');
  }

  private toKebabCase(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
}
