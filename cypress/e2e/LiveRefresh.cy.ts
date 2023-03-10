// https://docs.cypress.io/api/introduction/api.html

describe("Live Refresh", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get(".preview-code:first").as("container");

    cy.get("@container").children("div:last-child").as("preview");
  });

  it("changes the render after code change", () => {
    const textToReplace = "inline component";
    const textReplaced = "red component";

    cy.get("@preview")
      .get("[data-cy=my-button]")
      .should("have.text", textToReplace);

    cy.get("@container")
      .find(".prism-editor-wrapper textarea").as("editor");
    
		cy.get("@editor").invoke("val")
      .then((val) => {
        cy.get("@editor")
          .clear()
          .invoke('val', `${val}`.replace(textToReplace, textReplaced))
					.trigger('input');

        cy.get("@preview")
          .get("[data-cy=my-button]")
          .should("have.text", textReplaced);
      });
  });
});
