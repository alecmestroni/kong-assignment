/**
 * Kong Manager Admin Commands
 */

Cypress.Commands.add("navigateToPluginSelectionFromRoute", (routeId) => {
  cy.visit(`/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES}/${routeId}`)
  cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_PLUGINS).click()
  cy.getDataTestId(Cypress.env("SELECTORS").EMPTY_STATE_ACTION).click()
})

Cypress.Commands.add("navigateToPluginSelection", (action = "empty-state") => {
  cy.visit(`/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").PLUGINS}`)

  if (action === "add-plugin") {
    cy.getDataTestId(Cypress.env("SELECTORS").ADD_PLUGIN).click()
  } else {
    cy.getDataTestId(Cypress.env("SELECTORS").EMPTY_STATE_ACTION).click()
  }
})

Cypress.Commands.add("verifyPluginSelectionPage", ({ expectedSearch = "", shouldHaveBasicAuth = true } = {}) => {
  cy.location("pathname").should("eq", `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").PLUGINS_SELECTION}`)
  cy.location("search").should("eq", expectedSearch)

  if (shouldHaveBasicAuth) {
    cy.getDataTestId(Cypress.env("SELECTORS").PLUGIN_BASIC_AUTH).should("exist")
  }
})
