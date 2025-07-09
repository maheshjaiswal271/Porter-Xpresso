# 𝑃𝑜𝑟𝑡𝑒𝑟𝑊𝑎𝑎𝑙𝑒 Application

A comprehensive delivery management system with real-time tracking and multi-role support.

## Features

- **Multi-role Authentication**
  - Admin: Manage users, porters, and system settings
  - Users: Place delivery requests and track shipments
  - Porter: Accept deliveries and manage deliveries in progress

- **Real-time Tracking**
  - Live location tracking using Google Maps API
  - Shortest path calculation
  - Estimated time of arrival

- **Payment System**
  - Distance-based pricing
  - Secure payment processing
  - Transaction history

- **Responsive Design**
  - Works on desktop and mobile devices
  - Progressive Web App (PWA) support

## Tech Stack

### Frontend
- React.js
- TypeScript
- Material-UI
- Redux Toolkit
- React Router
- Google Maps JavaScript API
- Socket.io-client

### Backend
- Spring Boot
- Spring Security
- SQL Server
- WebSocket
- JWT Authentication
- Google Maps Services API

## Prerequisites

- Node.js (v18 or higher)
- Java 17 or higher
- SQL Server Express or higher
- Google Maps API Key
- Maven

## Setup Instructions

1. Clone the repository
2. Set up environment variables
3. Install dependencies
4. Set up SQL Server database
5. Run the application

### Database Setup
```sql
-- Create Database
CREATE DATABASE db_porter;
GO

USE db_porter;
GO

-- Create Users table
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'USER', 'PORTER')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Create Deliveries table
CREATE TABLE deliveries (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT,
    porter_id BIGINT,
    pickup_location NVARCHAR(255) NOT NULL,
    pickup_latitude DECIMAL(10, 8) NOT NULL,
    pickup_longitude DECIMAL(11, 8) NOT NULL,
    delivery_location NVARCHAR(255) NOT NULL,
    delivery_latitude DECIMAL(10, 8) NOT NULL,
    delivery_longitude DECIMAL(11, 8) NOT NULL,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED')),
    distance DECIMAL(10, 2),
    amount DECIMAL(10, 2),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (porter_id) REFERENCES users(id)
);

-- Create Tracking table
CREATE TABLE tracking (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    delivery_id BIGINT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id)
);

-- Create Payments table
CREATE TABLE payments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    delivery_id BIGINT,
    amount DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    payment_method NVARCHAR(50),
    transaction_id NVARCHAR(100),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id)
);
```

### Frontend Setup
```bash
cd porter-delivery-frontend
npm install
npm start
```

### Backend Setup
```bash
./mvnw spring-boot:run
```

## Environment Variables

Create a `.env` file in the frontend directory with:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key
REACT_APP_API_URL=http://localhost:8080
```

The backend configuration is already set in `application.properties` with SQL Server connection details:

```properties
spring.datasource.url=jdbc:sqlserver://DESKTOP-PS5HGFA\\SQLEXPRESS;databaseName=db_porter;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=dims123
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
```

## API Documentation

API documentation is available at `/swagger-ui.html` when running the backend server.

## License

MIT 