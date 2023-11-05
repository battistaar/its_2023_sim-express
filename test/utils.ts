import { MongoClient } from 'mongodb'

export const URL = 'http://localhost:3000/api';
export const TODO_PATH = '/todo';
export const USER_PATH = '/users';

export function checkValidation(body: any, property: string) {
  expect(body.details).toBeDefined();
  const found = body.details.find(item => item.property === property);
  expect(found).toHaveProperty('property', property);
}

async function connectToDb() {
  const client = new MongoClient('mongodb://127.0.0.1:27017/sim-todo');
  await client.connect();
  return client;
}

export async function clearDB() {
  const client = await connectToDb();
  const collections = await client.db('sim-todo').collections();
  for (const coll of collections) {
    await coll.deleteMany({});
  };
  await client.close();
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject<E = {}>(obj: E): R
    }
  }
}

expect.extend({
  toContainObject(received, argument) {

    const pass = this.equals(received, 
      expect.arrayContaining([
        expect.objectContaining(argument)
      ])
    )

    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        pass: true
      }
    } else {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
        pass: false
      }
    }
  }
})