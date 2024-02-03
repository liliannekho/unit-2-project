<h1>Shopping Cart API</h1>

<h2>API Description</h2>

<p> This app is used for online shopping websites with the functionality of creating a user, picking items and creating a cart.</p>

<h2>Installing the API</h2>
<ol>
    <li>Create a new directory for the API (mkdir)</li>
    <li>cd into the  new directory</li>
    <li>Git clone repository into directory: git clone "paste SSH-key git clone link"</li>
    <li>cd into the cloned file</li>
    <li>touch .env</li>
    <li>code .</li>
    <li>Input your MONGO URI string into the .env file</li>
    <li>Install dependencies using: npm i</li>
    <li>Start the app using: npm run dev</li>
</ol>

## Endpoints & Routes

### Cart Posts:

| Endpoints: |  |  |
| ---- | ---- | ---- |
| POST | /carts |Creates cart |
| GET | /carts/:id | Returns user's cart |
| PUT | /carts/:id | Updates user's cart |
| DEL | /cart/:id | Deletes cart |

```js
router.post('/', cartController.createCart) //

// Get a user's cart
router.get('/:userId', cartController.getCart) //postman test good

// Update a user's cart
router.put('/:userId', cartController.updateCart) 

// Delete a user's cart
router.delete('/:userId', cartController.deleteCart)
```
### Users:

| Endpoints: |  |  |
| ---- | ---- | ---- |
| POST | /users | Accepts user data and creates a new user |
| PUT | /users/login | User is able to log in |
| PUT | /users/:id | Updates a user |
| DEL | /users/:id | Deletes a user |

```js
// userRoutes - .routes/userRoutes

router.post('/', userController.createUser) // create user
router.post('/login', userController.loginUser) // logs in user
router.put('/:id', userController.updateUser) // updates user
router.delete('/:id', userController.auth, userController.deleteUser) // deletes a user
```

### Items Posts:

| Endpoints: |  |  |
| ---- | ---- | ---- |
| POST | /items/create |Creates item |
| GET | /items | Returns all items |
| GET | /items/:id | Returns a single item by id |
| PUT | /items/:id | Updates user's item |
| DEL | /items/:id | Deletes item |

```js
router.post('/create', itemsController.createItem) 

// Get all items
router.get('/', itemsController.getAllItems)

// Get a single item by ID
router.get('/:id', itemsController.getItembyId) 

// Update an item by ID
router.put('/:id', itemsController.updateItem) 

// Delete an item by ID
router.delete('/:id', itemsController.deleteItem)
