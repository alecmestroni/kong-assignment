describe("Gateway Service Creation - URL Form", () => {
  beforeEach(() => {
    cy.visitHomePage();
    cy.openWorkspaceOverview();
    cy.getDataTestId(Cypress.env("SELECTORS").ACTION_BUTTON).click();
    cy.getDataTestId(Cypress.env("SELECTORS").URL_RADIO).click();
  });

  describe("Form State and Validation", () => {
    it("should keep submit button disabled when no URL is provided", () => {
      cy.getDataTestIdDisabled(Cypress.env("SELECTORS").SUBMIT_FORM);
    });

    it("should show browser validation error when URL field is empty", () => {
      cy.removeAttrFromDataTestId(
        Cypress.env("SELECTORS").SUBMIT_FORM,
        "disabled",
      );

      cy.interceptSimple("/validate", "POST", true);

      cy.getDataTestId(Cypress.env("SELECTORS").SUBMIT_FORM).click();

      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_URL_INPUT)
        .invoke("prop", "validity")
        .its("valueMissing")
        .should("be.true");
      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_URL_INPUT)
        .invoke("prop", "validationMessage")
        .should("eq", "Please fill out this field.");

      cy.checkNoRequest("/validate");
    });

    it("should not send validation request when required attribute is removed", () => {
      cy.removeAttrFromDataTestId(
        Cypress.env("SELECTORS").SUBMIT_FORM,
        "disabled",
      );
      cy.removeAttrFromDataTestId(
        Cypress.env("SELECTORS").SERVICE_URL_INPUT,
        "required",
      );

      cy.interceptSimple("/validate", "POST", true);

      cy.getDataTestId(Cypress.env("SELECTORS").SUBMIT_FORM).click();

      cy.checkNoRequest("/validate");
    });
  });

  describe("Server-side Validation", () => {
    it("should show server error when URL property is missing from request", () => {
      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_URL_INPUT).type(
        Cypress.env("SERVICE_URL"),
      );

      cy.createServiceWithoutProp("url");

      cy.getDataTestId(Cypress.env("SELECTORS").FORM_ERROR).should(
        "contain.text",
        "host: required field missing",
      );
    });
  });

  describe("Successful Service Creation", () => {
    it("should create Gateway Service successfully with valid URL", () => {
      cy.getDataTestIdDisabled(Cypress.env("SELECTORS").SUBMIT_FORM);

      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_URL_INPUT).type(
        Cypress.env("SERVICE_URL"),
      );

      cy.saveTextFromInput(
        Cypress.env("SELECTORS").SERVICE_NAME_INPUT,
        "serviceName",
      );

      cy.createService();

      cy.checkTextFromCopy(Cypress.env("SELECTORS").ID_COPY, "serviceId");

      cy.checkServiceCreated();
    });
  });
});
