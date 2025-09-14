/**
 * Kong Manager Route Commands
 */

Cypress.Commands.add("createRoute", (type = "default") => {
  cy.createRouteSimple().then(() => {
    cy.interceptSimple(`/${Cypress.env("routeId")}*`, "GET");
    cy.interceptSimple(`/${Cypress.env("routeId")}`, "GET");

    cy.waitSimple(`/${Cypress.env("routeId")}*`, 200).then((api) => {
      expect(
        api.response.body,
        `api should response with the body we expect`,
      ).to.deep.eq(Cypress.env("routeData"));
    });
    cy.waitSimple(`/${Cypress.env("routeId")}`, 200).then((api) => {
      expect(
        api.response.body,
        `api should response with the body we expect`,
      ).to.deep.eq(Cypress.env("routeData"));
    });

    cy.checkRouteDefaultProperties(type);
  });

  cy.checkTextFromCopy(Cypress.env("SELECTORS").UUID_COPY, "routeId");
});

Cypress.Commands.add("createRouteSimple", () => {
  const path = Cypress.env("PATHS").ROUTES;
  cy.interceptSimple(path, "POST", false);

  cy.clickDataTestIdAndWaitApi(
    Cypress.env("SELECTORS").ROUTE_FORM_SUBMIT,
    Cypress.env("PATHS").ROUTES,
    "POST",
    201,
    false,
  ).then((api) => {
    expect(
      api.response.body.name,
      `api should response with name: ${Cypress.env("routeName") || null}`,
    ).to.eq(Cypress.env("routeName") || null);
    const routeData = api.response.body;
    Cypress.env("routeData", routeData);
    expect(
      api.response.body.service?.id || null,
      `api should response with service: ${Cypress.env("serviceId") || null}`,
    ).to.eq(Cypress.env("serviceId") || null);

    const routeId = routeData.id;
    Cypress.env("routeId", routeId);
  });
});

Cypress.Commands.add("checkRouteDefaultProperties", (type) => {
  let fileName;
  switch (type) {
    case "default":
      fileName = "routeDefaultProp";
      cy.log("Check default properties for base case");
      break;
    case "full":
      fileName = "routeFullProp";
      cy.log("Check default properties for full case");
      break;
    case "advanced":
      fileName = "routeAdvancedProp";
      cy.log("Check default properties for advanced case");
      break;
    default:
      throw new Error(`type: ${type} is not supported`);
  }
  cy.fixture(fileName).then((defaultProps) => {
    const routeData = Cypress.env("routeData");

    Object.keys(defaultProps).forEach((key) => {
      expect(
        routeData,
        `Route should contain property "${key}"`,
      ).to.have.property(key);
      expect(
        routeData[key],
        `Property "${key}" should have value ${JSON.stringify(defaultProps[key])}`,
      ).to.deep.eq(defaultProps[key]);
    });
  });
});

Cypress.Commands.add("compileBasicRouteForm", (type = "default") => {
  if (type === "full") {
    Cypress.env("routeName", `new-routes-${Date.now()}`);

    cy.fixture("routeFullProp").then((routeData) => {
      cy.getDataTestId(Cypress.env("SELECTORS").SELECT_WRAPPER).click();
      cy.getDataTestId(
        `${Cypress.env("SELECTORS").SELECT_ITEM_PREFIX}${Cypress.env("serviceId")}`,
      ).click();
      cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_NAME).type(
        Cypress.env("routeName"),
      );
      cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_TAGS).type(
        routeData.tags.join(","),
      );
      cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_HOST).type(
        routeData.hosts[0],
      );
      cy.getDataTestId(Cypress.env("SELECTORS").MULTISELECT_TRIGGER).click();
      cy.wrap(routeData.methods).each((method) => {
        cy.getDataTestId(
          `${Cypress.env("SELECTORS").MULTISELECT_ITEM_PREFIX}${method}`,
          false,
        ).click();
      });
    });
  } else if (type === "advanced") {
  }
  cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_PATH).type(
    Cypress.env("ROUTE_PATH"),
  );
});

Cypress.Commands.add("checkRouteCreated", () => {
  const path = Cypress.env("PATHS").ROUTES;

  cy.interceptSimple(`${path}*`, "GET", false);

  cy.visit(
    `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES}`,
  ).then(() => {
    cy.waitSimple(`${path}*`, 200).then((api) => {
      const foundRoute = api.response.body.data.find(
        (route) =>
          route.name === Cypress.env("routeName") &&
          route.id === Cypress.env("routeId"),
      );

      expect(
        foundRoute,
        `Route with name "${Cypress.env("routeName")}" and id "${Cypress.env("routeId")}" should exist in the response`,
      ).to.exist;
    });
    // If routeName is null, the frontend displays a dash (-)
    const displayName = Cypress.env("routeName") || "-";
    cy.contains(displayName).should("be.visible");
  });
});
