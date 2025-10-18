# 🔒 CORS Configuration Guide

## ✅ CORS Fixed for Production

The backend now properly handles Cross-Origin Resource Sharing (CORS) for both development and production environments.

---

## 🌐 Allowed Origins

The backend accepts requests from:

### **Development:**
- ✅ `http://localhost:5173` (Vite default port)
- ✅ `http://localhost:5174` (Vite alternate port)

### **Production:**
- ✅ `https://quickjuice-frontend.onrender.com` (Hardcoded)
- ✅ Custom domain via `FRONTEND_URL` environment variable
- ✅ Custom Socket.IO origin via `SOCKET_CORS_ORIGIN` environment variable

### **Special Cases:**
- ✅ **Requests with no origin** (Postman, curl, mobile apps, server-to-server)

---

## 🔧 Configuration Details

### **Allowed Methods:**
```
GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### **Allowed Headers:**
```
Content-Type, Authorization
```

### **Credentials:**
```
Enabled (cookies, authorization headers)
```

---

## 📝 Environment Variables

### **Backend (.env)**

Set these on Render or your hosting platform:

```env
# For development
FRONTEND_URL=http://localhost:5173
SOCKET_CORS_ORIGIN=http://localhost:5173

# For production
FRONTEND_URL=https://quickjuice-frontend.onrender.com
SOCKET_CORS_ORIGIN=https://quickjuice-frontend.onrender.com

# Or your custom domain
FRONTEND_URL=https://your-domain.com
SOCKET_CORS_ORIGIN=https://your-domain.com
```

---

## 🚀 How It Works

### **1. Origin Checking Function:**
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://quickjuice-frontend.onrender.com',
  process.env.FRONTEND_URL,
  process.env.SOCKET_CORS_ORIGIN
].filter(Boolean);
```

### **2. Dynamic Origin Validation:**
```javascript
origin: (origin, callback) => {
  // Allow requests with no origin (Postman, curl, etc.)
  if (!origin) return callback(null, true);
  
  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}
```

### **3. Applied to Both:**
- ✅ Express REST API endpoints
- ✅ Socket.IO WebSocket connections

---

## 🧪 Testing CORS

### **Test 1: From Frontend**
```javascript
// In your React app (running on localhost:5173)
fetch('https://quickjuice-backend.onrender.com/api/products')
  .then(res => res.json())
  .then(data => console.log('Products:', data))
  .catch(err => console.error('CORS Error:', err));
```

### **Test 2: From Postman**
```bash
# Postman doesn't send Origin header, so it should work
GET https://quickjuice-backend.onrender.com/api/products
```

### **Test 3: From curl**
```bash
# Test with specific origin
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS \
  https://quickjuice-backend.onrender.com/api/products
```

### **Test 4: Browser Console**
```javascript
// Run in browser console
fetch('https://quickjuice-backend.onrender.com/api/products', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## 🐛 Common CORS Errors & Solutions

### **Error 1: "Access to fetch has been blocked by CORS policy"**

**Cause:** Frontend origin not in allowed list

**Solution:** 
1. Check your frontend URL
2. Update `FRONTEND_URL` on Render
3. Restart backend service

### **Error 2: "Credentials flag is 'true', but Access-Control-Allow-Credentials header is not present"**

**Cause:** Backend not configured to allow credentials

**Solution:** Already fixed! ✅ `credentials: true` is set

### **Error 3: "Method not allowed by CORS"**

**Cause:** HTTP method not in allowed list

**Solution:** Already fixed! ✅ All common methods allowed

### **Error 4: "Header not allowed by CORS"**

**Cause:** Custom header not in allowed list

**Solution:** Add to `allowedHeaders` in server.js:
```javascript
allowedHeaders: ['Content-Type', 'Authorization', 'Your-Custom-Header']
```

---

## 🔐 Production Deployment Checklist

### **On Render (Backend):**

1. ✅ Set environment variables:
   ```env
   FRONTEND_URL=https://quickjuice-frontend.onrender.com
   SOCKET_CORS_ORIGIN=https://quickjuice-frontend.onrender.com
   ```

2. ✅ Deploy/restart service

3. ✅ Check logs for CORS errors

### **On Vercel/Netlify (Frontend):**

1. ✅ Set API URL:
   ```env
   VITE_API_URL=https://quickjuice-backend.onrender.com/api
   ```

2. ✅ Deploy frontend

3. ✅ Test from production URL

---

## 📊 CORS Flow Diagram

```
┌─────────────────────────────────────────────┐
│  Frontend (localhost:5173 or production)    │
│                                             │
│  1. Send request with Origin header        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Backend CORS Middleware                    │
│                                             │
│  2. Check if origin is allowed:            │
│     - No origin? ✅ Allow (Postman)        │
│     - In allowedOrigins? ✅ Allow          │
│     - Not in list? ❌ Reject               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Response with CORS headers:                │
│                                             │
│  Access-Control-Allow-Origin: <origin>     │
│  Access-Control-Allow-Credentials: true    │
│  Access-Control-Allow-Methods: GET, POST.. │
│  Access-Control-Allow-Headers: Content-..  │
└─────────────────────────────────────────────┘
```

---

## 🎯 Benefits of This Configuration

✅ **Secure:** Only whitelisted origins allowed  
✅ **Flexible:** Supports environment variables  
✅ **Dev-Friendly:** Works with localhost variants  
✅ **Testing-Friendly:** Allows Postman/curl (no origin)  
✅ **Production-Ready:** Supports deployed frontends  
✅ **Credentials:** Cookies and auth headers work  
✅ **Methods:** All CRUD operations supported  

---

## 🔄 Updating Allowed Origins

### **Add New Origin:**

1. **Option A:** Add to hardcoded list in `server.js`:
   ```javascript
   const allowedOrigins = [
     'http://localhost:5173',
     'http://localhost:5174',
     'https://quickjuice-frontend.onrender.com',
     'https://your-new-domain.com', // Add here
     process.env.FRONTEND_URL,
     process.env.SOCKET_CORS_ORIGIN
   ].filter(Boolean);
   ```

2. **Option B:** Use environment variable:
   ```env
   FRONTEND_URL=https://your-new-domain.com
   ```

3. Commit, push, and deploy

---

## 📚 Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [Socket.IO CORS](https://socket.io/docs/v4/handling-cors/)

---

## ✅ Summary

**CORS is now properly configured for:**
- ✅ Development (localhost)
- ✅ Production (Render frontend)
- ✅ Testing tools (Postman, curl)
- ✅ Custom domains (via env variables)
- ✅ WebSocket connections (Socket.IO)

**Your backend is production-ready! 🚀**

---

*Last Updated: October 18, 2025*
