/**
 * Kong Manager Service Commands
 */

Cypress.Commands.add("checkServiceCreated", () => {
  cy.visit(
    `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES}`,
  ).then(() => {
    cy.contains(Cypress.env("serviceName")).should("be.visible");
  });
});
