describe('Registration page', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('should show validation errors when leaving all fields blank', () => {
    cy.get('[data-testid=signUpDirectory]').click();

    cy.get('[data-testid=signUpButton]').click();

    cy.get('[data-testid=emailError]').should('have.css', 'color', 'rgb(255, 0, 0)');
    cy.get('[data-testid=userNameError]').should('have.css', 'color', 'rgb(255, 0, 0)');
    cy.get('[data-testid=passwordError]').should('have.css', 'color', 'rgb(255, 0, 0)');
  })
})