export const user1 = {
  firstName: 'Name1',
  lastName: 'Last1',
  picture: 'https://somedomain.com/somepicture',
  username: 'test1@test.com',
  password: 'test1Password'
}

export const user2 = {
  firstName: 'Name2',
  lastName: 'Last2',
  picture: 'https://somedomain.com/somepicture',
  username: 'test2@test.com',
  password: 'test2Password'
}

export const user3 = {
  firstName: 'Name2',
  lastName: 'Last2',
  picture: 'https://somedomain.com/somepicture',
  username: 'test3@test.com',
  password: 'test3Password'
}

export async function createUser(userData: any) {
  return fetch('http://localhost:3000/api/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(res => res.json());
}

export async function login(userData: any): Promise<{id: string, token: string}> {
  await createUser(userData);
  return fetch('http://localhost:3000/api/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: userData.username, password: userData.password})
    })
    .then(res => res.json())
    .then(data => ({id: data.user.id, token: data.token}));
}