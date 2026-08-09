const { test, expect } = require('@playwright/test');

test('GET request with a parameterized query returns 200 and data', async ({ request }) => {
  // 1. Send an HTTP GET request with a parameterized query
  const response = await request.get('http://localhost:3000/api/jobpost/1');

  // 2. Assert the status code is 200 OK
  expect(response.status()).toBe(200);

  // 3. Assert that the response body contains data
  const body = await response.json();
  expect(body).toBeDefined();
});