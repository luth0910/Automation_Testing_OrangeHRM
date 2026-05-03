const BASE_URL = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
const DASHBOARD_URL = "/web/index.php/dashboard/index";
const VALID_USERNAME = "Admin";
const VALID_PASSWORD = "admin123";

describe("OrangeHRM - Fitur Login", () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
    cy.get(".orangehrm-login-form", { timeout: 10000 }).should("be.visible");
  });

  it("TC_001 | Login berhasil dengan username dan password yang valid", () => {
    cy.get('input[name="username"]').clear().type(VALID_USERNAME);
    cy.get('input[name="password"]').clear().type(VALID_PASSWORD);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should("include", DASHBOARD_URL);
    cy.get(".oxd-topbar-header-breadcrumb").should("contain.text", "Dashboard");
  });

  it("TC_002 | Login gagal dengan password yang salah", () => {
    cy.get('input[name="username"]').clear().type(VALID_USERNAME);
    cy.get('input[name="password"]').clear().type("admin123567");
    cy.get('button[type="submit"]').click();

    cy.get(".oxd-alert-content-text").should("be.visible").and("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });

  it("TC_003 | Login gagal dengan username yang salah", () => {
    cy.get('input[name="username"]').clear().type("AdminSalah");
    cy.get('input[name="password"]').clear().type(VALID_PASSWORD);
    cy.get('button[type="submit"]').click();

    cy.get(".oxd-alert-content-text").should("be.visible").and("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });

  it("TC_004 | Login gagal saat username dan password dikosongkan", () => {
    cy.get('button[type="submit"]').click();

    cy.get(".oxd-input-field-error-message")
      .should("have.length.at.least", 2)
      .each(($el) => {
        cy.wrap($el).should("contain.text", "Required");
      });
    cy.url().should("include", "/auth/login");
  });

  it("TC_005 | Login gagal saat username dikosongkan", () => {
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').clear().type(VALID_PASSWORD);
    cy.get('button[type="submit"]').click();

    cy.get(".oxd-input-field-error-message").first().should("be.visible").and("contain.text", "Required");
    cy.url().should("include", "/auth/login");
  });

  it("TC_006 | Login gagal saat password dikosongkan", () => {
    cy.get('input[name="username"]').clear().type(VALID_USERNAME);
    cy.get('input[name="password"]').clear();
    cy.get('button[type="submit"]').click();

    cy.get(".oxd-input-field-error-message").first().should("be.visible").and("contain.text", "Required");
    cy.url().should("include", "/auth/login");
  });

  it("TC_007 | Halaman login menampilkan semua elemen UI dengan benar", () => {
    cy.get(".orangehrm-login-branding img").should("be.visible");
    cy.get('input[name="username"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible").and("contain.text", "Login");
    cy.get(".orangehrm-login-forgot p").should("contain.text", "Forgot your password?");
  });

  it("TC_008 | Login gagal dengan username berupa spasi saja", () => {
    cy.get('input[name="username"]').clear().type("   ");
    cy.get('input[name="password"]').clear().type(VALID_PASSWORD);
    cy.get('button[type="submit"]').click();

    cy.get(".oxd-alert-content-text, .oxd-input-field-error-message").first().should("be.visible");
    cy.url().should("include", "/auth/login");
  });

  it("TC_009 | Tombol login dapat diklik setelah username dan password diisi", () => {
    cy.get('input[name="username"]').clear().type(VALID_USERNAME);
    cy.get('input[name="password"]').clear().type(VALID_PASSWORD);
    cy.get('button[type="submit"]').should("not.be.disabled").click();

    cy.url({ timeout: 10000 }).should("include", DASHBOARD_URL);
  });
});
