# 🧪 SauceDemo E2E Playwright Automation Framework

[![Playwright](https://img.shields.io/badge/Playwright-v1.49.1-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Allure 3](https://img.shields.io/badge/Allure%20Report-v3.x-FF6C37?style=for-the-badge&logo=lighthouse)](https://allurereport.org/)
[![Dockerized Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge&logo=jenkins)](https://www.jenkins.io/)

An enterprise-grade, highly optimized end-to-end test automation framework built with **Playwright**, **TypeScript**, and **Allure Report 3** for the [SauceDemo](https://www.saucedemo.com) e-commerce application. It is pre-integrated with a modern, fully containerized **Jenkins CI/CD Pipeline** using Docker Compose.

---

## 🛠️ Architecture & Core Design

The framework is built around solid software engineering principles, employing strict separation of concerns, the Page Object Model (POM), decoupled test data, and zero flaky logic (no hard waits).

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST SPECIFICATIONS                       │
│             login.spec.ts │ cart.spec.ts                     │
│     (test cases, Allure annotations, assertions)             │
└────────────────────┬────────────────────────────────────────┘
                     │ uses
┌────────────────────▼────────────────────────────────────────┐
│                  PAGE OBJECT MODEL (POM)                     │
│      BasePage ──► LoginPage / InventoryPage / CartPage       │
│   (all locators and page interactions live here)             │
└────────────────────┬────────────────────────────────────────┘
                     │ reads from
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

### ⚡ Key Design Decisions

*   **Page Object Model (POM)**: Every web page has its corresponding Page Object class extending `BasePage.ts`. Locators are defined using stable `data-test` attributes to make the tests resilient to UI changes.
*   **No Hard Waits**: Synchronisation is handled completely by Playwright's built-in auto-waiting mechanism and web assertions. `waitForTimeout()` is strictly avoided to maximize run speeds.
*   **Decoupled Test Data**: Credentials, item pricing, and expected error assertions are isolated inside `test-data/` to keep test files fully readable and data modifications trivial.
*   **Allure 3 Metadata**: Custom wrappers in `utils/allure.helpers.ts` inject rich metadata (`severity`, `features`, `stories`, `epics`) without polluting test files with boilerplate annotation logic.
*   **Highly Parallel Execution**: Engineered with `fullyParallel: true` in `playwright.config.ts` to run tests concurrently at the worker level in independent browser contexts.
*   **Smart Retry Strategy**:
    *   **Local Runs**: `1` retry to allow debug evaluation.
    *   **CI Runs**: `2` retries to combat network fluctuations (automatically configured by the `process.env.CI` toggle).

---

## 💻 Tech Stack & Dependencies

| Technology | Purpose | Core Benefits |
| :--- | :--- | :--- |
| **Playwright (`^1.49.1`)** | Automation engine | Auto-waiting, multiple browser contexts, fast execution |
| **TypeScript (`^5.x`)** | Static compilation | Typesafe locators, cleaner refactoring, robust IntelliSense |
| **Allure Report 3 (`^3.8.2`)** | Reporting dashboard | Rich charts, historical dynamics, flaky markers, step tracking |
| **dotenv (`^16.4.7`)** | Configuration management | Secure, environment-specific secret and URL loading |
| **Docker & Jenkins** | Continuous Integration | Standardized container runner, automatic webhook execution |

---

## 📂 Project Structure

```bash
saucedemo-playwright/
├── config/
│   └── env.config.ts             # Central environment configuration loader
├── pages/                        # Page Object Model (POM) layer
│   ├── BasePage.ts               # Base class with shared action utilities
│   ├── LoginPage.ts              # Login authentication locators and actions
│   ├── InventoryPage.ts          # Catalog products and shopping badge actions
│   └── CartPage.ts               # Checkout cart validation page objects
├── scripts/
│   └── run-with-history.sh       # Multi-run script simulating trend history
├── test-data/                    # Isolated test suites datasets
│   ├── login.data.ts             # Valid/invalid credential mock datasets
│   └── products.data.ts          # Catalog inventories expectations (price/names)
├── tests/                        # Playwright E2E spec suites
│   ├── login.spec.ts             # Authentication E2E scenarios (13 test cases)
│   └── cart.spec.ts              # Shopping Cart E2E scenarios (12 test cases)
├── utils/
│   └── allure.helpers.ts         # High-level Allure annotations helpers
├── .env.example                  # Template configuration for project secrets
├── allurerc.json                 # Allure 3 config (history tracking directories)
├── docker-compose.yml            # 1-Click Jenkins service deployment config
├── Dockerfile.jenkins            # Custom Jenkins container with Docker CLI
├── Jenkinsfile                   # Multi-stage CI pipeline logic (Playwright Agent)
├── package.json                  # Task runner scripts & dependencies
└── playwright.config.ts          # Core Playwright execution configurations
```

---

## 🚀 Getting Started (Local Setup)

### 📋 Prerequisites
Ensure you have the following installed locally:
*   **Node.js**: v18 or higher
*   **npm**: v9 or higher
*   **Java**: v8 or higher (required by the Allure CLI to generate HTML reports locally)

### 🔧 1. Clone & Install Dependencies
Clone the repository and run `npm install`:
```bash
git clone https://github.com/ChaudharyVishal007/saucedemo-playwright.git
cd saucedemo-playwright
npm install
```

### 🌐 2. Install Playwright Browsers
Download the required browser binaries (Chromium and Firefox are pre-configured):
```bash
npm run playwright:install
```

### 🔒 3. Configure Environment Variables
Copy the `.env.example` file to create a local `.env` configuration:
```bash
cp .env.example .env
```
> [!NOTE]
> The default values in `.env` are pre-configured to work against SauceDemo out-of-the-box. No modifications are needed to run the suite immediately.

---

## 🏃 Running Tests Locally

All tests run in **headless parallel mode** by default on Chromium.

### 📊 Test Command Matrix

| Command | Action |
| :--- | :--- |
| `npm test` | Executes the entire test suite (25 E2E Tests) |
| `npm run test:smoke` | Runs critical happy paths tagged with `@smoke` |
| `npm run test:regression` | Runs comprehensive coverage tagged with `@regression` |
| `npm run test:login` | Runs authentication test suite exclusively |
| `npm run test:cart` | Runs shopping cart test suite exclusively |
| `npm run test:headed` | Executes tests with visible browser windows (headed mode) |

### 🔍 Filtering Specific Tests
To execute a specific test case matching a substring name:
```bash
npx playwright test -g "should login successfully"
```

---

## 📊 Allure 3 Rich Reporting

This framework is configured with **Allure Report 3** to capture screenshots on failures, record runtime steps, and compile history graphs across sequential runs.

### ⚡ Option A: Run, Generate & Open (Fastest)
Compile results, generate the rich dashboard, and launch it in your default browser in one execution command:
```bash
npm run report
```

### ⚙️ Option B: Step-by-Step Reporting
If you prefer running test suites and building reports individually:
```bash
# 1. Run the test suite (generates raw JSON/JSONL results in allure-results/)
npm test

# 2. Compile raw data into a beautiful static HTML report
npm run allure:generate

# 3. Spin up a local server to view the report
npm run allure:open
```

### 📈 Simulating Historical Trend Graphs
Allure 3 aggregates **Stability**, **Durations History**, and **Status Dynamics** metrics. To view these graphs locally, simulate a series of sequential runs using our preconfigured history shell script:
```bash
npm run test:history
```
> [!TIP]
> This command runs the suite 5 times sequentially. A dedicated regression test is intentionally configured to simulate realistic network/UI flakiness on runs 2 and 4. This produces beautiful, meaningful analytics in the Allure graphs to demonstrate how the framework behaves in real CI environments!

---

## 🧪 Detailed Test Coverage

The suite encompasses **25 complete E2E test scenarios** covering every core customer journey on SauceDemo:

### 🔑 1. Authentication Suite (`tests/login.spec.ts`) — 13 Tests
*   **Positive Scenarios**:
    *   Successful authentication with valid credentials (validates navigation, target URL, main headers, page & browser tab titles).
    *   Validation of session persistence across page reloads.
    *   Clean rendering check of all structural UI forms.
*   **Negative Scenarios**:
    *   Authentication failures on empty username field, empty password field, or both blank.
    *   Validating specific application lockout warnings for locked-out user profiles.
    *   Explicit credentials validation failures (wrong username/correct password, correct username/wrong password, both fields completely wrong).
    *   Sanitization checks: SQL injection payload validation, Cross-Site Scripting (XSS) payload authentication behavior checks.
*   **UI Assertion Boundaries**:
    *   Explicit error indicator styling (red highlight boundaries & error icons) display on input boxes.
    *   Clean dismissal of the credential error message banner when clicking the 'X' button.

### 🛒 2. Shopping Cart Suite (`tests/cart.spec.ts`) — 12 Tests
*   **Product Addition Flows**:
    *   Adding a single item increments the shopping cart badge count to `1`.
    *   Adding multiple items sequentially increments the badge indicator accurately.
    *   Toggling "Add to cart" changes the item button style to a "Remove" button immediately.
*   **Cart Inventory Validation**:
    *   Successful navigation validation (URL, headers) to the shopping cart page.
    *   Validation that product names, specific description details, and prices on the cart screen exactly match the selected inventory catalogs.
    *   Multiple item layouts display consistently inside the cart container.
*   **Product Removal Flows**:
    *   Removing products from the home catalog screen clears the cart badge count.
    *   Removing items directly from the checkout cart cleanses the cart.
    *   Removing a single item from a multi-item cart leaves other products fully intact.
    *   Clicking "Continue Shopping" returns users to the catalog, persisting the existing cart items and badge state.
*   **Badge Boundary Conditions**:
    *   Shopping badge indicator is completely hidden when the cart is empty.
    *   Shopping badge disappears instantly after removing the final item.

---

## 🚀 CI/CD & Jenkins Pipeline Automation

This framework is fully equipped with a production-ready, lightweight, and modern **Dockerized Jenkins CI/CD pipeline** designed to run tests automatically on code push and generate beautiful interactive **Allure Reports**.

### 🛠️ CI/CD Architecture Flow

```mermaid
graph TD
    Developer[Developer Push] -->|Webhook Trigger| GitHub[GitHub Repository]
    GitHub -->|SCM Hook| JenkinsController[Jenkins Controller Container]
    JenkinsController -->|Docker Socket| PlaywrightAgent[Playwright Node/Linux Agent]
    PlaywrightAgent -->|npm ci| RunTests[Execute Playwright Tests]
    RunTests -->|Generate allure-results| AllureGen[Generate Allure 3 HTML Report]
    AllureGen -->|Archive & Publish| JenkinsController
```

### 📦 1. Required Jenkins Plugins
For the pipeline to execute, ensure the following plugins are installed under **Manage Jenkins** ➔ **Plugins** ➔ **Available Plugins**:
1.  **Docker Pipeline Plugin** (`docker-workflow`): Allows Jenkins to spin up the official Microsoft Playwright container dynamically.
2.  **Allure Jenkins Plugin** (`allure-jenkins-plugin`): Aggregates test runs, builds status history graphs, and displays interactive Allure 3 dashboards in the Jenkins UI.
3.  **GitHub Integration Plugin** (`github`): Listens for GitHub webhook push notifications to auto-trigger the pipeline.

### 🚀 2. Spin Up Jenkins in 1-Click
We provide a preconfigured docker-compose file that mounts the host's Docker socket to authorize containerized agents.

#### Start the Jenkins Server:
```bash
docker compose up -d --build
```

#### Access Jenkins UI:
*   **URL**: `http://localhost:8080`
*   **Initial Admin Password**: Retrieve the generated password from logs:
    ```bash
    docker logs jenkins-ci 2>&1 | grep -A 2 "Please use the following password"
    ```
    *(Alternatively, print it directly from the volume)*:
    ```bash
    docker exec jenkins-ci cat /var/jenkins_home/secrets/initialAdminPassword
    ```

### ⛓️ 3. Pipeline Configuration Steps
1.  **Create Pipeline**: Go to **New Item**, enter `saucedemo-qa-pipeline`, select **Pipeline**, and click **OK**.
2.  **Trigger Configurations**: Check **GitHub hook trigger for GITScm polling**.
3.  **Pipeline script from SCM**:
    *   **Definition**: `Pipeline script from SCM`
    *   **SCM**: `Git`
    *   **Repository URL**: `https://github.com/ChaudharyVishal007/saucedemo-playwright.git` (or your repository fork).
    *   **Branch Specifier**: `*/qa`
    *   **Script Path**: `Jenkinsfile`
4.  **Save**: Click **Save**.

### 🔗 4. GitHub Webhook Setup Steps
1.  Go to your **GitHub Repository** ➔ **Settings** ➔ **Webhooks** ➔ **Add webhook**.
2.  **Payload URL**: `http://<your-public-jenkins-ip>:8080/github-webhook/`
    > [!NOTE]
    > For local testing, use a tunneling tool like **ngrok** to expose your local port `8080` to the internet (e.g. `ngrok http 8080`).
3.  **Content type**: `application/json`
4.  **Which events**: Select **Just the push event**.
5.  Click **Add webhook**.

### 📊 5. Allure Report Integration in Jenkins
1.  Go to **Manage Jenkins** ➔ **Tools** ➔ **Allure Report installations...**
2.  Name it **Allure** (matching the default, or keep it automatic).
3.  Under **Install automatically**, select **Install from Maven Central** (choose the latest 2.x version).
4.  The pipeline will automatically compile test outcomes into a stunning interactive widget accessible directly from the build's sidebar menu!

### 🔍 6. Manual Setup Verification
To manually test the pipeline without waiting for a commit push:
1.  Open `http://localhost:8080` and click on `saucedemo-qa-pipeline`.
2.  Click **Build Now** to manually trigger the execution pipeline.
3.  Open the active build's **Console Output** to verify:
    *   Code is successfully checked out from the `qa` branch.
    *   The `playwright` noble Docker container is pulled.
    *   Dependencies are installed using `npm ci`.
    *   Playwright tests execute inside the container agent.
    *   Allure reports are compiled and published.
