describe("Gateway Service Creation - URL Form", () => {
  beforeEach(() => {
    cy.visitHomePage();
    cy.openWorkspaceOverview();
    cy.getDataTestId(Cypress.env("SELECTORS").ACTION_BUTTON).click();
    cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_URL_LABEL).click();
  });

  describe("Form State and Validation", () => {
    it("should keep submit button disabled when no URL is provided", () => {
      cy.getDataTestIdDisabled(Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT);
    });

    it("should show browser validation error when URL field is empty", () => {
      cy.removeAttrFromDataTestId(
        Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT,
        "disabled",
      );

      cy.interceptSimple("/validate", "POST", true);

      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT).click();

      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_INPUT_URL)
        .invoke("prop", "validity")
        .its("valueMissing")
        .should("be.true");
      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_INPUT_URL)
        .invoke("prop", "validationMessage")
        .should("eq", "Please fill out this field.");

      cy.checkNoRequest("/validate");
    });

    it("should not send validation request when required attribute is removed", () => {
      cy.removeAttrFromDataTestId(
        Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT,
        "disabled",
      );
      cy.removeAttrFromDataTestId(
        Cypress.env("SELECTORS").SERVICE_FORM_INPUT_URL,
        "required",
      );

      cy.interceptSimple("/validate", "POST", true);

      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT).click();

      cy.checkNoRequest("/validate");
    });
  });

  describe("Server-side Validation", () => {
    it("should show server error when URL property is missing from request", () => {
      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_INPUT_URL).type(
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
      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_INPUT_URL).type(
        Cypress.env("SERVICE_URL"),
      );

      cy.createService();

      cy.checkServiceCreated();
    });
  });
});
