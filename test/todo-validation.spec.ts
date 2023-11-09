import request from "supertest";
import { URL, clearDB, checkValidation, TODO_PATH } from "./utils";
import { login, user1 } from "./users";
const req = request(URL);

describe('todo validation', () => {
  let token: string = '';

  beforeAll(async () => {
    await clearDB();
    let loginData = await login(user1);
    token = loginData.token;
  });

  afterAll( async () => {
    await clearDB();
  });

  it('should fail if title is missing', async () => {
    const response = await req.post(TODO_PATH)
      .set({'Authorization': `Bearer ${token}`})
      .send({
        dueDate: '2023-11-01'
      });
      checkValidation(response.body, 'title');
  });

  it('should validate dueDate format', async () => {
    const response = await req.post(TODO_PATH)
      .set({'Authorization': `Bearer ${token}`})
      .send({
        title: 'test1',
        dueDate: '2023-14-01'
      });
      checkValidation(response.body, 'dueDate');
  });

  it('should validate assignedTo format', async () => {
    const response = await req.post(TODO_PATH)
      .set({'Authorization': `Bearer ${token}`})
      .send({
        title: 'test1',
        assignedTo: 'test'
      });
      checkValidation(response.body, 'assignedTo');
  });

  it('should validate assignedTo existance', async () => {
    const response = await req.post(TODO_PATH)
      .set({'Authorization': `Bearer ${token}`})
      .send({
        title: 'test1',
        assignedTo: '652d49fb8edaa92f08249295'
      });
      checkValidation(response.body, 'assignedTo');
  });
});