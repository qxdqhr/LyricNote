/**
 * English translations
 */

export default {
  // Common
  common: {
    hello: 'Hello',
    welcome: 'Welcome',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    retry: 'Retry',
  },

  // Navigation
  nav: {
    home: 'Home',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
  },

  // User
  user: {
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    phone: 'Phone',
    nickname: 'Nickname',
  },

  // Form validation
  validation: {
    required: '{{field}} is required',
    invalid_email: 'Invalid email format',
    password_too_short: 'Password must be at least {{count}} characters',
    passwords_not_match: 'Passwords do not match',
  },

  // Error messages
  errors: {
    network: 'Network error, please try again later',
    server: 'Server error',
    unauthorized: 'Unauthorized, please login first',
    not_found: 'Not found',
    unknown: 'Unknown error',
  },

  // Success messages
  success: {
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    updated: 'Updated successfully',
    created: 'Created successfully',
  },
} as const;

