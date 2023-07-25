import IssueModal from '../pages/IssueModal';

const timeWidget = '[data-testid="icon:stopwatch"]';
const modalTracking = '[data-testid="modal:tracking"]';

describe('Time tracking "estimated time" and "remaining time" adding, editing and removing', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`)
			.then((url) => {
				cy.visit(url + '/board');
				// opening first available task
				cy.get(IssueModal.backlogList).children().first().click();
			});
	});

	const getIssueDetailsModal = () =>
		cy.get('[data-testid="modal:issue-details"]');

	it('Check "estimate" for add/edit and delete functionality', () => {
		let estimatedTime = 16;

		getIssueDetailsModal().within(() => {
			// add estimated time. assert is added and visible
			inputCheckEstimated(estimatedTime);

			// edit estimated time. assert is updated and visible
			estimatedTime++;
			inputCheckEstimated(estimatedTime);

			// remove estimated time. assert removed
			inputCheckEstimated();
		});
	});

	it('Check "remaining time" for add/edit and delete functionality', () => {
		let timeRemaining = 7;

		getIssueDetailsModal().should('be.visible');

		// add time remaining. assert it is added and visible
		inputCheckTimeRemaining(timeRemaining);

		// edit time remaining. assert it is updated and visible
		timeRemaining++;
		inputCheckTimeRemaining(timeRemaining);

		// remove time remaining value. assert it is removed
		openTimeModal();
		cy.get(modalTracking).within(() => {
			cy.get('input[placeholder="Number"]').eq(1).click().clear();
		});
		closeTimeModal();
	});
});

function inputCheckEstimated(hours = null) {
	const estimatedInput = cy
		.contains('Original Estimate')
		.next()
		.children('input[placeholder="Number"]');

	estimatedInput.clear();

	if (hours > 0) {
		estimatedInput.type(hours);
		estimatedInput.should('have.value', hours);
		cy.get(timeWidget)
			.next()
			.contains(hours + 'h estimated');
	} else {
		estimatedInput.should('not.have.value');
		cy.get(timeWidget).next().should('not.contain', 'estimated');
	}
}

function inputCheckTimeRemaining(hours) {
	openTimeModal();
	cy.get(modalTracking).within(() => {
		cy.get('input[placeholder="Number"]').eq(1).click().clear().type(hours);
	});
	closeTimeModal();
	cy.get(timeWidget)
		.next()
		.contains(hours + 'h remaining');
}

function openTimeModal() {
	cy.get(timeWidget).click();
	cy.get(modalTracking).should('be.visible');
}

function closeTimeModal() {
	cy.get(modalTracking).within(() => {
		cy.contains('button', 'Done').click();
	});
	cy.get(modalTracking).should('not.exist');
}
