///<reference types="cypress" />
import { register, login, logout } from '/cypress/support/utils.js';


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
        login();
        logout();
    });

});