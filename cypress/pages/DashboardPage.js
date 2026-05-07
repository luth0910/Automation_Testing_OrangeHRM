import { DASHBOARD_URL } from "../support/constant";

class DashboardPage {
  // ── Selectors
  breadcrumb() {
    return cy.get(".oxd-topbar-header-breadcrumb");
  }
  // ── Assertions
  verifyUrl() {
    cy.url({ timeout: 10000 }).should("include", DASHBOARD_URL);
    return this;
  }
  verifyDashboardLoaded() {
    this.verifyUrl();
    this.breadcrumb().should("contain.text", "Dashboard");
    return this;
  }
}

export default new DashboardPage();
