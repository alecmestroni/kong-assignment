describe("Visit Home Page", () => {
  it("should visit the home page", () => {
    cy.visit("/");
    cy.contains(
      "No valid Kong Enterprise license configured: Enterprise features will be read-only. Configure a license or try Kong Konnect for the fastest way to get started with Kong Gateway. You can contact sales for any Enterprise license or upgrade questions.",
    ).should("be.visible");
  });
});
