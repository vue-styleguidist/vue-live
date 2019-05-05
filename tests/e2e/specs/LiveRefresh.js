// https://docs.cypress.io/api/introduction/api.html

describe("Live Refresh", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get(".preview-code:first").as("container");

    cy.get("@container")
      .children("div:last-child")
      .as("preview");
  });

  it("changes the render after code change", () => {
    cy.get("@preview")
      .find(".vdp-datepicker input")
      .should("not.have.value", "");

    const codeToDelete = ' :value="today"/>';
    cy.get("@container")
      .find(".prism-editor-wrapper pre")
      .type(`${"{backspace}".repeat(codeToDelete.length)}/>`);

    cy.get("@preview")
      .find(".vdp-datepicker input")
      .should("have.value", "");
  });
});
