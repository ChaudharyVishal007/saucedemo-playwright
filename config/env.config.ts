import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  users: {
    standard: {
      username: process.env.STANDARD_USER || 'standard_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
    locked: {
      username: process.env.LOCKED_USER || 'locked_out_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
    problem: {
      username: process.env.PROBLEM_USER || 'problem_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
    performance: {
      username: process.env.PERFORMANCE_USER || 'performance_glitch_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
  },
};
