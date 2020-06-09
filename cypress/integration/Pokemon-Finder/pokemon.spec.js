describe("Pokemon Finder - Pokemon", () => {
    /* eslint-disable */
    before(() => {
        cy.log("Comienzo la suite de test");
        cy.fixture('pokemon.json').as('pokemon');
    });

    beforeEach(() => {
        const api_url = Cypress.env('CYPRESS_API_URL');
        const pokemon = Cypress.env('CYPRESS_POKEMON');

        cy.request('GET',`${api_url}/pokemon/${pokemon}`).as('RequestPokemon');
    });

    it('Validar Status Code', () => {
        cy.get('@RequestPokemon').its('status').should('equal', 200);
    });

    /*it('Validar Header', () => {
        cy.get('@RequestPokemon').its('headers').its('content-type').should('include', 'text/html; charset=utf-8');
    });*/

    it('Obtener datos del Pokemon', ()=>{
        const api_url = Cypress.env('CYPRESS_API_URL');
        const pokemon = Cypress.env('CYPRESS_POKEMON');

        cy.request('GET',`${api_url}/pokemon/${pokemon}`).should((response) => {
            let responseRequest = JSON.parse(response.body);
            cy.log("[i] RESPONSE: ", responseRequest);
            expect(response.status).to.eq(200);
            expect(responseRequest).not.to.be.empty;
        });
    });

    /*it("Se debe mostrar el dialog de salir con sus elementos", () => {
        // Valido el btn de salir
        cy.addContextTestReport('Text', 'Test title', 'Texto de prueba de la descripcion');
    });*/
});
