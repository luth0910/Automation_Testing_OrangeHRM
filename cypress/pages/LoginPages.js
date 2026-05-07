class LoginPage {
  // ── Selectors ──────────────────────────────────────────────
  usernameInput() {
    return cy.get('[name="username"]');
  }

  passwordInput() {
    return cy.get('[name="password"]');
  }

  submitButton() {
    return cy.get('[type="submit"]');
  }

  errorMessage() {
    return cy.get(".oxd-input-field-error");
  }

  // ── Actions ────────────────────────────────────────────────
  visit(url) {
    cy.visit(url);
    return this;
  }

  typeUsername(username) {
    this.usernameInput().type(username);
    return this;
  }

  typePassword(password) {
    this.passwordInput().type(password);
    return this;
  }

  clickSubmit() {
    this.submitButton().click();
    return this;
  }

  /**
   * Shorthand: ketik username + password + submit
   */
  login(username, password) {
    if (username) this.typeUsername(username);
    if (password) this.typePassword(password);
    this.clickSubmit();
    return this;
  }

  // ── Assertions ─────────────────────────────────────────────
  verifyErrorVisible() {
    this.errorMessage().should("be.visible");
    return this;
  }
}

export default new LoginPage();
