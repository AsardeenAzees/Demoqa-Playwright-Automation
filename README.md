# DemoQA Playwright Automation

![DemoQA Playwright Automation Tests](https://github.com/AsardeenAzees/Demoqa-Playwright-Automation/actions/workflows/demoqa-tests.yml/badge.svg)

A QA automation portfolio project for testing the [DemoQA](https://demoqa.com/) web application using **Playwright**, **JavaScript**, and **Jest**.

This project demonstrates practical QA automation skills including UI automation, form validation, reusable page objects, test data handling, API helper utilities, stable test execution, and CI/CD execution with GitHub Actions.

---

## Project Highlights

- End-to-end UI automation using Playwright
- JavaScript test scripting with Jest
- Chromium browser automation
- Page Object Model structure
- JSON-based test data handling
- Book Store API helper utilities
- Headless and headed browser execution
- GitHub Actions CI workflow
- Automated test execution on every push and pull request

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Playwright | Browser automation |
| Jest | Test runner and assertions |
| JavaScript | Test scripting language |
| Node.js | Runtime environment |
| Chromium | Browser used for automation |
| JSON | Test data and credential configuration |
| GitHub Actions | Continuous Integration / automated test execution |

---

## Application Under Test

The project automates test scenarios on the public DemoQA practice website:

```text
https://demoqa.com
```

DemoQA is a sample web application commonly used for practicing UI automation, form validation, browser interactions, and API-supported testing.

---

## Test Coverage

### Elements Module

| Test Scenario | Type | Status |
|---|---|---|
| Open Elements page and verify page content | UI Test | Automated |
| Collapse Elements section | UI Test | Automated |
| Submit valid Text Box form data | UI Test | Automated |
| Validate invalid email error | Negative Test | Automated |
| Perform double click action | Interaction Test | Automated |
| Perform right click action | Interaction Test | Automated |
| Perform normal click action | Interaction Test | Automated |

### Book Store Module

| Test Scenario | Type | Status |
|---|---|---|
| Open Book Store page | UI Test | Automated |
| Search for a specific book | UI Test | Automated |
| Open book details page | UI Test | Automated |
| Open Profile page | UI Test | Automated |
| Validate not logged-in profile state | UI Test | Automated |

---

## Latest CI Execution Result

The GitHub Actions workflow successfully runs the automated test suite in CI.

```text
Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
Browser:     Chromium
Runner:      Jest
Mode:        Headless
```

The workflow runs automatically when code is pushed to the `main` branch or when a pull request is opened.

---

## Project Structure

```text
Demoqa-Playwright-Automation/
│
├── .github/
│   └── workflows/
│       └── demoqa-tests.yml          # GitHub Actions CI workflow
│
├── data/
│   └── books.json                    # Book Store test data
│
├── pages/
│   └── textBox.js                    # Page Object Model for Text Box page
│
├── tests/
│   ├── elements.spec.js              # Elements, Text Box, and Buttons tests
│   └── bookstore.spec.js             # Book Store tests
│
├── utilities/
│   └── bookstoreApi.js               # Book Store API helper functions
│
├── user.json                         # Local credential file, ignored from Git
├── package.json
├── package-lock.json
├── jest.config.js
├── .gitignore
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/AsardeenAzees/Demoqa-Playwright-Automation.git
```

Go to the project folder:

```bash
cd Demoqa-Playwright-Automation
```

Install dependencies:

```bash
npm install
```

Install Playwright Chromium browser:

```bash
npx playwright install chromium
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

Do not commit real usernames, passwords, tokens, or other secrets to GitHub.

Recommended `.gitignore` entries:

```gitignore
node_modules/
user.json
.env
test-results/
coverage/
```

---

## Running Tests Locally

Run all tests:

```bash
npm run test
```

Run all tests in single-thread mode for better stability:

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

Run a single test by name:

```bash
npm run test -- -t "should open the Elements page"
```

---

## Running Tests in Headed Mode

By default, Playwright runs in **headless mode**, meaning the browser runs in the background without opening a visible browser window.

For debugging or interview demonstration, tests can be executed in headed mode.

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
- Debugging element interaction issues
- Understanding browser behavior
- Demonstrating automation during interviews

---

## GitHub Actions CI Workflow

This project includes a GitHub Actions workflow that automatically runs the automation test suite when code is pushed to GitHub.

Workflow file:

```text
.github/workflows/demoqa-tests.yml
```

The CI workflow performs the following steps:

1. Checks out the repository
2. Sets up Node.js
3. Installs project dependencies
4. Installs the Playwright Chromium browser
5. Creates `user.json` using GitHub repository secrets
6. Runs the Jest automation test suite

Example workflow command:

```bash
npm run test -- --runInBand
```

---

## GitHub Secrets Used in CI

The CI workflow uses GitHub repository secrets to generate `user.json` safely during workflow execution.

| Secret Name | Purpose |
|---|---|
| `DEMOQA_USERNAME` | DemoQA Book Store username |
| `DEMOQA_PASSWORD` | DemoQA Book Store password |

Secrets are configured in:

```text
GitHub Repository → Settings → Secrets and variables → Actions
```

This avoids exposing credentials in the source code.

---

## Browser and Execution Mode

| Item | Value |
|---|---|
| Browser | Chromium |
| Local default mode | Headless |
| Debug mode | Headed |
| CI mode | Headless |
| Test runner | Jest |

Example browser launch:

```javascript
const { chromium } = require('playwright');

browser = await chromium.launch({
  headless: process.env.HEADED !== 'true'
});
```

---

## Page Object Model

The project uses a basic Page Object Model structure to separate page-specific actions from test logic.

Example:

```javascript
const { TextBoxPage } = require('../pages/textBox');

const textBoxPage = new TextBoxPage(page);

await textBoxPage.navigate();
await textBoxPage.fillForm(user);
```

Benefits:

- Cleaner test files
- Reusable page actions
- Easier maintenance
- Better scalability for larger automation frameworks

---

## API Helper Utility

The project contains a Book Store API helper file:

```text
utilities/bookstoreApi.js
```

The API helper is used for API-supported test preparation and demonstrates knowledge of combining UI automation with backend/API operations.

API helper responsibilities:

- Authenticate a Book Store user
- Store token-related data
- Add books through API
- Delete books through API

This is useful in real QA automation projects because APIs can prepare test data faster than UI steps.

---

## Example UI Test

```javascript
test('should submit valid text box data', async () => {
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

## Stability Improvements

While building this project, several real-world automation issues were identified and improved.

| Issue | Improvement |
|---|---|
| `www.demoqa.com` navigation issue | Updated base URL to `https://demoqa.com` |
| Public website slow loading | Increased timeout and improved wait strategy |
| Missing async/await usage | Added correct `await` handling |
| Browser process not closing correctly | Added proper browser teardown |
| Unsupported selector syntax in older Playwright version | Replaced with compatible selectors |
| Parallel execution instability | Used `--runInBand` for stable execution |
| Credential exposure risk | Used `user.json` locally and GitHub Secrets in CI |

---

## Skills Demonstrated

This repository demonstrates the following QA and automation skills:

- UI test automation
- End-to-end testing
- Form validation testing
- Negative test scenarios
- Browser interaction testing
- Playwright automation
- JavaScript test scripting
- Jest test execution
- Page Object Model
- Test data management
- API helper implementation
- Debugging and troubleshooting
- Headless and headed test execution
- GitHub Actions CI/CD
- Secure secret handling
- Test documentation

---

## Recommended Commands

| Purpose | Command |
|---|---|
| Run all tests | `npm run test` |
| Run tests one by one | `npm run test -- --runInBand` |
| Run Elements tests only | `npm run test -- tests/elements.spec.js` |
| Run Book Store tests only | `npm run test -- tests/bookstore.spec.js` |
| Run a test by name | `npm run test -- -t "test name"` |
| Debug open handles | `npm run test -- --detectOpenHandles` |

---

## Future Improvements

Planned improvements:

- Add HTML test reporting
- Add screenshots on failure
- Add video recording for failed tests
- Add Playwright trace viewer support
- Add cross-browser testing with Firefox and WebKit
- Add more API test coverage
- Add manual test cases folder
- Add sample bug reports
- Add test execution screenshots to README
- Migrate from Jest runner to Playwright Test Runner for advanced reporting

---

## Notes

DemoQA is a public practice website. Because of ads, network delay, and server load, some tests may require higher timeout values or single-thread execution.

Recommended stable command:

```bash
npm run test -- --runInBand
```

For local debugging:

```powershell
$env:HEADED="true"; npm run test -- --runInBand
```

---

## Author

**Asardeen Azees**

QA Automation Enthusiast | Playwright | JavaScript | Manual Testing | API Testing

GitHub: [AsardeenAzees](https://github.com/AsardeenAzees)

LinkedIn: [asardeen-azees](https://www.linkedin.com/in/asardeen-azees/)

---

## License

This project is created for learning, portfolio, and QA automation practice purposes.