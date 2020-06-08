describe("Search Pokemon", () => {
    /* eslint-disable */
    before(() => {
        cy.log("Comienzo la suite de test");
        cy.visit(""); //visito el main home

        // Valido si estoy en la pagina home
        cy.url().should("eq", `${Cypress.config().baseUrl}/` );
    });

    it("Se debe mostrar el dialog de salir con sus elementos", () => {
        // Valido el btn de salir
        cy.addContextTestReport('Text', 'Test title', 'Texto de prueba de la descripcion');
    });
});