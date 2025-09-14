describe("Plugin Selection - Navigation Flow", () => {
  before("Create Service and Route", () => {
    cy.createServiceAdmin()
    cy.createRouteAdmin()
  })

  describe("Route Plugin Navigation", () => {
    it("should navigate to plugin selection page from route with correct route ID parameter", { jiraKey: "KONG-7842" }, () => {
      cy.navigateToPluginSelectionFromRoute(Cypress.env("routeId"))
      cy.verifyPluginSelectionPage({
        expectedSearch: `?routeId=${Cypress.env("routeId")}`,
      })
    })
  })

  describe("Plugin Page - Empty State Action", () => {
    it("should redirect to plugin selection page without parameters from empty state", { jiraKey: "KONG-5291" }, () => {
      cy.navigateToPluginSelection("empty-state")
      cy.verifyPluginSelectionPage({
        expectedSearch: "",
      })
    })
  })

  describe("Plugin Page - Add Plugin Action", () => {
    before(() => {
      cy.createPlugin()
    })

    it("should redirect to plugin selection page without parameters when adding new plugin", { jiraKey: "KONG-3674" }, () => {
      cy.navigateToPluginSelection("add-plugin")
      cy.verifyPluginSelectionPage({
        expectedSearch: "",
      })
    })
  })
})
