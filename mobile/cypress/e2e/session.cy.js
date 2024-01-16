describe('Session page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=loginDirectory]').click();
    cy.get('[data-testid=emailInput]').type('windesheim@gmail.com');
    cy.get('[data-testid=passwordInput]').type('Windesheim2024!');
    cy.get('[data-testid=loginButton]').click();
    cy.wait(3000);
  })

  it('should show request and planned session cards', () => {
    cy.get('[data-testid=sessionTab]').click();

    cy.get('[data-testid=requestCard]').should('exist').should('be.visible');
    cy.get('[data-testid=plannedSessionCard]').should('exist').should('be.visible');
  })

  it('should toggle between the default and alternative session list', () => {
    cy.get('[data-testid=sessionTab]').click();

    cy.get('[data-testid=sessionListSwitch]').click();

    cy.get('[data-testid=altList]').should('be.visible');
  })
})