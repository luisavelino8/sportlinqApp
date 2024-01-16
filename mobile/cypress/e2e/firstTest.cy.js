describe('Welcome page', () => {
  it('shows all elements on the page', () => {
    cy.visit('/')

    cy.get('[data-testid=SportlinqLogo]').should('be.visible');

    cy.get('[data-testid=loginDirectory]').should('be.visible');

    cy.get('[data-testid=signUpDirectory]').should('be.visible');
  })
})