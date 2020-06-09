describe("Pokemon Finder Mock - Pokemons", () => {
    /* eslint-disable */
    before(() => {
        cy.log("Comienzo la suite de test");
        cy.fixture('pokemons.json').as('pokemons')
    });

    beforeEach(() => {
        const api_url = Cypress.env('CYPRESS_API_URL');
        cy.request('GET',`${api_url}/pokemons`).as('RequestPokemons');
    });

    it('Validar Status Code', () => {
        cy.get('@RequestPokemons').its('status').should('equal', 200);
    });

    /*it('Validar Header', () => {
        cy.get('@RequestPokemons').its('headers').its('content-type').should('include', 'application/json; charset=utf-8');
    });*/

    it('Obtiene todos los pokemones', ()=>{
        cy.get('@RequestPokemons').its('body').should('not.to.be.empty');
    });

    /*it("Title", () => {
        cy.addContextTestReport('Text', 'Test title', 'Texto de prueba de la descripcion');
    });*/
});