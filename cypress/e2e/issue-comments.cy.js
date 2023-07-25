import { faker } from '@faker-js/faker';

const timeStamp = getTimeStamp();

describe('Issue comments creating, editing and deleting', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.url()
			.should('eq', `${Cypress.env('baseUrl')}project/board`)
			.then((url) => {
				cy.visit(url + '/board');
				cy.contains('This is an issue of type: Task.').click();
			});
	});

	const getIssueDetailsModal = () =>
		cy.get('[data-testid="modal:issue-details"]');

	it('Should create a comment successfully', () => {
		const comment = 'TEST_COMMENT';

		getIssueDetailsModal().within(() => {
			cy.contains('Add a comment...').click();

			cy.get('textarea[placeholder="Add a comment..."]').type(comment);

			cy.contains('button', 'Save').click().should('not.exist');

			cy.contains('Add a comment...').should('exist');
			cy.get('[data-testid="issue-comment"]').should('contain', comment);
		});
	});

	it.only('Should create, edit and delete comment successfully', () => {
		const comment = faker.lorem.sentence(2);
		const commentEdited = `EDITED COMMENT: ${comment} ${timeStamp}`;
		const commentDiv = '[data-testid="issue-comment"]';
		const commentTextarea = 'textarea[placeholder="Add a comment..."]';

		getIssueDetailsModal().within(() => {
			// Add comment. assert, that comment is added and visible
			cy.contains('Add a comment...').click();
			cy.get(commentTextarea).type(comment);
			cy.contains('button', 'Save').click().should('not.exist');
			cy.contains(commentDiv, comment);

			// Edit comment. Assert that updated comment is visible
			cy.contains(commentDiv, comment).contains('Edit').click();
			cy.get(commentTextarea)
				.contains(comment)
				.clear()
				.type(commentEdited);
			cy.contains('button', 'Save').click().should('not.exist');
			cy.contains(commentDiv, commentEdited);

			// Remove comment. Assert that comment is removed
			cy.contains(commentDiv, comment).contains('Delete').click();
		});

		cy.get('[data-testid="modal:confirm"]')
			.contains('button', 'Delete comment')
			.click()
			.should('not.exist');
		getIssueDetailsModal().contains(commentEdited).should('not.exist');
	});

	it('Should edit a comment successfully', () => {
		const previousComment = 'An old silent pond...';
		const comment = 'TEST_COMMENT_EDITED';

		getIssueDetailsModal().within(() => {
			cy.get('[data-testid="issue-comment"]')
				.first()
				.contains('Edit')
				.click()
				.should('not.exist');

			cy.get('textarea[placeholder="Add a comment..."]')
				.should('contain', previousComment)
				.clear()
				.type(comment);

			cy.contains('button', 'Save').click().should('not.exist');

			cy.get('[data-testid="issue-comment"]')
				.should('contain', 'Edit')
				.and('contain', comment);
		});
	});

	it('Should delete a comment successfully', () => {
		getIssueDetailsModal()
			.find('[data-testid="issue-comment"]')
			.contains('Delete')
			.click();

		cy.get('[data-testid="modal:confirm"]')
			.contains('button', 'Delete comment')
			.click()
			.should('not.exist');

		getIssueDetailsModal()
			.find('[data-testid="issue-comment"]')
			.should('not.exist');
	});
});

function getTimeStamp() {
	const now = new Date();
	return now.toLocaleString();
}
