const requestify = require('requestify');

const baseUrl = 'https://demoqa.com';

async function authenticate(user) {
  const response = await requestify.request(`${baseUrl}/Account/v1/Login`, {
    method: 'POST',
    body: {
      userName: user.username,
      password: user.password,
    },
  });

  const body = response.getBody();
  process.env.token = body.token;
  process.env.username = body.username;
  process.env.userId = body.userId;
  process.env.expires = body.expires;

  return body;
}

async function addBook(ISBN) {
  return requestify.request(`${baseUrl}/Bookstore/v1/Books`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.token}`,
    },
    body: {
      userId: process.env.userId,
      collectionOfIsbns: [{ isbn: ISBN }],
    },
  });
}

async function deleteBook(ISBN) {
  return requestify.request(`${baseUrl}/Bookstore/v1/Book`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.token}`,
    },
    body: {
      userId: process.env.userId,
      isbn: ISBN,
    },
  });
}

module.exports = { authenticate, addBook, deleteBook };
