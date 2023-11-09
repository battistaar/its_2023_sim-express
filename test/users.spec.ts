import request from "supertest";
import { login, user1, user2, user3 } from "./users";
import { URL, USER_PATH, clearDB } from "./utils";
const req = request(URL);

describe('uncheck action', () => {
  let token1: string = '';
  let user1Id: string = '';
  let user2Id: string = '';
  let user3Id: string = '';


  beforeAll(async () => {
    await clearDB();
    // create users
    let login1Data = await login(user1);
    token1 = login1Data.token;
    user1Id = login1Data.id;
    let login2Data = await login(user2);
    user2Id = login2Data.id;
    let login3Data = await login(user3);
    user3Id = login3Data.id;
  });

  afterAll( async () => {
    await clearDB();
  });

  it('should fail if no auth token', async () => {
    const response = await req.get(USER_PATH)
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('should fail if invalid auth token', async () => {
    const response = await req.get(USER_PATH)
    .set({'Authorization': `Bearer asd`})
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })


  it('should return the list of users', async () => {
    const response = await req.get(USER_PATH)
      .set({'Authorization': `Bearer ${token1}`})
      .send({});
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
  });

});