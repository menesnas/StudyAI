const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const nominatimRoutes = require('./routes/nominatim.routes');

// Route'ları kullan
app.use('/api/nominatim', nominatimRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
