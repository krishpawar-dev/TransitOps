# TransitOps – Smart Transport Operations Platform (Backend API)

Enterprise-grade RESTful API backend built using **Node.js, Express.js, MongoDB, Mongoose, and JWT Authentication** following strict **MVC Architecture**.

---

## 🚀 Tech Stack & Libraries

- **Runtime & Framework:** Node.js, Express.js
- **Database & ORM:** MongoDB, Mongoose
- **Authentication & Security:** JWT (Access & Refresh Tokens), bcrypt, Helmet, CORS, Express-Rate-Limit, Cookie-Parser
- **Validation:** express-validator
- **File Uploads:** Multer
- **Email & Automation:** Nodemailer, Node-Cron
- **Reporting & Exporting:** json2csv, PDFKit
- **Logging & Config:** Morgan, Dotenv

---

## 📁 Project Architecture

```
server/
├── src/
│   ├── config/
│   │   └── database.js            # MongoDB Connection with retry logic
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Refresh, Password
│   │   ├── vehicleController.js    # CRUD, Uploads, Search, Filters
│   │   ├── driverController.js     # CRUD, License Expiry, Safety Score
│   │   ├── tripController.js       # Dispatch, Complete, Cancel, Rules
│   │   ├── maintenanceController.js# Open/Close lifecycle, Cost tracking
│   │   ├── fuelController.js       # Logs, Fuel Efficiency, Cost/km
│   │   ├── expenseController.js    # Category breakdown, Approvals
│   │   ├── reportController.js     # Utilization, ROI, CSV/PDF Exports
│   │   └── dashboardController.js  # Aggregated KPIs, Charts, Recent Activity
│   ├── middlewares/
│   │   ├── authMiddleware.js      # JWT token authentication
│   │   ├── roleMiddleware.js      # Role-Based Access Control (RBAC)
│   │   ├── validateMiddleware.js  # Express-validator error wrapper
│   │   └── errorMiddleware.js     # Global error handler & 404 handler
│   ├── models/
│   │   ├── User.js                # Roles: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst
│   │   ├── Vehicle.js             # Registration, Status: Available, On Trip, In Shop, Retired
│   │   ├── Driver.js              # Status: Available, On Trip, Leave, Suspended
│   │   ├── Trip.js                # Status: Scheduled, In Transit, Completed, Cancelled
│   │   ├── Maintenance.js         # Status: Open, In Progress, Closed
│   │   ├── FuelLog.js             # Liters, Cost, Odometer, station
│   │   └── Expense.js             # Fuel, Maintenance, Toll, Repair, Insurance...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── fuelRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── reportRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   ├── cronService.js         # Daily Cron job for License expiry & auto-suspend
│   │   ├── emailService.js        # Nodemailer template for License expiry reminders
│   │   └── reportService.js       # ROI, Fleet Utilization, CSV & PDF generators
│   ├── utils/
│   │   ├── ApiError.js            # Custom Operational Error Class
│   │   ├── ApiResponse.js         # Standardized JSON response envelope
│   │   ├── calculateROI.js        # ROI, Fuel Efficiency, Cost/km calculators
│   │   ├── queryHelpers.js        # Pagination, Sorting & Date range query builders
│   │   └── seed.js                # Database seeder script
│   ├── validators/
│   │   ├── authValidators.js
│   │   ├── vehicleValidators.js
│   │   ├── driverValidators.js
│   │   ├── tripValidators.js
│   │   ├── maintenanceValidators.js
│   │   └── fuelExpenseValidators.js
│   ├── app.js                     # Express app configuration & middleware pipeline
│   └── server.js                  # Entry point & server listener
├── uploads/
│   └── documents/                 # Statically served uploaded vehicle documents
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Business Rules Implemented

1. **Vehicles:**
   - Registration Number is strictly unique.
   - Retired or In-Shop vehicles cannot be dispatched on trips.
   - Status transitions automatically:
     - Dispatch → `On Trip`
     - Complete/Cancel → `Available`
     - Open Maintenance → `In Shop`
     - Close Maintenance → `Available` (unless `Retired`).

2. **Drivers:**
   - License expired or suspended drivers cannot be dispatched.
   - Drivers already on a trip or on leave cannot be assigned.
   - Daily cron job checks license expiry: sends reminder email if within 30 days, auto-suspends if expired.

3. **Trips:**
   - Cargo Weight cannot exceed Vehicle's `maxLoadCapacity`.
   - Dispatch validates vehicle/driver availability and updates statuses atomically.
   - Complete updates vehicle odometer, driver distance/trip counts, and restores availability.

---

## 🔐 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "registrationNumber",
      "message": "Registration number is required"
    }
  ]
}
```

---

## 🛠️ Installation & Setup

1. **Install Dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and adjust variables:
   ```bash
   cp .env.example .env
   ```

3. **Seed Initial Database:**
   ```bash
   npm run seed
   ```
   *Seeds default users, vehicles, drivers, trips, maintenance, and expenses.*

   Default Login Credentials created:
   - **Fleet Manager:** `admin@transitops.com` / `password123`
   - **Dispatcher:** `dispatcher@transitops.com` / `password123`
   - **Safety Officer:** `safety@transitops.com` / `password123`
   - **Financial Analyst:** `finance@transitops.com` / `password123`

4. **Run Server:**
   ```bash
   # Development mode with Nodemon
   npm run dev

   # Production mode
   npm start
   ```

---

## 📡 Core Endpoint Quick Reference

| Module | Method | Endpoint | Access / Role | Description |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Register new user |
| | `POST` | `/api/v1/auth/login` | Public | Authenticate user & receive JWT |
| | `POST` | `/api/v1/auth/logout` | Protected | Invalidate refresh token |
| | `GET` | `/api/v1/auth/me` | Protected | Get logged-in user profile |
| **Dashboard**| `GET` | `/api/v1/dashboard` | Protected | Aggregated KPIs, charts & metrics |
| **Vehicles** | `GET` | `/api/v1/vehicles` | Protected | List vehicles with filters & search |
| | `POST` | `/api/v1/vehicles` | Manager, Safety | Create vehicle |
| | `POST` | `/api/v1/vehicles/:id/documents` | Manager, Safety | Upload vehicle document (PDF/Image) |
| **Drivers** | `GET` | `/api/v1/drivers` | Protected | List drivers with license expiry filter |
| **Trips** | `POST` | `/api/v1/trips/:id/dispatch` | Manager, Dispatcher | Dispatch trip & lock vehicle/driver |
| | `POST` | `/api/v1/trips/:id/complete` | Manager, Dispatcher | Complete trip & update odometer |
| | `POST` | `/api/v1/trips/:id/cancel` | Manager, Dispatcher | Cancel trip & restore statuses |
| **Maintenance**|`POST` | `/api/v1/maintenance` | Manager, Dispatcher | Open maintenance & set vehicle `In Shop` |
| | `POST` | `/api/v1/maintenance/:id/close` | Manager, Safety | Close maintenance & set `Available` |
| **Reports** | `GET` | `/api/v1/reports/vehicle-roi` | Protected | Vehicle ROI report (`?export=csv` or `pdf`) |
| | `GET` | `/api/v1/reports/fuel-efficiency`| Protected | Fuel efficiency report (`?export=csv` or `pdf`) |
