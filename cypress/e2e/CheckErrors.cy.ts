describe("Render Errors", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("does not render an error", () => {
    cy.contains("More examples").click();
    cy.get("[class*='Preview_error']").should("not.exist");
  });
});
