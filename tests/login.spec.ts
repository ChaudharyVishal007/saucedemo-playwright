import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import {
  VALID_CREDENTIALS,
  LOCKED_CREDENTIALS,
  LOGIN_ERROR_MESSAGES,
  INVALID_CREDENTIALS,
} from '../test-data/login.data';
import { step, tag, severity, feature, story, epic, layer } from '../utils/allure.helpers';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    epic('Authentication');
    feature('Authentication');
    layer('e2e');
  });

  // ─────────────────────────────────────────────
  //  POSITIVE SCENARIOS
  // ─────────────────────────────────────────────

  test.describe('Positive Scenarios', () => {
    test(
      '@smoke - should login successfully with valid credentials',
      async ({ page }) => {
        tag('smoke', 'regression');
        severity('blocker');
        story('Valid Login');

        await step('Navigate to login page', async () => {
          await expect(page).toHaveURL('/');
        });

        await step('Enter valid credentials and submit', async () => {
          await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
        });

        await step('Validate redirect to inventory page', async () => {
          await expect(page).toHaveURL('/inventory.html');
        });

        await step('Validate inventory page title', async () => {
          const inventoryPage = new InventoryPage(page);
          const title = await inventoryPage.getPageTitle();
          expect(title).toBe('Products');
        });

        await step('Validate browser tab title', async () => {
          await expect(page).toHaveTitle('Swag Labs');
        });
      }
    );

    test('@smoke - login page should display all UI elements correctly', async ({ page }) => {
      tag('smoke');
      severity('normal');
      story('Login Page UI');

      await step('Verify username field is visible', async () => {
        expect(await loginPage.isUsernameFieldVisible()).toBe(true);
      });

      await step('Verify password field is visible', async () => {
        expect(await loginPage.isPasswordFieldVisible()).toBe(true);
      });

      await step('Verify login button is visible', async () => {
        expect(await loginPage.isLoginButtonVisible()).toBe(true);
      });

      await step('Verify logo text', async () => {
        const logoText = await loginPage.getLogoText();
        expect(logoText).toBe('Swag Labs');
      });

      await step('Verify page title in browser tab', async () => {
        await expect(page).toHaveTitle('Swag Labs');
      });
    });

    test('@regression - should persist session state after login', async ({ page }) => {
      tag('regression');
      severity('normal');
      story('Session Persistence');

      await step('Login with valid credentials', async () => {
        await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
      });

      await step('Confirm inventory page loaded', async () => {
        await expect(page).toHaveURL('/inventory.html');
      });

      await step('Reload page and verify session persists', async () => {
        await page.reload();
        await expect(page).toHaveURL('/inventory.html');
      });
    });
  });

  // ─────────────────────────────────────────────
  //  NEGATIVE SCENARIOS
  // ─────────────────────────────────────────────

  test.describe('Negative Scenarios', () => {
    test('@regression - should show error when username is empty', async ({ page }) => {
      tag('regression');
      severity('critical');
      story('Empty Username');

      await step('Submit login form with empty username', async () => {
        await loginPage.login('', VALID_CREDENTIALS.password);
      });

      await step('Validate error message is visible', async () => {
        expect(await loginPage.isErrorMessageVisible()).toBe(true);
      });

      await step('Validate error message text', async () => {
        const errorText = await loginPage.getErrorMessageText();
        expect(errorText).toContain(LOGIN_ERROR_MESSAGES.emptyUsername);
      });

      await step('Validate URL has not changed (still on login page)', async () => {
        await expect(page).toHaveURL('/');
      });
    });

    test('@regression - should show error when password is empty', async ({ page }) => {
      tag('regression');
      severity('critical');
      story('Empty Password');

      await step('Submit login form with empty password', async () => {
        await loginPage.login(VALID_CREDENTIALS.username, '');
      });

      await step('Validate error message', async () => {
        const errorText = await loginPage.getErrorMessageText();
        expect(errorText).toContain(LOGIN_ERROR_MESSAGES.emptyPassword);
      });

      await step('Validate URL has not changed', async () => {
        await expect(page).toHaveURL('/');
      });
    });

    test('@regression - should show error when both fields are empty', async ({ page }) => {
      tag('regression');
      severity('normal');
      story('Both Fields Empty');

      await step('Submit login with both fields empty', async () => {
        await loginPage.login('', '');
      });

      await step('Validate error message', async () => {
        const errorText = await loginPage.getErrorMessageText();
        expect(errorText).toContain(LOGIN_ERROR_MESSAGES.emptyUsername);
      });
    });

    test('@regression - should show error for locked out user', async ({ page }) => {
      tag('regression');
      severity('critical');
      story('Locked User');

      await step('Attempt login with locked user credentials', async () => {
        await loginPage.login(LOCKED_CREDENTIALS.username, LOCKED_CREDENTIALS.password);
      });

      await step('Validate locked out error message', async () => {
        const errorText = await loginPage.getErrorMessageText();
        expect(errorText).toContain(LOGIN_ERROR_MESSAGES.lockedUser);
      });

      await step('Validate user is not redirected', async () => {
        await expect(page).toHaveURL('/');
      });
    });

    for (const { scenario, username, password, expectedError } of INVALID_CREDENTIALS) {
      test(`@regression - should reject invalid login: ${scenario}`, async ({ page }) => {
        tag('regression');
        severity('critical');
        story('Invalid Credentials');

        await step(`Enter credentials: ${scenario}`, async () => {
          await loginPage.login(username, password);
        });

        await step('Validate error message', async () => {
          const errorText = await loginPage.getErrorMessageText();
          expect(errorText).toContain(expectedError);
        });

        await step('Validate still on login page', async () => {
          await expect(page).toHaveURL('/');
        });
      });
    }
  });

  // ─────────────────────────────────────────────
  //  ERROR UI BEHAVIOUR
  // ─────────────────────────────────────────────

  test.describe('Error UI Behaviour', () => {
    test('@regression - should dismiss error message when X button is clicked', async ({ page }) => {
      tag('regression');
      severity('minor');
      story('Error Dismissal');

      await step('Trigger an error by submitting empty form', async () => {
        await loginPage.login('', '');
      });

      await step('Confirm error is visible', async () => {
        expect(await loginPage.isErrorMessageVisible()).toBe(true);
      });

      await step('Close the error message', async () => {
        await loginPage.closeErrorMessage();
      });

      await step('Confirm error is no longer visible', async () => {
        expect(await loginPage.isErrorMessageVisible()).toBe(false);
      });
    });

    test('@regression - should show error icon on input fields on failed login', async ({ page }) => {
      tag('regression');
      severity('minor');
      story('Error Field Highlighting');

      await step('Submit form with wrong credentials', async () => {
        await loginPage.login('bad_user', 'bad_pass');
      });

      await step('Validate error styling on username field', async () => {
        await loginPage.expectErrorIconOnUsername();
      });

      await step('Validate error styling on password field', async () => {
        await loginPage.expectErrorIconOnPassword();
      });
    });
  });
});
