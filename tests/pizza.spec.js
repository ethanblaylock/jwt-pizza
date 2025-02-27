import { test, expect } from 'playwright-test-coverage';

async function setupRoutes(page) {
  await page.route('*/**/api/order/menu', async (route) => {
      const menuRes = [
        { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
        { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: menuRes });
    });
  
  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'POST') {
      const franchiseReq = {name: "pizzaPocket", admins: [{email: "d@jwt.com"}]};
      const franchiseRes = { name: 'pizzaPocket', admins: [{ email: 'd@jwt.com', id: 3, name: 'Kai Chen' }], id: 2 };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
      await route.fulfill({ json: franchiseRes });
    } 
    else {
      const franchiseRes = [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
    }
  });

  await page.route('*/**/api/docs', async (route) => {
    const docsRes = {
      "version": "20240518.154317",
      "endpoints": [
          {
              "method": "POST",
              "path": "/api/auth",
              "description": "Register a new user",
              "example": "curl -X POST localhost:3000/api/auth -d '{\"name\":\"pizza diner\", \"email\":\"d@jwt.com\", \"password\":\"diner\"}' -H 'Content-Type: application/json'",
              "response": {
                  "user": {
                      "id": 2,
                      "name": "pizza diner",
                      "email": "d@jwt.com",
                      "roles": [
                          {
                              "role": "diner"
                          }
                      ]
                  },
                  "token": "tttttt"
              }
          },
          {
              "method": "PUT",
              "path": "/api/auth",
              "description": "Login existing user",
              "example": "curl -X PUT localhost:3000/api/auth -d '{\"email\":\"a@jwt.com\", \"password\":\"admin\"}' -H 'Content-Type: application/json'",
              "response": {
                  "user": {
                      "id": 1,
                      "name": "常用名字",
                      "email": "a@jwt.com",
                      "roles": [
                          {
                              "role": "admin"
                          }
                      ]
                  },
                  "token": "tttttt"
              }
          },
          {
              "method": "PUT",
              "path": "/api/auth/:userId",
              "requiresAuth": true,
              "description": "Update user",
              "example": "curl -X PUT localhost:3000/api/auth/1 -d '{\"email\":\"a@jwt.com\", \"password\":\"admin\"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt'",
              "response": {
                  "id": 1,
                  "name": "常用名字",
                  "email": "a@jwt.com",
                  "roles": [
                      {
                          "role": "admin"
                      }
                  ]
              }
          },
          {
              "method": "DELETE",
              "path": "/api/auth",
              "requiresAuth": true,
              "description": "Logout a user",
              "example": "curl -X DELETE localhost:3000/api/auth -H 'Authorization: Bearer tttttt'",
              "response": {
                  "message": "logout successful"
              }
          },
          {
              "method": "GET",
              "path": "/api/order/menu",
              "description": "Get the pizza menu",
              "example": "curl localhost:3000/api/order/menu",
              "response": [
                  {
                      "id": 1,
                      "title": "Veggie",
                      "image": "pizza1.png",
                      "price": 0.0038,
                      "description": "A garden of delight"
                  }
              ]
          },
          {
              "method": "PUT",
              "path": "/api/order/menu",
              "requiresAuth": true,
              "description": "Add an item to the menu",
              "example": "curl -X PUT localhost:3000/api/order/menu -H 'Content-Type: application/json' -d '{ \"title\":\"Student\", \"description\": \"No topping, no sauce, just carbs\", \"image\":\"pizza9.png\", \"price\": 0.0001 }'  -H 'Authorization: Bearer tttttt'",
              "response": [
                  {
                      "id": 1,
                      "title": "Student",
                      "description": "No topping, no sauce, just carbs",
                      "image": "pizza9.png",
                      "price": 0.0001
                  }
              ]
          },
          {
              "method": "GET",
              "path": "/api/order",
              "requiresAuth": true,
              "description": "Get the orders for the authenticated user",
              "example": "curl -X GET localhost:3000/api/order  -H 'Authorization: Bearer tttttt'",
              "response": {
                  "dinerId": 4,
                  "orders": [
                      {
                          "id": 1,
                          "franchiseId": 1,
                          "storeId": 1,
                          "date": "2024-06-05T05:14:40.000Z",
                          "items": [
                              {
                                  "id": 1,
                                  "menuId": 1,
                                  "description": "Veggie",
                                  "price": 0.05
                              }
                          ]
                      }
                  ],
                  "page": 1
              }
          },
          {
              "method": "POST",
              "path": "/api/order",
              "requiresAuth": true,
              "description": "Create a order for the authenticated user",
              "example": "curl -X POST localhost:3000/api/order -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"storeId\":1, \"items\":[{ \"menuId\": 1, \"description\": \"Veggie\", \"price\": 0.05 }]}'  -H 'Authorization: Bearer tttttt'",
              "response": {
                  "order": {
                      "franchiseId": 1,
                      "storeId": 1,
                      "items": [
                          {
                              "menuId": 1,
                              "description": "Veggie",
                              "price": 0.05
                          }
                      ],
                      "id": 1
                  },
                  "jwt": "1111111111"
              }
          },
          {
              "method": "GET",
              "path": "/api/franchise",
              "description": "List all the franchises",
              "example": "curl localhost:3000/api/franchise",
              "response": [
                  {
                      "id": 1,
                      "name": "pizzaPocket",
                      "stores": [
                          {
                              "id": 1,
                              "name": "SLC"
                          }
                      ]
                  }
              ]
          },
          {
              "method": "GET",
              "path": "/api/franchise/:userId",
              "requiresAuth": true,
              "description": "List a user's franchises",
              "example": "curl localhost:3000/api/franchise/4  -H 'Authorization: Bearer tttttt'",
              "response": [
                  {
                      "id": 2,
                      "name": "pizzaPocket",
                      "admins": [
                          {
                              "id": 4,
                              "name": "pizza franchisee",
                              "email": "f@jwt.com"
                          }
                      ],
                      "stores": [
                          {
                              "id": 4,
                              "name": "SLC",
                              "totalRevenue": 0
                          }
                      ]
                  }
              ]
          },
          {
              "method": "POST",
              "path": "/api/franchise",
              "requiresAuth": true,
              "description": "Create a new franchise",
              "example": "curl -X POST localhost:3000/api/franchise -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt' -d '{\"name\": \"pizzaPocket\", \"admins\": [{\"email\": \"f@jwt.com\"}]}'",
              "response": {
                  "name": "pizzaPocket",
                  "admins": [
                      {
                          "email": "f@jwt.com",
                          "id": 4,
                          "name": "pizza franchisee"
                      }
                  ],
                  "id": 1
              }
          },
          {
              "method": "DELETE",
              "path": "/api/franchise/:franchiseId",
              "requiresAuth": true,
              "description": "Delete a franchises",
              "example": "curl -X DELETE localhost:3000/api/franchise/1 -H 'Authorization: Bearer tttttt'",
              "response": {
                  "message": "franchise deleted"
              }
          },
          {
              "method": "POST",
              "path": "/api/franchise/:franchiseId/store",
              "requiresAuth": true,
              "description": "Create a new franchise store",
              "example": "curl -X POST localhost:3000/api/franchise/1/store -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"name\":\"SLC\"}' -H 'Authorization: Bearer tttttt'",
              "response": {
                  "id": 1,
                  "franchiseId": 1,
                  "name": "SLC"
              }
          },
          {
              "method": "DELETE",
              "path": "/api/franchise/:franchiseId/store/:storeId",
              "requiresAuth": true,
              "description": "Delete a store",
              "example": "curl -X DELETE localhost:3000/api/franchise/1/store/1  -H 'Authorization: Bearer tttttt'",
              "response": {
                  "message": "store deleted"
              }
          }
      ],
      "config": {
          "factory": "https://pizza-factory.cs329.click",
          "db": "localhost"
      }
  };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: docsRes });
  });
      
}

