const { chromium } = require('playwright');
const { TextBoxPage } = require('../pages/textBox');

jest.setTimeout(90000);

const baseUrl = 'https://demoqa.com';
const isHeaded = process.env.HEADED === 'true';

let browser;
let context;
let page;

async function openPage(path, expectedText) {
  const url = `${baseUrl}${path}`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      // DemoQA can be slow because of ads and external scripts.
      // Waiting for page text is more stable than depending only on .main-header.
      if (expectedText) {
        await page.waitForFunction(
          (text) => document.body && document.body.innerText.includes(text),
          expectedText,
          { timeout: 45000 },
        );
      }

      return;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }

      await page.waitForTimeout(1500);
    }
  }
}

async function getBodyText() {
  return page.textContent('body');
}

async function clickButtonWithExactText(buttonText) {
  await page.waitForFunction(
    (text) => Array.from(document.querySelectorAll('button')).some((button) => button.innerText.trim() === text),
    buttonText,
    { timeout: 30000 },
  );

  await page.evaluate((text) => {
    const button = Array.from(document.querySelectorAll('button')).find(
      (item) => item.innerText.trim() === text,
    );

    if (!button) {
      throw new Error(`Button not found: ${text}`);
    }

    button.scrollIntoView({ block: 'center' });
    button.click();
  }, buttonText);
}

beforeAll(async () => {
  browser = await chromium.launch({
    headless: !isHeaded,
    slowMo: isHeaded ? 300 : 0,
  });
});

beforeEach(async () => {
  context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });

  page = await context.newPage();
  page.setDefaultTimeout(45000);
  page.setDefaultNavigationTimeout(60000);
});

afterEach(async () => {
  await context.close();
});

afterAll(async () => {
  await browser.close();
});

describe('Elements page', () => {
  test('should open the Elements page', async () => {
    await openPage('/elements', 'Elements');

    const bodyText = await getBodyText();
    expect(bodyText).toContain('Elements');
  });

  test('should collapse the Elements menu container', async () => {
    await openPage('/elements', 'Elements');

    await page.waitForSelector('.element-group');
    await page.click('.header-right');

    const elementListClass = await page.getAttribute('.element-group .element-list', 'class');
    expect(elementListClass).not.toContain('show');
  });
});

describe('Text Box page', () => {
  const user = {
    name: 'Test Tester',
    email: 'test@test.com',
    currentAddress: '3930 N Pine Grove Ave, Chicago, IL 60613',
    permanentAddress: '24 Girard St, Rochester, NY 14610',
  };

  test('should submit valid text box data', async () => {
    const textBoxPage = new TextBoxPage(page, baseUrl);

    await textBoxPage.navigate();
    await textBoxPage.fillForm(user);

    await page.evaluate(() => document.querySelector('#submit').scrollIntoView({ block: 'center' }));
    await page.click('#submit', { force: true });

    await page.waitForSelector('#output');
    const outputText = await page.textContent('#output');

    expect(outputText).toContain(user.name);
    expect(outputText).toContain(user.email);
    expect(outputText).toContain(user.currentAddress);
    expect(outputText).toContain(user.permanentAddress);
  });

  test('should show error for invalid email', async () => {
    await openPage('/text-box', 'Text Box');

    await page.fill('#userEmail', 'test');
    await page.evaluate(() => document.querySelector('#submit').scrollIntoView({ block: 'center' }));
    await page.click('#submit', { force: true });

    const emailClass = await page.getAttribute('#userEmail', 'class');
    expect(emailClass).toContain('field-error');
  });
});

describe('Buttons page', () => {
  test('should perform Double Click', async () => {
    await openPage('/buttons', 'Buttons');

    await page.dblclick('#doubleClickBtn');
    await page.waitForSelector('#doubleClickMessage');

    const messageText = await page.textContent('#doubleClickMessage');
    expect(messageText).toContain('double click');
  });

  test('should perform Right Click', async () => {
    await openPage('/buttons', 'Buttons');

    await page.click('#rightClickBtn', { button: 'right' });
    await page.waitForSelector('#rightClickMessage');

    const messageText = await page.textContent('#rightClickMessage');
    expect(messageText).toContain('right click');
  });

  test('should perform Normal Click', async () => {
    await openPage('/buttons', 'Buttons');

    // Avoid button:has-text() because older Playwright versions in this repo do not support it.
    await clickButtonWithExactText('Click Me');

    await page.waitForSelector('#dynamicClickMessage');
    const messageText = await page.textContent('#dynamicClickMessage');

    expect(messageText).toContain('dynamic click');
  });
});
