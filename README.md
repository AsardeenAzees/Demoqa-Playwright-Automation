# DemoQA Playwright Automation Project

This repository contains an end-to-end test automation project for the [DemoQA](https://demoqa.com/) web application using **Playwright**, **JavaScript**, and **Jest**.

The main purpose of this project is to demonstrate practical QA automation skills such as UI automation, test data handling, API helper usage, browser automation, assertions, reusable page objects, and stable test execution.

---

## Project Overview

This project automates key modules of the DemoQA website, including:

- Elements page validation
- Text Box form submission
- Invalid email validation
- Button interactions
  - Double click
  - Right click
  - Normal click
- Book Store page validation
- Book search validation
- Book details page validation
- Profile page validation
- Book Store API helper functions

The project is designed as a QA portfolio project to demonstrate real-world test automation practices.

---

## Tech Stack

| Tool / Technology | Purpose |
|---|---|
| Playwright | Browser automation |
| Jest | Test runner and assertions |
| JavaScript | Test scripting language |
| Node.js | Runtime environment |
| JSON | Test data management |
| Chromium | Browser used for test execution |

---

## Why Playwright?

Playwright is a modern automation tool used for reliable browser testing. It supports multiple browsers, fast execution, auto-waiting, and strong locator handling.

In this project, Playwright is used to automate real browser actions such as:

- Opening web pages
- Filling forms
- Clicking buttons
- Validating page content
- Handling UI interactions
- Testing public web application flows

---

## Project Structure

```text
playwright-demoqa/
│
├── data/
│   └── books.json              # Test data for Book Store tests
│
├── pages/
│   └── textBox.js              # Page Object Model file for Text Box page
│
├── tests/
│   ├── elements.spec.js        # UI tests for Elements, Text Box, and Buttons
│   └── bookstore.spec.js       # UI tests for Book Store module
│
├── utilities/
│   └── bookstoreApi.js         # API helper functions for Book Store
│
├── user.json                   # Local user credentials file, ignored from Git
├── package.json
├── jest.config.js
├── .gitignore
└── README.md
```

---

## Test Coverage

### Elements Module

| Test Scenario | Status |
|---|---|
| Open Elements page and verify header | Automated |
| Collapse Elements section | Automated |
| Submit valid Text Box form data | Automated |
| Validate invalid email error | Automated |
| Perform double click action | Automated |
| Perform right click action | Automated |
| Perform normal click action | Automated |

---

### Book Store Module

| Test Scenario | Status |
|---|---|
| Open Book Store page | Automated |
| Search for a book | Automated |
| Open book details page | Automated |
| Open Profile page | Automated |
| Validate not logged-in profile state | Automated |

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/playwright-demoqa.git
```

Go to the project folder:

```bash
cd playwright-demoqa
```

Install dependencies:

```bash
npm install
```

---

## Test User Configuration

This project uses a local `user.json` file for Book Store login/API-related scenarios.

Create a `user.json` file in the root folder:

```json
{
  "username": "your_demoqa_username",
  "password": "your_demoqa_password"
}
```

Important:

```text
Do not commit real usernames or passwords to GitHub.
```

Make sure `user.json` is added to `.gitignore`.

Example `.gitignore`:

```gitignore
node_modules/
user.json
.env
test-results/
coverage/
```

---

## Running Tests

Run all tests:

```bash
npm run test
```

Run tests one by one for better stability:

```bash
npm run test -- --runInBand
```

Run only the Elements test file:

```bash
npm run test -- tests/elements.spec.js
```

Run only the Book Store test file:

```bash
npm run test -- tests/bookstore.spec.js
```

Run a single test by test name:

```bash
npm run test -- -t "should open the Elements page"
```

---

## Running Tests in Headed Mode

By default, Playwright runs in headless mode.

Headless mode means the browser runs in the background without opening a visible browser window.

To debug visually, run tests in headed mode:

### Windows PowerShell

```powershell
$env:HEADED="true"; npm run test -- --runInBand
```

### macOS / Linux

```bash
HEADED=true npm run test -- --runInBand
```

Headed mode is useful for:

- Watching test execution step by step
- Debugging failed actions
- Understanding browser behavior
- Interview demonstration

---

## Browser Used

This project currently uses **Chromium**.

Example:

```javascript
const { chromium } = require('playwright');
```

The browser is launched through Playwright:

```javascript
browser = await chromium.launch();
```

By default, Playwright runs Chromium in headless mode.

---

## Important Fixes and Improvements Done

During test stabilization, the following issues were identified and improved:

### 1. Base URL Issue

Original URL:

```javascript
https://www.demoqa.com
```

Updated stable URL:

```javascript
https://demoqa.com
```

Reason:

```text
The www version caused DNS/navigation issues in Playwright.
```

---

### 2. Timeout Handling

DemoQA can be slow because it is a public demo website with ads and external scripts.

To reduce false failures, test timeout handling was improved.

Example:

```javascript
jest.setTimeout(60000);
```

---

### 3. Better Page Loading Strategy

Instead of waiting for the full page load, tests can wait for DOM content:

```javascript
await page.goto(`${baseUrl}/elements`, {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
```

This improves test stability on slower pages.

---

### 4. Missing Await Fixed

Incorrect:

```javascript
textBoxPage.navigate();
```

Correct:

```javascript
await textBoxPage.navigate();
```

Reason:

```text
Without await, the test may start filling fields before the page is ready.
```

---

### 5. Proper Browser Teardown

To avoid worker process leaks, the browser should be closed properly.

```javascript
afterAll(async () => {
  await page.close();
  await browser.close();
});
```

---

### 6. Selector Improvements

Some older Playwright versions may not support selectors like:

```javascript
button:has-text("Click Me")
```

To improve compatibility, safer selectors and text-based handling were used.

---

## Page Object Model Usage

This project includes a basic Page Object Model structure.

Example:

```javascript
const { TextBoxPage } = require('../pages/textBox');
```

The Text Box page actions are separated into a reusable page class.

Benefits of Page Object Model:

- Cleaner test files
- Reusable page actions
- Easier maintenance
- Better structure for larger automation projects

---

## Example Test Scenario

Example: Submit valid Text Box data.

```javascript
it('should submit valid text box data', async () => {
  const textBoxPage = new TextBoxPage(page);

  await textBoxPage.navigate();
  await textBoxPage.fillForm(user);

  await page.click('#submit');

  const output = await page.textContent('#output');
  expect(output).toContain(user.name);
  expect(output).toContain(user.email);
});
```

---

## API Helper Usage

The project also includes API helper functions for the Book Store module.

Example helper file:

```text
utilities/bookstoreApi.js
```

API helper responsibilities:

- Authenticate user
- Add book
- Delete book
- Reuse token-based API calls

This shows understanding of both UI automation and API-supported test setup.

---

## Challenges Faced

While working on this project, several real-world automation challenges were handled:

| Challenge | Solution |
|---|---|
| DemoQA website slow loading | Increased timeout and improved wait strategy |
| DNS issue with www.demoqa.com | Updated base URL to demoqa.com |
| Unstable full page load wait | Used DOM content loaded strategy |
| Missing async/await | Added correct await usage |
| Browser process not closing | Added browser close in teardown |
| Unsupported selector syntax | Replaced with compatible selectors |
| Public site instability | Used single-thread execution with `--runInBand` |

---

## What This Project Demonstrates

This project demonstrates the following QA automation skills:

- Playwright browser automation
- JavaScript test scripting
- Jest test execution
- UI test automation
- Form validation testing
- Button interaction testing
- Page Object Model usage
- Test data handling using JSON
- API helper creation
- Test debugging
- Timeout handling
- Selector troubleshooting
- Headless and headed browser execution
- Real-world issue fixing

---

## Future Improvements

Planned improvements:

- Add GitHub Actions CI pipeline
- Add test reports
- Add screenshots on failure
- Add video recording for failed tests
- Add Allure or HTML reporting
- Improve API test coverage
- Add cross-browser testing using Chromium, Firefox, and WebKit
- Migrate to Playwright Test Runner for advanced reporting and tracing
- Add environment-based configuration
- Add retry strategy for unstable public site tests

---

## GitHub Actions Plan

A future CI workflow can run the automation tests automatically when code is pushed to GitHub.

Example workflow plan:

```yaml
name: DemoQA Automation Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm run test -- --runInBand
```

---

## Recommended Package Scripts

You can add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:elements": "jest tests/elements.spec.js --runInBand",
    "test:bookstore": "jest tests/bookstore.spec.js --runInBand",
    "test:debug": "jest --runInBand --detectOpenHandles"
  }
}
```

---



## Notes

DemoQA is a public practice website. Because of ads, network delay, and public server load, some tests may require higher timeout values or single-thread execution.

For stable local execution, the recommended command is:

```bash
npm run test -- --runInBand
```

For learning and debugging:

```powershell
$env:HEADED="true"; npm run test -- --runInBand
```

---

## Author

**Asardeen Azees**

QA Automation Enthusiast | Playwright | JavaScript | Manual Testing | API Testing

GitHub: `https://github.com/AsardeenAzees`

LinkedIn: `https://www.linkedin.com/in/asardeen-azees/`

---

## License

This project is created for learning, portfolio, and QA automation practice purposes.