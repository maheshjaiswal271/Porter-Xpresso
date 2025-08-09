# Porter Delivery System - Render Deployment

This project is organized for deployment on Render with separate frontend and backend services.

## Project Structure

```
Porter/
├── frontend/          # React application
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── render.yaml
├── backend/           # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── render.yaml
└── DEPLOYMENT_INSTRUCTIONS.md
```

## Deployment Steps

### 1. Backend Deployment (Spring Boot)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: porter-backend
   - **Root Directory**: backend
   - **Environment**: Java
   - **Build Command**: `./mvnw clean install`
   - **Start Command**: `java -jar target/porter-0.0.1-SNAPSHOT.jar`
   - **Port**: 8080

5. Add Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: production
   - `SERVER_PORT`: 8080
   - Add your database connection strings and other required environment variables

6. Deploy the service

### 2. Frontend Deployment (React)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Static Site"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: porter-frontend
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL (e.g., https://porter-backend.onrender.com)

6. Deploy the service

### 3. Update Frontend API Configuration

After deploying the backend, update the `frontend/src/config.js` file with your backend URL.

## Environment Variables

### Backend Required Variables:
- Database connection strings
- JWT secret keys
- Email service credentials
- Payment gateway credentials

### Frontend Required Variables:
- `VITE_API_URL`: Backend service URL

## Notes

- The backend will be available at: `https://porter-backend.onrender.com`
- The frontend will be available at: `https://porter-frontend.onrender.com`
- Make sure to update CORS settings in the backend to allow requests from the frontend domain
- Update the frontend configuration to point to the correct backend URL 