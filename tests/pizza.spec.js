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
        } else {
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
    await page.goto('/docs');
    await expect(page.getByText('JWT Pizza API')).toBeVisible();
  });