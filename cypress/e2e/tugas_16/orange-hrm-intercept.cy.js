const BASE_URL = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
const DASHBOARD_URL = "/web/index.php/dashboard/index";
const VALID_USERNAME = "Admin";
const VALID_PASSWORD = "admin123";

describe("OrangeHRM - Fitur Login (Intercept Dasar)", () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
    cy.get(".orangehrm-login-form", { timeout: 10000 }).should("be.visible");
  });
  // TC_001 | Login berhasil
  it("TC_001 | Login berhasil — cek status code 200 atau 302", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    cy.get('input[name="username"]').clear().type(VALID_USERNAME);
    cy.get('input[name="password"]').clear().type(VALID_PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 302]);
    });
    cy.url({ timeout: 10000 }).should("include", DASHBOARD_URL);
    cy.get(".oxd-topbar-header-breadcrumb").should("contain.text", "Dashboard");
  });
  it("TC_002 | Login gagal — password salah", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    cy.get('input[name="username"]').clear().type(VALID_USERNAME);
    cy.get('input[name="password"]').clear().type("admin12234");
    cy.get('button[type="submit"]').click();
    cy.wait("@loginRequest");
    cy.get(".oxd-alert-content-text").should("be.visible").and("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });
  // TC_003 | Login gagal — username salah
  it("TC_003 | Login gagal — username salah", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    cy.get('input[name="username"]').clear().type("UserTidakAda");
    cy.get('input[name="password"]').clear().type(VALID_PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.wait("@loginRequest");
    cy.get(".oxd-alert-content-text").should("be.visible").and("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });
  // TC_004 | mencoba kalau bisa server error 401
  it("TC_004 | mencoba kalau bisa server 401 — stub response dari intercept", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate", {
      statusCode: 401,
      body: { error: "Unauthorized" },
    }).as("stubUnauthorized");
    cy.get('input[name="username"]').clear().type(VALID_USERNAME);
    cy.get('input[name="password"]').clear().type(VALID_PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.wait("@stubUnauthorized").then((interception) => {
      expect(interception.response.statusCode).to.eq(401);
    });
  });
  // TC_005 | Field kosong — form tidak boleh dikirim
  it("TC_005 | Field kosong — form tidak dikirim ke server", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    cy.get('button[type="submit"]').click();
    cy.get(".oxd-input-field-error-message")
      .should("have.length.at.least", 2)
      .each(($el) => {
        cy.wrap($el).should("contain.text", "Required");
      });
    cy.url().should("include", "/auth/login");
  });
});
