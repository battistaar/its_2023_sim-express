import { URL, TODO_PATH } from "./utils";

export async function createTodo(authToken, todoData) {
  return fetch(`${URL}${TODO_PATH}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(todoData)
  })
  .then(res => res.json());
}

export async function completeTodo(authToken, id) {
  return fetch(`${URL}${TODO_PATH}/${id}/check`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  })
  .then(res => res.json());
}