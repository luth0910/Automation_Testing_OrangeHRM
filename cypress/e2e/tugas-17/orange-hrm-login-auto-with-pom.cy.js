import loginPage from "../../pages/LoginPages.js";
import dashboardPage from "../../pages/DashboardPage";
import { BASE_URL, VALID_USERNAME, VALID_PASSWORD } from "../../support/constant";

describe("OrangeHRM - Fitur Login (POM + Intercept)", () => {
  beforeEach(() => {
    loginPage.visit(BASE_URL);
  });
  // ── TC-001 | Login berhasil ────────────────────────────────
  it("TC-001 - Login dengan Email dan Password yang Valid", () => {
    cy.intercept("GET", "**/api/v2/dashboard/employees/action-summary").as("summaryProfile");
    loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    cy.wait("@summaryProfile", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    dashboardPage.verifyDashboardLoaded();
  });
  // ── TC-002 | Password salah ────────────────────────────────
  it("TC-002 - Login dengan Password yang Salah", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    loginPage.login(VALID_USERNAME, "admin123567");
    cy.wait("@loginRequest", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(302);
    });
  });
  // ── TC-003 | Username salah ────────────────────────────────
  it("TC-003 - Login dengan Username yang Salah", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    loginPage.login("Admin123", VALID_PASSWORD);
    cy.wait("@loginRequest", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(302);
    });
  });
  // ── TC-004 | Username kosong ───────────────────────────────
  it("TC-004 - Login dengan Username Kosong", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    loginPage.typePassword(VALID_PASSWORD);
    loginPage.clickSubmit();
    // Intercept tidak akan terpanggil karena form tidak submit
    // Verifikasi error required field
    cy.get(".oxd-input-group .oxd-text--span").should("be.visible").and("contain.text", "Required");
  });
  // ── TC-005 | Password kosong ───────────────────────────────
  it("TC-005 - Login dengan Password Kosong", () => {
    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginRequest");
    loginPage.typeUsername(VALID_USERNAME);
    loginPage.clickSubmit();
    cy.get(".oxd-input-group .oxd-text--span").should("be.visible").and("contain.text", "Required");
  });
});
