// Firebase Auth error codes as messages a person can act on.
const MESSAGES = {
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/user-not-found': 'The email or password is not correct.',
  'auth/wrong-password': 'The email or password is not correct.',
  'auth/invalid-credential': 'The email or password is not correct.',
  'auth/user-disabled': 'This account has been turned off.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/email-already-in-use': 'An account with this email already exists. Sign in instead.',
  'auth/weak-password': 'Use a password with at least 8 characters.',
  'auth/network-request-failed': 'The connection failed. Check your network and try again.'
}

export function authErrorMessage(err) {
  if (!err) return 'Something went wrong. Try again.'
  // Firebase JS SDK 7 does not know the newer INVALID_LOGIN_CREDENTIALS reply and reports it as an internal error.
  if (/INVALID_LOGIN_CREDENTIALS|INVALID_PASSWORD|EMAIL_NOT_FOUND/.test(err.message || '')) return MESSAGES['auth/invalid-credential']
  return MESSAGES[err.code] || 'Something went wrong. Try again.'
}
