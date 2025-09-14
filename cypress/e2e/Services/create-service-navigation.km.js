describe("Gateway Service Creation - Navigation Flow", () => {
  describe("Workspace Overview - Action Button", () => {
    it("should redirect to service creation form with service selector visible and CTA parameter", { jiraKey: "KONG-8472" }, () => {
      cy.visitHomePage()
      cy.openWorkspaceOverview()
      cy.getDataTestId(Cypress.env("SELECTORS").ACTION_BUTTON).click()
      cy.location("pathname").should("eq", `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES_CREATION}`)
      cy.location("search").should("eq", `?cta=new-user`)
      cy.contains(Cypress.env("LABELS").SERVICE_CREATION).should("exist")
    })
  })
  describe("Gateway Services Page - Empty State Action", () => {
    it("should redirect to service creation form with service selector visible", { jiraKey: "KONG-5936" }, () => {
      cy.visit(`/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES}`)
      cy.getDataTestId(Cypress.env("SELECTORS").EMPTY_STATE_ACTION).click()
      cy.location("pathname").should("eq", `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES_CREATION}`)
      cy.location("search").should("eq", "")
      cy.contains(Cypress.env("LABELS").SERVICE_CREATION).should("exist")
    })
  })
  describe("Gateway Services Page - Add Service Action", () => {
    before(() => {
      cy.createItem("services", { url: Cypress.env("SERVICE_URL"), name: `new-service-${Date.now()}` }, { name: "serviceId", property: "id" })
    })
    it("should redirect to service creation form with service selector visible", { jiraKey: "KONG-2147" }, () => {
      cy.visit(`/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES}`)
      cy.getDataTestId(Cypress.env("SELECTORS").ADD_SERVICE).click()
      cy.location("pathname").should("eq", `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES_CREATION}`)
      cy.location("search").should("eq", "")
      cy.contains(Cypress.env("LABELS").SERVICE_CREATION).should("exist")
    })
  })
})
