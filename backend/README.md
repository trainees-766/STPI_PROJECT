# Customer Management Backend

Express.js + MongoDB backend for managing customers and units across Datacom, Exim, Incubation, and Projects sections.

## Setup Instructions

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
```
Edit `.env` and update your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/customer-management
PORT=5000
```

3. **Start MongoDB**
Make sure MongoDB is running on your local machine or use a cloud instance.

4. **Run the Server**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Datacom (RF & LAN Customers)
- `GET /api/datacom/rf` - Get all RF customers
- `GET /api/datacom/lan` - Get all LAN customers
- `POST /api/datacom/rf` - Create RF customer
- `POST /api/datacom/lan` - Create LAN customer
- `PUT /api/datacom/rf/:id` - Update RF customer
- `PUT /api/datacom/lan/:id` - Update LAN customer
- `DELETE /api/datacom/rf/:id` - Delete RF customer
- `DELETE /api/datacom/lan/:id` - Delete LAN customer

### Exim (STPI & Non-STPI Units)
- `GET /api/exim/stpi` - Get all STPI units
- `GET /api/exim/non-stpi` - Get all Non-STPI units
- `POST /api/exim/stpi` - Create STPI unit
- `POST /api/exim/non-stpi` - Create Non-STPI unit
- `PUT /api/exim/stpi/:id` - Update STPI unit
- `PUT /api/exim/non-stpi/:id` - Update Non-STPI unit
- `DELETE /api/exim/stpi/:id` - Delete STPI unit
- `DELETE /api/exim/non-stpi/:id` - Delete Non-STPI unit

### Incubation
- `GET /api/incubation` - Get all incubation customers
- `POST /api/incubation` - Create incubation customer
- `PUT /api/incubation/:id` - Update incubation customer
- `DELETE /api/incubation/:id` - Delete incubation customer

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Project Structure
```
backend/
├── models/
│   ├── Customer.js      # Customer model (Datacom & Incubation)
│   ├── Unit.js          # Unit model (Exim)
│   └── Project.js       # Project model
├── routes/
│   ├── datacomRoutes.js
│   ├── eximRoutes.js
│   ├── incubationRoutes.js
│   └── projectRoutes.js
├── server.js            # Main server file
├── package.json
└── .env.example
```

## Testing the API

You can test the API using tools like Postman, Insomnia, or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get RF customers
curl http://localhost:5000/api/datacom/rf

# Create RF customer
curl -X POST http://localhost:5000/api/datacom/rf \
  -H "Content-Type: application/json" \
  -d '{
    "managerName": "John Doe",
    "managerPhone": "1234567890",
    "managerEmail": "john@example.com",
    "managerDesignation": "Manager",
    "leaderName": "Jane Smith",
    "leaderPhone": "0987654321",
    "leaderEmail": "jane@example.com",
    "leaderDesignation": "Team Leader",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "ipDetails": "192.168.1.100",
    "bandwidth": "100 Mbps",
    "bridgeDetails": "Bridge A",
    "prtgGraphLink": "https://prtg.example.com/graph"
  }'
```
