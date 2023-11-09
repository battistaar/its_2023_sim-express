import request from "supertest";
import { URL, clearDB, TODO_PATH } from "./utils";
import { login, user1 } from "./users";
import { completeTodo, createTodo } from "./todos";
const req = request(URL);

describe('todo list', () => {
  let token1: string = '';
  let user1Id: string = '';
  let todo1: any = null;
  let todo2: any = null;
  let todo3: any = null;

  beforeAll(async () => {
    await clearDB();
    // create users
    let login1Data = await login(user1);
    token1 = login1Data.token;
    user1Id = login1Data.id;
    const dueDate = new Date(Date.now() + (60*60*24*1000));
    //create todos
    todo1 = await createTodo(token1, {title: 'test1'});
    todo2 = await createTodo(token1, {title: 'test2'});
    todo3 = await createTodo(token1, {title: 'test3', dueDate: dueDate});
    await completeTodo(token1, todo2.id);
  });

  afterAll( async () => {
    await clearDB();
  });

  it('should fail if no auth token', async () => {
    const response = await req.get(TODO_PATH)
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('should fail if invalid auth token', async () => {
    const response = await req.get(TODO_PATH)
    .set({'Authorization': `Bearer asd`})
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('should return non completed todos', async () => {
    const response = await req.get(TODO_PATH)
      .set({'Authorization': `Bearer ${token1}`})
      .send({});
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('should return non completed todos', async () => {
    const response = await req.get(`${TODO_PATH}?showCompleted=true`)
      .set({'Authorization': `Bearer ${token1}`})
      .send({});
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
  });

});