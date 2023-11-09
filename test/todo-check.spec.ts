import request from "supertest";
import { URL, clearDB, TODO_PATH } from "./utils";
import { login, user1, user2, user3 } from "./users";
import { createTodo, completeTodo } from "./todos";
const req = request(URL);

describe('check action', () => {
  let token1: string = '';
  let user1Id: string = '';
  let token2: string = '';
  let user2Id: string = '';
  let token3: string = '';
  let user3Id: string = '';
  let todo1: any = null;
  let todo2: any = null;
  let todo3: any = null;

  beforeAll(async () => {
    await clearDB();
    // create users
    let login1Data = await login(user1);
    token1 = login1Data.token;
    user1Id = login1Data.id;
    let login2Data = await login(user2);
    token2 = login2Data.token;
    user2Id = login2Data.id;
    let login3Data = await login(user3);
    token3 = login3Data.token;
    user3Id = login3Data.id;

    //create todos
    todo1 = await createTodo(token1, {title: 'test1'});
    todo2 = await createTodo(token2, {title: 'test2'});
    todo3 = await createTodo(token1, {title: 'test3'});
  });

  afterAll( async () => {
    await clearDB();
  });

  it('should fail if no auth token', async () => {
    const response = await req.patch(`${TODO_PATH}/${todo1.id}/check`)
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('should fail if invalid auth token', async () => {
    const response = await req.patch(`${TODO_PATH}/${todo1.id}/check`)
    .set({'Authorization': `Bearer asd`})
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('owner should be able to check', async () => {
    const response = await req.patch(`${TODO_PATH}/${todo1.id}/check`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({});
    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  it('other users should not be able to check', async () => {
    const response = await req.patch(`${TODO_PATH}/${todo1.id}/check`)
      .set({'Authorization': `Bearer ${token2}`})
      .send({});
    expect(response.statusCode).toBe(404);
  });

  it('assigned user should be able to check', async () => {
    await req.post(`${TODO_PATH}/${todo2.id}/assign`)
      .set({'Authorization': `Bearer ${token2}`})
      .send({
        userId: user3Id
      });
    const response = await req.patch(`${TODO_PATH}/${todo2.id}/check`)
      .set({'Authorization': `Bearer ${token3}`})
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
  });

});


describe('uncheck action', () => {
  let token1: string = '';
  let user1Id: string = '';
  let token2: string = '';
  let user2Id: string = '';
  let token3: string = '';
  let user3Id: string = '';
  let todo1: any = null;
  let todo2: any = null;
  let todo3: any = null;

  beforeAll(async () => {
    await clearDB();
    // create users
    let login1Data = await login(user1);
    token1 = login1Data.token;
    user1Id = login1Data.id;
    let login2Data = await login(user2);
    token2 = login2Data.token;
    user2Id = login2Data.id;
    let login3Data = await login(user3);
    token3 = login3Data.token;
    user3Id = login3Data.id;

    //create todos
    todo1 = await createTodo(token1, {title: 'test1'});
    todo2 = await createTodo(token2, {title: 'test2'});
    todo3 = await createTodo(token1, {title: 'test3'});
    await completeTodo(token1, todo1.id);
    await completeTodo(token2, todo2.id);
    await completeTodo(token3, todo3.id);
  });

  afterAll( async () => {
    await clearDB();
  });

  it('should fail if no auth token', async () => {
    const response = await req.patch(`${TODO_PATH}/${todo1.id}/uncheck`)
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('should fail if invalid auth token', async () => {
    const response = await req.patch(`${TODO_PATH}/${todo1.id}/uncheck`)
    .set({'Authorization': `Bearer asd`})
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('owner should be able to uncheck', async () => {
    const response = await req.patch(`${TODO_PATH}/${todo1.id}/uncheck`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({});
    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(false);
  });

  it('other users should not be able to uncheck', async () => {
    const response = await req.patch(`${TODO_PATH}/${todo1.id}/uncheck`)
      .set({'Authorization': `Bearer ${token2}`})
      .send({});
    expect(response.statusCode).toBe(404);
  });

  it('assigned user should be able to uncheck', async () => {
    await req.post(`${TODO_PATH}/${todo2.id}/assign`)
      .set({'Authorization': `Bearer ${token2}`})
      .send({
        userId: user3Id
      });
    const response = await req.patch(`${TODO_PATH}/${todo2.id}/uncheck`)
      .set({'Authorization': `Bearer ${token3}`})
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(false);
  });

});

