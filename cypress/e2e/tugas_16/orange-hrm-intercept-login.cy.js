const BASE_URL = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
const DASHBOARD_URL = "/web/index.php/dashboard/index";
const VALID_USERNAME = "Admin";
const VALID_PASSWORD = "admin123";

describe("OrangeHRM - Fitur Login (Intercept Lanjutan)", () => {
  ///----------- TC_001 | Login berhasil dengan intercept---------------
  it("TC-001-Login dengan Email dan Password yang Valid", () => {
    cy.visit(BASE_URL);
    cy.get('[name="username"]').type(VALID_USERNAME);
    cy.get('[name="password"]').type(VALID_PASSWORD);
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/action-summary").as("summaryPorofile");
    cy.get('[type="submit"]').click();
    cy.wait("@summaryPorofile", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.url({ timeout: 10000 }).should("include", DASHBOARD_URL);
    cy.get(".oxd-topbar-header-breadcrumb").should("contain.text", "Dashboard");
  });

  ///----------- TC_002 | Login dengan password yang salah  dengan intercept---------------
  it("TC-002-Login dengan Password yang Salah", () => {
    cy.visit(BASE_URL);
    cy.get('[name="username"]').type(VALID_USERNAME);
    cy.get('[name="password"]').type("admin123567");
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    cy.get('[type="submit"]').click();
    cy.wait("@loginRequest", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(302);
    });
  });

  it("TC-003-Login dengan Username yang Salah", () => {
    cy.visit(BASE_URL);
    cy.get('[name="username"]').type("Admin123");
    cy.get('[name="password"]').type(VALID_PASSWORD);
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    cy.get('[type="submit"]').click();
    cy.wait("@loginRequest", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(302);
    });
  });
  // ------TC-004 Login dengan Username kosong----------
  it("TC-004-Login dengan Username Kosong", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    cy.visit(BASE_URL);
    cy.get('[name="password"]').type(VALID_PASSWORD);
    cy.get('[type="submit"]').click();
    cy.get(".oxd-input-field-error").should("be.visible");
  });

  //------TC-005 Login dengan password kosong ---------
  it("TC-005 Login dengan password kosong", () => {
    cy.visit(BASE_URL);

    cy.get('[name="username"]').type(VALID_USERNAME);
    cy.get('[type="submit"]').click();

    cy.get(".oxd-input-field-error").should("be.visible");
  });
});
