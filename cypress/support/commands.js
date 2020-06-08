const addContext = require("mochawesome/addContext");

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


/*
# =============================================================================================================
# -- COMMAND ADD CONTEXT TO TEST REPORT --
# IMPLEMENTATION: cy.addContextTestReport(title, value);
# =============================================================================================================
*/
Cypress.Commands.add("addContextTestReport", (type, title, value) => {
  cy.once("test:after:run", (test, runnable) => {
    console.log('[i] ADD CONTEXT TEST REPORT');
    //console.log("TEST: ", test);
    //console.log("RUNNABLE: ", runnable);
    //console.log("TYPE: ",type);

    //value = (type === "url") ? "<a href='"+value+"' target='_blank'>"+value+"</a>":value;

    //addContext({ test }, { title, value });
    addContext({ test }, { title: title, value: value });
  });
});
