# 🔐 Demo Credentials

## Database Successfully Seeded! ✅

Your MongoDB Atlas database has been populated with demo users and products.

---

## 👥 Demo User Accounts

### 🔑 Admin Account
- **Email:** `admin@quickjuice.com`
- **Password:** `Admin@123`
- **Role:** Administrator
- **Access:** Full admin dashboard, manage products, orders, and users

### 🔑 Customer Account
- **Email:** `demo@example.com`
- **Password:** `Demo@123`
- **Role:** Customer
- **Access:** Browse products, add to cart, place orders, track deliveries

---

## 📦 Seeded Products (8 Total)

1. **Classic Orange Juice** - 3 variants (250ml, 500ml, 1L) - 10% OFF
2. **Orange Mango Blend** - 3 variants - Tropical fusion
3. **Orange Carrot Fusion** - 2 variants - Health boost
4. **Premium Valencia Orange** - 2 variants - Premium quality
5. **Orange Ginger Boost** - 2 variants - Immunity boost
6. **Orange Turmeric Wellness** - 2 variants - Anti-inflammatory
7. **Orange Strawberry Delight** - 2 variants - Sweet & fruity
8. **Orange Pineapple Paradise** - 2 variants - Tropical paradise

All products have:
- ✅ Sample images from Cloudinary
- ✅ Multiple size variants
- ✅ Stock quantities
- ✅ Nutritional information
- ✅ Ratings and reviews
- ✅ Proper pricing

---

## 🚀 How to Use

### Login as Admin
1. Go to: `http://localhost:5173/login`
2. Enter email: `admin@quickjuice.com`
3. Enter password: `Admin@123`
4. Access admin dashboard to:
   - Add/edit/delete products
   - Manage orders
   - Manage users
   - View analytics

### Login as Customer
1. Go to: `http://localhost:5173/login`
2. Enter email: `demo@example.com`
3. Enter password: `Demo@123`
4. Browse and shop:
   - View all products
   - Add items to cart
   - Place orders
   - Track delivery

---

## 🔄 Re-seed Database

If you need to reset the database with fresh demo data:

```bash
cd server
node seed.js
```

⚠️ **Warning:** This will delete all existing products and users!

---

## 📝 Notes

- Images use Cloudinary's demo URL (placeholder images)
- You can replace these with real product images via the Admin dashboard
- Use "Add Product" feature in admin panel to upload real images to your Cloudinary account
- All passwords are hashed using bcrypt for security
- JWT tokens expire after 1 hour (refresh tokens: 7 days)

---

## 🎯 Next Steps

1. ✅ Login with admin account
2. ✅ Verify products are visible
3. ✅ Upload custom product images (optional)
4. ✅ Test customer flow (browse, cart, checkout)
5. ✅ Test admin features (manage orders, users)

---

**Enjoy exploring QuickJuice! 🍊**
