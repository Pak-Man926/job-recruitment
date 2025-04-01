const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS (optional)
app.use(express.json()); // ✅ Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // ✅ Parse URL-encoded requests

// Routes
const userRoutes = require('./src/routes/userRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const jobApplicationRoutes = require("./src/routes/jobApplicationRoutes");

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use("/api/applications", jobApplicationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require("dotenv").config();

