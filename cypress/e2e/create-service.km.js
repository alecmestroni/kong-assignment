describe("Visit Home Page", () => {
  before("clean environment", () => {
    cy.cleanEnvironment();
  });

  beforeEach("should visit the home page", () => {
    cy.visitHomePage();
    cy.openWorkspaceOverview();
  });

  it(`should create Gateway Service in workspace: ${Cypress.env("WORKSPACE_NAME")} type FULL_URL`, () => {
    cy.getDataTestId("action-button").click();

    cy.getDataTestId("gateway-service-url-input").type(
      "https://api.kong-air.com/flights",
    );

    cy.saveTextFromInput("gateway-service-name-input", "serviceName");

    cy.getDataTestId("service-create-form-submit").click();

    cy.saveTextFromCopy("id-copy-uuid", "serviceId");

    cy.checkServiceCreated();
  });

  it(`should create Gateway Service in workspace: ${Cypress.env("WORKSPACE_NAME")} type PATH`, () => {
    cy.getDataTestId("sidebar-item-gateway-services").click();
    cy.getDataTestId("toolbar-add-gateway-service").click();
    cy.getDataTestId("gateway-service-protocol-radio-label").click();

    cy.getDataTestId("gateway-service-host-input").type("api.kong-air.com");
    cy.getDataTestId("gateway-service-path-input").type("/flights");

    cy.saveTextFromInput("gateway-service-name-input", "serviceName");

    cy.getDataTestId("service-create-form-submit").click();

    cy.saveTextFromCopy("id-copy-uuid", "serviceId");

    cy.checkServiceCreated();
  });
});
