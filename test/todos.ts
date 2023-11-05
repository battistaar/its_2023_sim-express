export async function createTodo(authToken, todoData) {
  return fetch('http://localhost:3000/api/todo',
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