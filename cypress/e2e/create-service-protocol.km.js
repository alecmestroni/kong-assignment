describe("Gateway Service Creation - Protocol Form", () => {
  beforeEach(() => {
    cy.visitHomePage();
    cy.openWorkspaceOverview();
    cy.getDataTestId(Cypress.env("SELECTORS").ACTION_BUTTON).click();
    cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_PROTOCOL_LABEL).click();
  });

  describe("Form State and Validation", () => {
    it("should keep submit button disabled when required fields are missing", () => {
      cy.getDataTestIdDisabled(Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT);
    });

    it("should show browser validation error when host field is empty", () => {
      cy.removeAttrFromDataTestId(
        Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT,
        "disabled",
      );

      cy.interceptSimple("/validate", "POST", true);

      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT).click();

      // Verify browser validation kicks in
      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_INPUT_HOST)
        .invoke("prop", "validity")
        .its("valueMissing")
        .should("be.true");
      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_INPUT_HOST)
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
        Cypress.env("SELECTORS").SERVICE_FORM_INPUT_HOST,
        "required",
      );

      cy.interceptSimple("/validate", "POST", true);

      cy.getDataTestId(Cypress.env("SELECTORS").SERVICE_FORM_SUBMIT).click();

      cy.checkNoRequest("/validate");
    });
  });

  describe("Server-side Validation", () => {
    it("should show server error when required property is missing from request", () => {
      cy.compileProtocolForm();

      cy.createServiceWithoutProp("host");

      cy.getDataTestId(Cypress.env("SELECTORS").FORM_ERROR).should(
        "contain.text",
        "host: required field missing",
      );
    });
  });

  describe("Successful Service Creation", () => {
    it("should create Gateway Service successfully with protocol form", () => {
      cy.compileProtocolForm();

      cy.createService();

      cy.checkServiceCreated();
    });
  });
});
