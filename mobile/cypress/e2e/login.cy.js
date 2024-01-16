describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('should show validation errors when leaving all fields blank', () => {
    cy.get('[data-testid=loginDirectory]').click();

    cy.get('[data-testid=loginButton]').click();
    cy.contains('Gebruiker niet gevonden').should('be.visible');
  })

  it('login with user credentials and show home screen', () => {
    cy.get('[data-testid=loginDirectory]').click();

    cy.get('[data-testid=emailInput]').type('windesheim@gmail.com');
    cy.get('[data-testid=passwordInput]').type('Windesheim2024!');

    cy.get('[data-testid=loginButton]').click();

    cy.get('[data-testid=homeScreenContainer]').should('be.visible');
  })
})