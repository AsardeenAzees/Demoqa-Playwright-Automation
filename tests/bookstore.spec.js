const { chromium } = require('playwright');
const booksData = require('../data/books.json');

jest.setTimeout(90000);

const baseUrl = 'https://demoqa.com';

const isHeaded = process.env.HEADED === 'true';
const expectedBook = booksData.books[0];

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

describe('Book Store page', () => {
  test('should open the Book Store page', async () => {
    await openPage('/books', 'Book Store');

    const bodyText = await getBodyText();
    expect(bodyText).toContain('Book Store');
  });

  test('should search and show the expected book', async () => {
    await openPage('/books', 'Book Store');

    await page.fill('#searchBox', expectedBook.title);
    await page.waitForFunction(
      (title) => document.body && document.body.innerText.includes(title),
      expectedBook.title,
      { timeout: 30000 },
    );

    const bodyText = await getBodyText();
    expect(bodyText).toContain(expectedBook.title);
  });

  test('should open a single book details page', async () => {
    await openPage('/books', 'Book Store');

    // Use href selector instead of a:has-text() because this repo uses an older Playwright selector engine.
    await page.click(`a[href*="${expectedBook.isbn}"]`);

    await page.waitForFunction(
      (title) => document.body && document.body.innerText.includes(title),
      expectedBook.title,
      { timeout: 30000 },
    );

    const bodyText = await getBodyText();
    expect(bodyText).toContain(expectedBook.title);
    expect(bodyText).toContain(expectedBook.author);
  });

  test('should open Profile page and show not logged in message', async () => {
    await openPage('/profile', 'Profile');

    const bodyText = await getBodyText();
    expect(bodyText).toContain('Profile');
    expect(bodyText).toContain('not logged');
  });
});
