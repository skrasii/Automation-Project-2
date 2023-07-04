describe('Issue create', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            // open first available issue
            cy.get('[data-testid="board-list:backlog"]').children().eq(0).click();
        });
    });

    // Assignment 3. Test 1
    it('Delete first issue and verify it has been successfully removed from board', () => {

        let issueTitle

        //Getting issue details modal and working with it.
        cy.get('[data-testid="modal:issue-details"]').as('issueModal').should('be.visible');
        cy.get('@issueModal').within(() => {

            cy.get('[placeholder="Short summary"]').invoke('text').then((title) => {
                issueTitle = title;
                cy.log(`Deleting issue: "${issueTitle}"`)
            })

            cy.get('[data-testid="icon:trash"]').click()

        }).then(() => {

            // only then working with confimation modal and board list, preventing async execusion 
            cy.get('[data-testid="modal:confirm"]').contains('Delete issue').click()
            cy.get('[data-testid="modal:confirm"]').should('not.exist')

            cy.reload()

            // assert target issue is deleted and not visible on the jira board
            cy.get('[data-testid="board-list:backlog"]').children().should('not.contain', issueTitle);

        });

    });

    // Assignment 3. Test 2
    it('Start issue delete process and abort it. Verify issue is not affected', () => {

        let issueTitle

        //Getting issue details modal and working with it.
        cy.get('[data-testid="modal:issue-details"]').as('issueModal').should('be.visible');
        cy.get('@issueModal').within(() => {

            cy.get('[placeholder="Short summary"]').invoke('text').then((title) => {
                issueTitle = title;
                cy.log(`Deleting issue: "${issueTitle}"`)
            })

            cy.get('[data-testid="icon:trash"]').click()

        }).then(() => {

            // only then working with confimation modal and board list, preventing async execusion 
            cy.get('[data-testid="modal:confirm"]').contains('Cancel').click()
            cy.get('[data-testid="modal:confirm"]').should('not.exist')

            cy.reload()

            cy.get('@issueModal').within(() => {
                cy.get('[data-testid="icon:close"]').first().click();
            })
            // assert target issue is bit deleted and visible on the jira board
            cy.get('[data-testid="board-list:backlog"]').children().should('contain', issueTitle);

        });

    });

});
