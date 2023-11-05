import request from "supertest";
import { URL, clearDB } from "./utils";
import { createUser, user1, user2 } from "./users";
import * as jwt from 'jsonwebtoken';
const JWT_SECRET = 'my_jwt_secret';

const req = request(URL);

describe('login', () => {
  let userToken = '';
  beforeAll(async () => {
    await clearDB();
    await createUser(user1);
    await createUser(user2);
  });

  afterAll(async () => {
    await clearDB();
  })

  it('should succeed', async () => {
    const response = await req.post('/login')
    .send({
      username: user1.username,
      password: user1.password
    });
    expect(response.statusCode).toBe(200);
    const validJwt: any = jwt.verify(response.body.token, JWT_SECRET);
    expect(validJwt.firstName).toBe(user1.firstName);
  });

  it('should fail for invalid username', async () => {
    const response = await req.post('/login')
    .send({
      username: 'test@test.com',
      password: user1.password
    });
    expect(response.statusCode).toBe(400);
  });

  it('should fail for invalid password', async () => {
    const response = await req.post('/login')
    .send({
      username: user1.username,
      password: 'wrongPassword'
    });
    expect(response.statusCode).toBe(400);
  });
});