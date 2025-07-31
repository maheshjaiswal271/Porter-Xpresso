# Porter Application Deployment Guide

## Environment Variables Setup

The application uses environment variables for configuration. Create a `.env` file in the `src/` directory with the following variables:

```env
# Server
SERVER_PORT=8080

# Database 
DB_URL=jdbc:sqlserver://DESKTOP-PS5HGFA:1433;databaseName=db_porter;encrypt=true;trustServerCertificate=true
DB_USERNAME=sa
DB_PASSWORD=dims123

# JWT
JWT_SECRET=9a4f2c8d3b7a1e6f45c8a0b3f267d8b1d4e6f3c8a9d2b5f8e3a7c4d9f2e5b8a1c4d7f0e9a3b6c8d2e5f7a9c0b3d6e8f1
JWT_EXPIRATION=86400000

# Email
MAIL_USERNAME=porterxpresso@gmail.com
MAIL_PASSWORD=tqso agws busj iytl

# Razorpay
RAZORPAY_KEY_ID=rzp_test_eGUiQ3AsMGiYQ4
RAZORPAY_KEY_SECRET=CN3FR1LHpxNqu9aCUbPKsAie
RAZORPAY_CURRENCY=INR
RAZORPAY_COMPANY_NAME=PORTER XPRESSO

# Frontend Url
FRONTEND_URL=http://localhost:3000
```

## Render Deployment

### Backend Deployment

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Set the following configuration:
     - **Build Command**: `mvn clean install`
     - **Start Command**: `java -jar target/porter-0.0.1-SNAPSHOT.jar`
     - **Environment**: Java 17

2. **Set Environment Variables on Render**
   - Go to your service settings
   - Add the following environment variables:
     ```
     SERVER_PORT=8080
     DB_URL=your_production_database_url
     DB_USERNAME=your_db_username
     DB_PASSWORD=your_db_password
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRATION=86400000
     MAIL_USERNAME=your_email
     MAIL_PASSWORD=your_email_password
     RAZORPAY_KEY_ID=your_razorpay_key
     RAZORPAY_KEY_SECRET=your_razorpay_secret
     RAZORPAY_CURRENCY=INR
     RAZORPAY_COMPANY_NAME=PORTER XPRESSO
     FRONTEND_URL=https://your-frontend-url.onrender.com
     ```

### Frontend Deployment

1. **Create a new Static Site on Render**
   - Connect your GitHub repository
   - Set the following configuration:
     - **Build Command**: `cd porter-delivery-frontend && npm install && npm run build`
     - **Publish Directory**: `porter-delivery-frontend/dist`
     - **Environment**: Node.js

2. **Set Environment Variables for Frontend**
   - Add the backend URL as an environment variable:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```

## Database Setup

For production deployment, you'll need to:

1. **Set up a production database** (e.g., Azure SQL Database, AWS RDS, or any cloud SQL service)
2. **Update the DB_URL** to point to your production database
3. **Ensure the database is accessible** from your Render service

## Important Notes

1. **CORS Configuration**: The backend is configured to accept requests from the FRONTEND_URL environment variable
2. **Environment Variables**: All sensitive configuration is now externalized to environment variables
3. **Database**: Make sure your production database is properly configured and accessible
4. **Email Service**: Update email credentials for production use
5. **Payment Gateway**: Use production Razorpay keys for live transactions

## Local Development

For local development, the application will:
- Use the `.env` file in the `src/` directory
- Fall back to default values if environment variables are not set
- Use localhost:3000 as the default frontend URL

## Troubleshooting

1. **Database Connection Issues**: Check your database URL and credentials
2. **CORS Errors**: Verify the FRONTEND_URL is correctly set
3. **Email Issues**: Ensure email credentials are correct and SMTP is enabled
4. **Payment Issues**: Verify Razorpay keys are correct for your environment (test/production) 