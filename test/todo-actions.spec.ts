import request from "supertest";
import { URL, clearDB, checkValidation, TODO_PATH } from "./utils";
import { login, user1, user2, user3 } from "./users";
import { createTodo } from "./todos";
const req = request(URL);

describe('assign action', () => {
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

  it('should be able to assign', async () => {
    const response = await req.post(`${TODO_PATH}/${todo1.id}/assign`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({
        userId: user2Id
      });
    expect(response.body.assignedTo.id).toBe(user2Id);
  });

  it('should validate userid format', async () => {
    const response = await req.post(`${TODO_PATH}/${todo1.id}/assign`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({
        userId: 'test'
      });
    expect(response.statusCode).toBe(400);
    checkValidation(response.body, 'userId');
  });

  it('should validate user existance', async () => {
    const response = await req.post(`${TODO_PATH}/${todo1.id}/assign`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({
        userId: '652d49fb8edaa92f08249295'
      });
    expect(response.statusCode).toBe(400);
  });

  it('should validate todo existance', async () => {
    const response = await req.post(`${TODO_PATH}/652d49fb8edaa92f08249295/assign`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({
        userId: user2Id
      });
    expect(response.statusCode).toBe(404);
  });

  it('should check the owner', async () => {
    await req.post(`${TODO_PATH}/${todo1.id}/assign`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({
        userId: user2Id
      });
    
    const response1 = await req.post(`${TODO_PATH}/${todo1.id}/assign`)
      .set({'Authorization': `Bearer ${token2}`})
      .send({
        userId: user3Id
      });
    expect(response1.statusCode).toBe(404);
    const response2 = await req.post(`${TODO_PATH}/${todo1.id}/assign`)
      .set({'Authorization': `Bearer ${token3}`})
      .send({
        userId: user3Id
      });
    expect(response2.statusCode).toBe(404);
  });

  it('should only see owned and assigned', async () => {
    await req.post(`${TODO_PATH}/${todo1.id}/assign`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({
        userId: user2Id
      });
    
    const response1 = await req.get(TODO_PATH)
      .set({'Authorization': `Bearer ${token2}`})
      .send();
    expect(response1.statusCode).toBe(200);
    expect(response1.body).toHaveLength(2);
    expect(response1.body).toContainObject({id: todo1.id})
    expect(response1.body).toContainObject({id: todo2.id})
  });
});