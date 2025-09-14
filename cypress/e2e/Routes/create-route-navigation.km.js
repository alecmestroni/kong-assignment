describe("Gateway Route Creation - Navigation Flow", () => {
  before("Create Service and save ID", () => {
    cy.createItem(
      "services",
      { url: Cypress.env("SERVICE_URL"), name: `new-service-${Date.now()}` },
      { name: "serviceId", property: "id" },
    );
  });
  describe("Gateway Service Page - Alert Button", () => {
    it("should redirect to route creation form with pre-selected service and redirect URL", () => {
      cy.visit(
        `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES}/${Cypress.env("serviceId")}`,
      );
      cy.get(Cypress.env("SELECTORS").ALERT_BUTTON).click();
      cy.location("pathname", { timeout: 30000 }).should(
        "eq",
        `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES_CREATION}`,
      );
      cy.location("search", { timeout: 30000 }).should(
        "eq",
        `?serviceId=${Cypress.env("serviceId")}&redirect=/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES}/${Cypress.env("serviceId")}${Cypress.env("PATHS").ROUTES}`,
      );
      cy.get(Cypress.env("SELECTORS").SERVICE_SELECT_INPUT).should("not.exist");
      cy.contains(Cypress.env("LABELS").ROUTE_CREATION).should("exist");
    });
  });
  describe("Workspace Overview - Action Button", () => {
    it("should redirect to route creation form with service selector visible and CTA parameter", () => {
      cy.visitHomePage();
      cy.openWorkspaceOverview();
      cy.getDataTestId(Cypress.env("SELECTORS").ACTION_BUTTON).click();
      cy.location("pathname", { timeout: 30000 }).should(
        "eq",
        `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES_CREATION}`,
      );
      cy.location("search", { timeout: 30000 }).should("eq", `?cta=new-user`);
      cy.get(Cypress.env("SELECTORS").SERVICE_SELECT_INPUT).should("exist");
      cy.contains(Cypress.env("LABELS").ROUTE_CREATION).should("exist");
    });
  });
  describe("Routes Page - Empty State Action", () => {
    it("should redirect to route creation form with service selector visible", () => {
      cy.visit(
        `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES}`,
      );
      cy.getDataTestId(Cypress.env("SELECTORS").EMPTY_STATE_ACTION).click();
      cy.location("pathname", { timeout: 30000 }).should(
        "eq",
        `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES_CREATION}`,
      );
      cy.location("search", { timeout: 30000 }).should("eq", "");
      cy.get(Cypress.env("SELECTORS").SERVICE_SELECT_INPUT).should("exist");
      cy.contains(Cypress.env("LABELS").ROUTE_CREATION).should("exist");
    });
  });
  describe("Routes Page - Add Route Action", () => {
    before(() => {
      cy.createItem("routes", {
        paths: ["/mock"],
        name: `new-route-${Date.now()}`,
      });
    });
    it("should redirect to route creation form with service selector visible", () => {
      cy.visit(
        `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES}`,
      );
      cy.getDataTestId(Cypress.env("SELECTORS").ADD_ROUTE).click();
      cy.location("pathname", { timeout: 30000 }).should(
        "eq",
        `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES_CREATION}`,
      );
      cy.location("search", { timeout: 30000 }).should("eq", "");
      cy.get(Cypress.env("SELECTORS").SERVICE_SELECT_INPUT).should("exist");
      cy.contains(Cypress.env("LABELS").ROUTE_CREATION).should("exist");
    });
  });
});
