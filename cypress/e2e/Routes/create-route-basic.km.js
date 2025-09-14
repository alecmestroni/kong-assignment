describe("Gateway Route Creation - Basic Form", () => {
  beforeEach(() => {
    cy.visit(`/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES_CREATION}`)
  })
  describe("Form State and Validation", () => {
    it("should keep submit button disabled when required fields are missing", { jiraKey: "KONG-9127" }, () => {
      cy.getDataTestIdDisabled(Cypress.env("SELECTORS").ROUTE_FORM_SUBMIT)
    })
  })

  describe("Successful Route Creation with only Path", () => {
    before("Clean Environment to create Route without Service Id", () => {
      cy.cleanEnvironment()
    })

    it("should create Route successfully with path", { jiraKey: "KONG-4652" }, () => {
      cy.compileBasicRouteForm()

      cy.createRoute()

      cy.checkRouteCreated()
    })
  })
  describe("Successful Route Creation with full information", () => {
    before("Create Service and save ID", () => {
      cy.createItem("services", { url: Cypress.env("SERVICE_URL"), name: `new-service-${Date.now()}` }, { name: "serviceId", property: "id" })
    })

    it("should create Route successfully with associated service", { jiraKey: "KONG-8316" }, () => {
      cy.compileBasicRouteForm("full")

      cy.createRoute("full")

      cy.checkRouteCreated()
    })
  })
  describe("Successful Route Creation with advanced information", () => {
    before("Create Service and save ID", () => {
      cy.createItem("services", { url: Cypress.env("SERVICE_URL"), name: `new-service-${Date.now()}` }, { name: "serviceId", property: "id" })
    })

    it("should create Route successfully with advanced configuration and associated service", { jiraKey: "KONG-8399" }, () => {
      cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_ADVANCED_LABEL).click()
      cy.compileBasicRouteForm("advanced")

      cy.createRoute("advanced")

      cy.checkRouteCreated()
    })
  })
})
