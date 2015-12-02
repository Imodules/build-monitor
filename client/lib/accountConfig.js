'use strict';
AccountsTemplates.configure({
	// Behaviour
	confirmPassword: true,
	enablePasswordChange: true,
	forbidClientAccountCreation: false,
	overrideLoginErrors: true,
	sendVerificationEmail: false,
	lowercaseUsername: false,

	// Appearance
	showForgotPasswordLink: true,
	showLabels: true,
	showPlaceholders: true,
	showResendVerificationEmailLink: false,

	// Client-side Validation
	continuousValidation: false,
	negativeFeedback: false,
	negativeValidation: true,
	positiveValidation: true,
	positiveFeedback: true,
	showValidating: true,

	// Redirects
	homeRoutePath: '/',
	redirectTimeout: 4000
});

AccountsTemplates.configure({
	defaultLayout: 'noLayout',
	defaultLayoutRegions: {},
	defaultContentRegion: 'main'
});

AccountsTemplates.configureRoute('signIn', {
	path: '/login',
	contentRegion: 'main'
});
