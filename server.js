const express = require('express');
const dotenv = require('dotenv');
// Route file
const camps = require('./routes/camps');

// Load config file
dotenv.config({ path: './config/config.env' });

const app = express();
// Moute Routers
app.use('/api/v1/camps', camps);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
