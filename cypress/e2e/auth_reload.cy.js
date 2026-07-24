describe("Session survives a full page reload", () => {
  it("keeps the therapist on /terapeuta after CTRL+R", () => {
    cy.visit("/login");
    cy.get('input[type="email"]:visible').type("gabrielafelixsilva@gmail.com");
    cy.get('input[type="password"]:visible').type("salame123");
    cy.contains("button", "Entrar").click();

    cy.location("pathname").should("eq", "/terapeuta");

    cy.reload();

    cy.location("pathname").should("eq", "/terapeuta");
  });
});
