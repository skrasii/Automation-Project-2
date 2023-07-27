import IssueModal from '../pages/IssueModal';

const baseUrl = `${Cypress.env('baseUrl')}project/board`;

const issueNumber = 1;
const modalTracking = '[data-testid="modal:tracking"]';
const issueTitle = "Krasii's test task";
const issueModal = '[data-testid="modal:issue-details"]';
const closeIcon = '[data-testid="icon:close"]';

const estimatedInputField = () => cy.contains('Original Estimate').next().children('input[placeholder="Number"]');
const getIssueDetailsModal = () => cy.get(issueModal);
const timeWidget = () => cy.get('[data-testid="icon:stopwatch"]').next();


describe('Time tracking "estimated time" and "remaining time" adding, editing and removing', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.url().should('eq', baseUrl).then((url) => {
			cy.visit(url + '/board');
		});
	});

	it('Check there are no estimated hours and no time logged by default in newly created task', () => {
		createIssue(issueTitle, baseUrl);
		openIssue(null, issueTitle);

		getIssueDetailsModal().within(() => {
			estimatedInputField().should('not.have.value');
			timeWidget().should('contain', 'No time logged');
		});
	});

	it('Check "estimate" time can be added and visible', () => {
		openIssue(issueNumber);

		getIssueDetailsModal().within(() => {
			// add estimated time. assert it is added and visible
			inputCheckEstimated(10);
		});

		closeIssue();
		openIssue(issueNumber);
		timeWidget().should('contain', `${10}h estimated`);
	});

	it('Check "estimate" time can be edited and visible', () => {
		openIssue(issueNumber);

		getIssueDetailsModal().within(() => {
			// edit estimated time. assert it is updated and visible
			inputCheckEstimated(20);
		});

		closeIssue();
		openIssue(issueNumber);
		timeWidget().should('contain', `${20}h estimated`);
	});

	it('Check "estimate" time can be removed', () => {
		openIssue(issueNumber);

		getIssueDetailsModal().within(() => {
			// remove estimated time. assert it is updated and visible
			inputCheckEstimated(null);
		});

		closeIssue();
		openIssue(issueNumber);
		timeWidget().should('not.contain', `estimated`);
	});

	it('Check "time spent"/"time remaining" can be added and visible', () => {
		const timeSpent = 2;
		const timeRemaining = 5;

		openIssue(issueNumber);
		openTimeModal();
		cy.get(modalTracking).within(() => {
			cy.get('input[placeholder="Number"]').eq(0).click().clear().type(timeSpent);
			cy.get('input[placeholder="Number"]').eq(1).click().clear().type(timeRemaining);
		});
		closeTimeModal();

		timeWidget().should('not.contain', 'No time logged');
		timeWidget().should('contain', `${timeSpent}h logged`);
		timeWidget().should('contain', `${timeRemaining}h remaining`);
	});

	it('Check "time spent"/"time remaining" can be cleared', () => {
		openIssue(issueNumber);

		openTimeModal();
		cy.get(modalTracking).within(() => {
			cy.get('input[placeholder="Number"]').eq(0).click().clear();
			cy.get('input[placeholder="Number"]').eq(1).click().clear();
		});
		closeTimeModal();

		timeWidget().should('contain', 'No time logged');
		timeWidget().should('not.contain', `h logged`);
		timeWidget().should('not.contain', `h remaining`);
	});


});

function inputCheckEstimated(hours = null) {
	estimatedInputField().clear();

	if (hours > 0) {
		estimatedInputField().type(hours).trigger('{enter}').blur();
		estimatedInputField().should('have.value', hours);
		timeWidget().should('contain', `${hours}h estimated`);
	} else {
		estimatedInputField().should('not.have.value');
		timeWidget().should('not.contain', 'estimated');
	}
}

function openTimeModal() {
	timeWidget().click();
	cy.get(modalTracking).should('be.visible');
}

function closeTimeModal() {
	cy.get(modalTracking).within(() => {
		cy.contains('button', 'Done').click();
	});
	cy.get(modalTracking).should('not.exist');
}

function createIssue(title, url) {
	cy.visit(url + '/board?modal-issue-create=true');

	IssueModal.getIssueModal()
		.within(() => {
			// fix for title field being unfocused during form load.
			cy.wait(500);
			IssueModal.editTitle(title);
			cy.get(IssueModal.submitButton).click();
		})
		.then(() => {
			cy.get('[type="success"]')
				.contains('Issue has been successfully created.')
				.click();
		});
}

function openIssue(number = null, title = '') {
	if (title.length > 0) {
		cy.get(IssueModal.backlogList).contains(title).click();
	} else if (number !== null) {
		cy.get(IssueModal.backlogList).children().eq(number).click();
	} else {
		cy.get(IssueModal.backlogList).children().eq(0).click();
	}
}

function closeIssue() {
	cy.get(issueModal).within(() => {
		cy.get(closeIcon).first().click({ force: true });
	});
	getIssueDetailsModal().should('not.exist');
}
