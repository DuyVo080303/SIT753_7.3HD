const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = require('../index'); // Adjust if needed

jest.mock('sqlite3', () => ({
  verbose: () => ({
    Database: jest.fn().mockImplementation(() => ({
      all: jest.fn((query, params, cb) => {
        if (query.includes('SELECT username, email, password FROM Users')) {
          return cb(null, [{
            username: 'hashedUser',
            email: 'hashedEmail',
            password: 'hashedPassword'
          }]);
        }
        return cb(null, []);
      }),
      run: jest.fn((query, params, cb) => cb && cb()),
      close: jest.fn(),
    }))
  })
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn((value, salt) => Promise.resolve(`hashed_${value}`)),
  compare: jest.fn((plain, hashed) => {
    if (plain === 'password123' && hashed === 'hashedPassword') return Promise.resolve(true);
    return Promise.resolve(false);
  })
}));

describe('POST /login', () => {
  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'user@example.com', password: 'wrongpass' });

    expect(res.text).toContain('Invalid email or password');
  });
});

describe('POST /create', () => {
  it('should create account successfully with unique email and username', async () => {
    const res = await request(app)
      .post('/create')
      .send({
        user: 'newUser',
        email: 'newuser@example.com',
        password: 'password123'
      });

    expect(res.text).toContain('Create Account Successfully');
  });

  it('should show error if username or email already exists', async () => {
    // mock bcrypt to match user/email as used
    require('bcrypt').compare.mockImplementationOnce(() => Promise.resolve(true));
    const res = await request(app)
      .post('/create')
      .send({
        user: 'usedUser',
        email: 'user@example.com',
        password: 'password123'
      });

    expect(res.text).toContain('Username has been used');
  });
});
