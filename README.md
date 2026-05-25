# SauceDemo QA Automation Framework

<div align="center">

![Playwright](https://img.shields.io/badge/Playwright-1.49+-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Allure](https://img.shields.io/badge/Allure_Report-3.x-f7941e?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0zMiA0QzE2LjUgNCA0IDE2LjUgNCAzMnMxMi41IDI4IDI4IDI4IDI4LTEyLjUgMjgtMjhTNDcuNSA0IDMyIDR6Ii8+PC9zdmc+)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A production-grade, CI-ready end-to-end test automation framework**  
built with Playwright and Allure Report 3 for [SauceDemo](https://www.saucedemo.com)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Framework Architecture](#framework-architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup & Installation](#setup--installation)
- [Running Tests](#running-tests)
- [Allure Report 3](#allure-report-3)
- [Test Coverage](#test-coverage)
- [Framework Design Decisions](#framework-design-decisions)
- [Configuration & Environment](#configuration--environment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Assumptions & Scope](#assumptions--scope)

---

## Overview

This framework automates end-to-end UI test coverage for the SauceDemo web application, covering the two core business flows:

- **Login Functionality** — positive, negative, security, and UI validation scenarios
- **Add to Cart Functionality** — adding, validating, and removing products from the shopping cart

The solution is built to be **scalable**, **maintainable**, and **CI-ready** with:
- Zero hard waits (no `waitForTimeout`)
- Full test independence (no shared browser state)
- Data-driven test design (test data separated from logic)
- Structured Allure 3 reporting with steps, severities, epics, features, and layers

---

## Framework Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST SPECIFICATIONS                       │
│             login.spec.ts │ cart.spec.ts                     │
│   (describe blocks, test steps, Allure annotations)         │
└────────────────────┬────────────────────────────────────────┘
                     │ uses
┌────────────────────▼────────────────────────────────────────┐
│                  PAGE OBJECT MODEL (POM)                     │
│      BasePage → LoginPage / InventoryPage / CartPage         │
│   (encapsulates all locators and page interactions)          │
└────────────────────┬────────────────────────────────────────┘
                     │ reads
┌────────────────────▼────────────────────────────────────────┐
│              TEST DATA  &  CONFIGURATION                     │
│    test-data/login.data.ts │ test-data/products.data.ts      │
│    config/env.config.ts    │ .env                            │
└─────────────────────────────────────────────────────────────┘
                     │ reports to
┌────────────────────▼────────────────────────────────────────┐
│                   ALLURE REPORT 3                            │
│   Steps │ Severity │ Epic │ Feature │ Story │ Layer (e2e)    │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
saucedemo-qa/
│
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI/CD pipeline
│
├── config/
│   └── env.config.ts               # Centralised runtime environment config
│
├── pages/                          # Page Object Model (POM) layer
│   ├── BasePage.ts                 # Abstract base: navigate, getTitle, waitForLoad
│   ├── LoginPage.ts                # Login page: fill, submit, error assertions
│   ├── InventoryPage.ts            # Products page: add/remove, badge, sort
│   └── CartPage.ts                 # Cart page: item names, prices, remove, empty check
│
├── scripts/
│   └── run-with-history.sh         # Multi-run script to build Allure history graphs
│
├── test-data/                      # All test data — decoupled from test logic
│   ├── login.data.ts               # Credentials, error message constants, invalid sets
│   └── products.data.ts            # Product names, expected prices, page constants
│
├── tests/                          # Test specification files
│   ├── login.spec.ts               # 14 tests: positive, negative, security, UI
│   └── cart.spec.ts                # 11 tests: add, validate, remove, edge cases
│
├── utils/
│   └── allure.helpers.ts           # Allure wrappers: step, tag, severity, epic, layer, story
│
├── .env                            # Runtime environment variables (not committed to VCS)
├── .env.example                    # Safe template showing required variables
├── playwright.config.ts            # Playwright: browsers, timeouts, reporters, parallel config
├── tsconfig.json                   # TypeScript compiler configuration
└── package.json                    # NPM scripts and dependency declarations
```

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | `^1.49.1` | Browser automation framework |
| [TypeScript](https://www.typescriptlang.org) | `^5.x` | Type-safe test authoring |
| [allure-playwright](https://www.npmjs.com/package/allure-playwright) | `^3.9.0` | Allure result generation |
| [allure](https://www.npmjs.com/package/allure) | `^3.8.2` | Allure Report 3 CLI for report generation |
| [dotenv](https://www.npmjs.com/package/dotenv) | `^16.4.7` | Environment variable loading |
| Node.js | `18+` | Runtime |

---

## Setup & Installation

### Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | v18 or higher | [Download](https://nodejs.org/) |
| npm | v9 or higher | Bundled with Node.js |

> **Note:** Allure 3 is installed as a local npm package — **no Java or global installation required**.

### Installation Steps

```bash
# Step 1 — Clone the repository
git clone https://github.com/ChaudharyVishal007/saucedemo-playwright.git
cd saucedemo-playwright

# Step 2 — Install all Node.js dependencies (includes Playwright + Allure 3)
npm install

# Step 3 — Install Playwright browser binaries
npm run playwright:install

# Step 4 — Configure environment variables
cp .env.example .env
# The default values in .env work out of the box — no changes needed
```

### Environment Variables (`.env`)

```ini
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
LOCKED_USER=locked_out_user
PROBLEM_USER=problem_user
PERFORMANCE_USER=performance_glitch_user
PASSWORD=secret_sauce
ENV=staging
```

---

## Running Tests

### All Tests

```bash
npm test
```

Runs the full suite in parallel, headless, on Chromium and Firefox.

### Filter by Tag

```bash
# Smoke tests only (critical happy paths — fast, ~5 tests)
npm run test:smoke

# Full regression suite
npm run test:regression
```

### Filter by Spec or Browser

```bash
# Only login tests
npm run test:login

# Only cart tests
npm run test:cart

# Run on Chrome only
npx playwright test --project=chromium

# Run on Firefox only
npx playwright test --project=firefox

# Headed mode (watch the browser)
npm run test:headed
```

### Run a Specific Test by Name

```bash
npx playwright test -g "should login successfully"
```

---

## Allure Report 3

This framework uses **Allure Report 3** — the latest generation of Allure reporting with a modern UI, featuring:

- Test result timelines
- Severity distribution charts
- Feature / Epic / Story groupings
- Retry tracking and flaky test detection
- Screenshot and trace attachments on failure

### Quick Report (Run Tests + Generate + Open)

```bash
npm run report
```

### Step-by-Step

```bash
# 1. Run tests — generates raw results in allure-results/
npm test

# 2. Generate the Allure 3 HTML report
npm run allure:generate

# 3. Open the report in your browser
npm run allure:open

# Alternative: live serve directly from raw results
npm run allure:serve
```

### Build Report with Historical Trend Data

To populate **Status Dynamics**, **Stability Distribution**, and **Durations History** graphs, run the multi-pass history script. This executes the test suite 5 times and accumulates history between runs:

```bash
npm run test:history

# Or with a custom number of runs:
bash scripts/run-with-history.sh 3
```

### Allure Report Labels Used

| Label | Values | Graph It Powers |
|---|---|---|
| `severity` | blocker, critical, normal, minor | Severities bar chart |
| `epic` | Authentication, Shopping Cart | Epics stability distribution |
| `feature` | Authentication, Cart | Features by story grouping |
| `story` | Valid Login, Empty Username, etc. | Story-level breakdown |
| `layer` | e2e | Testing pyramid, Durations by layer |
| `tag` | smoke, regression | Tag filter in test list |

---

## Test Coverage

### Login — `tests/login.spec.ts` (14 tests)

#### ✅ Positive Scenarios

| Test | Tags | Severity | Assertions |
|---|---|---|---|
| Successful login with valid credentials | `@smoke @regression` | Blocker | URL = `/inventory.html`, page title = `Products`, tab title = `Swag Labs` |
| Login page displays all UI elements | `@smoke` | Normal | Username field, password field, login button, logo text all visible |
| Session persists after page reload | `@regression` | Normal | URL remains `/inventory.html` after `page.reload()` |

#### ✅ Negative Scenarios

| Test | Tags | Severity | Assertions |
|---|---|---|---|
| Empty username | `@regression` | Critical | Error message visible, correct error text, URL unchanged |
| Empty password | `@regression` | Critical | Error message visible, correct error text, URL unchanged |
| Both fields empty | `@regression` | Normal | Error message = "Username is required" |
| Locked out user | `@regression` | Critical | Specific locked-out error message, no redirect |
| Wrong username, correct password | `@regression` | Critical | Invalid credentials error |
| Correct username, wrong password | `@regression` | Critical | Invalid credentials error |
| Both credentials wrong | `@regression` | Critical | Invalid credentials error |
| **SQL injection attempt** | `@regression` | Critical | Rejected with invalid credentials error (no bypass) |
| **XSS injection attempt** | `@regression` | Critical | Rejected with invalid credentials error (no script execution) |

#### ✅ Error UI Behaviour

| Test | Tags | Severity | Assertions |
|---|---|---|---|
| Dismiss error via X button | `@regression` | Minor | Error disappears after clicking close button |
| Error styling on input fields | `@regression` | Minor | Both input fields get CSS `error` class on failed login |

---

### Cart — `tests/cart.spec.ts` (11 tests)

#### ✅ Adding Products

| Test | Tags | Severity | Assertions |
|---|---|---|---|
| Add single product → badge count | `@smoke @regression` | Blocker | Badge = 1, Remove button appears, Add button disappears |
| Add multiple products → badge increments | `@regression` | Critical | Badge increments correctly after each addition |
| Button state changes after add | `@regression` | Normal | "Add to cart" → "Remove" button swap confirmed |

#### ✅ Cart Page Validation

| Test | Tags | Severity | Assertions |
|---|---|---|---|
| Navigate to cart, validate product | `@smoke @regression` | Blocker | URL = `/cart.html`, title = "Your Cart", item count = 1, name + price correct |
| Multiple products in cart validated | `@regression` | Critical | Item count = 2, both names present, both prices correct |

#### ✅ Removing Products

| Test | Tags | Severity | Assertions |
|---|---|---|---|
| Remove from inventory page | `@smoke @regression` | Critical | Badge disappears, "Add to cart" button returns |
| Remove from cart page | `@regression` | Critical | Cart becomes empty |
| Remove one of multiple, preserve others | `@regression` | Normal | Remaining item still in cart, removed item gone |
| Continue shopping after cart view | `@regression` | Minor | Returns to `/inventory.html`, badge count preserved |

#### ✅ Cart Badge Edge Cases

| Test | Tags | Severity | Assertions |
|---|---|---|---|
| No badge on empty cart | `@regression` | Minor | Cart badge not visible on inventory page |
| Badge disappears after removing all items | `@regression` | Normal | Badge gone after removing 2 items one by one |

---

## Framework Design Decisions

### 1. Page Object Model (POM)

Every page is encapsulated in a dedicated class extending `BasePage`. Locators are defined **once** as class properties using `data-test` attributes — the most stable selectors on SauceDemo's DOM.

```
BasePage (abstract)
  └── LoginPage
  └── InventoryPage
  └── CartPage
```

This means if a locator ever changes, it is fixed in one place only.

### 2. No Hard Waits

`waitForTimeout()` is **never used**. Playwright's built-in auto-waiting handles element readiness. Global timeouts are configured once in `playwright.config.ts`:

```typescript
actionTimeout: 10_000,     // per-action timeout
navigationTimeout: 15_000, // page load timeout
expect: { timeout: 5_000 } // assertion timeout
```

### 3. Test Data Separation

All test input and expected output values live in `test-data/`:

- `login.data.ts` — credentials, expected error message strings, invalid credential matrix
- `products.data.ts` — product names, expected prices

Tests import named constants — **no magic strings** inside spec files.

### 4. Test Independence

Every test starts fresh with its own browser context. The `beforeEach` hook sets up the page state (navigate, log in if needed). Tests do not depend on each other and can run in any order.

### 5. Parallel Execution

`fullyParallel: true` enables test-level parallelism. With `workers: 2` locally and `workers: 4` in CI, the full suite completes in under 20 seconds.

### 6. Allure 3 Annotations

`utils/allure.helpers.ts` provides clean wrapper functions so test files stay readable:

```typescript
epic('Authentication');      // groups tests by business epic
feature('Authentication');   // groups by feature for behaviour view
story('Valid Login');         // groups by user story
layer('e2e');                 // populates Testing Pyramid graph
severity('blocker');          // severity classification
tag('smoke', 'regression');  // execution filter tags
step('Navigate to page', async () => { ... }); // named step in report
```

### 7. Tagging Strategy

| Tag | Purpose | When to Run |
|---|---|---|
| `@smoke` | Critical happy paths — fastest confidence check | Every deployment |
| `@regression` | Full coverage — all positive + negative + edge cases | Pull requests, nightly builds |

### 8. Retry Strategy

```typescript
retries: process.env.CI ? 2 : 1
```

- **Local:** 1 retry — prevents flaky failures due to network jitter
- **CI:** 2 retries — increased resilience in shared pipeline environments

### 9. Screenshots & Traces on Failure

```typescript
screenshot: 'only-on-failure',
video: 'retain-on-failure',
trace: 'retain-on-failure',
```

Allure automatically picks up failure screenshots from `test-results/` and attaches them to the failed test entry in the report.

---

## Configuration & Environment

### `playwright.config.ts` — Key Settings

| Setting | Value | Purpose |
|---|---|---|
| `testDir` | `./tests` | Test file discovery location |
| `fullyParallel` | `true` | Test-level parallelism |
| `workers` | `2` local / `4` CI | Parallel worker count |
| `retries` | `1` local / `2` CI | Automatic retry on failure |
| `baseURL` | from `.env` | Applied to all relative URL navigations |
| `headless` | `true` | Headless by default |
| `actionTimeout` | `10s` | Max time for any single action |
| `navigationTimeout` | `15s` | Max time for page navigation |

### Browsers Configured

| Browser | Project Name |
|---|---|
| Google Chrome (Chromium) | `chromium` |
| Mozilla Firefox | `firefox` |

---

## CI/CD Pipeline

The framework includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:

1. Installs Node.js dependencies
2. Installs Playwright browser binaries
3. Runs the full test suite
4. Generates the Allure Report
5. Uploads Allure results as a build artifact

### Triggering the Pipeline

```yaml
# Triggers on:
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### Running Smoke Tests Only in CI

```bash
npx playwright test --grep @smoke --project=chromium
```

---

## Assumptions & Scope

| # | Assumption |
|---|---|
| 1 | The application under test is `https://www.saucedemo.com` with publicly documented test credentials |
| 2 | `data-test` HTML attributes are the preferred locator strategy — they are stable and semantically meaningful |
| 3 | Allure 3 CLI is installed as a local npm package — no global CLI or Java installation is required |
| 4 | The **checkout flow is out of scope** — the assignment covers Login and Add to Cart only |
| 5 | Screenshots on failure are automatically captured by Playwright and attached to Allure test entries |
| 6 | Tests run against the live SauceDemo site — no mocking or local server setup is required |
| 7 | The `locked_out_user`, `problem_user`, and `performance_glitch_user` accounts are used only in specific negative test scenarios |

---

## Quick Reference — All Commands

```bash
# ── INSTALLATION ──────────────────────────────────────────────
npm install                              # Install all dependencies
npm run playwright:install               # Install browser binaries

# ── RUNNING TESTS ─────────────────────────────────────────────
npm test                                 # Full suite (all browsers, parallel)
npm run test:smoke                       # @smoke tagged tests only
npm run test:regression                  # @regression tagged tests only
npm run test:login                       # Login spec only
npm run test:cart                        # Cart spec only
npm run test:headed                      # Visible browser (debugging)
npx playwright test --project=chromium   # Chrome only
npx playwright test --project=firefox    # Firefox only

# ── ALLURE REPORT 3 ───────────────────────────────────────────
npm run report                           # Generate + open report (one command)
npm run allure:generate                  # Generate HTML report from results
npm run allure:open                      # Open the generated report
npm run allure:serve                     # Live serve from raw allure-results

# ── HISTORY & TREND GRAPHS ────────────────────────────────────
npm run test:history                     # 5-run history build (populates trend graphs)
bash scripts/run-with-history.sh 3       # Custom number of history runs
```

---

<div align="center">

**Built with ❤️ using Playwright + TypeScript + Allure Report 3**

</div>
