# 🍊 QuickJuice Project - Complete Folder Structure

## Project Root
```
quickjuice/
├── client/                          # Frontend React application
├── server/                          # Backend Node.js application
├── docker-compose.yml               # Docker orchestration
├── .gitignore                       # Git ignore rules
└── README.md                        # Main documentation
```

## Backend Structure (`server/`)
```
server/
├── src/
│   ├── config/
│   │   ├── database.js              # MongoDB connection setup
│   │   └── socket.js                # Socket.IO configuration & handlers
│   │
│   ├── controllers/
│   │   ├── auth.controller.js       # Authentication (signup, login, forgot password, etc.)
│   │   ├── product.controller.js    # Product CRUD operations ⭐ EXAMPLE
│   │   ├── cart.controller.js       # Cart management
│   │   ├── order.controller.js      # Order checkout, tracking, cancel
│   │   ├── admin.controller.js      # Admin dashboard, stats, rider assignment
│   │   └── rider.controller.js      # Rider status, location, order updates
│   │
│   ├── models/
│   │   ├── User.js                  # User schema (customer/admin/rider)
│   │   ├── Product.js               # Product schema with variants
│   │   ├── Cart.js                  # Shopping cart schema
│   │   ├── Order.js                 # Order schema with status tracking
│   │   └── Rider.js                 # Rider profile & stats
│   │
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth/*
│   │   ├── products.routes.js       # /api/products/*
│   │   ├── cart.routes.js           # /api/cart/*
│   │   ├── orders.routes.js         # /api/orders/*
│   │   ├── admin.routes.js          # /api/admin/*
│   │   └── rider.routes.js          # /api/rider/*
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT authentication & authorization
│   │   ├── error.middleware.js      # Global error handler
│   │   └── validate.middleware.js   # Request validation with express-validator
│   │
│   ├── services/
│   │   ├── payment.service.js       # Payment processing (Stripe, COD, Wallet)
│   │   ├── inventory.service.js     # Stock management & sync
│   │   └── notification.service.js  # Email, SMS, push notifications
│   │
│   ├── utils/
│   │   ├── logger.js                # Winston logger setup
│   │   └── helpers.js               # Utility functions (distance calc, formatting, etc.)
│   │
│   ├── jobs/
│   │   ├── orderCleanup.js          # Cleanup old/abandoned orders
│   │   └── inventorySync.js         # Sync stock with external systems
│   │
│   └── server.js                    # Main entry point
│
├── logs/                            # Log files (auto-generated)
├── .env.example                     # Environment variables template
├── Dockerfile                       # Backend Docker image
└── package.json                     # Backend dependencies
```

## Frontend Structure (`client/`)
```
client/
├── public/
│   └── vite.svg                     # Public assets
│
├── src/
│   ├── api/
│   │   ├── client.js                # Axios instance with interceptors
│   │   ├── auth.api.js              # Auth API calls
│   │   ├── products.api.js          # Products API calls
│   │   ├── orders.api.js            # Orders API calls
│   │   └── cart.api.js              # Cart API calls
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx           # Reusable button component
│   │   │   ├── Input.jsx            # Form input component
│   │   │   └── Toast.jsx            # Notification toast
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── Footer.jsx           # Footer
│   │   │
│   │   └── products/
│   │       ├── ProductCard.jsx      # Product card ⭐ EXAMPLE COMPONENT
│   │       └── VariantSelector.jsx  # Size/variant selector
│   │
│   ├── hooks/
│   │   ├── useAuth.js               # Authentication hook
│   │   ├── useCart.js               # Cart operations hook
│   │   └── useSocket.js             # Socket.IO connection hook
│   │
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Products.jsx             # Products listing with filters
│   │   ├── ProductDetail.jsx        # Single product view
│   │   ├── Cart.jsx                 # Shopping cart
│   │   ├── Checkout.jsx             # Checkout flow
│   │   ├── OrderTracking.jsx        # Real-time order tracking
│   │   ├── Profile.jsx              # User profile
│   │   └── AdminDashboard.jsx       # Admin panel
│   │
│   ├── store/
│   │   ├── authStore.js             # Zustand auth state
│   │   └── cartStore.js             # Zustand cart state
│   │
│   ├── App.jsx                      # Main app component with routing
│   ├── main.jsx                     # React entry point
│   └── styles.css                   # Tailwind CSS with custom styles
│
├── .env.example                     # Frontend env variables
├── Dockerfile                       # Frontend Docker image
├── nginx.conf                       # Nginx configuration for production
├── package.json                     # Frontend dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
└── eslint.config.js                 # ESLint configuration
```

## Key Files Documentation

### Backend

#### **Models**
- `User.js` - User authentication, roles (customer/admin/rider), address management
- `Product.js` - Products with variants (sizes), images, nutritional info, ratings
- `Cart.js` - User shopping cart with items, coupons, price calculations
- `Order.js` - Order lifecycle, status tracking, payment, delivery details
- `Rider.js` - Rider profiles, location tracking, delivery stats

#### **Controllers**
- `auth.controller.js` - JWT authentication, password reset, profile management
- `product.controller.js` ⭐ - Full CRUD, search, filtering, stock management
- `cart.controller.js` - Add/update/remove items, coupon application
- `order.controller.js` - Checkout, payment processing, order tracking, ratings
- `admin.controller.js` - Dashboard stats, order management, rider assignment
- `rider.controller.js` - Accept orders, update status, location tracking

#### **Services**
- `payment.service.js` - Stripe integration, COD, wallet payments, refunds
- `inventory.service.js` - Stock checks, updates, low-stock alerts, sync
- `notification.service.js` - Email (nodemailer), SMS, push notifications

