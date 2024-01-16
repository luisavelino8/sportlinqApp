describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=loginDirectory]').click();
    cy.get('[data-testid=emailInput]').type('windesheim@gmail.com');
    cy.get('[data-testid=passwordInput]').type('Windesheim2024!');
    cy.get('[data-testid=loginButton]').click();
    cy.wait(3000);
  })

  it('show all the elements on the home page', () => {
    cy.get('[data-testid=homeScreenContainer]').should('be.visible');
  
    cy.get('[data-testid=welcomeText]').should('exist');
    cy.get('[data-testid=homePageCard]').should('exist');
    cy.get('[data-testid=friendSession]').should('exist');
  })

})