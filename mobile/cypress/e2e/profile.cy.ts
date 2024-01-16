describe('Profile page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=loginDirectory]').click();
    cy.get('[data-testid=emailInput]').type('windesheim@gmail.com');
    cy.get('[data-testid=passwordInput]').type('Windesheim2024!');
    cy.get('[data-testid=loginButton]').click();
    cy.wait(3000);
  })

  it('should show info from the user', () => {
    cy.get('[data-testid=profileTab]').click();

    cy.get('[data-testid=userInfoView]').should('exist').should('be.visible');

  })

  it('should navigate to profile settings and show user details', () => {
    cy.get('[data-testid=profileTab]').click();
    cy.get('[data-testid=profileSettingsIcon]').click();
    cy.get('[data-testid=profileSettingsOptions]').click();

    cy.get('[data-testid=emailField]').should('exist').should('be.visible');
    cy.get('[data-testid=usernameField]').should('exist').should('be.visible');
    cy.get('[data-testid=fullnameField]').should('exist').should('be.visible');
    cy.get('[data-testid=cityField]').should('exist').should('be.visible');
    cy.get('[data-testid=aboutmeField]').should('exist').should('be.visible');
    cy.get('[data-testid=passwordField]').should('exist').should('be.visible');
  })

})