#### **Middlewares**
- `auth.middleware.js` - JWT verification, role-based access control
- `error.middleware.js` - Centralized error handling
- `validate.middleware.js` - express-validator rules for all routes

### Frontend

#### **Components**
- `ProductCard.jsx` ⭐ - Featured product card with animations, add to cart, favorites
- `Navbar.jsx` - Navigation with cart count, user menu, mobile responsive
- `Footer.jsx` - Site footer with links and info

#### **Pages**
- `Home.jsx` - Hero section, featured products, categories
- `Products.jsx` - Product grid with filters (category, price, search)
- `ProductDetail.jsx` - Detailed view with variant selector, add to cart
- `Cart.jsx` - Cart items, quantity updates, coupon input, checkout button
- `Checkout.jsx` - Delivery address, payment method, order summary
- `OrderTracking.jsx` - Real-time order status, rider location on map
- `Profile.jsx` - User info, order history, saved addresses
- `AdminDashboard.jsx` - Orders management, rider assignment, stats

#### **Hooks**
- `useAuth.js` - Login, logout, token management, user state
- `useCart.js` - Cart operations with optimistic UI updates
- `useSocket.js` - WebSocket connection for real-time updates

#### **Store (Zustand)**
- `authStore.js` - Global authentication state
- `cartStore.js` - Global cart state with persistence

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password
- `GET /me` - Get current user (protected)
- `PUT /update-profile` - Update user profile (protected)
- `POST /logout` - Logout user (protected)

### Products (`/api/products/`)
- `GET /` - List products with pagination, filters
- `GET /featured` - Get featured products
- `GET /:id` - Get single product
- `POST /` - Create product (admin)
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)
- `PATCH /:id/stock` - Update stock (admin)

### Cart (`/api/cart/`)
- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /update/:itemId` - Update item quantity
- `DELETE /remove/:itemId` - Remove item
- `DELETE /clear` - Clear cart
- `POST /apply-coupon` - Apply discount coupon
- `DELETE /remove-coupon` - Remove coupon

### Orders (`/api/orders/`)
- `POST /checkout` - Create order from cart
- `GET /` - Get user orders
- `GET /:id` - Get order details
- `POST /:id/cancel` - Cancel order
- `POST /:id/rate` - Rate delivered order

### Admin (`/api/admin/`)
- `GET /stats` - Dashboard statistics
- `GET /orders` - All orders with filters
- `PUT /orders/:id/status` - Update order status
- `PUT /orders/:id/assign-rider` - Assign rider
- `GET /riders` - All riders
- `GET /products` - All products (admin view)
- `GET /users` - All users

### Rider (`/api/rider/`)
- `GET /profile` - Rider profile
- `PUT /status` - Update online/offline status
- `PUT /location` - Update current location
- `GET /orders` - Assigned orders
- `GET /history` - Delivery history
- `PUT /orders/:id/status` - Update order status
- `POST /orders/:id/accept` - Accept order

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhook

## WebSocket Events

### Client → Server
- `rider:location` - Rider sends location update
- `rider:join-order` - Rider joins order room
- `customer:join-order` - Customer joins order room

### Server → Client
- `order:new` - New order notification (admin)
- `order:status` - Order status update
- `order:location` - Rider location update
- `order:rider-assigned` - Rider assigned to order
- `order:cancelled` - Order cancelled
- `order:accepted` - Rider accepted order

## Environment Variables

### Backend (`.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickjuice
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SOCKET_CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Docker Services

```yaml
services:
  - mongodb (port 27017)
  - backend (port 5000)
  - frontend (port 5173)
  - redis (port 6379) - optional
```

## Tech Stack Summary

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.IO
- **Payment**: Stripe
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs
- **Logging**: Winston
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (frontend)
- **Process Manager**: PM2 (optional)

## Development Workflow

1. **Setup**
   ```bash
   # Clone repository
   git clone <repo-url>
   cd quickjuice
   
   # Backend setup
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your values
   npm run dev
   
   # Frontend setup (new terminal)
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env with backend URL
   npm run dev
   ```

2. **Using Docker**
   ```bash
   docker-compose up -d
   ```

3. **Access**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

## Testing
- Backend: `npm test` (Jest + Supertest)
- Frontend: `npm test` (Vitest + React Testing Library)

## TODO: Implementation Notes

### Backend
- [ ] Implement file upload for product images (Multer + S3)
- [ ] Add Redis for session storage and caching
- [ ] Implement rate limiting for all endpoints
- [ ] Add comprehensive logging for all operations
- [ ] Implement email templates for notifications
- [ ] Add SMS notifications (Twilio)
- [ ] Implement push notifications (FCM)
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Implement API documentation (Swagger)

### Frontend
- [ ] Implement all page components
- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Add form validation
- [ ] Implement real-time order tracking map
- [ ] Add payment form (Stripe Elements)
- [ ] Implement image optimization
- [ ] Add PWA support
- [ ] Implement accessibility features
- [ ] Add E2E tests (Playwright/Cypress)

## Notes for Developers

1. **Security**: Always validate user input, sanitize data, use HTTPS in production
2. **Performance**: Implement caching, lazy loading, code splitting
3. **Scalability**: Use horizontal scaling, load balancers, CDN
4. **Monitoring**: Set up error tracking (Sentry), analytics
5. **Documentation**: Keep API docs updated, add JSDoc comments
6. **Testing**: Write tests for critical flows
7. **Code Quality**: Use ESLint, Prettier, follow conventions

---

**This is a complete starter scaffold. Implement the TODOs based on your specific requirements.**
