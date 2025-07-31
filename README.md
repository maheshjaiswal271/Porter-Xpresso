# Porter Delivery Platform

A full-stack delivery management platform for booking, tracking, and managing deliveries, with real-time updates and role-based dashboards for users, porters, and admins.

---

## 🚀 Features
- User registration, login, and OTP authentication
- Book and track deliveries in real-time
- Porter dashboard for managing assigned tasks
- Admin dashboard for managing users and deliveries
- Payment integration (Razorpay)
- Email notifications
- WebSocket-based real-time updates
- Role-based access control

---

## 🛠️ Tech Stack
- **Backend:** Java, Spring Boot, Spring Security, JPA/Hibernate
- **Frontend:** React (Vite), JavaScript, CSS
<<<<<<< HEAD
- **Database:** SQL Server (Configure via environment variables)
=======
- **Database:** (Configure in `application.properties`)
>>>>>>> 44ab1387d3706530843c39622451e327c01e3b00
- **Payments:** Razorpay
- **WebSockets:** Spring WebSocket, custom service

---

## 📁 Folder Structure
```
Porter/
├── porter-delivery-frontend/   # React frontend (Vite)
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── contexts/           # React context providers
│       ├── pages/              # Page-level components
│       ├── services/           # API and WebSocket services
│       └── ...
├── src/main/java/com/porter/   # Spring Boot backend
│   ├── config/                 # Configuration classes
│   ├── controller/             # REST controllers
│   ├── DTO/                    # Data Transfer Objects
│   ├── Email/                  # Email service
│   ├── exception/              # Exception handling
│   ├── model/                  # JPA entities
│   ├── repository/             # Spring Data repositories
│   ├── security/               # Security config & JWT
│   ├── service/                # Service interfaces & impl
│   └── ...
└── src/main/resources/         # Application properties, static files
```

---

<<<<<<< HEAD
## ⚙️ Environment Variables Setup

The application uses environment variables for configuration. Create a `.env` file in the `src/` directory:

```env
# Server
SERVER_PORT=8080

# Database 
DB_URL=jdbc:sqlserver://your-server:1433;databaseName=db_porter;encrypt=true;trustServerCertificate=true
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_CURRENCY=INR
RAZORPAY_COMPANY_NAME=PORTER XPRESSO

# Frontend Url
FRONTEND_URL=http://localhost:3000
```

---

## ⚙️ Setup Instructions

### 1. Backend (Spring Boot)
1. **Configure Environment Variables:**
   - Create `.env` file in `src/` directory with your configuration
   - Or set environment variables directly
2. **Build & Run:**
   - Using Maven:
     ```sh
     ./mvnw spring-boot:run
     ```
   - Or import into your IDE and run `PorterApplication.java`.

### 2. Frontend (React)
1. **Install dependencies:**
   ```sh
   cd porter-delivery-frontend
   npm install
   ```
2. **Run the app:**
   ```sh
   npm run dev
   ```
3. **Configure API endpoints:**
   - Update API URLs in `porter-delivery-frontend/src/services/` as needed.

---

## 🚀 Deployment

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy to Render:
1. **Backend:** Create a Web Service with Java 17
2. **Frontend:** Create a Static Site
3. **Set Environment Variables** as specified in the deployment guide

---

=======
## ⚙️ Setup Instructions

### 1. Backend (Spring Boot)
1. **Configure Database:**
   - Edit `src/main/resources/application.properties` with your DB credentials.
2. **Build & Run:**
   - Using Maven:
     ```sh
     ./mvnw spring-boot:run
     ```
   - Or import into your IDE and run `PorterApplication.java`.

### 2. Frontend (React)
1. **Install dependencies:**
   ```sh
   cd porter-delivery-frontend
   npm install
   ```
2. **Run the app:**
   ```sh
   npm run dev
   ```
3. **Configure API endpoints:**
   - Update API URLs in `porter-delivery-frontend/src/services/` as needed.

---

>>>>>>> 44ab1387d3706530843c39622451e327c01e3b00
## 🗄️ SQL Server: Create Tables

Below are example SQL Server queries to create the main tables required for the backend. Adjust field types and constraints as needed for your environment.

```sql
-- Users table
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'USER', 'PORTER')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Deliveries table
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

-- Tracking table
CREATE TABLE tracking (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    delivery_id BIGINT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id)
);

-- Payments table
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

---

## 🧑‍💻 Usage
- Access the frontend at [http://localhost:5173](http://localhost:5173) (default Vite port)
- Backend runs at [http://localhost:8080](http://localhost:8080) (default Spring Boot port)
- Register as a user, book deliveries, or log in as porter/admin for respective dashboards.

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

<<<<<<< HEAD
## 📄 License
[MIT](LICENSE) *(or specify your license here)*

---

## 📬 Contact
- **Author:** [Your Name](mailto:your.email@example.com)
- **Project Link:** [GitHub Repository](https://github.com/yourusername/porter)

---

*Feel free to update this README with more details as your project evolves!* 
=======
## 📬 Contact
- **Author:** [Mahesh Jaiswal](mailto:maheshjaiswal271@gmail.com)
- **Project Link:** [GitHub Repository](https://github.com/maheshjaiswal271/Porter-Delivery-App))

---

*Feel free to update this README with more details as your project evolves!* 
>>>>>>> 44ab1387d3706530843c39622451e327c01e3b00
