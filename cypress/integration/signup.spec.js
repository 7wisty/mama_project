///<reference types="cypress" />
import { register, login, logout, setJwtToken } from '/cypress/support/utils.js';


describe('Sign up', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    
    it('should do register user', () => {
        register();    
    });

    it('should do login user', () => {
        login();
    });
    
    it('should do logout user', () => {
        cy.readFile('tmp/token.txt')
        .should('not.be.empty')
        .then(token => {
            cy.visit('/', {
                onBeforeLoad: (window) => setJwtToken(window, token)
            });
        });
        logout();
    });

});