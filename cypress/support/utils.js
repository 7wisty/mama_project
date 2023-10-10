import meUser from '/cypress/fixtures/me-user.json';
import selectors from '/cypress/fixtures/selectors.json';
import { faker } from '@faker-js/faker';

export function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
};

export function register() {

    cy.get(selectors.appHeader).find('a[href$="/register"]').should('be.visible').as('registerButton');
    cy.get('@registerButton').click();

    cy.url().should('include', '/#/register');
    cy.get(selectors.registerPage).find('h1').should('have.text', 'Sign up');
    cy.get(selectors.registerForm).should('be.visible');

    const rnd = Math.round(Math.random() * 89999) + 10000;

    const username = 'user_' + rnd;
    
    const email = username + '@gmail.com';
    
    cy.get(selectors.registerForm).within(() => {
        cy.get('input[ng-model$=username]').type(username);
        cy.get('input[ng-model$=email]').type(email);
        cy.get('input[ng-model$=password]').type(meUser.password);
        cy.get('button[type=submit]').click();
    });
    cy.get(selectors.appHeader).should('be.visible').should('contain.text', username);
};

export function logout() {
    cy.get(selectors.appHeader).find('a[href$="/settings"]').click();
    cy.get(selectors.settingsPage).find('h1').should('have.text', 'Your Settings');
    cy.get(selectors.settingsPage).find('button[ng-click*=logout]').click();

    cy.get(selectors.appHeader).should('not.contain.text', meUser.username);
};

export function login() {
    cy.get('.navbar').should('be.visible').as('appHeader');
    cy.get('@appHeader').find('a[href$="/login"]').click();
    cy.url().should('include', '/#/login');

    cy.get('.auth-page').should('be.visible').as('loginPage');
    cy.get('@loginPage').find('h1').should('have.text', 'Sign in');

    cy.get('@loginPage').find('form').should('be.visible').as('loginForm').within(() => {
        cy.get('input[ng-model$=email]').type(meUser.email);
        cy.get('input[ng-model$=password]').type(meUser.password);
        cy.get('button[type=submit]').click();  
    });

    cy.get('@appHeader').should('contain.text', meUser.username);
};

export function addArticle() {

    cy.get(selectors.appHeader).find('a[href$="/editor/"]').click();
    cy.url().should('include', '/#/editor/');

    cy.get(selectors.addArticleForm)
    .should('be.visible');

    const article = fillArticle();

    cy.get(selectors.addArticleForm).find('button[type="button"]').click();

    cy.get(selectors.articlePage).should('be.visible');

    cy.get('.container.page').should('be.visible');

    return article;
};

export function setJwtToken(window, token) {
    window.localStorage.setItem('jwtToken', token);
};

export function generateFakeArticle() {

    return {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        tags: [
            faker.word.adjective(),
            faker.word.adjective(),
            faker.word.adjective()
        ]
    };
};

export function openMyArticles() {

    cy.get(selectors.appHeader).contains('a', meUser.username).click();
    cy.url().should('include', meUser.username);

    cy.get('.articles-toggle > ul > li:first-child a')
    .should('have.class', 'active');
};

export function checkArticle (article) {

cy.get(selectors.articlePage).find('h1').should('contains.text', article.title);

    for (const tag of article.tags) {
    cy.get(selectors.articleTags).should('contain.text', tag);
    };

cy.get(selectors.articlePage).find('[ng-bind-html$=body]')
    .should('contain.html', '<strong>healthy</strong>')
    .should('contain.html', '<em>tasty.</em>')
    .should('contain.html', '<li>banana</li>');
};

export function openMyArticle(article) {

    openMyArticles();

        cy.get(selectors.myArticles).contains(article.title)
        .parents('article-preview')
        .find('a.preview-link').click();
};

export function clearArticle() {

    cy.get(selectors.editArticleForm).within(() => {
        cy.get('input[ng-model$=description]').clear();
        cy.get('textarea[ng-model$=body]').clear();
        cy.get('input[ng-model$=tagField]').clear();
        cy.get('input[ng-model$=title]').clear();
    })

    cy.get('.tag-list .tag-default').each((tag) => cy.wrap(tag)
        .find('[ng-click*=remove]').click());
};

export function fillArticle() {

    const article = generateFakeArticle();

    cy.get(selectors.editArticleForm).find('input[ng-model$=title]').type(article.title);
    cy.get(selectors.editArticleForm).find('input[ng-model$=description]').type(article.description);

    const body = `I like fruits!
It is **healthy** and *tasty.*

My favorite are:
* banana
* orange
* lemon`;
    cy.get(selectors.editArticleForm).find('textarea[ng-model$=body]').type(body);

    cy.get(selectors.editArticleForm).find('input[ng-model$=tagField]').as('articleTagInput');
    for (const tag of article.tags) {
        cy.get('@articleTagInput').type(tag).type('{enter}');
    }

    return article;
}
