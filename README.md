summary of the API operations with examples:

1. Register User: 
   - POST `/register` with name, email, and password
   - Example: `{"name": "John Doe", "email": "john@example.com", "password": "123456"}`
   - Returns: `{"message": "User registered"}`

2. Login: 
   - POST `/login` with email and password
   - Example: `{"email": "john@example.com", "password": "123456"}`
   - Returns: JWT token `{"message": "success", "token": "eyJhbG..."}`

3. Get Products:
   - GET `/products` with JWT token in Authorization header
   - Returns: Array of products `[{"_id": "123", "name": "Widget", "role": "featured"}]`

4. Add Product:
   - POST `/product` with JWT token and product details
   - Example: `{"name": "Super Widget", "role": "premium"}`
   - Returns: `{"message": "product added successfully"}`

All protected endpoints require "Bearer" token in Authorization header. Responses use standard HTTP status codes (200, 400, 401, 500) for success and various error conditions.

Here is an sample of the data already stored in the API:
{
    "name" : "admon",
    "email" : "admin@gmail.com",
    "password" : "admin1"
}
