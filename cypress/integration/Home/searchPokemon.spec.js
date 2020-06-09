describe("Search Pokemon", () => {
    /* eslint-disable */
    before(() => {
        cy.log("Comienzo la suite de test");
        cy.visit(""); //visito el main home

        // Valido si estoy en la pagina home
        cy.url().should("eq", `${Cypress.config().baseUrl}/` );
    });

    it("Buscar", () => {
        cy.get('[data-cy=overlay-load]').should("not.be.visible").then(() => {
            cy.get('[data-cy=input-search').should("exist").then( ($res) => {
                cy.wrap($res).should('be.empty');

                cy.get('[data-cy=btn-search]').then( $res => {
                    cy.wrap($res).click();
                    cy.get('[data-cy=msg-error').then($res => {
                        cy.wrap($res).should("be.visible");
                    })
                });

            });
        });
    });

    it("Buscar pokemon", () => {
        cy.get('[data-cy=overlay-load]').should("not.be.visible").then(() => {
            const api_url = Cypress.env('CYPRESS_API_URL');
            const pokemon = Cypress.env('CYPRESS_POKEMON');
            cy.get('[data-cy=input-search').should("exist").then( ($res) => {
                cy.wrap($res).should('be.empty').type(pokemon);

                cy.get('[data-cy=btn-search]').then( $res => {
                   cy.wrap($res).click();

                    cy.server();
                    cy.fixture('search.json').as('searchMock');
                    cy.request('GET', `${api_url}/search?search=${pokemon}`).then(($res) => {
                        let responseRequest = JSON.parse($res.body);
                        cy.log("[i] RESPONSE: ", responseRequest);
                        expect($res.status).to.eq(200);
                        expect(responseRequest).not.to.be.empty;

                        cy.get('[data-cy=list-of-results]').then( $res =>{
                            cy.wrap($res).contains(pokemon);
                        })
                    });
                });

            });
        });
    });
    /*it("Se debe mostrar el dialog de salir con sus elementos", () => {
        // Valido el btn de salir
        cy.addContextTestReport('Text', 'Test title', 'Texto de prueba de la descripcion');
    });*/
});