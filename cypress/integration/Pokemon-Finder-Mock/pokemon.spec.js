describe("Pokemon Finder Mock - Pokemon", () => {
    /* eslint-disable */
    before(() => {
        cy.log("Comienzo la suite de test");
        cy.fixture('pokemon.json').as('pokemon')
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
        cy.get('@RequestPokemon').its('headers').its('content-type').should('include', 'application/json; charset=utf-8');
    });*/

    it('Obtiene la informacion del pokemon', ()=>{
        cy.get('@RequestPokemon').its('body').should('not.to.be.empty');
    });

    /*it("Title", () => {
        cy.addContextTestReport('Text', 'Test title', 'Texto de prueba de la descripcion');
    });*/
});
