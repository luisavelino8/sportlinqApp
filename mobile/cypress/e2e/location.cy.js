describe('Location page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=loginDirectory]').click();
    cy.get('[data-testid=emailInput]').type('windesheim@gmail.com');
    cy.get('[data-testid=passwordInput]').type('Windesheim2024!');
    cy.get('[data-testid=loginButton]').click();
    cy.wait(3000);
  })

  it('should toggle between the map and the location list', () => {
    cy.get('[data-testid=locationTab]').click();

    cy.get('[data-testid=locationSwitch]').click();

    cy.get('[data-testid=locationCard]').should('be.visible');
  })

})