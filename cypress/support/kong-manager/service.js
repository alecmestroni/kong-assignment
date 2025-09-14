/**
 * Kong Manager Service Commands
 */

Cypress.Commands.add("checkServiceCreated", () => {
  const path = Cypress.env("PATHS").SERVICES;

  cy.interceptSimple(`${path}*`, "GET", false);

  cy.visit(
    `/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").SERVICES}`,
  ).then(() => {
    cy.waitSimple(`${path}*`, 200).then((api) => {
      const foundService = api.response.body.data.find(
        (service) =>
          service.name === Cypress.env("serviceName") &&
          service.id === Cypress.env("serviceId"),
      );

      expect(
        foundService,
        `Service with name "${Cypress.env("serviceName")}" and id "${Cypress.env("serviceId")}" should exist in the response`,
      ).to.exist;
    });
    cy.contains(Cypress.env("serviceName")).should("be.visible");
  });
});

Cypress.Commands.add("createService", () => {
  const path = Cypress.env("PATHS").SERVICES;

  cy.interceptSimple(path, "POST", false);

  cy.clickDataTestIdAndWaitApi(
    Cypress.env("SELECTORS").SUBMIT_FORM,
    "/validate",
  ).then((api) => {
    expect(
      api.response.body.message,
      `api should response with message: schema validation successful`,
    ).to.eq("schema validation successful");
  });

  cy.waitSimple(path, 201).then((api) => {
    expect(
      api.response.body.name,
      `api should response with name: ${Cypress.env("serviceName")}`,
    ).to.eq(Cypress.env("serviceName"));
    const serviceData = api.response.body;
    Cypress.env("serviceData", serviceData);

    const serviceId = serviceData.id;
    Cypress.env("serviceId", serviceId);

    cy.interceptSimple(`/${serviceId}*`, "GET");
    cy.interceptSimple(`/${serviceId}`, "GET");

    cy.waitSimple(`/${serviceId}*`, 200).then((api) => {
      expect(
        api.response.body,
        `api should response with the body we expect`,
      ).to.deep.eq(Cypress.env("serviceData"));
    });
    cy.waitSimple(`/${serviceId}`, 200).then((api) => {
      expect(
        api.response.body,
        `api should response with the body we expect`,
      ).to.deep.eq(Cypress.env("serviceData"));
    });

    cy.checkServiceDefaultProperties();
  });
});

Cypress.Commands.add("createServiceWithoutProp", (prop) => {
  cy.interceptAndRemoveProp("/validate", prop, "POST", true);
  cy.getDataTestId(Cypress.env("SELECTORS").SUBMIT_FORM).click();
  cy.waitSimple("/validate-" + prop, 400).then((api) => {
    expect(
      api.response.body.code,
      `api should response with the body we expect`,
    ).to.eq(2);
    expect(
      api.response.body.message,
      `api should response with the body we expect`,
    ).to.eq(`schema violation (host: required field missing)`);
    expect(
      api.response.body.fields,
      `api should response with the body we expect`,
    ).to.deep.eq({
      host: "required field missing",
    });
    expect(
      api.response.body.name,
      `api should response with the body we expect`,
    ).to.eq("schema violation");
  });
});

Cypress.Commands.add("checkServiceDefaultProperties", () => {
  cy.fixture("serviceDefaultProp").then((defaultProps) => {
    const serviceData = Cypress.env("serviceData");

    Object.keys(defaultProps).forEach((key) => {
      expect(
        serviceData,
        `Service should contain property "${key}"`,
      ).to.have.property(key);
      expect(
        serviceData[key],
        `Property "${key}" should have value ${JSON.stringify(defaultProps[key])}`,
      ).to.deep.eq(defaultProps[key]);
    });
  });
});

Cypress.Commands.add("compileProtocolForm", () => {
  const serviceUrl = new URL(Cypress.env("SERVICE_URL"));
  cy.getDataTestId(Cypress.env("SELECTORS").SELECT_WRAPPER).click();
  cy.getDataTestId(
    `${Cypress.env("SELECTORS").SELECT_ITEM_PREFIX}${serviceUrl.protocol.replace(":", "")}`,
  ).click();
  cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_HOST_INPUT).type(
    serviceUrl.host,
  );
  cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_PATH_INPUT).type(
    serviceUrl.pathname,
  );
});

Cypress.Commands.add("checkNoRequest", (path) => {
  // Verify no validation request was sent to server
  cy.wait(2000);
  cy.get(`@${path}.all`).should("have.length", 0);
});
