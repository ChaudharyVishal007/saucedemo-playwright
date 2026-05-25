export const VALID_CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const LOGIN_ERROR_MESSAGES = {
  emptyUsername: 'Epic sadface: Username is required',
  emptyPassword: 'Epic sadface: Password is required',
  lockedUser: 'Epic sadface: Sorry, this user has been locked out.',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
};

export const INVALID_CREDENTIALS = [
  {
    scenario: 'wrong username, correct password',
    username: 'wrong_user',
    password: 'secret_sauce',
    expectedError: LOGIN_ERROR_MESSAGES.invalidCredentials,
  },
  {
    scenario: 'correct username, wrong password',
    username: 'standard_user',
    password: 'wrong_password',
    expectedError: LOGIN_ERROR_MESSAGES.invalidCredentials,
  },
  {
    scenario: 'both fields wrong',
    username: 'invalid_user',
    password: 'invalid_pass',
    expectedError: LOGIN_ERROR_MESSAGES.invalidCredentials,
  },
  {
    scenario: 'SQL injection attempt',
    username: "' OR '1'='1",
    password: "' OR '1'='1",
    expectedError: LOGIN_ERROR_MESSAGES.invalidCredentials,
  },
  {
    scenario: 'XSS attempt',
    username: '<script>alert(1)</script>',
    password: 'secret_sauce',
    expectedError: LOGIN_ERROR_MESSAGES.invalidCredentials,
  },
];

export const LOCKED_CREDENTIALS = {
  username: 'locked_out_user',
  password: 'secret_sauce',
};
