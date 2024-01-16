describe('New session page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=loginDirectory]').click();
    cy.get('[data-testid=emailInput]').type('windesheim@gmail.com');
    cy.get('[data-testid=passwordInput]').type('Windesheim2024!');
    cy.get('[data-testid=loginButton]').click();
    cy.wait(3000);
  })

  it('should show the modal for a new session', () => {
    cy.get('[data-testid=newSessionTab]').click();
    cy.get('[data-testid=sessionModal]').should('exist').should('be.visible');
  })

})