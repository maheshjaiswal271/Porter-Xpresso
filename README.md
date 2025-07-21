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
- **Database:** (Configure in `application.properties`)
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

## 🧑‍💻 Usage
- Access the frontend at [http://localhost:5173](http://localhost:5173) (default Vite port)
- Backend runs at [http://localhost:8080](http://localhost:8080) (default Spring Boot port)
- Register as a user, book deliveries, or log in as porter/admin for respective dashboards.

---

## 📬 Contact
- **Author:** [Mahesh Jaiswal](mailto:maheshjaiswal271@gmail.com)
- **Project Link:** [GitHub Repository](https://github.com/maheshjaiswal271/Porter-Delivery-App))

---

*Feel free to update this README with more details as your project evolves!*
