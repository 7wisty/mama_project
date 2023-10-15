import { getRandomNumber, setJwtToken } from '/cypress/support/utils.js';
import selectors from '/cypress/fixtures/selectors.json';
import meUser from '/cypress/fixtures/me-user.json';

function waitForArticlesList() {

    cy.get(selectors.articleList).contains('.article-preview', 'Loading')
        .should('not.be.visible');

};

function selectRandomArticle() {

    waitForArticlesList();

    const rand = getRandomNumber(0, 9);
    cy.get(selectors.articleList)
        .find('.article-preview:not(.ng-hide)')
        .should('have.length', 10)
        .eq(rand)
        .as('randomArticle');

};

describe('Global articles feed', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    
    it('should do display article list', () => {
        cy.get(selectors.articleList).find('.article-preview:not(.ng-hide)')
        .should('be.visible')
        .should('have.length', 10)
        .each(article => {
            cy.wrap(article).within(() => {
                cy.get('article-meta').within(() => {
                    cy.get('.date').should('be.visible');
                    cy.get('a[ui-sref*=profile] img').should('be.visible');
                    cy.get('.author').should('be.visible');
                    cy.get('favorite-btn')
                    .invoke('text')
                    .invoke('trim')
                    .should('match', /^[0-9]+$/)
                })
                cy.get('h1').should('be.visible');
                cy.get('[ng-bind*=description]').should('be.visible');
                cy.get('.tag-list li').should('have.length.greaterThan', 0);
            });
        });
    });

    it('should do open article detail page', () => {
        cy.get('.feed-toggle ul > li:nth-child(2) a')
        .should('have.class', 'active');
        selectRandomArticle();

        cy.get('@randomArticle').find('h1')
                .invoke('text')
                .invoke('trim')
                .as('randomArticleTitle');

        cy.get('@randomArticle')
        .find('a.preview-link')
        .click();

        cy.location('hash').should('contain', '#/article/');

            cy.get('@randomArticleTitle').then(title => {
                cy.get('.article-page h1')
                    .invoke('text')
                    .invoke('trim')
                    .should('eq', title);
            });
    });

    it('like article', () => {
        cy.readFile('tmp/token.txt')
        .should('not.be.empty')
        .then(token => {
            cy.visit('/', {
                onBeforeLoad: (window) => setJwtToken(window, token)
            });
        });
        cy.get('.navbar').should('be.visible')
        .should('contain.text', meUser.username);

        cy.get('.feed-toggle ul > li:nth-child(2) a').should('be.visible').click();
      
        cy.get(selectors.articleList).find('.article-preview:not(.ng-hide)')
        .should('be.visible')
        .should('have.length', 10);
        cy.get('list-pagination li')
        .should('have.length.greaterThan', 10)
        .as('availablePages')
        .eq(0)
        .should('have.class', 'active');

        const rand = getRandomNumber(15, 24);
            cy.get('@availablePages')
                .eq(rand)
                .find('a')
                .click();  
        cy.get('list-pagination li')
            .should('have.length.greaterThan', 10)
            .as('availablePages')
            .eq(rand)
            .should('have.class', 'active');
        selectRandomArticle();
        cy.get('@randomArticle')
        .find('favorite-btn button')
        .as('likeButton');

        cy.get('@likeButton')
        .invoke('text')
        .invoke('trim')
        .then(likes => parseInt(likes))
        .as('likesBefore');

        cy.get('@likeButton')
                .invoke('hasClass', 'btn-primary')
                .then(likedBefore => {
                    console.log('liked before', likedBefore);
                    cy.get('@likeButton')
                        .click()
                        .should('not.have.class', 'disabled');

                    cy.get('@likesBefore').then(likesBefore => {
                        const expectingLikes = likesBefore + (likedBefore ? -1 : 1);
                        cy.get('@likeButton')
                            .invoke('text')
                            .invoke('trim')
                            .then(likes => parseInt(likes))
                            .should('eq', expectingLikes);
                    });
                });
    });
    it('navigate in list by paging', () => {
        cy.get('list-pagination li')
        .should('have.length.greaterThan', 10)
        .as('availablePages')
        .eq(0)
        .should('have.class', 'active');

        cy.get(selectors.articleList).find('.article-preview:not(.ng-hide)')
        .should('be.visible')
        .should('have.length', 10);
        
        const rand = getRandomNumber(1, 9);
            cy.get('@availablePages')
                .eq(rand)
                .find('a')
                .click();
        waitForArticlesList();

        cy.get(selectors.articleList).find('.article-preview:not(.ng-hide)')
        .should('be.visible')
        .should('have.length', 10);

    

    });

    it('should do filter articles by tag', () => {
        cy.get('.tag-list > a[ng-bind=tagName]').should('have.length.greaterThan', 5).as('Tags');
        const rand = getRandomNumber(0, 5);
        cy.get('@Tags')
        .eq(rand)
        .click()
        .invoke('text')
        .invoke('trim')
        
        .as('randomTagName');

        waitForArticlesList();

        cy.get('@randomTagName').then(tagName => {
            cy.get('.feed-toggle li:nth-child(3) a').should('contains.text', tagName)
            .should('have.length', 1);
        })
    });
});
