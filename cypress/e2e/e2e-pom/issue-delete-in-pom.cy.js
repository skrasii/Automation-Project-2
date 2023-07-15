/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //open issue detail modal with title from line 16  
      cy.contains(issueTitle).click();
    });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = 'This is an issue of type: Task.';

  it('Should delete issue successfully', () => {

    //Getting issue details modal and working with it.
    IssueModal.getIssueDetailModal().as('issueModal').should('be.visible');
    cy.get('@issueModal').within(() => {

      cy.log(`Deleting issue: "${issueTitle}"`)
      cy.get(IssueModal.deleteButton).click()

    }).then(() => {

      // only then working with confimation modal and board list, preventing async execusion 
      IssueModal.confirmDeletion()
      IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle)

    });

  });

  it('Should cancel deletion process successfully', () => {

    //Getting issue details modal and working with it.
    IssueModal.getIssueDetailModal().as('issueModal').should('be.visible');
    cy.get('@issueModal').within(() => {

      cy.log(`Deleting issue: "${issueTitle}"`)
      cy.get(IssueModal.deleteButton).click()

    }).then(() => {

      // only then working with confimation modal and board list, preventing async execusion 
      IssueModal.cancelDeletion()
      IssueModal.closeDetailModal()
      IssueModal.ensureIssueIsVisibleOnBoard(issueTitle)

    });
  });
});
