import IssueModal from '../pages/IssueModal';

const timeWidget = '[data-testid="icon:stopwatch"]';

describe('Issue comments creating, editing and deleting', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.url()
			.should('eq', `${Cypress.env('baseUrl')}project/board`)
			.then((url) => {
				cy.visit(url + '/board');
				// opening first available task
				cy.get(IssueModal.backlogList).children().first().click();
			});
	});

	const getIssueDetailsModal = () =>
		cy.get('[data-testid="modal:issue-details"]');

	it('Should check estimation for add/edit and delete functionality', () => {
		let estimatedTime = 16;

		getIssueDetailsModal().within(() => {
			const estimationInput = cy.contains('Original Estimate').next()
				.children('input[placeholder="Number"]');

			// add estimation. assert, that estimation is added and visible
			inputAndCheckEstimation(estimatedTime);

			// edit estimation. assert that updated value is visible
			estimatedTime++;
			inputAndCheckEstimation(estimatedTime);

			// remove estimation. assert removed
			estimationInput.clear();
			estimationInput.should('not.have.value');
			cy.get(timeWidget).next().should('not.contain', 'estimated');
		});
	});
});

function inputAndCheckEstimation(hours) {
	const estimationInput = cy.contains('Original Estimate').next()
		.children('input[placeholder="Number"]');

	estimationInput.clear().type(hours);
	estimationInput.should('have.value', hours);
	cy.get(timeWidget).next()
		.contains(hours + 'h estimated');
}
