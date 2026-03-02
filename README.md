📦 Ecommerce Backend API

A robust and scalable Ecommerce Backend API built using Node.js, Express, MongoDB.
This backend handles authentication, product management, cart functionality, order processing, and real-time updates.

🚀 Tech Stack

Node.js

Express.js

MongoDB & Mongoose

JWT Authentication

Bcrypt.js

Socket.io

REST API

Postman (API Testing)

📂 Project Structure
ecommerce-backend/
│── middleware/
│── models/
│── routes/
│── utils/
│── server.js
│── package.json
│── package-lock.json
│── .env
🔑 Features

User Registration & Login

Secure Password Hashing

JWT Authentication & Authorization

Product CRUD Operations

Cart Management

Order Management

Real-time Updates using Socket.io

Environment Variable Configuration

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/ecommerce-backend.git
2. Navigate to project directory
cd ecommerce-backend
3. Install dependencies
npm install
4. Create a .env file in root directory
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
5. Run the server
npm start

Server will run at:

http://localhost:5000
📌 API Endpoints
🔐 Authentication

POST /api/auth/register

POST /api/auth/login

🛍 Products

GET /api/products

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id

📦 Orders

POST /api/orders

GET /api/orders

🛠 Future Improvements

Payment Gateway Integration

Admin Dashboard

Cloud Deployment (Render / Railway)

CI/CD Integration

👨‍💻 Author

Swarnava Ghosh
IT Student | Full Stack Developer
