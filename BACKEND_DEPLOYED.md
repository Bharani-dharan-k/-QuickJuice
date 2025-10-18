# 🚀 Backend Hosted on Render - Configuration Guide

## ✅ Backend URL
**https://quickjuice-backend.onrender.com/**

---

## 🔧 Required Backend Environment Variables on Render

You need to set these environment variables in your Render dashboard for the backend service:

### **Navigate to:** 
Render Dashboard → Your Service → Environment

### **Add/Update these variables:**

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Frontend URL (UPDATE THIS!)
FRONTEND_URL=https://your-frontend-domain.vercel.app
SOCKET_CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Database (Keep your existing MongoDB Atlas URI)
MONGODB_URI=mongodb+srv://bharanidharank:bharani5544@cluster0.wyjzx6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Secrets (Use strong secrets in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production-67890
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (Keep your existing credentials)
CLOUDINARY_CLOUD_NAME=do552lhuo
CLOUDINARY_API_KEY=235948734698519
CLOUDINARY_API_SECRET=j9PdpJAthpHuGlc0WuvRVW7AmqE

# Payment Gateway (if using Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_SUCCESS_URL=https://your-frontend-domain.vercel.app/order/success
STRIPE_CANCEL_URL=https://your-frontend-domain.vercel.app/checkout

# Email Service (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🌐 Frontend Configuration (Already Updated)

The frontend `.env` file has been updated to:

```env
VITE_API_URL=https://quickjuice-backend.onrender.com/api
VITE_SOCKET_URL=https://quickjuice-backend.onrender.com
```

---

## 📝 Important Steps

### 1. **Update Backend CORS Settings**

Once you deploy your frontend (e.g., on Vercel), update these variables on Render:

```env
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
SOCKET_CORS_ORIGIN=https://your-actual-frontend-url.vercel.app
```

### 2. **Test Backend API**

Visit these URLs to verify your backend is working:

- **Health Check:** https://quickjuice-backend.onrender.com/health
- **Products API:** https://quickjuice-backend.onrender.com/api/products
- **API Docs:** Check if your backend has a `/api` endpoint

### 3. **Deploy Frontend**

Now that backend is configured, deploy your frontend to Vercel:

#### **Option A: Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://quickjuice-backend.onrender.com/api
   VITE_SOCKET_URL=https://quickjuice-backend.onrender.com
   ```
5. Deploy!

#### **Option B: Deploy to Netlify**

1. Go to [netlify.com](https://netlify.com)
2. Import from GitHub
3. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
4. Add environment variables (same as Vercel)
5. Deploy!

### 4. **Update Backend CORS After Frontend Deployment**

After your frontend is deployed, go back to Render and update:

```env
FRONTEND_URL=https://quickjuice-your-app.vercel.app
SOCKET_CORS_ORIGIN=https://quickjuice-your-app.vercel.app
```

**Important:** Replace `quickjuice-your-app.vercel.app` with your actual frontend URL!

---

## 🧪 Testing Checklist

After deployment, test these features:

- [ ] Visit your frontend URL
- [ ] Check if products load
- [ ] Test login (admin@quickjuice.com / Admin@123)
- [ ] Test signup
- [ ] Add product to cart
- [ ] Test admin dashboard
- [ ] Upload a product image
- [ ] Place a test order

---

## 🐛 Common Issues & Solutions

### **Issue 1: CORS Error**
```
Access to fetch at 'https://quickjuice-backend.onrender.com/api/...' 
has been blocked by CORS policy
```

**Solution:** Update `FRONTEND_URL` and `SOCKET_CORS_ORIGIN` on Render with your actual frontend URL.

### **Issue 2: 502 Bad Gateway**
**Solution:** Render free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

### **Issue 3: Images Not Uploading**
**Solution:** Verify Cloudinary credentials in Render environment variables.

### **Issue 4: Login Not Working**
**Solution:** 
- Check JWT secrets are set on Render
- Verify MongoDB connection string is correct
- Check browser console for errors

---

## 🔒 Security Recommendations

Before going live:

1. **Change JWT Secrets**
   - Use strong random strings (32+ characters)
   - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Enable HTTPS Only**
   - Both Render and Vercel provide HTTPS by default ✓

3. **Secure MongoDB**
   - Whitelist only Render's IP addresses
   - Use strong database password

4. **Protect API Keys**
   - Never commit `.env` files to Git ✓ (already in .gitignore)
   - Keep Cloudinary credentials secure

---

## 📊 Monitoring

### **Render Dashboard:**
- View logs
- Monitor resource usage
- Check deployment status

### **Test Endpoints:**
```bash
# Health check
curl https://quickjuice-backend.onrender.com/health

# Get products
curl https://quickjuice-backend.onrender.com/api/products

# Test with authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://quickjuice-backend.onrender.com/api/admin/stats
```

---

## 🎯 Next Steps

1. ✅ **Backend deployed on Render** ← Done!
2. ✅ **Frontend configured to use Render URL** ← Done!
3. 📤 **Deploy frontend to Vercel/Netlify** ← Do this next
4. 🔧 **Update CORS settings on Render** ← After frontend deployment
5. 🧪 **Test all features**
6. 🌍 **Share your live app!**

---

## 🆘 Need Help?

If you encounter issues:

1. Check Render logs: Dashboard → Your Service → Logs
2. Check browser console (F12) for frontend errors
3. Test API endpoints with Postman or curl
4. Verify all environment variables are set correctly

---

**Your backend is live! Now deploy the frontend to complete the setup! 🚀**

Backend URL: https://quickjuice-backend.onrender.com/
