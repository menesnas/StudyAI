const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
const aiRoutes = require("./routes/ai.routes");
const planRoutes = require("./routes/plan.routes");
const taskRoutes = require("./routes/task.routes");
const nominatimRoutes = require('./routes/nominatim.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const resourceRoutes = require('./routes/resource.routes');
const searchRoutes = require("./routes/search.routes");
app.use("/api/search", searchRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/tasks", taskRoutes);
app.use('/api/nominatim', nominatimRoutes);
app.use('/api/map', nominatimRoutes); // Map endpoint'i ekle
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks/resources', resourceRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

// Veritabanı senkronizasyonu
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });