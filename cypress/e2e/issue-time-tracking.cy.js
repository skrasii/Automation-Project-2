import IssueModal from '../pages/IssueModal';

const baseUrl = `${Cypress.env('baseUrl')}project/board`;

const issueNumber = 0;
const modalTracking = '[data-testid="modal:tracking"]';
const issueTitle = "Krasii's test task";
const issueModal = '[data-testid="modal:issue-details"]';
const closeIcon = '[data-testid="icon:close"]';

const estimatedInputField = () => cy.contains('Original Estimate').next().children('input[placeholder="Number"]');
const getIssueDetailsModal = () => cy.get(issueModal);
const timeWidget = () => cy.get('[data-testid="icon:stopwatch"]').next();
const timeSpentField = () => cy.get('input[placeholder="Number"]').eq(0);
const timeRemainField = () => cy.get('input[placeholder="Number"]').eq(1);

describe('Time tracking "estimated time" and "remaining time" adding, editing and removing', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.url().should('eq', baseUrl).then((url) => {
			cy.visit(url + '/board');
		});
	});

	it('Check "estimate" time can be added and visible', () => {
		const hours = 10

		cy.visit(baseUrl + '/board?modal-issue-create=true');
		createIssue(issueTitle);
		openIssue('', issueTitle);

		getIssueDetailsModal().within(() => {
			estimatedInputField().should('not.have.value');
			timeWidget().should('contain', 'No time logged');
			// add original estimate time. assert it is added and visible
			inputCheckEstimated(hours);
		});

		reOpenIssue('', issueTitle);
		timeWidget().should('contain', `${hours}h estimated`);

	});

	it('Check "estimate" time can be edited and visible', () => {
		const hours = 20

		openIssue(issueNumber);
		getIssueDetailsModal().within(() => {
			// edit original estimate time. assert it is updated and visible
			inputCheckEstimated(hours);
		});

		reOpenIssue(issueNumber);
		timeWidget().should('contain', `${hours}h estimated`);
	});

	it('Check "estimate" time can be removed', () => {
		openIssue(issueNumber);

		getIssueDetailsModal().within(() => {
			// remove original estimate time
			inputCheckEstimated(null);
			timeWidget().should('not.contain', `estimated`);
		});

		reOpenIssue(issueNumber);
		timeWidget().should('not.contain', `estimated`);
	});

	it('Check "time spent"/"time remaining" can be added and visible', () => {
		const timeSpent = 2;
		const timeRemaining = 5;

		openIssue(issueNumber);
		openTimeModal();
		cy.get(modalTracking).within(() => {
			timeSpentField().clear().type(timeSpent);
			timeRemainField().clear().type(timeRemaining);
		});
		closeTimeModal();

		timeWidget().should('not.contain', 'No time logged');
		timeWidget().should('contain', `${timeSpent}h logged`);
		timeWidget().should('contain', `${timeRemaining}h remaining`);

		reOpenIssue(issueNumber);

		// assert same after re-open
		timeWidget().should('contain', `${timeSpent}h logged`);
		timeWidget().should('contain', `${timeRemaining}h remaining`);
	});

	it('Check "time spent"/"time remaining" can be cleared and saved', () => {
		openIssue(issueNumber);

		openTimeModal();
		cy.get(modalTracking).within(() => {
			timeSpentField().clear();
			timeRemainField().clear();
		});
		closeTimeModal();

		timeWidget().should('contain', 'No time logged');
		timeWidget().should('not.contain', `h logged`);
		timeWidget().should('not.contain', `h remaining`);

		reOpenIssue(issueNumber);

		// assert same after re-open
		timeWidget().should('contain', 'No time logged');
		timeWidget().should('not.contain', `h logged`);
		timeWidget().should('not.contain', `h remaining`);
	});


});

function reOpenIssue(number = null, title = '') {
		cy.log('🔄 Reopening task')
		closeIssue();
		openIssue(number, title);
}

function inputCheckEstimated(hours = null) {
	estimatedInputField().clear();

	if (hours > 0) {
		estimatedInputField().click().type(hours).blur();
		estimatedInputField().should('have.value', hours);
		timeWidget().should('contain', `${hours}h estimated`);
	} else {
		estimatedInputField().should('not.have.value');
		estimatedInputField().should('have.attr', 'placeholder', 'Number');
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

function createIssue(title) {

	IssueModal.getIssueModal().should('be.visible');
	
	IssueModal.getIssueModal()
		.within(() => {
			// fix for title field being unfocused during form load.
			cy.get('[data-testid*="avatar:"]').should('be.visible');
			cy.get('input[name="title"]').type(title);
			cy.get(IssueModal.submitButton).click();
		})
		.then(() => {
			cy.get('[type="success"]')
				.should('contain', 'Issue has been successfully created.')
				.click();
		});

}

function openIssue(number = null, title = '') {
	if (title.length > 0) {
		cy.get(IssueModal.backlogList).contains(title).click();
	} else if (number >= 0) {
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
