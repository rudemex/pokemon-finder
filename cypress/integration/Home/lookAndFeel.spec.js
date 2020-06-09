describe("Look & Feel - Home", () => {
    /* eslint-disable */
    before(() => {
        cy.log("Comienzo la suite de test");
        cy.visit(""); //visito el main home

        // Valido si estoy en la pagina home
        cy.url().should("eq", `${Cypress.config().baseUrl}/` );
    });

    it("Se debe mostrar la pantalla de Home con sus elementos", () => {
        cy.get('[data-cy=overlay-load]').then($res => {
            cy.wrap($res).should("exist");
        });

        cy.get('[data-cy=overlay-load]').should("not.be.visible").then(() => {
            cy.get('[data-cy="header"]').then($res => {
                cy.wrap($res).should("exist");
            });

            cy.get('[data-cy=logo]').then($res => {
                cy.wrap($res).contains("Pokemon Finder");
            });

            cy.get('[data-cy=form-search]').then($res => {
                cy.wrap($res).should("exist");
            });

            cy.get('[data-cy=input-search').should("exist").then(($res) => {
                cy.wrap($res).should('be.empty');
            });

            cy.get('[data-cy=btn-search]').then($res => {
                cy.wrap($res).should("not.be.disabled").contains("Search");
            });

            cy.get('[data-cy=msg-error').then($res => {
                cy.wrap($res).should("not.be.visible");
            })

            cy.get('[data-cy="footer"]').then($res => {
                cy.wrap($res).should("exist").contains("©Mex Delgado - Build with ❤ - Visit my repo");
            });
        });
    });

    /*it("Se debe mostrar el dialog de salir con sus elementos", () => {
        // Valido el btn de salir
        cy.addContextTestReport('Text', 'Test title', 'Texto de prueba de la descripcion');
    });*/

});