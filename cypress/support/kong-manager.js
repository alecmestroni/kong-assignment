/**
 * Kong Manager Support File
 */

import "cypress-xray-junit-reporter/support"
import "./kong-manager/route"
import "./kong-manager/service"
import "./kong-manager/admin"
import "./kong-manager/plugin"
import "./common"

before("clean environment", () => {
  cy.cleanEnvironment()
})

after("clean environment", () => {
  cy.cleanEnvironment()
})

Cypress.on("uncaught:exception", () => {
  return false
})
