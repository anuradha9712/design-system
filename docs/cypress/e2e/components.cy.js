const hostURL = 'http://localhost:8000/components/overview/all-components/'

describe('test for Components', () => {
  it('check for storybook links', () => {
    cy.visit(hostURL);
    cy.get('[data-test=DesignSystem-VerticalNav--Text]').each(navLink => {
      navLink.click();
      navLink[0].innerText !== 'Overview' && cy.location('pathname').should('match', /\/avatar$/);
      // cy.wait(2000);
      // cy.get('[data-test=live-error]').should('not.exist');
      cy.get('[data-test=live-error]').should('not.exist');
    });
  });

  // it('check for page title', () => {
  //   cy.visit(hostURL);
  //   cy.get('[data-test=DesignSystem-VerticalNav--Text]').each(navLink => {
  //     navLink.click();
  //     let componentName = navLink[0].innerText;
  //     // cy.location('pathname').should('match', /\/${componentName}/`);
  //     // cy.location('pathname').should('match', componentName);

  //     // componentName !== 'Overview' && cy.get('[data-test=Docs-PageTitle]').innerText.should('match', componentName );
  //     cy.log('testingggg==============',navLink);
  //     // componentName !== 'Overview' && cy.get('[data-test=Docs-PageTitle]').invoke("text").should("eq", componentName);       
  //   });
  // })
});