async function orderRoutes(page) {
  await page.route('*/**/api/order', async (route) => {
    if (route.request().method() === 'GET') {
      const orderRes = { orders: [] };
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: orderRes });
    }
    else {
      const orderReq = {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
      };
      const orderRes = {
        order: {
          items: [
            { menuId: 1, description: 'Veggie', price: 0.0038 },
            { menuId: 2, description: 'Pepperoni', price: 0.0042 },
          ],
          storeId: '4',
          franchiseId: 2,
          id: 23,
        },
        jwt: 'eyJpYXQ',
      };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(orderReq);
      await route.fulfill({ json: orderRes });
    }
  });
}

async function dinerRoutes(page) {
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'PUT') {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } 
    else if (route.request().method() === 'POST') {
      const registerReq = { email: 'd@jwt.com', password: 'a', name: 'Kai Chen' };
      const registerRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(registerReq);
      await route.fulfill({ json: registerRes });
    }
    else {
    const logoutRes = { message: 'logout successful' };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
    }
  });
}

async function franchiseRoutes(page) {
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'PUT') {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'franchisee', objectId: '2'  }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } 
    else if (route.request().method() === 'POST') {
      const registerReq = { email: 'd@jwt.com', password: 'a', name: 'Kai Chen' };
      const registerRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'franchisee', objectId: '2' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(registerReq);
      await route.fulfill({ json: registerRes });
    }
    else {
    const logoutRes = { message: 'logout successful' };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
    }
  });

  await page.route('*/**/api/franchise/*', async (route) => {
    const franchiseRes = [{ id: 2, name: 'pizzaPocket', admins: [{ id: 3, name: 'Kai Chen', email: 'd@jwt.com' }], stores: [{ id: 4, name: 'SLC', totalRevenue: 0 }] }];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/franchise/*/store', async (route) => {
    const storeRes = { id: 1, name: 'byu', totalRevenue: 0 };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: storeRes });
  });

  await page.route('*/**/api/franchise/*/store/*', async (route) => {
    const storeRes = { message: 'store deleted' };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: storeRes });
  });
}

async function adminRoutes(page) {
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'PUT') {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } 
    else if (route.request().method() === 'POST') {
      const registerReq = { email: 'd@jwt.com', password: 'a', name: 'Kai Chen' };
      const registerRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(registerReq);
      await route.fulfill({ json: registerRes });
    }
    else {
    const logoutRes = { message: 'logout successful' };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
    }
  });

}

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('purchase with login', async ({ page }) => {
    
    await setupRoutes(page);
    await dinerRoutes(page);
    await orderRoutes(page);
    await page.goto('/');
  
    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();
  
    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('button', { name: 'Pay Now' }).click();
    // Check balance
    await expect(page.getByText('0.008')).toBeVisible();
  });

  test('verify purchase', async ({ page }) => {
    
    await setupRoutes(page);
    await dinerRoutes(page);
    await orderRoutes(page);
    await page.goto('/');
  
    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();
  
    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('button', { name: 'Pay Now' }).click();
    // Check balance
    await expect(page.getByText('0.008')).toBeVisible();
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByRole('heading', { name: 'JWT Pizza - invalid' })).toBeVisible();
  });

  test('order error', async ({ page }) => {
    await setupRoutes(page);
    await dinerRoutes(page);
    await page.goto('/');
  
    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();
  
    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();
    await expect(page.getByText('⚠️ unauthorized')).toBeVisible();
  });

  test('plain pages', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByRole('main').getByRole('img').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^James$/ }).getByRole('img')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Maria$/ }).getByRole('img')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Anna$/ }).getByRole('img')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Brian$/ }).getByRole('img')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Our employees' })).toBeVisible();
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
    await expect(page.getByRole('main').getByRole('img')).toBeVisible();

  });

  test('logout', async ({ page }) => {
    await setupRoutes(page);
    await dinerRoutes(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Logout' }).click();
  });

  test('register', async ({ page }) => {

    await setupRoutes(page);
    await dinerRoutes(page);
    await page.goto('/');
    await page.getByRole('link', { name: 'Register', exact: true }).click();
    await page.getByRole('textbox', { name: 'Full name' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('Kai Chen');
    await page.getByRole('textbox', { name: 'Full name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByRole('link', { name: 'home' }).click();
  });

  test('not found', async ({ page }) => {
    await page.goto('/');
    await page.goto('/logi');
    await expect(page.getByText('Oops')).toBeVisible();
  });

  test('diner dashboard', async ({ page }) => {
    await setupRoutes(page);
    await dinerRoutes(page);
    await orderRoutes(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'KC' }).click();
    await expect(page.getByText('Your pizza kitchen')).toBeVisible();
    await expect(page.getByText('How have you lived this long')).toBeVisible();
    await page.getByRole('link', { name: 'Buy one' }).click();

  });

  test('franchise dashboard as diner', async ({ page }) => {
    await setupRoutes(page);
    await dinerRoutes(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByText('So you want a piece of the')).toBeVisible();
  });

  test('franchise dashboard as franchisee', async ({ page }) => {
    await setupRoutes(page);
    await franchiseRoutes(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByText('Everything you need to run an')).toBeVisible();
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByRole('textbox', { name: 'store name' }).click();
    await page.getByRole('textbox', { name: 'store name' }).fill('byu');
    await page.getByRole('button', { name: 'Create' }).click();
  });

  test('close store', async ({ page }) => {
    await setupRoutes(page);
    await franchiseRoutes(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Are you sure you want to')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
  });

  test('admin dashboard', async ({ page }) => {
    await setupRoutes(page);
    await adminRoutes(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByText('Keep the dough rolling and')).toBeVisible();
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).fill('pizzaPocket');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('d@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();
  });

  test('docs', async ({ page }) => {
    await setupRoutes(page);
    await page.goto('/docs');
    await expect(page.locator('#root')).toBeVisible();
  });

  test('verify jwt', async ({ page }) => {
    await setupRoutes(page);
    await adminRoutes(page);
    await page.goto('/');
    
  });