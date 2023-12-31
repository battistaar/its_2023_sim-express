import request from "supertest";
import { URL, clearDB, TODO_PATH } from "./utils";
import { login, user1, user2 } from "./users";
const req = request(URL);


describe('todo creation', () => {
  let token1: string = '';
  let user1Id: string = '';
  let user2Id: string = '';

  beforeAll(async () => {
    await clearDB();
    let login1Data = await login(user1);
    token1 = login1Data.token;
    user1Id = login1Data.id;
    let login2Data = await login(user2);
    user2Id = login2Data.id;
  });

  afterAll( async () => {
    await clearDB();
  });

  it('should fail if no auth token', async () => {
    const response = await req.post(TODO_PATH)
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('should fail if invalid auth token', async () => {
    const response = await req.post(TODO_PATH)
    .set({'Authorization': `Bearer asd`})
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(401);
  })

  it('should create a todo with only title', async () => {
    const response = await req.post(TODO_PATH)
    .set({'Authorization': `Bearer ${token1}`})
    .send({
      title: 'test1'
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('test1');
    expect(response.body.dueDate).toBeUndefined();
    expect(response.body.assignedTo).toBeUndefined();
    expect(response.body.createdBy.id).toBe(user1Id);
    expect(response.body.expired).toBeFalsy();
  });

  it('should create a todo with dueDate', async () => {
    const testDate = new Date('2023-12-10');
    const response = await req.post(TODO_PATH)
    .set({'Authorization': `Bearer ${token1}`})
    .send({
      title: 'test1',
      dueDate: testDate
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('test1');
    expect(new Date(response.body.dueDate)).toEqual(testDate);
    expect(response.body.assignedTo).toBeUndefined();
    expect(response.body.createdBy.id).toBe(user1Id);
    expect(response.body.expired).toBeFalsy();
  });

  it('should create an expired todo', async () => {
    const testDate = new Date('2023-06-10');
    const response = await req.post(TODO_PATH)
    .set({'Authorization': `Bearer ${token1}`})
    .send({
      title: 'test1',
      dueDate: testDate
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('test1');
    expect(new Date(response.body.dueDate)).toEqual(testDate);
    expect(response.body.assignedTo).toBeUndefined();
    expect(response.body.createdBy.id).toBe(user1Id);
    expect(response.body.expired).toBe(true);
  });

  it('should create a todo with assignedTo', async () => {
    const testDate = new Date('2023-11-10');
    const response = await req.post(TODO_PATH)
    .set({'Authorization': `Bearer ${token1}`})
    .send({
      title: 'test1',
      assignedTo: user2Id
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('test1');
    expect(response.body.dueDate).toBeUndefined();
    expect(response.body.assignedTo.id).toBe(user2Id);
    expect(response.body.createdBy.id).toBe(user1Id);
    expect(response.body.expired).toBeFalsy();
  });

  it('should create a todo with all fields', async () => {
    const testDate = new Date('2023-11-10');
    const response = await req.post(TODO_PATH)
    .set({'Authorization': `Bearer ${token1}`})
    .send({
      title: 'test1',
      dueDate: testDate,
      assignedTo: user2Id
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('test1');
    expect(new Date(response.body.dueDate)).toEqual(testDate);
    expect(response.body.assignedTo.id).toBe(user2Id);
    expect(response.body.createdBy.id).toBe(user1Id);
    expect(response.body.expired).toBeFalsy();
  });
})