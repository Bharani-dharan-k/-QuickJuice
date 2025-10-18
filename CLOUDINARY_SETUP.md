# Cloudinary Setup Guide

This project uses Cloudinary for storing product images. Follow these steps to set it up:

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. Create your account (you can use GitHub/Google)

## 2. Get Your Credentials

1. After login, you'll be on your Dashboard
2. You'll see three important credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "Show" to reveal it)

## 3. Configure Your Project

1. Open `server/.env` file (create one if it doesn't exist by copying `.env.example`)
2. Add your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

3. Replace the placeholder values with your actual credentials from the Cloudinary Dashboard

## 4. Test the Setup

1. Start your server: `cd server && npm start`
2. Log in as admin (credentials in seed.js)
3. Go to Admin Dashboard → Add New Product
4. Fill in the form and upload images
5. Submit - images will be uploaded to Cloudinary!

## Image Configuration

- **Folder**: Images are stored in `quickjuice/products` folder
- **Transformation**: Images are automatically resized to 800x800px
- **Limit**: Maximum 5 images per product
- **Formats**: All standard image formats (JPG, PNG, WEBP, etc.)

## Cloudinary Features Used

- Cloud storage for images
- Automatic image optimization
- Image transformations (resize, crop)
- Fast CDN delivery
- Secure URLs

## Free Tier Limits

Cloudinary free tier includes:
- 25GB storage
- 25GB bandwidth/month
- 25,000 transformations/month

This is more than enough for development and small projects!

## Troubleshooting

### "Invalid API credentials"
- Double-check your credentials in `.env`
- Make sure there are no extra spaces
- Restart your server after updating `.env`

### "Images not uploading"
- Check server console for error messages
- Verify your Cloudinary account is active
- Make sure images are under 10MB

### "Cannot read properties of undefined"
- Ensure all three Cloudinary environment variables are set
- Check that cloudinary.js config file is properly imported

## Need Help?

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK Guide](https://cloudinary.com/documentation/node_integration)
