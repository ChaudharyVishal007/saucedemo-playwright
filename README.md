# SauceDemo E2E QA Automation Framework

A production-grade, highly scalable test automation framework built using **Playwright**, **TypeScript**, and **Allure Report 3** for E2E testing on [SauceDemo](https://www.saucedemo.com).

---

## 🛠️ What is Used (Tech Stack)

The framework is built using the following core technologies to ensure speed, stability, and premium reporting:

*   **Core Engine:** [Playwright](https://playwright.dev/) (`^1.49.1`) — Modern, fast, and stable E2E testing library with auto-waiting.
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (`^5.x`) — Static typing for reliable test architecture.
*   **Reporting:** [Allure Report 3](https://allurereport.org/) (`^3.8.2` CLI & `^3.9.0` Playwright integration) — Native historical trends, category breakdowns, and dynamic analytics.
*   **Environment Configuration:** `dotenv` (`^16.4.7`) — Environment variable management.

---

## 🚀 Setup & Installation

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/ChaudharyVishal007/saucedemo-playwright.git
cd saucedemo-playwright

# Install dependencies
npm install

# Install Playwright browsers
npm run playwright:install
```

### 2. Configure Environment Variables
Copy the template file to `.env`:
```bash
cp .env.example .env
```
*(The default values in `.env` are configured to work out-of-the-box.)*

---

## 🏃 How to Run Tests

All tests run in **headless parallel mode** by default on Google Chrome (Chromium).

| Command | Description |
|---|---|
| `npm test` | Run all 25 tests |
| `npm run test:smoke` | Run critical Smoke tests (`@smoke`) |
| `npm run test:regression` | Run full Regression suite (`@regression`) |
| `npm run test:login` | Run Login specification only |
| `npm run test:cart` | Run Cart specification only |
| `npm run test:headed` | Run tests in headed (visible browser) mode |

To run a specific test by name:
```bash
npx playwright test -g "should login successfully"
```

---

## 📊 How to Open Allure Report

Allure 3 dynamically accumulates historical trend graphs, stability status, and flaky test markers natively using `allure-history.jsonl`!

### Quick Report (Run + Generate + Open)
```bash
npm run report
```

### Manual Steps
```bash
# 1. Run the test suite
npm test

# 2. Generate the HTML report
npm run allure:generate

# 3. Open the report in your default browser
npm run allure:open
```

### 📈 Simulating Allure Trend & Stability Graphs
To fully populate Allure's **Status Dynamics**, **Status Transitions**, **Durations History**, and **Stability** graphs with rich data:
```bash
# Runs the suite 5 times sequentially, logging historical trends natively
npm run test:history
```
*(One of the regression tests is configured to simulate realistic flakiness during Run 2 and 4 so you can see beautiful transitions and stability percentages on the Allure dashboard!)*

---

## 🏗️ Project Architecture & Design Decisions

### 1. Page Object Model (POM)
Every webpage is encapsulated in a dedicated class extending `BasePage.ts` (`LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts`). Locators are defined once using stable `data-test` attributes, ensuring high resilience against UI changes.

### 2. Decoupled Test Data
No hardcoded strings. All user credentials, error messages, and product details live in `test-data/login.data.ts` and `test-data/products.data.ts`.

### 3. Allure 3 Metadata Helpers
Test steps, epic tags, layers, and severities are handled through clean custom wrappers in `utils/allure.helpers.ts` to keep test specs clean and highly organized.

### 4. Zero Hard Waits
The framework completely avoids sleep statements like `waitForTimeout()`. Instead, it relies entirely on Playwright's built-in auto-waiting assertions for optimal speed.

---

## 📁 Directory Structure

```
saucedemo-playwright/
├── .github/workflows/
│   └── playwright.yml         # CI/CD GitHub Actions Workflow
├── config/
│   └── env.config.ts          # Central environment config
├── pages/                     # Page Object Model Layer
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   └── CartPage.ts
├── scripts/
│   └── run-with-history.sh    # Multi-run script to build Allure history
├── test-data/                 # Decoupled Test Data
│   ├── login.data.ts
│   └── products.data.ts
├── tests/                     # E2E Test Specifications
│   ├── login.spec.ts
│   └── cart.spec.ts
├── utils/
│   └── allure.helpers.ts      # Allure 3 custom annotators
├── allurerc.json              # Allure 3 config file (historyPath setup)
├── playwright.config.ts       # Playwright global configurations
└── package.json               # NPM scripts and dependencies
```

---

<div align="center">
  <b>Built with ❤️ using Playwright, TypeScript, and Allure Report 3</b>
</div>
