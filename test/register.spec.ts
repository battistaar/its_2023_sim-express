import request from 'supertest';
import { URL, checkValidation, clearDB } from './utils';

const req = request(URL);

describe('register validation', () => {
  it('should validate picture', async () => {
    const response = await req.post('/register')
    .send({
      firstName: 'Name1',
      lastName: 'Last1',
      picture: 'https//somedomain.com/somepicture',
      username: 'test1@test.com',
      password: 'test1Password'
    });
    expect(response.body.details.length).toBe(1);
    checkValidation(response.body, 'picture');
  });
  it('should validate username', async () => {
    const response = await req.post('/register')
    .send({
      firstName: 'Name1',
      lastName: 'Last1',
      picture: 'https://somedomain.com/somepicture',
      username: 'test1test.com',
      password: 'test1Password'
    });
    expect(response.body.details.length).toBe(1);
    checkValidation(response.body, 'username');
  });
  it('should validate password', async () => {
    const response = await req.post('/register')
    .send({
      firstName: 'Name1',
      lastName: 'Last1',
      picture: 'https://somedomain.com/somepicture',
      username: 'test1@test.com',
      password: 'testPassword'
    });
    expect(response.body.details.length).toBe(1);
    checkValidation(response.body, 'password');
  });
});

describe('register', () => {
  beforeAll(async () => {
    await clearDB();
  });

  afterAll( async () => {
    await clearDB();
  });
  it('should succeed', async () => {
    const response = await req.post('/register')
      .send({
        firstName: 'Name1',
        lastName: 'Last1',
        picture: 'https://somedomain.com/somepicture',
        username: 'test1@test.com',
        password: 'test1Password'
      });
    expect(response.status).toBe(200);
    expect(response.body.fullName).toBe('Name1 Last1');
  });
  it('should fail if username already exists', async () => {
    const response = await req.post('/register')
      .send({
        firstName: 'Name1',
        lastName: 'Last1',
        picture: 'https://somedomain.com/somepicture',
        username: 'test1@test.com',
        password: 'test1Password'
      });
    expect(response.status).toBe(400);
  });
});