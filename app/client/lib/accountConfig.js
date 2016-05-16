Accounts.config({
	sendVerificationEmail: false,
	forbidClientAccountCreation: false
});

Accounts.ui.config({
	passwordSignupFields: 'EMAIL_ONLY',
	loginPath: '/login',
	signUpPath: '/signup',
	resetPasswordPath: '/reset-password',
	onSignedInHook: () => FlowRouter.go('/'),
	onSignedOutHook: () => FlowRouter.go('/login'),
	minimumPasswordLength: 6
});
