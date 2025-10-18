# 🍊 QuickJuice — Quick-Commerce Orange Juice Web App

A full-stack quick-commerce web application for ordering and tracking fresh orange juice deliveries. Built with React, Node.js, Express, MongoDB, and Socket.IO.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Testing](#testing)

## ✨ Features

### User Features
- 🔐 User authentication (signup, login, password reset)
- 🛒 Shopping cart with real-time updates
- 🍹 Browse products with variants (sizes, add-ons)
- 💳 Secure checkout and payment processing
- 📍 Real-time order tracking with live location updates
- 📱 Optimistic UI for instant feedback
- 🔔 Push notifications for order updates
- 👤 User profile management

### Admin Features
- 📊 Admin dashboard with analytics
- 🎯 Rider assignment and management
- 📦 Order management (view, update, cancel)
- 🍊 Product inventory management
- 📈 Real-time order statistics

### Rider Features
- 🚴 Order assignment notifications
- 📍 Live location updates
- ✅ Order status management

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Validation**: express-validator
- **Payment**: Stripe/PayPal (integration ready)
- **File Upload**: Multer
- **Security**: helmet, cors, bcrypt

### DevOps
- **Containerization**: Docker & Docker Compose
- **Process Manager**: PM2
- **Logging**: Winston

## 📁 Project Structure

```
quickjuice/
├── client/                      # Frontend application
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/                 # API client and endpoints
│   │   │   ├── client.js
│   │   │   ├── products.api.js
│   │   │   ├── orders.api.js
│   │   │   ├── cart.api.js
│   │   │   └── auth.api.js
│   │   ├── components/          # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── products/
│   │   │       ├── ProductCard.jsx
│   │   │       └── VariantSelector.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useSocket.js
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── store/               # State management
│   │   │   ├── authStore.js
│   │   │   └── cartStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
│
├── server/                      # Backend application
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── database.js
│   │   │   └── socket.js
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── rider.controller.js
│   │   ├── models/              # Database models
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   └── Rider.js
│   │   ├── routes/              # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── products.routes.js
│   │   │   ├── cart.routes.js
│   │   │   ├── orders.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── rider.routes.js
│   │   ├── middlewares/         # Custom middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── services/            # Business logic
│   │   │   ├── payment.service.js
│   │   │   ├── inventory.service.js
│   │   │   └── notification.service.js
│   │   ├── utils/               # Helper functions
│   │   │   ├── logger.js
│   │   │   └── helpers.js
│   │   ├── jobs/                # Background jobs
│   │   │   ├── orderCleanup.js
│   │   │   └── inventorySync.js
│   │   └── server.js            # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml           # Docker services configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB 6+
- Docker & Docker Compose (optional)

### Local Development Setup

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/quickjuice.git
cd quickjuice
```

#### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

#### 4. Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/quickjuice

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=quickjuice-images

# Socket.IO
SOCKET_CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📡 API Documentation

### Authentication

#### POST /api/auth/signup
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

#### POST /api/auth/login
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### POST /api/auth/refresh-token
```json
{
  "refreshToken": "your-refresh-token"
}
```

#### POST /api/auth/forgot-password
```json
{
  "email": "john@example.com"
}
```

### Products

#### GET /api/products
Query params: `?page=1&limit=10&category=juice&sort=-createdAt`

#### GET /api/products/:id

#### POST /api/products (Admin only)
```json
{
  "name": "Fresh Orange Juice",
  "description": "100% fresh squeezed oranges",
  "category": "juice",
  "variants": [
    {
      "size": "small",
      "price": 4.99,
      "stock": 50
    }
  ],
  "imageUrl": "https://..."
}
```

### Cart

#### GET /api/cart

#### POST /api/cart/add
```json
{
  "productId": "64f...",
  "variantId": "64f...",
  "quantity": 2
}
```

#### PUT /api/cart/update/:itemId
```json
{
  "quantity": 3
}
```

#### DELETE /api/cart/remove/:itemId

### Orders

#### POST /api/orders/checkout
```json
{
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "coordinates": [40.7128, -74.0060]
  },
  "paymentMethod": "card",
  "paymentDetails": {
    "stripePaymentMethodId": "pm_..."
  }
}
```

#### GET /api/orders/:id

#### POST /api/orders/:id/cancel

### Admin

#### GET /api/admin/orders

#### PUT /api/admin/orders/:id/assign-rider
```json
{
  "riderId": "64f..."
}
```

### Rider

#### PUT /api/rider/orders/:id/status
```json
{
  "status": "picked_up"
}
```

#### PUT /api/rider/location
```json
{
  "coordinates": [40.7128, -74.0060]
}
```

### Webhooks

#### POST /api/webhooks/stripe
Stripe webhook handler for payment events

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# E2E tests
npm run test:e2e
```

## 🔒 Security Notes

- [ ] Implement rate limiting on all endpoints
- [ ] Add CSRF protection for state-changing operations
- [ ] Sanitize all user inputs
- [ ] Use HTTPS in production
- [ ] Implement proper password policies
- [ ] Add API request signing for sensitive operations
- [ ] Set up Content Security Policy headers
- [ ] Regular dependency updates and security audits
- [ ] Implement proper session management
- [ ] Add request logging and monitoring

## 📦 Deployment

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-Specific Notes
- Set `NODE_ENV=production`
- Use production MongoDB cluster
- Configure Redis for session storage
- Set up CDN for static assets
- Configure load balancer
- Set up monitoring (e.g., PM2, DataDog)
- Configure logging aggregation
- Set up automated backups

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React and Vite teams
- Express.js community
- MongoDB team
- All contributors

---

**Note**: This is a starter template. Implement actual business logic, add comprehensive error handling, write tests, and follow security best practices before deploying to production.
