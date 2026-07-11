class TextBoxPage {
  constructor(page, baseUrl = 'https://demoqa.com') {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async navigate() {
    await this.page.goto(`${this.baseUrl}/text-box`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await this.page.waitForSelector('#userName');
  }

  async fillForm(user) {
    await this.page.fill('#userName', user.name);
    await this.page.fill('#userEmail', user.email);
    await this.page.fill('#currentAddress', user.currentAddress);
    await this.page.fill('#permanentAddress', user.permanentAddress);
  }
}

module.exports = { TextBoxPage };
