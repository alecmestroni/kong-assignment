describe("Gateway Plugin Creation - Basic Form", () => {
  beforeEach(() => {
    cy.createServiceAndSaveId("serviceId")
    cy.createRouteAndSaveId("routeId")
    cy.then(() => {
      cy.visit(`/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES}/${Cypress.env("routeId")}`)
      cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_PLUGINS).click()
      cy.getDataTestId(Cypress.env("SELECTORS").EMPTY_STATE_ACTION).click()
    })
  })
  describe("Successful Plugin Association to a Route", () => {
    it("should associate Basic Auth plugin to route successfully", { jiraKey: "KONG-9158" }, () => {
      cy.getDataTestId(Cypress.env("SELECTORS").PLUGIN_BASIC_AUTH).click()
      cy.getDataTestId(Cypress.env("SELECTORS").PLUGIN_FORM_SUBMIT).click()
    })
  })
})
