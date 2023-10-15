import { setJwtToken, openMyArticles, checkArticle, openMyArticle, clearArticle, fillArticle, addArticle } from '/cypress/support/utils.js';
import selectors from '/cypress/fixtures/selectors.json';

describe('Articles',() => {
    beforeEach(() => {
        cy.visit('/');
        cy.readFile('tmp/token.txt')
        .should('not.be.empty')
        .then(token => {
            cy.visit('/', {
                onBeforeLoad: (window) => setJwtToken(window, token)
            });
        });
        
    });

    it('publish article',() => {

        const article = addArticle();      
     
        checkArticle(article);
    });

    it('delete article',() => {
        const article = addArticle();
        
        openMyArticle(article);

        cy.get('.article-actions span:not(.ng-hide) button').click();
        cy.url().should('eq', 'https://demo.realworld.io/#/');

        openMyArticles();

        cy.get(selectors.myArticles).should('be.visible')
        .find('article-preview')
        .should('have.length.greaterThan', 0);

        cy.get(selectors.myArticles).contains(article.title)
        .should('have.length', 0);


        
    });
    it('edit article',() => {

        const article = addArticle();

        openMyArticle(article);

        cy.get('.article-actions a[href*="#/editor"]').click();

        cy.get(selectors.editArticlePage).find('form')
            .should('be.visible');

        clearArticle();

        const newArticle = fillArticle();

        cy.get(selectors.editArticlePage).find('button[type=button]').click();

        cy.get(selectors.articlePage).should('be.visible');

        checkArticle(newArticle);
    });
});