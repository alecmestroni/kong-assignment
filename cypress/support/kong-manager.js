/**
 * Kong Manager Common Commands
 */

import "./kong-manager/route";
import "./kong-manager/service";
import "./kong-manager/admin";

Cypress.Commands.add("visitHomePage", () => {
  cy.visit("/");
  cy.url().should("include", Cypress.env("PATHS").HOMEPAGE);
  cy.contains(Cypress.env("ERRORS").MISSING_LICENSE).should("be.visible");
});

Cypress.Commands.add("openWorkspaceOverview", () => {
  cy.getDataTestId(`workspace-link-${Cypress.env("WORKSPACE_NAME")}`).click();
  cy.url().should(
    "include",
    `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").OVERVIEW}`,
  );
  cy.checkDataTestIdFromArray(["Services", "Routes", "Consumers", "Plugins"]);
});

Cypress.Commands.add("getDataTestId", (dataTestId) => {
  return cy
    .get(`[data-testid="${dataTestId}"]`, { timeout: 45000 })
    .should("be.visible")
    .should("not.be.disabled");
});

Cypress.Commands.add("checkDataTestIdFromArray", (array) => {
  array.forEach((item) => {
    cy.getDataTestId(item);
  });
});

Cypress.Commands.add("saveTextFromInput", (dataTestId, envVarName) => {
  cy.getDataTestId(dataTestId)
    .invoke("val")
    .then((text) => {
      Cypress.env(envVarName, text);
      cy.log(
        `${envVarName.toUpperCase()} saved to env: ${Cypress.env(envVarName)}`,
      );
    });
});

Cypress.Commands.add("saveTextFromCopy", (dataTestId, envVarName) => {
  cy.getDataTestId(dataTestId)
    .find(".copy-text")
    .invoke("text")
    .then((text) => {
      Cypress.env(envVarName, text.trim());
      cy.log(
        `${envVarName.toUpperCase()} saved to env: ${Cypress.env(envVarName)}`,
      );
    });
});
