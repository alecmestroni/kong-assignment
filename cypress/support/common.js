/**
 * Kong Manager Common Commands
 */

Cypress.Commands.add("visitHomePage", () => {
  cy.visit("/");
  cy.url().should("include", Cypress.env("PATHS").HOMEPAGE);
  cy.contains(Cypress.env("ERRORS").MISSING_LICENSE, { timeout: 30000 }).should(
    "be.visible",
  );
});

Cypress.Commands.add("openWorkspaceOverview", () => {
  cy.getDataTestId(
    `${Cypress.env("SELECTORS").WORKSPACE_LINK_PREFIX}${Cypress.env("WORKSPACE_NAME")}`,
  ).click();
  cy.url().should(
    "include",
    `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").OVERVIEW}`,
  );
  cy.checkDataTestIdFromArray(Cypress.env("SELECTORS").OVERVIEW_CARDS);
});

Cypress.Commands.add("getDataTestId", (dataTestId, shouldScroll = true) => {
  cy.get(`[data-testid="${dataTestId}"]`, { timeout: 45000 }).as(dataTestId);
  if (shouldScroll) {
    cy.get(`@${dataTestId}`)
      .scrollIntoView()
      .should("be.visible")
      .should("not.be.disabled");
  } else {
    cy.get(`@${dataTestId}`).should("be.visible").should("not.be.disabled");
  }
});

Cypress.Commands.add("getDataTestIdDisabled", (dataTestId) => {
  cy.get(`[data-testid="${dataTestId}"]`, { timeout: 45000 })
    .scrollIntoView()
    .should("be.visible")
    .should("be.disabled");
});

Cypress.Commands.add("removeAttrFromDataTestId", (dataTestId, attr) => {
  cy.get(`[data-testid="${dataTestId}"]`, { timeout: 45000 })
    .scrollIntoView()
    .should("be.visible")
    .invoke("removeAttr", attr)
    .should("not.have.attr", attr);
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

Cypress.Commands.add("checkTextFromCopy", (dataTestId, envVarName) => {
  cy.getDataTestId(dataTestId)
    .find(Cypress.env("SELECTORS").COPY_TEXT)
    .invoke("text")
    .then((text) => {
      expect(
        text,
        `Text: ${text} should match ${envVarName}: ${Cypress.env(envVarName)}`,
      ).to.eq(Cypress.env(envVarName));
    });
});

Cypress.Commands.add(
  "interceptSimple",
  (path, method = "POST", isNested = true) => {
    if (!path) throw new Error("path is required");
    const level = isNested ? "/**" : "/*";
    cy.intercept({
      method: method,
      url: `${Cypress.env("KONG_ADMIN_URL")}${level}${path}`,
      times: 1,
    }).as(path);
  },
);

Cypress.Commands.add(
  "interceptAndRemoveProp",
  (path, propToRemove, method = "POST", isNested = true) => {
    if (!path) throw new Error("path is required");
    if (!propToRemove) throw new Error("propToRemove is required");

    const level = isNested ? "/**" : "/*";

    cy.intercept(
      {
        method: method,
        url: `${Cypress.env("KONG_ADMIN_URL")}${level}${path}`,
        times: 1,
      },
      (req) => {
        if (
          req.body &&
          typeof req.body === "object" &&
          propToRemove in req.body
        ) {
          delete req.body[propToRemove];
        }
        req.continue();
      },
    ).as(`${path}-${propToRemove}`);
  },
);

Cypress.Commands.add("waitSimple", (name, statusCode = 200) => {
  cy.wait(`@${name}`, { timeout: 30000 }).then((api) => {
    cy.on("fail", (err) => {
      err.message += `\n\nLastInterceptedResponseBody:</strong>\n${JSON.stringify(api.response?.body, null, 1)}\n`;
      throw err;
    });
    expect(
      api.response.statusCode,
      `api should response with status: ${statusCode}`,
    ).to.eq(statusCode);
    return api;
  });
});

Cypress.Commands.add(
  "clickDataTestIdAndWaitApi",
  (dataTestId, path, method = "POST", statusCode = 200, isNested = true) => {
    cy.interceptSimple(path, method, isNested);
    cy.getDataTestId(dataTestId).click();
    return cy.waitSimple(path, statusCode);
  },
);
