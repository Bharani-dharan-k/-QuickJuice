# MongoDB Setup Guide for QuickJuice

## Option 1: Use MongoDB Atlas (Cloud - Recommended for Quick Start)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickjuice?retryWrites=true&w=majority
   ```

## Option 2: Install MongoDB Locally (Windows)

### Using MongoDB Community Edition

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and run installer

2. **Install MongoDB:**
   - Run the MSI installer
   - Choose "Complete" installation
   - Install as a Windows Service (default)
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB Service:**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # Start MongoDB if not running
   Start-Service -Name MongoDB
   ```

4. **Verify Installation:**
   ```powershell
   # Connect to MongoDB shell
   mongosh
   
   # Should see: "Connected to: mongodb://localhost:27017"
   # Exit with: exit
   ```

5. **Your `.env` should have:**
   ```
   MONGODB_URI=mongodb://localhost:27017/quickjuice
   ```

### Using Chocolatey (Package Manager)

```powershell
# Install Chocolatey if you don't have it
# Run PowerShell as Administrator
choco install mongodb

# Start MongoDB
mongod
```

## Option 3: Use Docker (Easiest)

If you have Docker installed:

```powershell
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Your .env should have:
# MONGODB_URI=mongodb://localhost:27017/quickjuice
```

Or use the docker-compose.yml already in the project:

```powershell
cd D:\Project\intern
docker-compose up -d mongodb
```

## Verify MongoDB is Running

### Check MongoDB Connection:

```powershell
# Using mongosh (MongoDB Shell)
mongosh "mongodb://localhost:27017/quickjuice"

# Should connect successfully
# List databases: show dbs
# Exit: exit
```

### Check from your app:

Once MongoDB is running, restart your backend:
```powershell
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

## Troubleshooting

### Error: "connect ECONNREFUSED"
- MongoDB is not running
- Start the MongoDB service or Docker container

### Error: "authentication failed"
- Check username/password in connection string
- For local MongoDB, no auth needed by default

### Error: "network timeout"
- Check firewall settings
- Verify MongoDB port 27017 is accessible

### Windows Service Issues:
```powershell
# Stop MongoDB
Stop-Service -Name MongoDB

# Start MongoDB
Start-Service -Name MongoDB

# Restart MongoDB
Restart-Service -Name MongoDB
```

## MongoDB Compass (GUI Tool)

MongoDB Compass provides a visual interface:
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Create database: `quickjuice`
4. View collections, documents, and run queries

## Quick Start Recommendation

**For Development:** Use MongoDB Atlas (Option 1) - no local installation needed!
**For Production:** Set up proper MongoDB Atlas cluster with backups and monitoring

---

Once MongoDB is connected, your QuickJuice backend will be ready to go! 🚀
