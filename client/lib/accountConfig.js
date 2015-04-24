/**
 * Created by paul on 4/23/15.
 */

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
	redirectTimeout: 4000,

	onSubmitHook: function(error, state){
		if (!error) {
			if (state === "signIn") {
				// Successfully logged in
				// Redirect to home.
				Router.go('/');
			}
			if (state === "signUp") {
				// Successfully registered
				Router.go('/profile');
			}
		}
	}
});

AccountsTemplates.configureRoute('signIn', {
	name: 'signin',
	path: '/login',
	template: 'login'
});
